type Status = 'pass' | 'warn' | 'skip'

interface Check {
  id: string
  name: string
  status: Status
  threshold: string
  notes: string
}

interface Category {
  label: string
  checks: Check[]
}

const CATEGORIES: Category[] = [
  {
    label: 'Balance Reconciliation',
    checks: [
      { id: 'E0.1', status: 'pass', name: 'No duplicate timestamps on the same account', threshold: '<1% of accounts have timestamp collisions', notes: '0/23,869 accounts have duplicate-datetime rows.' },
      { id: 'E0.2', status: 'pass', name: 'Running balance changes correctly after each debit and credit', threshold: '<0.1% of consecutive pairs fail arithmetic check (±$0.10)', notes: '0/8,816,643 pairs broken.' },
      { id: 'E0.3', status: 'pass', name: 'Account balance not negative after the first transaction', threshold: '0% of accounts have negative balance after first transaction', notes: '0/23,869 accounts open with negative balance; min opening balance $0.75.' },
      { id: 'E0.4', status: 'pass', name: 'Transactions pushing an account into negative balance are rare', threshold: '<1% of completed transactions have negative running_balance', notes: 'No negative balances detected.' },
      { id: 'E0.5', status: 'pass', name: 'No duplicate transactions with identical amount, account and timestamp', threshold: '0 exact-duplicate transaction groups', notes: '0 duplicate groups covering 0 rows.' },
      { id: 'E0.6', status: 'pass', name: 'No missing values in mandatory transaction fields', threshold: '0 nulls in transaction_id, account_id, customer_id, datetime, amount, direction', notes: 'All fields complete across 8,885,318 rows.' },
      { id: 'E0.7', status: 'pass', name: 'All transaction amounts are greater than zero', threshold: 'All transaction amounts must be > 0', notes: '0/8,885,318 rows have amount ≤ 0.' },
      { id: 'E0.8', status: 'pass', name: "Every transaction is labelled 'credit' or 'debit'", threshold: "direction must be 'credit' or 'debit' for every row", notes: '0/8,885,318 rows have invalid direction values.' },
    ],
  },
  {
    label: 'Statistical Distributions',
    checks: [
      { id: 'E1.1', status: 'pass', name: 'Customer incomes are right-skewed', threshold: 'mean/median ratio > 1.05 (log-normal property)', notes: 'mean=$238,511, median=$164,484; ratio=1.45.' },
      { id: 'E1.2', status: 'pass', name: 'Customer incomes span a realistic range', threshold: 'CV between 0.35 and 1.5', notes: 'stddev=$336,590, mean=$238,511; CV=1.411.' },
      { id: 'E1.3', status: 'pass', name: 'Card purchase amounts have a realistic log-normal shape', threshold: '|log-skewness| < 1.5', notes: 'log-skewness=0.359 based on 2,234,186 card_pos transactions.' },
      { id: 'E1.4', status: 'pass', name: 'High-net-worth customers spend more per transaction than retail', threshold: 'HNW median ≥ 1.5× retail median', notes: 'HNW median=$154.41, retail=$30.00; ratio=5.15×.' },
      { id: 'E1.6', status: 'pass', name: 'High-net-worth customers make larger cash deposits than retail', threshold: 'HNW median cash deposit ≥ 1.3× retail', notes: 'HNW=$1,992, retail=$365; ratio=5.45×.' },
    ],
  },
  {
    label: 'Income Consistency',
    checks: [
      { id: 'E2.1', status: 'warn', name: "Payroll deposits match the customer's declared annual income", threshold: '≥75% of full-time customers within ±40% of declared income', notes: '2,042/4,578 within range (44.6%); avg relative error 54.3%.' },
      { id: 'E2.2', status: 'skip', name: 'Part-time vs. full-time income comparison', threshold: 'N/A', notes: 'Skipped: insufficient part-time or full-time payroll data.' },
      { id: 'E2.3', status: 'warn', name: 'Self-employed income fluctuates more than salaried income', threshold: 'Self-employed median CV ≥ 1.5× full-time median CV', notes: 'self_employed CV=0.143, full_time CV=0.177; ratio=0.81×.' },
      { id: 'E2.4', status: 'pass', name: 'Contractors receive fewer pay credits per year than full-time employees', threshold: 'Contractor payroll count/year < 0.5× full-time count', notes: 'contractor=6, full_time=30 median transactions; ratio=0.2×.' },
    ],
  },
  {
    label: 'Lifecycle Completeness',
    checks: [
      { id: 'E3.1', status: 'pass', name: 'Credit card accounts have at least one repayment each month', threshold: '≥90% of active non-AML credit cards', notes: '4,693/4,693 cards have repayment transactions (100%).' },
      { id: 'E3.2', status: 'pass', name: 'Loan accounts have at least one repayment debit recorded', threshold: '≥90% of active non-AML loans', notes: '1,273/1,273 loans have repayment transactions (100%).' },
      { id: 'E3.3', status: 'pass', name: 'Term deposit accounts have at least one interest payment credited', threshold: '≥90% of active non-AML term deposits', notes: '2,583/2,770 term deposits have interest credits (93.2%).' },
      { id: 'E3.4', status: 'pass', name: 'Business accounts have made at least one payroll payment', threshold: '≥70% of active non-AML business accounts', notes: '2,640/2,873 business accounts have payroll outflows (91.9%).' },
      { id: 'E3.5', status: 'pass', name: 'Trust accounts have distributed funds to beneficiaries quarterly', threshold: '≥75% of active non-AML trust accounts', notes: '615/615 trust accounts have distributions (100%).' },
      { id: 'E3.6', status: 'pass', name: 'Business accounts have made at least one supplier or vendor payment', threshold: '≥70% of active non-AML business accounts', notes: '2,663/2,873 business accounts have supplier payments (92.7%).' },
    ],
  },
  {
    label: 'AML Signal Quality',
    checks: [
      { id: 'E4.1', status: 'skip', name: 'AML pre-scenario density baseline', threshold: 'N/A', notes: 'Skipped: insufficient pre-scenario AML data.' },
      { id: 'E4.2', status: 'warn', name: 'AML accounts show a surge in activity during their laundering window', threshold: 'Median spike ratio ≥ 1.2× pre-scenario rate', notes: 'Median during/pre-scenario density ratio = 0.77×.' },
      { id: 'E4.4', status: 'pass', name: 'Suspicious customers use cash far more often than normal customers', threshold: 'Suspected cash ratio ≥ 2× normal customers', notes: 'suspected=33.7%, normal=8.8% median cash %; ratio=3.85×.' },
      { id: 'E4.5', status: 'pass', name: 'AML-labelled customer rate matches the configured target', threshold: '5.0% ± 2pp', notes: '655 AML customers / 12,500 total = 5.24%.' },
      { id: 'E4.6', status: 'warn', name: 'Smurfing deposits are kept just below the cash reporting threshold', threshold: '≥90% of smurfing deposits ≥$3,000 in [$3,000–$9,900]', notes: '93.5% of 46 structuring-range deposits in zone; 3 deposits above $9,900.' },
      { id: 'E4.8', status: 'pass', name: 'Loan-back: offshore wire received then repaid in instalments', threshold: '≥70% of loan_back accounts have inbound wire + ≥3 outbound repayments', notes: '4/4 loan_back accounts show repayment pattern (100%).' },
      { id: 'E4.9', status: 'pass', name: 'Ghost payroll: fake employees drain salary at ATMs within 24 h', threshold: '≥70% of ghost payroll credits matched to ATM drain ≥90% within 24 h', notes: '24/24 payroll credits have same-day ATM drain (100%).' },
      { id: 'E4.10', status: 'skip', name: 'ATM cashout ring burst signal', threshold: 'N/A', notes: 'Skipped: no atm_cashout_ring scenarios in dataset.' },
      { id: 'E4.11', status: 'skip', name: 'Crypto gateway cycle signal', threshold: 'N/A', notes: 'Skipped: no crypto_gateway scenarios in dataset.' },
      { id: 'E4.12', status: 'pass', name: 'Hawala mirror: broker collects then settles via international wire', threshold: '≥60% of hawala broker accounts have ≥4 collection credits + 1 settlement wire', notes: '3/3 broker accounts show collection+settlement pattern (100%).' },
      { id: 'E4.13', status: 'pass', name: 'Corporate round-robin: cash in, invoice transfers, wire exit', threshold: '≥70% of scenarios show cash_deposit + transfer + wire_transfer', notes: '3/3 scenarios show all three phases (100%).' },
      { id: 'E4.14', status: 'pass', name: 'Director loan recycling: bidirectional transfer account present', threshold: '≥70% of director_loan_recycling scenarios have ≥1 bidirectional transfer account', notes: '3/3 scenarios show bidirectional transfer flow (100%).' },
      { id: 'E4.15', status: 'pass', name: 'Intrabank hub: receives ≥2 inbound and fans out ≥2 outbound transfers', threshold: '≥70% of intrabank_hub scenarios have a hub account with ≥2 in and ≥2 out transfers', notes: '3/3 scenarios have a qualifying hub account (100%).' },
      { id: 'E4.16', status: 'skip', name: 'Collusive structuring signal', threshold: 'N/A', notes: 'Skipped: no collusive_structuring scenarios in dataset.' },
    ],
  },
  {
    label: 'Country Realism',
    checks: [
      { id: 'E5.1', status: 'pass', name: 'Payroll credits land on the correct weekday (AU)', threshold: '≥75% on Friday for AU', notes: '148,093/195,773 payroll credits on correct day (75.65%).' },
      { id: 'E5.2', status: 'skip', name: 'Seasonal volume December vs. October', threshold: 'N/A', notes: 'Skipped: dataset does not cover both October and December.' },
      { id: 'E5.3', status: 'pass', name: 'Transaction volume shows natural seasonal variation', threshold: 'CV of monthly counts > 0.05 (not flat)', notes: 'CV=0.354 across 7 months.' },
      { id: 'E5.4', status: 'pass', name: 'International wire transfers go to at least 5 different countries', threshold: '≥5 distinct destination countries', notes: '40 distinct wire destination countries.' },
      { id: 'E5.5', status: 'pass', name: '10–30% of outbound wires go to FATF high-risk jurisdictions', threshold: '10–30% of wire transactions to FATF high-risk countries', notes: '24,162/161,080 wires flagged as FATF high-risk (15.0%).' },
      { id: 'E5.6', status: 'pass', name: 'PayID usage proportion is within the Australian expected range (AU)', threshold: '7–15% of individual deposit account transactions', notes: '466,645/5,490,579 transactions are PayID (8.5%).' },
    ],
  },
  {
    label: 'Customer Demographics',
    checks: [
      { id: 'E6.1', status: 'pass', name: 'Customer ages are realistic', threshold: 'Median 35–55, min ≥18, max ≤90', notes: 'median=50, min=19, max=81.' },
      { id: 'E6.2', status: 'warn', name: 'Self-employed customers have more variable transaction amounts than salaried', threshold: 'Self-employed median CV ≥ 1.5× full-time', notes: 'self_employed CV=0.143 (n=1,956), full_time CV=0.177 (n=4,578); ratio=0.81×.' },
      { id: 'E6.3', status: 'pass', name: 'High-net-worth customers deposit larger cash amounts than retail', threshold: 'HNW median cash deposit ≥ 2× retail median', notes: 'HNW median=$1,992, retail median=$365; ratio=5.45×.' },
      { id: 'E6.4', status: 'pass', name: 'Politically exposed persons make up 1–5% of customers', threshold: '1–5% of customers flagged as PEP', notes: '255/12,500 customers have pep_flag=true (2.04%).' },
      { id: 'E6.5', status: 'pass', name: 'Customers with adverse media flags make up 1–8% of the population', threshold: '1–8% of customers flagged with adverse media', notes: '378/12,500 customers have adverse_media_flag=true (3.02%).' },
      { id: 'E6.6', status: 'pass', name: '65–90% of customers are individuals', threshold: '65–90% individual customers', notes: '15,612/24,014 individual customers (65.01%).' },
      { id: 'E6.7', status: 'pass', name: 'Credit card repayments include full, minimum, and partial behaviours', threshold: 'Each archetype (full/minimum/partial) ≥15% of repayments', notes: 'full=20.0%, minimum=20.0%, partial=60.0%.' },
    ],
  },
  {
    label: 'Financial Consistency',
    checks: [
      { id: 'E7.1', status: 'pass', name: 'Account balances rarely fall below the overdraft limit', threshold: '<1% of transactions breach overdraft limit', notes: '0.000% of transactions below overdraft floor.' },
      { id: 'E7.2', status: 'pass', name: 'Home loan amounts do not exceed 5.5× annual income', threshold: 'p99 of (loan_amount / annual_income) ≤ 5.5', notes: 'p99 DTI = 4.96× annual income.' },
      { id: 'E7.3', status: 'pass', name: 'Personal loan amounts do not exceed 1.2× annual income', threshold: 'p99 of (personal loan / annual_income) ≤ 1.2', notes: 'p99 DTI = 0.78× annual income.' },
      { id: 'E7.4', status: 'pass', name: "Credit card limits do not exceed 30% of the cardholder's annual income", threshold: 'p99 of (credit_limit / annual_income) ≤ 0.30', notes: 'p99 credit_limit/income = 0.179.' },
      { id: 'E7.5', status: 'pass', name: 'Newly opened credit cards start with a zero balance', threshold: '≤5% of credit cards have non-zero opening balance', notes: '0/4,693 cards have current_balance > $1.' },
      { id: 'E7.6', status: 'warn', name: 'Home loan mortgages are paid off before the borrower turns 70', threshold: 'p99 of (age_at_open + term_years) ≤ 70 years', notes: 'p99 projected age at maturity = 71.0 years.' },
      { id: 'E7.7', status: 'pass', name: 'Loan repayment amounts match the standard amortisation formula', threshold: '≥90% of loans within ±5% of P×r/(1-(1+r)^-n)', notes: '100.0% within 5%; avg relative error 0.0%.' },
    ],
  },
  {
    label: 'Data Completeness',
    checks: [
      { id: 'E8.1', status: 'pass', name: 'Online and mobile transactions have a device and IP record', threshold: '≥95% of eligible transactions have a digital context row', notes: '7,504,192/7,843,111 eligible transactions have context (95.7%).' },
      { id: 'E8.2', status: 'pass', name: 'Most individual customers have a tax file number on record', threshold: '≥80% of individual customers have tax_file_number', notes: '9,394/9,394 individual customers have national ID (100%).' },
      { id: 'E8.3', status: 'pass', name: 'Every customer has at least one address on file', threshold: '0 customers without an address record', notes: '0/12,500 customers have no address.' },
      { id: 'E8.4', status: 'pass', name: 'Transaction accounts have a behavioural baseline profile', threshold: '≥90% of eligible accounts have a baseline record', notes: '28,140/24,097 eligible accounts have baselines (116.8%).' },
      { id: 'E8.5', status: 'pass', name: '8–25% of individual customers have moved address at least once', threshold: '8–25% of individual customers have ≥2 address records', notes: '2,321/9,366 individual customers have multiple addresses (24.8%).' },
      { id: 'E8.6', status: 'pass', name: '8–25% of personal deposit accounts are shared with a joint holder', threshold: '8–25% of individual deposit accounts have a joint holder', notes: '2,243/15,005 individual accounts have joint_holder access (14.9%).' },
    ],
  },
  {
    label: 'ML Readiness',
    checks: [
      { id: 'E9.1', status: 'pass', name: 'Annual income values are spread out enough to be a useful ML feature', threshold: 'CV of annual_income > 0.40', notes: 'CV = 1.411 (stddev=$336,590, mean=$238,511).' },
      { id: 'E9.2', status: 'pass', name: 'AML-labelled transaction proportion matches configured class imbalance', threshold: '5.0% ± 2pp', notes: '655 AML / 12,500 total customers = 5.24%.' },
      { id: 'E9.3', status: 'pass', name: 'Transactions cover the full configured date range with no large gaps', threshold: '2025-11-01 → 2026-05-31 (within 14-day slack)', notes: 'Actual range: 2025-11-01 to 2026-05-31.' },
      { id: 'E9.4', status: 'warn', name: 'Multi-bank customer proportion matches configuration', threshold: '25.0% ± 5pp', notes: '2,496 customers with >1 bank = 20.0%.' },
    ],
  },
  {
    label: 'Device Signal',
    checks: [
      { id: 'E10.1', status: 'pass', name: '40–75% of digital transactions are made from a mobile device', threshold: '40–75% of digital context rows have mobile device_type', notes: '3,760,686/7,699,528 rows are mobile (48.84%).' },
      { id: 'E10.2', status: 'pass', name: '20–40% of customers have made at least one tablet transaction', threshold: '20–40% of customers have ≥1 tablet transaction', notes: '3,227/12,500 customers have tablet digital context (25.8%).' },
      { id: 'E10.3', status: 'pass', name: 'At least one device is shared across multiple customers (AML signal)', threshold: '≥1 device_id shared across >1 customer', notes: '28 device_ids used by multiple customers.' },
      { id: 'E10.4', status: 'pass', name: 'Mobile transactions originate from CGNAT IP addresses (100.x.x.x)', threshold: '≥50% of mobile digital context rows use CGNAT IP', notes: '3,760,269/3,760,635 mobile rows have CGNAT IP (99.99%).' },
    ],
  },
  {
    label: 'Statistical Fidelity',
    checks: [
      { id: 'E11.1', status: 'pass', name: "Transaction amounts follow Benford's Law", threshold: "First digit = 1 in 22–38% of transaction amounts", notes: 'Observed 33.27% (Benford expected 30.1%) over 8,840,491 txns.' },
      { id: 'E11.2', status: 'pass', name: 'At least 8% of card purchases are round dollar amounts', threshold: '≥8% of card_pos amounts are exact multiples of 10', notes: '19.63% round-10 amounts over 2,234,186 card_pos txns.' },
      { id: 'E11.3', status: 'pass', name: 'A small proportion of large transactions creates a realistic long tail', threshold: 'P90/P50 ≥ 4.0', notes: 'p50=$80.50, p90=$1,114.68; ratio=13.85×.' },
      { id: 'E11.4', status: 'pass', name: 'Payroll credits are at least 10× larger than typical card purchases', threshold: 'payroll_credit median ≥ 10× card_pos median', notes: 'payroll=$3,888.32, card_pos=$38.95; ratio=99.83×.' },
      { id: 'E11.5', status: 'pass', name: 'Transactions under $0.50 make up less than 3% of all transactions', threshold: '<3% of completed transactions are under $0.50', notes: '0.0% micro-transactions over 8,840,512 completed txns.' },
    ],
  },
  {
    label: 'Temporal Fidelity',
    checks: [
      { id: 'E12.1', status: 'pass', name: 'Weekdays have at least 20% more transactions per day than weekends', threshold: 'weekday/weekend daily volume ratio ≥ 1.2', notes: 'avg weekday=50,840, avg weekend=19,589 txns/day; ratio=2.6×.' },
      { id: 'E12.2', status: 'pass', name: 'Daily transaction counts vary naturally', threshold: 'CV of daily transaction counts ≥ 0.15', notes: 'CV=0.526 over 212 calendar days.' },
      { id: 'E12.3', status: 'pass', name: 'Loan and credit card repayments cluster around month boundaries', threshold: '≥35% of repayments fall in days 1–7 or 25–31', notes: '100.0% of 40,489 repayment transactions in boundary days.' },
      { id: 'E12.4', status: 'warn', name: 'Payroll arrives on a consistent cadence', threshold: 'Median per-customer stddev of payroll gap ≤ 5 days', notes: 'median gap stddev=7.12 days over 4,578 customers with ≥3 payrolls.' },
      { id: 'E12.5', status: 'pass', name: 'Most card purchases and ATM withdrawals happen between 7 am and 10 pm', threshold: '≥55% of card_pos/atm_withdrawal between 07:00 and 21:59', notes: '79.99% in business hours over 2,234,210 transactions.' },
    ],
  },
  {
    label: 'Referential Integrity',
    checks: [
      { id: 'E13.1', status: 'pass', name: 'Every account is linked to an existing customer — no orphaned accounts', threshold: '0 orphaned accounts', notes: '0 of 28,140 accounts have no customer_master row.' },
      { id: 'E13.2', status: 'pass', name: 'Every transaction is linked to an existing account — no orphaned transactions', threshold: '0 orphaned transactions', notes: '0 of 8,885,318 transactions have no account_base row.' },
      { id: 'E13.3', status: 'pass', name: 'All AML scenario designations reference valid customers and accounts', threshold: '0 broken FK references', notes: '0 missing customers, 0 missing accounts across 655 designations.' },
      { id: 'E13.4', status: 'warn', name: 'Every typed transaction has a corresponding extension row', threshold: '100% coverage', notes: '3 missing extension rows across 8,377,973 typed transactions (wire_international: 3 missing).' },
      { id: 'E13.5', status: 'pass', name: 'High-net-worth customers transact at higher average amounts than retail', threshold: 'HNW avg ≥ 1.5× retail avg', notes: 'HNW avg=$1,839, retail avg=$551; ratio=3.34×.' },
    ],
  },
  {
    label: 'Account Type Completeness',
    checks: [
      { id: 'E14.1', status: 'pass', name: 'Each individual customer has exactly one transaction account', threshold: '≥95% of individual customers have exactly 1 transaction account', notes: '9,366/9,366 individual customers (100%).' },
      { id: 'E14.2', status: 'pass', name: 'Each business customer has exactly one business cheque account', threshold: '≥95% of business customers have exactly 1 business cheque account', notes: '2,500/2,503 business customers (99.9%).' },
      { id: 'E14.3', status: 'pass', name: 'Every active account has at least one owner in account_access', threshold: '≥99% of active accounts have an owner access row', notes: '27,686/27,686 active accounts have an owner (100%).' },
      { id: 'E14.4', status: 'pass', name: 'No account has a close date before its open date', threshold: '0 accounts with close_date < open_date', notes: '0 account(s) with inverted date range.' },
    ],
  },
  {
    label: 'Extension Completeness',
    checks: [
      { id: 'E15.1', status: 'pass', name: 'Card POS transactions have extension rows', threshold: '≥99% of card_pos transactions have an extension row', notes: '2,234,186/2,234,186 (100.0%).' },
      { id: 'E15.2', status: 'pass', name: 'BPAY transactions have extension rows', threshold: '≥99% of bpay transactions have an extension row', notes: '922,827/922,827 (100.0%).' },
      { id: 'E15.3', status: 'pass', name: 'Cash deposit transactions have extension rows', threshold: '≥99% of cash_deposit transactions have an extension row', notes: '304,775/304,775 (100.0%).' },
      { id: 'E15.4', status: 'pass', name: 'Cash withdrawal transactions have extension rows', threshold: '≥99% of cash_withdrawal transactions have an extension row', notes: '524,951/524,951 (100.0%).' },
    ],
  },
  {
    label: 'Behavioral & Digital Coverage',
    checks: [
      { id: 'E16.1', status: 'pass', name: 'Every account with transactions has exactly one behavioral baseline row', threshold: '≥99% of transacting accounts have exactly 1 baseline row', notes: '23,869/23,869 accounts have a baseline (100%).' },
      { id: 'E16.2', status: 'warn', name: 'Online/mobile/POS transactions each have a digital context row', threshold: '≥99% of digital-channel transactions have a digital_context row', notes: '7,504,192/7,843,111 digital transactions have context (95.7%).' },
      { id: 'E16.3', status: 'pass', name: 'Behavioral baseline period ends the day before the dataset starts', threshold: '0 baseline rows with wrong period_end date', notes: '0/28,140 rows have unexpected baseline_period_end (dataset starts 2025-11-01).' },
    ],
  },
  {
    label: 'CTR Flagging',
    checks: [
      { id: 'E17.1', status: 'pass', name: 'All cash deposits ≥ $10,000 have ctr_triggered=true', threshold: '100% of deposits above CTR threshold must be flagged', notes: '10,321/10,321 large deposits are CTR-flagged (100%).' },
      { id: 'E17.2', status: 'skip', name: 'Cash withdrawal CTR flagging', threshold: 'N/A', notes: 'Skipped: no cash withdrawals ≥ $10,000.' },
      { id: 'E17.3', status: 'pass', name: 'Fraction of cash deposits that trigger a CTR is within realistic range', threshold: '0.1–5% of cash deposits trigger a CTR', notes: '10,321/304,775 deposits CTR-flagged (3.39%).' },
    ],
  },
  {
    label: 'Running Balance',
    checks: [
      { id: 'E18.1', status: 'pass', name: 'No completed transaction has a null running_balance after reconciliation', threshold: '0 completed transactions with null running_balance', notes: '0/8,840,512 completed transactions missing balance (0.00%).' },
    ],
  },
]

