# Transactional Wallet Ledger Frontend

Next.js portfolio client for the Fastify Transactional Wallet Ledger API. The UI is designed as a production-style fintech demo for recruiters: landing page, auth, protected dashboard, payment-key resolution and a two-step transfer modal.

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
- `POST /payment-keys`
- `GET /payment-keys/:key`
- `DELETE /payment-keys/:key`
- `POST /payments`

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
- Payment-key resolution before transfer
- Mobile-first dark/neon product UI
