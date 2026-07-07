# SmartWallet

A personal finance Progressive Web App (PWA) for tracking income, expenses, bills, lending, and savings — built for personal use, tracking everything in **LKR (Sri Lankan Rupees)**.

🔗 **Live app:** https://thebeastsl06.github.io/smartwallet/

---

## Overview

SmartWallet keeps **Cash** and **Bank** balances separate, and gives a full picture of where money goes each month — income, mandatory bills, day-to-day expenses, money lent or borrowed, and progress toward savings goals. It's a single-file React app with no backend build step, backed by Supabase for data storage.

---

## Features

### 💰 Dual Account Tracking
Cash and Bank balances are tracked independently. Every income entry, bill, expense, transfer, and savings contribution is tied to a specific account (source or destination), so balances always reflect reality.

### 📊 Smart Budget with Cascading Overflow
Set percentage-based budget allocations per category. If a category overspends:
1. The overrun is absorbed into the **Buffer** category.
2. If Buffer's own allocation is also exceeded, the excess cascades into the **Emergency** category.
3. Only when Emergency itself is exceeded does the app raise a 🔴 **Over Budget** alert, with a breakdown of which categories contributed.

This means small overruns are absorbed quietly, and you're only alerted when things are genuinely off track.

### 🧾 Income, Bills & Expenses
- **Income sources:** Salary, Overtime, Allowances, Bonus, Other
- **Bill types:** Loan Installment, Credit Card, Electricity, Router/Internet, Telephone, Water, Custom
- **Expense categories:** Food & Groceries, Eggs & Yoghurts, Snacks, Transport, Family & Kids, Health, Education, Leisure, Emergency, Other

### 🤝 Lending & Borrowing
Track money lent to or borrowed from others. Unsettled entries automatically carry forward into future months until fully settled — once settled, they no longer clutter upcoming months.

### 🎯 Savings Goals
Set savings goals and contribute toward them directly from Cash or Bank. Contributions create matching transactions so your account balances always stay accurate; deleting a goal cleans up its linked transactions too.

### 📈 Reports
- Expenses-by-category donut chart (with percentage + amount per category)
- Expenses vs Salary and Bills vs Salary comparisons
- Category grouping on the Home tab (e.g. Food & Groceries, Eggs & Yoghurts, and Snacks roll up into a single "Foods" bar) — Reports and expense dropdowns still show every category separately

### 🕒 Historical Browsing
Every tab supports browsing past months, so you can review budgets, bills, expenses, and lending history for any prior period.

---

## Tech Stack

- **React 18** (CDN, UMD build — no bundler)
- **Babel Standalone** for in-browser JSX transpilation
- **Tailwind CSS** (CDN)
- **Supabase** for data storage and auth (Postgres + Row Level Security)
- **Vanilla Service Worker** for PWA installability (network-first, no offline caching of app files)

No build tools, no npm install — the entire app is a single `index.html` file plus a manifest and service worker.

---

## Project Structure

```
smartwallet-pwa/
├── index.html          # The entire app (React components, logic, styling)
├── manifest.json        # PWA manifest (name, icons, theme)
├── sw.js                 # Service worker (network-first strategy)
├── icon.svg              # App icon
└── icon-maskable.svg     # Maskable app icon (for adaptive icons on Android)
```

---

## Data Model (Supabase)

| Table | Purpose |
|---|---|
| `income_entries` | Income records, with a destination account (Cash/Bank) |
| `mandatory_bills` | Recurring/one-off bills, with a source account |
| `transactions` | General expenses, with a source account |
| `savings_goals` | Savings goals and their contribution source account |
| `lendings` | Money lent/borrowed, with account + settlement account (no month/year columns — carry-forward is determined by settlement status, not a stored period) |
| `transfers` | Cash ↔ Bank transfers |

Row Level Security is enabled on every table, scoped to `auth.uid()`.

---

## Deployment

The app is hosted on **GitHub Pages**. To deploy an update:
1. Replace `index.html` (and/or other changed files) in the repository.
2. Upload directly via GitHub's web interface (no CI/build step required).
3. GitHub Pages serves the updated file automatically — the service worker is network-first, so users won't get stuck on a stale cached version.

---

## Notes for Future Development

- Smart Budget calculations are **planning-only** — they never affect actual Cash/Bank balances.
- Category grouping (e.g. "Foods") is scoped to the Home tab only; Reports and dropdowns always show granular categories.
- Babel Standalone requires the classic JSX runtime preset to be registered manually before use — without it, the auto runtime emits `import` statements that break execution in the browser.
