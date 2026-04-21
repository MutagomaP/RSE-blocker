# 🇷🇼 RSE Platform — Rwanda Stock Exchange Broker-to-Buyer System

A full-stack NestJS platform connecting **licensed brokers** to **investors** on the Rwanda Stock Exchange (RSE). 

---

## 📐 Architecture

```
rse-platform/
├── apps/
│   ├── api/          ← NestJS REST API (Backend) — Port 3000
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── auth/         JWT authentication (register/login)
│   │       │   ├── users/        User profiles (investors, brokers, admins)
│   │       │   ├── brokers/      Broker profiles & CMA license management
│   │       │   ├── securities/   RSE-listed equities, bonds, ETFs
│   │       │   ├── orders/       Buy/sell order placement & matching engine
│   │       │   ├── trades/       Executed trade records (T+2 settlement)
│   │       │   ├── portfolio/    Investor portfolio & P&L
│   │       │   └── market/       RSE indices, breadth, top movers
│   │       └── seed.ts           Database seeder (real RSE securities)
│   │
│   └── web/          ← NestJS SSR Frontend (Handlebars) — Port 3001
│       ├── src/
│       │   ├── common/           ApiService, AuthMiddleware, WebAuthGuard
│       │   └── modules/          Route controllers (home, auth, market…)
│       ├── views/                Handlebars templates (.hbs)
│       └── public/               CSS, JS, images
│
└── docker-compose.yml            PostgreSQL + API + Web
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ (or Docker)

### 1. Clone & Install

```bash
git clone <your-repo>
cd rse-platform

# Install API deps
cd apps/api && npm install

# Install Web deps
cd ../web && npm install
```

### 2. Configure Environment

```bash
# API
cd apps/api
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Web
cd apps/web
cp .env.example .env
```

### 3. Start PostgreSQL

```bash
# Option A: Docker
docker run -d --name rse_postgres \
  -e POSTGRES_DB=rse_platform \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=rse_password \
  -p 5432:5432 postgres:16-alpine

# Option B: Use existing PostgreSQL — just create the database:
createdb rse_platform
```

### 4. Seed the Database

```bash
cd apps/api
npx ts-node src/seed.ts
```

This creates:
- **8 RSE-listed securities** (BK, MTN, BRALIRWA, KCB, Equity, Safaricom, Nation Media, Rwanda Bond)
- **3 licensed broker firms** with profiles
- **Admin account**: `admin@rse.rw` / `Admin@RSE2024!`
- **Broker account**: `info@africafinancial.rw` / `Broker@RSE2024!`

### 5. Run Both Apps

```bash
# Terminal 1 — API
cd apps/api && npm run start:dev

# Terminal 2 — Web
cd apps/web && npm run start:dev
```

Open http://localhost:3001

---

## 🐳 Docker Compose (Production-like)

```bash
docker-compose up --build
```

Access:
- Web: http://localhost:3001
- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

---

## 📡 API Endpoints

Full Swagger documentation at `/api/docs` when running.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Register investor or broker |
| POST | `/api/v1/auth/login` | Login, receive JWT |
| GET  | `/api/v1/auth/me` | Get current user |
| GET  | `/api/v1/market` | Market overview, indices, movers |
| GET  | `/api/v1/securities` | List all RSE securities |
| GET  | `/api/v1/securities/:id` | Security detail |
| GET  | `/api/v1/brokers` | List licensed brokers |
| GET  | `/api/v1/brokers/:id` | Broker profile |
| POST | `/api/v1/orders` | Place buy/sell order |
| GET  | `/api/v1/orders/my-orders` | My orders |
| DELETE | `/api/v1/orders/:id` | Cancel pending order |
| GET  | `/api/v1/portfolio` | My portfolio + P&L |
| GET  | `/api/v1/trades/my-trades` | My trade history |

---

## 🌐 Web Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with live ticker, market data, brokers |
| `/market` | Full market board — indices, breadth, all securities |
| `/securities` | Searchable securities listing |
| `/securities/:id` | Security detail with 30-day chart + trade widget |
| `/brokers` | Licensed broker directory |
| `/brokers/:id` | Broker profile page |
| `/dashboard` | Authenticated — portfolio summary + market snapshot |
| `/portfolio` | Holdings, P&L, trade history |
| `/orders` | Place orders, view & cancel order book |
| `/auth/login` | Sign in |
| `/auth/register` | Create investor or broker account |

---

## 🏛 Business Rules

- **Roles**: `investor` (buy/sell), `broker` (intermediate + own trades), `admin` (platform management)
- **Order matching**: Market orders auto-match against pending limit orders (FIFO)
- **Settlement**: T+2 business days via CSD Rwanda
- **Commission**: 1% per trade (configurable per broker)
- **Order types**: Market (instant) and Limit (queue until matched)
- **Shorting**: Sell orders require sufficient portfolio holdings
- **CMA compliance**: All brokers require CMA Rwanda license approval before activation

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| API Framework | NestJS 10 (TypeScript) |
| Web Framework | NestJS 10 + Handlebars SSR |
| Database | PostgreSQL 16 via TypeORM |
| Authentication | JWT (passport-jwt) |
| API Docs | Swagger / OpenAPI |
| Styling | Custom CSS (Syne + DM Sans fonts) |
| Charts | Chart.js |
| Containers | Docker + Docker Compose |

---

## 📈 RSE-Listed Securities Seeded

| Ticker | Company | Type |
|--------|---------|------|
| BK | Bank of Kigali Group | Equity |
| MTN | MTN Rwanda PLC | Equity |
| BRALIRWA | Bralirwa PLC | Equity |
| KCB | KCB Group (cross-listed NSE) | Equity |
| EQUITY | Equity Group Holdings (cross-listed NSE) | Equity |
| SAFARICOM | Safaricom PLC (cross-listed NSE) | Equity |
| NATION | Nation Media Group (cross-listed NSE) | Equity |
| GOK2034 | Rwanda Treasury Bond 2034 | Bond |

---

## 🔒 Security Notes for Production

1. Change `JWT_SECRET` to a 256-bit random string
2. Enable HTTPS / SSL termination (nginx recommended)
3. Set `NODE_ENV=production` to disable TypeORM `synchronize`
4. Run proper DB migrations instead of `synchronize: true`
5. Add rate limiting (`@nestjs/throttler`)
6. Implement proper KYC/AML flows before live trading
