# Transactional Wallet Ledger

Production-style wallet ledger API and dashboard with authentication, payment keys, internal transfers, idempotency-ready client flow, and transactional consistency.

![Transactional Wallet Ledger logo](./transactional-wallet-ledger-front/public/brand-logo.png)

## Overview

Transactional Wallet Ledger is a full-stack portfolio/demo project composed of a Fastify API and a Next.js dashboard. It models an internal wallet ledger where users can register, authenticate, create payment keys, resolve recipients, send wallet transfers, and inspect debit/credit transaction history.

The goal is not to build a real banking product. The goal is to demonstrate how production-oriented transactional systems can be structured: explicit API contracts, token-based auth, wallet balance updates, ledger records, recipient lookup before payment, validation boundaries, E2E/API tests, and a polished interface that makes the backend behavior easy to evaluate.

## Why This Project Exists

Most portfolio projects stop at CRUD. This project focuses on backend problems that appear in real payment-like systems:

- Retry-safe operation design and idempotency boundaries.
- Duplicate request handling as a first-class concern.
- Balance consistency during internal transfers.
- Recipient resolution before payment confirmation.
- Ledger-backed debit and credit transaction history.
- Clear separation between HTTP modules, services, schemas, and persistence.
- Typed request validation with Zod.
- Public user sanitization so password hashes are not returned.
- Authenticated PDF receipts attached to debit transactions.
- A frontend that demonstrates the API as a real product instead of a raw endpoint list.

## Monorepo Structure

```txt
.
├── .env.example
├── README.md
├── transactional-wallet-ledger-api/
│   ├── data/
│   │   └── .gitkeep
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth.ts
│   │   │   ├── payment.ts
│   │   │   ├── payment-key.ts
│   │   │   ├── transaction.ts
│   │   │   └── user.ts
│   │   ├── plugins/
│   │   │   └── prisma.ts
│   │   ├── schema/
│   │   │   ├── auth.schema.ts
│   │   │   ├── payment.schema.ts
│   │   │   ├── payment-key.schema.ts
│   │   │   ├── transaction.schema.ts
│   │   │   └── user.schema.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── balance.service.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── payment-key.service.ts
│   │   │   ├── receipt.service.ts
│   │   │   ├── session.service.ts
│   │   │   ├── transaction.service.ts
│   │   │   └── user.service.ts
│   │   ├── util/
│   │   │   └── parser-util.ts
│   │   └── server.ts
│   ├── tests/
│   │   └── e2e/
│   ├── package.json
│   └── playwright.config.ts
└── transactional-wallet-ledger-front/
    ├── app/
    │   ├── dashboard/
    │   ├── login/
    │   ├── payment-keys/
    │   ├── register/
    │   ├── transactions/
    │   └── page.tsx
    ├── components/
    ├── hooks/
    ├── lib/
    ├── public/
    └── package.json
```

## Backend API

The backend is a Fastify API written in TypeScript. Routes are grouped by feature modules, while business logic lives in services and request validation lives in Zod schemas.

### Backend Stack

- Fastify
- TypeScript
- PostgreSQL
- Prisma
- Zod
- bcrypt
- PDFKit
- Playwright API/E2E tests

### Core Backend Features

- User registration and login.
- Password hashing with bcrypt.
- Bearer token authentication through persisted sessions.
- Public user selection without returning password hashes.
- Payment key creation, listing, lookup, and deletion.
- Pix-inspired internal wallet transfer flow.
- Recipient resolution before transfer confirmation.
- Atomic debit/credit wallet updates inside a Prisma transaction.
- Ledger rows with `DEBIT` and `CREDIT` transaction types.
- Transaction filters for authenticated users.
- PDF receipt generation for debit transfers.
- Receipt files saved deterministically as `data/{transactionId}.pdf`.
- Authenticated receipt download route.
- API/E2E tests around validation and auth boundaries.

### API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | API health check used by the frontend wake-up screen. |
| `POST` | `/auth/register` | Create a user account. |
| `POST` | `/auth/login` | Login and return a session token. |
| `GET` | `/users/me` | Return the authenticated public user. |
| `GET` | `/users/transactions` | Return authenticated user ledger rows with optional filters. |
| `GET` | `/payment-keys` | List authenticated user payment keys. |
| `POST` | `/payment-keys` | Create a payment key for the authenticated user. |
| `GET` | `/payment-keys/:key` | Resolve a payment key and its public owner data. |
| `GET` | `/payment-keys/:key/user` | Resolve only the public user behind a payment key. |
| `DELETE` | `/payment-keys/:key` | Delete an authenticated user's payment key. |
| `POST` | `/payments` | Create an internal wallet transfer. |
| `GET` | `/transactions/:id/receipt` | Fetch the PDF receipt for an owned debit transaction. |

## Frontend Dashboard

The frontend is a Next.js App Router application designed as a product-style portfolio UI for recruiters and technical reviewers. It consumes the Fastify API through a centralized client and presents the ledger system as an interactive demo.

### Frontend Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- TanStack Query
- React Hook Form
- Zod
- Lucide React
- Recharts

### Frontend Features

