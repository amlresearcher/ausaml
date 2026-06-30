#!/usr/bin/env python3
"""Extract sample scenarios from AML synthetic DuckDB for website visualisation.

Run from repo root:
    python website/scripts/extract_samples.py

Requires: duckdb, pyyaml (already in requirements.txt)
Output: website/public/data/
"""

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
# The consolidated oneview DuckDB (all banks merged)
DB_PATH = ROOT / "output" / "oneview" / "duckdb" / "aml_synthetic.duckdb"
CONFIG_PATH = ROOT / "config" / "typologies.yaml"
OUT_DIR = Path(__file__).parent.parent / "public" / "data"

MAX_NODES = 200

TYPOLOGY_DEFINITIONS = {
    "smurfing": "Multiple individuals make coordinated cash deposits each below CTR threshold, collectively exceeding it",
    "funnel_account": "Account aggregates funds from many sources then rapidly forwards to few destinations; near-zero balance",
    "cash_intensive": "Business deposits cash volumes exceeding declared annual turnover",
    "burst_transfers": "Single origin fans out rapid payments to multiple receivers within a burst window",
    "circular_ring": "N accounts form an ordered ring through which funds circulate",
    "micro_structuring": "Many depositors each make small cash deposits well below CTR threshold",
    "pass_through": "Controller funds pass-through accounts, each immediately forwarding 90-98% of received funds",
    "dormant_activation": "Controller reactivates dormant mule accounts which then burst payments back",
    "layering": "Rapid transfers across accounts and jurisdictions obscuring origin",
    "mule_network": "Coordinated individuals sharing physical/digital infrastructure receive and forward funds",
    "round_tripping": "Funds leave a beneficial owner, travel through intermediaries, and return to a different account",
    "fanin_fanout": "Aggregator collects from multiple sources then redistributes to multiple destinations",
    "hub_network": "Peripheral accounts funnel to a central hub which immediately forwards proceeds",
    "split_merge": "Origin splits to N intermediaries, each immediately forwarding to a single merger",
    "geo_smurfing": "Regional depositors in distinct geographic areas converge proceeds to same beneficiaries",
    "chain_branch": "Sequential chain with fraction simultaneously fanned to branch accounts at each node",
    "loan_back": "Criminal lends laundered funds to themselves through a shell entity to create legitimate income",
    "gambling_wash": "Illicit funds converted to gambling chips and cashed out as winnings",
    "ghost_payroll": "Fictitious employees receive payroll transfers that are immediately consolidated",
    "atm_cashout_ring": "Compromised card data used for coordinated ATM withdrawals across multiple locations",
    "crypto_gateway": "Fiat funds converted to cryptocurrency via exchange, layered on-chain, then cashed out",
    "insurance_cycling": "Rapid premium payments and policy surrenders used to cycle funds through insurer",
    "tbml_invoice": "Trade-based money laundering via over/under-invoiced import-export transactions",
    "hawala_mirror": "Informal value transfer mirrored by offsetting domestic transactions",
    "crypto_atm_withdrawal": "Crypto ATM used to convert crypto to cash with minimal KYC",
    "exchange_micro_structuring": "Small crypto exchange purchases structured to avoid reporting thresholds",
    "p2p_fiat_roundtrip": "P2P platform used to cycle fiat through multiple accounts",
    "crypto_salary_obfuscation": "Salary paid in crypto to obscure beneficial ownership of employment income",
    "stablecoin_chain": "Stablecoins used to chain transfers across wallets before off-ramping",
    "crypto_mining_wash": "Mining pool payouts used to launder proceeds as legitimate mining income",
    "unlicensed_vasp": "Unlicensed virtual asset service provider processes high-volume crypto transfers",
    "p2p_broker": "Informal broker matches buy/sell orders outside regulated exchange",
    "unlicensed_msb": "Unlicensed money services business transmits funds across borders",
    "gambling_rapid_cycling": "Rapid deposit/withdrawal cycles at online gambling platform",
    "otc_desk": "Over-the-counter crypto desk facilitates large trades with minimal documentation",
}

CROSS_BANK = {
    "layering", "mule_network", "round_tripping", "fanin_fanout",
    "hub_network", "split_merge", "geo_smurfing", "chain_branch",
}