const SUMMARY = { total: 101, passed: 84, warned: 10, failed: 0, skipped: 7 }

const STATUS_STYLES: Record<Status, { card: string; badge: string; label: string }> = {
  pass: { card: 'border-green-200 bg-green-50', badge: 'bg-green-100 text-green-700', label: 'PASS' },
  warn: { card: 'border-amber-200 bg-amber-50', badge: 'bg-amber-100 text-amber-700', label: 'WARN' },
  skip: { card: 'border-slate-200 bg-slate-50', badge: 'bg-slate-100 text-slate-500', label: 'SKIP' },
}

function catStatus(checks: Check[]): 'pass' | 'warn' | 'skip' {
  if (checks.some(c => c.status === 'warn')) return 'warn'
  if (checks.every(c => c.status === 'skip')) return 'skip'
  return 'pass'
}

export function SIValidation() {
  const passRate = Math.round((SUMMARY.passed / SUMMARY.total) * 100)

  return (
    <section id="si-validation" className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <div>
            <h2 className="text-3xl font-bold text-navy-900">Synthetic Integrity Validation</h2>
            <p className="text-slate-500 mt-2">
              {SUMMARY.total} automated checks verifying internal consistency, referential integrity,
              and AML signal quality across the generated dataset.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Results shown for <span className="font-medium text-slate-500">Yellow Bank · Small Dataset</span>
            </p>
          </div>
          <span className="shrink-0 bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-2 rounded-full">
            Overall: WARN
          </span>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          <div className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-lg">
            {SUMMARY.passed} passed
          </div>
          <div className="bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-2 rounded-lg">
            {SUMMARY.warned} warned
          </div>
          <div className="bg-slate-200 text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg">
            {SUMMARY.skipped} skipped
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-slate-500">
            <div className="w-32 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${passRate}%` }} />
            </div>
            <span className="font-semibold text-navy-900">{passRate}% pass rate</span>
          </div>
        </div>

        <div className="space-y-10">
          {CATEGORIES.map(cat => {
            const st = catStatus(cat.checks)
            const countByStatus = (s: Status) => cat.checks.filter(c => c.status === s).length
            return (
              <div key={cat.label}>
                <h3 className="text-lg font-semibold text-navy-900 mb-4 flex flex-wrap items-center gap-3">
                  {cat.label}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[st].badge}`}>
                    {st === 'warn' ? 'WARN' : 'PASS'}
                  </span>
                  <span className="text-xs text-slate-400 font-normal">
                    {countByStatus('pass')} passed
                    {countByStatus('warn') > 0 && ` · ${countByStatus('warn')} warned`}
                    {countByStatus('skip') > 0 && ` · ${countByStatus('skip')} skipped`}
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.checks.map(check => {
                    const s = STATUS_STYLES[check.status]
                    return (
                      <div key={check.id} className={`border rounded-lg p-4 ${s.card}`}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-mono text-xs text-slate-400 shrink-0 mt-0.5">{check.id}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${s.badge}`}>
                            {s.label}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-navy-900 mb-1 leading-snug">{check.name}</p>
                        <p className="text-xs text-slate-500 mb-2">Threshold: {check.threshold}</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{check.notes}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
