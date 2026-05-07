# Transactional Wallet Ledger Frontend

<img src="./public/brand-logo.png" alt="Transactional Wallet Ledger logo" width="140" />

Next.js portfolio client for the Fastify Transactional Wallet Ledger API. The UI is designed as a production-style fintech demo for recruiters: landing page, auth, protected dashboard, payment-key management, receipt download, payment-key resolution and a two-step transfer modal.

The logo in `public/brand-logo.png` was generated with AI for this portfolio demo. Prompt summary: dark/neon fintech logo mark combining wallet, ledger rows, transaction arrows and shield/check reliability cues, without embedded text.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GITHUB_URL=https://github.com/emanuelVINI01
```

`NEXT_PUBLIC_API_URL` must point to the Fastify API root. The frontend uses the real API endpoints:

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /users/me`
- `GET /users/transactions`
- `GET /payment-keys`
- `POST /payment-keys`
- `GET /payment-keys/:key`
- `DELETE /payment-keys/:key`
- `POST /payments`
- `GET /transactions/:id/receipt`

## Backend Wake-Up

`ApiWakeGate` checks `GET /health` before login, register and dashboard render. It uses request timeouts, automatic retry and explicit UI states for free Render-style cold starts:

- Checking API
- Waking backend
- Connecting to ledger service
- Ready

If the API fails repeatedly, the user sees a retry action instead of a blank screen.

## Authentication

The API returns a session with a token on `POST /auth/login`. The frontend stores that token in `localStorage` for demo simplicity via `lib/auth.ts`.

Every authenticated request goes through `lib/api-client.ts`, which injects:

```http
Authorization: Bearer <token>
```

For a production app, move auth storage to secure, httpOnly cookies controlled by the backend.

## Transaction Modal

The transfer modal is a two-step flow:

1. Resolve recipient by payment key through `GET /payment-keys/:key`.
2. Confirm amount and submit `POST /payments`.

The client generates an `Idempotency-Key` header for every new payment attempt. The current backend accepts the request without enforcing idempotency server-side yet, so the frontend keeps the integration isolated and visible as a TODO for the API layer.

Debit transfers generate a styled PDF receipt in the backend `data/` directory. The filename is deterministic: `data/{transactionId}.pdf`. The dashboard downloads it through the authenticated API route `GET /transactions/:id/receipt`, so the Bearer token is still attached by the centralized API client.

## Payment Keys

The `/payment-keys` page lists all keys owned by the logged-in user, supports copy/delete actions and is protected by the same wake-up/auth flow as the dashboard. Tax IDs are displayed consistently as `000.000/00` across the UI.

## Deployment

Suggested deployment split:

- Frontend: Vercel
- Backend Fastify API: Render
- Postgres: Neon or Supabase
- Redis coordination/locks, if added to the API: Upstash

Configure `NEXT_PUBLIC_API_URL` in Vercel to the deployed Fastify API URL.

## What This Demonstrates

- Production-style API consumption with a centralized client
- Bearer token auth flow
- Protected dashboard with cache invalidation
- Backend wake-up UX for free hosting
- Ledger transaction metrics and history
- Payment-key list with delete action
- Payment-key resolution before transfer
- Authenticated PDF receipt download for debit transfers
- Mobile-first dark/neon product UI