def main():
    try:
        import duckdb
        import yaml
    except ImportError as e:
        sys.exit(f"Missing dependency: {e}. Run: pip install duckdb pyyaml")

    if not DB_PATH.exists():
        sys.exit(f"DuckDB not found at {DB_PATH}. Run the pipeline first.")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "scenarios").mkdir(exist_ok=True)

    con = duckdb.connect(str(DB_PATH), read_only=True)

    # Dataset stats
    stats = {
        "total_customers": con.execute("SELECT COUNT(*) FROM customer_master").fetchone()[0],
        "total_accounts": con.execute("SELECT COUNT(*) FROM account_base").fetchone()[0],
        "total_transactions": con.execute("SELECT COUNT(*) FROM transaction_base").fetchone()[0],
        "aml_customers": con.execute(
            "SELECT COUNT(DISTINCT customer_id) FROM _aml_designations"
        ).fetchone()[0],
        "num_typologies": 35,
        "num_banks": con.execute("SELECT COUNT(*) FROM bank_master").fetchone()[0],
        "date_range": {"start": "2025-07-01", "end": "2025-12-31"},
    }
    stats["aml_ratio"] = round(stats["aml_customers"] / max(stats["total_customers"], 1), 4)
    _write(OUT_DIR / "dataset_stats.json", stats)
    print("[OK] dataset_stats.json")

    # Typologies metadata
    with open(CONFIG_PATH) as f:
        typo_yaml = yaml.safe_load(f)

    typologies = []
    for name, cfg in (typo_yaml.get("typologies") or {}).items():
        typologies.append({
            "name": name,
            "cross_bank": name in CROSS_BANK,
            "definition": TYPOLOGY_DEFINITIONS.get(name, ""),
            "instances_per_bank": cfg.get("instances", 5),
            "enabled": cfg.get("enabled", True),
        })
    _write(OUT_DIR / "typologies.json", typologies)
    print("[OK] typologies.json")

    # Heatmap: typology x bank instance counts
    # _scenario_log has no bank_id; derive bank from the first account in each scenario
    # via account_base.bank_id -> bank_master.bank_code
    banks_rows = con.execute("SELECT bank_code, bank_name FROM bank_master ORDER BY bank_code").fetchall()
    banks = [{"id": r[0], "name": r[1]} for r in banks_rows]
    bank_ids = [b["id"] for b in banks]

    # Build heatmap by joining scenario accounts to bank_master
    heatmap_rows = con.execute("""
        SELECT
            sl.typology,
            bm.bank_code,
            COUNT(*) as cnt
        FROM _scenario_log sl
        CROSS JOIN LATERAL (
            SELECT ab.bank_id
            FROM account_base ab
            WHERE ab.account_id::VARCHAR = sl.account_ids[1]
            LIMIT 1
        ) acc
        JOIN bank_master bm ON bm.bank_id = acc.bank_id
        GROUP BY sl.typology, bm.bank_code
    """).fetchall()

    count_map = {}
    for typology_name, bank_code, cnt in heatmap_rows:
        count_map[(typology_name, bank_code)] = cnt

    cells = []
    for bank in banks:
        for t in typologies:
            cells.append({
                "typology": t["name"],
                "bank": bank["id"],
                "count": count_map.get((t["name"], bank["id"]), 0),
            })

    _write(OUT_DIR / "heatmap.json", {"banks": bank_ids, "cells": cells})
    print("[OK] heatmap.json")

    # One scenario per typology (pick the first scenario_id per typology)
    scenario_rows = con.execute("""
        SELECT typology, MIN(scenario_id) as scenario_id
        FROM _scenario_log
        GROUP BY typology
        ORDER BY typology
    """).fetchall()

    for typology_name, scenario_id in scenario_rows:
        data = extract_scenario(con, typology_name, scenario_id)
        _write(OUT_DIR / "scenarios" / f"{typology_name}.json", data)
        print(f"  [OK] scenarios/{typology_name}.json  ({len(data['nodes'])} nodes, {len(data['edges'])} edges)")

    con.close()
    print(f"\nDone. Output written to {OUT_DIR}")


