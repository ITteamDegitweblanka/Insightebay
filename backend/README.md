# eBay Performance Dashboard Backend

## Setup

1. Create a MySQL database and update `.env` with your credentials.
2. Install dependencies:
   ```
npm install
   ```
3. Start the server:
   ```
npm run dev
   ```

## API Endpoints
- `GET /api/listings/analyze` — Analyze listing health
- `GET /api/employees/performance` — Employee KPIs
- `GET /api/listings/compare` — Optimization before/after
- `GET /api/sales/sold` — Sold item stats
- `GET /api/dashboard/summary` — Dashboard KPIs
