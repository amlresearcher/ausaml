# AusAML Website

The official project website for **AMLGen** and the **AusAML** benchmark dataset. Built with React, Vite, and Tailwind CSS.

🌐 **Live site:** [amlresearcher.github.io/ausaml](https://amlresearcher.github.io/ausaml)
📦 **Dataset:** [huggingface.co/datasets/DVK2026/AMLBench](https://huggingface.co/datasets/DVK2026/AMLBench)

---

## What the site covers

- **AMLGen** — overview of the synthetic banking data generator
- **AusAML** — the benchmark dataset produced by AMLGen, including a full summary table across Small and Large dataset variants and four bank colour groups
- **AML Typologies** — the 35 typology scenarios spanning structuring, layering, and integration layers of money laundering
- **Dataset Validation** — Synthetic Integrity Validation (SIV, 101 checks) and Synthetic Realism Validation (SRV, 13 checks) results

---

## Running locally

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
git clone https://github.com/amlresearcher/ausaml.git
cd ausaml
npm install
npm run dev
```

The site will be available at `http://localhost:5173`.

### Scripts

| Command            | Description                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Start development server with HMR    |
| `npm run build`    | TypeScript compile + production build |
| `npm run preview`  | Preview the production build locally  |
| `npm test`         | Run the Vitest test suite             |

---

## Tech stack

- [React 18](https://react.dev/)
- [Vite 7](https://vitejs.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [React Router 6](https://reactrouter.com/)
- [Vitest](https://vitest.dev/)