def extract_scenario(con, typology_name: str, scenario_id: str) -> dict:
    # _aml_designations uses 'typology' column (not 'typology_name')
    participants = con.execute("""
        SELECT d.customer_id, d.account_id, d.role
        FROM _aml_designations d
        WHERE d.scenario_id = ?
        LIMIT ?
    """, [scenario_id, MAX_NODES]).fetchall()

    nodes = []
    node_ids = set()
    account_to_role = {}

    for customer_id, account_id, role in participants:
        cid = str(customer_id) if customer_id else None
        aid = str(account_id) if account_id else None

        if cid and cid not in node_ids:
            nodes.append({
                "id": cid,
                "type": "customer",
                "role": role or "unknown",
                "label": f"Customer-{cid[:6]}",
            })
            node_ids.add(cid)
        if aid and aid not in node_ids:
            nodes.append({
                "id": aid,
                "type": "account",
                "role": role or "unknown",
                "label": _short_account(con, aid),
            })
            node_ids.add(aid)
            account_to_role[aid] = role or "unknown"

    account_ids = [n["id"] for n in nodes if n["type"] == "account"]

    if not account_ids:
        return {"typology": typology_name, "scenario_id": scenario_id,
                "nodes": nodes, "edges": [], "timeline": []}

    # Get scenario date range for filtering
    date_row = con.execute(
        "SELECT date_from, date_to FROM _scenario_log WHERE scenario_id = ? LIMIT 1",
        [scenario_id]
    ).fetchone()
    date_from = date_row[0] if date_row else None
    date_to = date_row[1] if date_row else None

    placeholders = ",".join(["?" for _ in account_ids])

    # Build edges using transaction_base joined with transaction_transfer_internal
    # direction=debit from account_id to target_account_id gives a transfer edge
    # We filter to scenario date window and only scenario accounts
    date_filter = ""
    date_params = []
    if date_from and date_to:
        date_filter = "AND t.transaction_datetime BETWEEN ? AND ?"
        date_params = [date_from, date_to]

    tx_rows = con.execute(f"""
        SELECT
            t.transaction_id,
            t.account_id,
            t.direction,
            t.amount,
            t.transaction_datetime,
            t.transaction_type,
            ti.target_account_id
        FROM transaction_base t
        LEFT JOIN transaction_transfer_internal ti ON t.transaction_id = ti.transaction_id
        WHERE t.account_id::VARCHAR IN ({placeholders})
        {date_filter}
        ORDER BY t.transaction_datetime
        LIMIT 500
    """, [str(a) for a in account_ids] + date_params).fetchall()

    edges = []
    timeline = []
    for tx_id, acct_id, direction, amount, dt, tx_type, target_acct_id in tx_rows:
        acct_str = str(acct_id) if acct_id else None
        target_str = str(target_acct_id) if target_acct_id else None
        dt_str = dt.isoformat() if hasattr(dt, 'isoformat') else str(dt)
        amt = float(amount) if amount else 0

        # Build transfer edge: debit from acct to target
        if direction == "debit" and acct_str and target_str:
            edges.append({
                "source": acct_str,
                "target": target_str,
                "amount": amt,
                "datetime": dt_str,
                "tx_type": tx_type or "transfer",
            })
        elif direction == "credit" and acct_str and target_str:
            # Credit means target_account sent to acct_str
            edges.append({
                "source": target_str,
                "target": acct_str,
                "amount": amt,
                "datetime": dt_str,
                "tx_type": tx_type or "transfer",
            })

        # Timeline entry for scenario accounts
        if acct_str and acct_str in account_to_role:
            timeline.append({
                "account_id": acct_str,
                "datetime": dt_str,
                "amount": amt,
                "direction": direction,
            })

    return {
        "typology": typology_name,
        "scenario_id": scenario_id,
        "nodes": nodes,
        "edges": edges,
        "timeline": sorted(timeline, key=lambda x: x["datetime"]),
    }


def _short_account(con, account_id: str) -> str:
    row = con.execute(
        "SELECT account_number FROM account_base WHERE account_id::VARCHAR = ? LIMIT 1",
        [account_id]
    ).fetchone()
    if row:
        return f"ACC-{row[0]}"
    return f"ACC-{account_id[:8]}"


def _write(path: Path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2, default=str)


if __name__ == "__main__":
    main()
