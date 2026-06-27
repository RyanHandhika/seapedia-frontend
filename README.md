# SEAPEDIA — Frontend

A mobile-first, PWA-ready marketplace frontend for the SEAPEDIA multi-role platform
(Buyer · Seller · Driver · Admin), built with **React + TypeScript + Vite**, wired to
the provided Express + Prisma backend.

---

## Stack

- **React 18** + **TypeScript** + **Vite 6**
- **TanStack Query** (server state, caching, mutations)
- **Zustand** (auth session, cart mirror, toasts)
- **React Router 6** (role-scoped route trees + guards)
- **Tailwind CSS** (custom marine design tokens)
- **Axios** (API client with transparent JWT refresh)
- **vite-plugin-pwa** (installable, offline catalog cache)

---

## Prerequisites

1. **The SEAPEDIA backend must be running.** By default this app proxies API calls to
   `http://localhost:4000`. Start the backend first (set up its `.env`, run
   `prisma migrate` + `prisma seed`, then `npm run dev`).
2. **Node 18+** and **npm**.

---

## Setup & run

```bash
# 1. Install dependencies
npm install

# 2. (optional) point the dev proxy at a non-default backend URL
cp .env.example .env
#   then edit VITE_API_TARGET if your backend isn't on http://localhost:4000

# 3. Start the dev server
npm run dev
#   → opens on http://localhost:5173

# 4. Production build / preview
npm run build
npm run preview
```

The Vite dev server proxies all `/api/*` requests to the backend, so there are no CORS
issues in development. The app itself only ever calls relative `/api/...` paths.

---

## Demo accounts

All seeded accounts use the password **`Password123!`**.

| Username      | Roles            | Notes                                   |
| ------------- | ---------------- | --------------------------------------- |
| `admin`       | ADMIN            | Logs in directly to the admin console   |
| `buyer_demo`  | BUYER            | Rp 1,000,000 wallet, 1 saved address    |
| `seller_demo` | BUYER + SELLER   | Prompts role selection; has a demo store |
| `driver_demo` | BUYER + DRIVER   | Prompts role selection                  |

**Discount codes:** `SAVE10` (10% voucher) · `FLAT25K` (Rp 25k voucher) · `PROMO15` (15% promo)

> Multi-role accounts (`seller_demo`, `driver_demo`) trigger the **role-selection
> handshake**: after login you choose an active role before a session is issued. You can
> switch roles anytime from the dashboard top bar.

---

## Architecture

```
src/
  api/          One typed module per domain (auth, catalog, buyer, seller, driver, admin)
                + client.ts: axios instance, envelope unwrapping, transparent 401→refresh
  stores/       Zustand: authStore (session + role flow), cartStore, toastStore
  lib/          utils (IDR formatting, status maps, JWT decode), queryClient + query keys
  components/
    ui/         10-piece component library (Button, Card, Table, Modal, Timeline, …)
    layout/     PublicLayout, AuthLayout, DashboardLayout (sidebar + role switcher)
  features/
    auth/       Login, Register, RoleSelection
    catalog/    Landing, ProductList, ProductDetail (shared guest + buyer)
    buyer/      Dashboard, Cart, Checkout, Orders, OrderDetail, Wallet, Addresses, Profile
    seller/     Dashboard, Products (CRUD + image upload), Orders, Store, Analytics
    driver/     Dashboard (active trip), Available Jobs, History, Earnings
    admin/      Dashboard, Users, Stores, Orders, Delivery Jobs, Vouchers, Promos, System
  routes/       guards (RequireAuth / RequireRole) + central router
```

### How the auth flow maps to the backend

- **Login** → `POST /auth/login`. Single-role and admin users get tokens immediately.
  Multi-role users get a `rolePendingToken` and are routed to **Role Selection**.
- **Role selection** → `POST /auth/select-role` (sends the pending token as Bearer),
  which returns the real access + refresh tokens.
- **Role switch** (mid-session) → `POST /auth/switch-role`, returns a new access token.
- **Token refresh** → on any `401`, the axios client calls `POST /auth/refresh` once,
  replays the original request, and de-dupes concurrent refreshes. On refresh failure it
  clears tokens and drops the user to logged-out state.

### Domain details honored

- **Money**: backend sends `Decimal(12,2)` as strings; the UI parses + formats as IDR.
- **Order statuses**: `SEDANG_DIKEMAS → MENUNGGU_PENGIRIM → SEDANG_DIKIRIM → PESANAN_SELESAI`
  (with `DIKEMBALIKAN`), rendered as a tracking timeline.
- **Pricing**: 12% PPN applied after discount + delivery; delivery fees Instant/Next-day/
  Regular = 50k/25k/15k. Totals are always confirmed against the backend's
  `/checkout/preview` before placing an order.
- **Single-store cart**: enforced by the backend; the UI surfaces the conflict message.
- **Driver job board**: take one job at a time; completing pays out 80% of the delivery fee.
- **Admin time simulation**: advance/reset the simulated clock to demo overdue orders.

---

## Notes

- **PWA**: the app is installable; the product catalog uses a stale-while-revalidate cache.
  API routes are excluded from the service-worker navigation fallback.
- **No backend secrets** live in this project. It only talks to the backend over `/api`.
- If you change the backend port, update `VITE_API_TARGET` in `.env`.