- Public landing page explaining the technical project.
- API wake-up screen for free-hosted backend instances.
- Register and login pages with Zod validation.
- Centralized token handling in `lib/auth.ts`.
- Centralized API fetch layer in `lib/api-client.ts`.
- Automatic `Authorization: Bearer <token>` header injection.
- Protected dashboard.
- Wallet balance and transaction metrics.
- Payment key management page.
- Dedicated transactions page.
- Two-step transfer modal:
  1. Resolve recipient by payment key.
  2. Confirm amount and submit transfer.
- Client-generated `Idempotency-Key` header for new transfer attempts.
- Authenticated PDF receipt access from the modal and transaction table.
- Mobile-first dark/neon UI with responsive cards, tables, modals, loading states, and animations.

## Transaction Flow

```txt
1. User logs in and receives a session token.
2. Frontend stores the token for the demo session.
3. User enters a recipient payment key.
4. Frontend calls the API to resolve the recipient.
5. UI displays recipient confirmation data.
6. User confirms amount and description.
7. Frontend sends POST /payments with:
   - Authorization: Bearer <token>
   - Idempotency-Key: <client-generated-uuid>
8. Backend validates the request and authenticated session.
9. Backend runs a Prisma transaction:
   - finds the payment key
   - checks payer balance
   - debits payer
   - creates DEBIT transaction
   - credits receiver
   - creates CREDIT transaction
10. Backend generates a PDF receipt for the debit transaction.
11. Frontend invalidates balance and transaction queries.
```

## Idempotency Status

The frontend already generates and sends an `Idempotency-Key` header for payment attempts. This makes the client flow idempotency-ready and prevents duplicate visual submissions during a pending transfer.

Server-side idempotency persistence is intentionally documented as roadmap work. A production-grade implementation should store idempotency keys with request hashes and final responses, then return the original result for safe retries.

## Auditability And Receipts

Each transfer creates ledger rows that can be inspected by the authenticated user. Debit transactions expose a `receiptUrl`, and the API generates a styled PDF receipt saved under:

```txt
transactional-wallet-ledger-api/data/{transactionId}.pdf
```

Receipt access goes through the API instead of public static hosting, so the Bearer token is still required.

Full reconciliation workflows, settlement reports, and administrative audit views are planned roadmap items.

## Data Model

The Prisma schema includes:

- `User`: account identity, tax ID, password hash, wallet balance.
- `Session`: persisted auth token with expiration metadata.
- `PaymentKey`: UUID-based internal payment identifier owned by a user.
- `Transaction`: ledger row with amount, type, reference ID, optional payer/receiver relations, and description.
- `TransactionType`: `DEBIT` or `CREDIT`.

## Running Locally

### 1. Configure Environment

Create a local environment file with a PostgreSQL connection string.

```bash
cp .env.example .env
```

The expected variable is:

```bash
DATABASE_URL="postgresql://ledger_user:ledger_password@localhost:5432/ledger_db?schema=public"
```

For the frontend, create:

```bash
cd transactional-wallet-ledger-front
touch .env.local
```

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GITHUB_URL=https://github.com/emanuelVINI01
```

### 2. Install Backend Dependencies

```bash
cd transactional-wallet-ledger-api
npm install
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

Run migrations according to your local database setup:

```bash
npx prisma migrate dev
```

### 4. Start The API

```bash
npm run dev
```

The API listens on:

```txt
http://localhost:3001
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd transactional-wallet-ledger-front
npm install
```

### 6. Start The Frontend

```bash
npm run dev
```

The dashboard runs on:

```txt
http://localhost:3000
```

## Useful Commands

### Backend

```bash
cd transactional-wallet-ledger-api
npm run dev
npm run build
npm run test:e2e
npm run admin:deposit
```

### Frontend

```bash
cd transactional-wallet-ledger-front
npm run dev
npm run build
npm run lint
```

## Testing

The backend includes Playwright-based API/E2E tests in:

```txt
transactional-wallet-ledger-api/tests/e2e/api.spec.ts
```

The current tests validate important boundaries such as:

- Health check behavior.
- Invalid auth payload rejection.
- Invalid transaction query rejection.
- Protected payment-key routes.
- Protected payment creation route.

## Deployment Split

Recommended deployment model:

- Frontend: Vercel
- Fastify API: Render
- PostgreSQL: Neon or Supabase
- Redis, if server-side locks/idempotency are added: Upstash

The frontend should receive the deployed API root through:

```bash
NEXT_PUBLIC_API_URL=https://your-api-url
```

The API should receive:

```bash
DATABASE_URL=postgresql://...
FRONTEND_URL=https://your-frontend-url
PORT=3001
```

## Roadmap

- Persist and enforce server-side idempotency keys.
- Add Redis-backed coordination or locks for high-contention transfer scenarios.
- Add reconciliation reports for debit/credit references.
- Add administrative audit views.
- Expand E2E coverage for successful transfer and receipt generation flows.
- Add richer transaction filtering in the frontend.
- Add CI for lint, build, and API tests.

## Project Status

This is a portfolio/demo project designed to communicate backend and full-stack engineering skills. It is production-style in architecture and presentation, but it is not a real financial institution, banking system, or payment processor.

