# 🛒 বাজার দর (BazarDor)

> **প্রয়োজনীয় পণ্যের দাম এক নজরে।**
> A Bangla-first web app to explore essential grocery prices, compare them market by market, and spot what got cheaper or costlier today.

Assignment: **B14-A7 — Bazar Dor** · Design: Figma / Penpot "Bazardor – Assignment-07" · Built with Next.js App Router.

## ✨ Features

1. **Live price board** — hero, "আজ দাম বেড়েছে ▲" / "আজ দাম কমেছে ▼" (top 6 each) and a responsive grid of all products, with Bengali digits and green/red/grey change badges.
2. **Infinite price ticker** — emoji + name + price/unit + ▲/▼ %, pauses on hover, respects `prefers-reduced-motion`.
3. **Category pages** (`/category/[slug]`) — title + icon, numeric price sorting (ডিফল্ট / কম→বেশি / বেশি→কম), skeleton loading, empty state and a friendly 404 for invalid slugs.
4. **Protected product details** (`/product/[slug]`) — min / max / average price and a market-by-market table, calculated only from real market records.
5. **Authentication** — Better Auth + MongoDB Atlas: email/password sign-up & sign-in, optional Google / GitHub login, toasts for every outcome, server-side session checks.
6. **Profile & update** — `/profile` and `/profile/update` (name update via Better Auth `updateUser`).
7. **Responsive & accessible** — mobile menu, 3-column desktop grid collapsing to 1, keyboard focus styles, semantic HTML.
8. **Resilient** — API failover + validation, custom 404, error boundary, loading skeletons, graceful database errors.

## 🧰 Tech stack

| Purpose | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) · React 19 · TypeScript |
| Styling | Tailwind CSS v4 + DaisyUI 5 (custom `bazardor` theme from the Figma tokens) |
| Font | Hind Siliguri (`next/font`) |
| Auth | Better Auth (email/password + Google + GitHub) |
| Database | MongoDB Atlas (official `mongodb` driver) |
| Toasts | react-hot-toast |
| Deployment | Vercel |

## 🗂️ Project structure

```
src/
├── app/
│   ├── page.tsx, loading.tsx            Home (hero, movers, all products)
│   ├── category/[slug]/                 Category page + skeleton
│   ├── product/[slug]/                  Protected product details + skeleton
│   ├── signin/  signup/                 Auth pages
│   ├── profile/  profile/update/        Protected profile pages
│   ├── api/auth/[...all]/route.ts       Better Auth handler
│   ├── not-found.tsx  error.tsx         404 + error boundary
│   └── layout.tsx  globals.css          Root layout, theme tokens, ticker CSS
├── components/                          Navbar (with user menu), PriceTicker, ProductCard, forms …
├── lib/
│   ├── api.ts                           API client: failover, validation, caching
│   ├── format.ts                        Bengali digits, BDT prices, units, Bangla date
│   ├── products.ts                      sorting, movers, market statistics
│   ├── auth.ts  auth-client.ts          Better Auth server / client
│   └── session.ts                       Server-side session guard
├── proxy.ts                             Optimistic redirect for /product/* and /profile/*
└── types/index.ts
```

## 🚀 Getting started

Requirements: **Node.js ≥ 20.9** and a **MongoDB Atlas** cluster.

```bash
npm install
cp .env.example .env.local      # then fill in the real values
npm run dev                     # http://localhost:3000
```

Other commands: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

### Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `MONGODB_URI` | ✅ | Atlas connection string (Atlas → Connect → Drivers). Include the database name in the path. |
| `BETTER_AUTH_SECRET` | ✅ | Long random string, e.g. `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | ✅ | Public origin, no trailing slash. Local: `http://localhost:3000`; production: your Vercel URL. |
| `NEXT_PUBLIC_APP_URL` | ✅ | Same origin; used for metadata and trusted origins. |
| `MONGODB_DB` | optional | Overrides the database name from the URI. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | optional | Google button appears only when both are set. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | optional | GitHub button appears only when both are set. |
| `BAZARDOR_API_BASES` | optional | Comma-separated API bases (defaults below). |

Never commit `.env*` files (they are git-ignored). `.env.example` contains placeholders only.

### MongoDB Atlas setup

1. Create a cluster → **Database Access**: create a dedicated user with read/write on the app database only, with a strong password.
2. **Network Access**: add your own IP for local development.
3. For Vercel, prefer the **Vercel ⇄ MongoDB Atlas integration** (or Atlas private networking / Vercel Static IPs) so you can keep a tight allow-list. Vercel functions use dynamic IPs; `0.0.0.0/0` is a last resort for coursework only — if you use it, keep the dedicated low-privilege user and remove the rule after grading.
4. Copy the connection string into `MONGODB_URI`. Better Auth creates its collections (`user`, `session`, `account`, `verification`) automatically.

### Google & GitHub login (optional)

- **Google** — Google Cloud Console → APIs & Services → Credentials → OAuth client ID (Web). Authorised redirect URI: `<origin>/api/auth/callback/google`.
- **GitHub** — GitHub → Settings → Developer settings → OAuth Apps. Authorization callback URL: `<origin>/api/auth/callback/github`.

Add one redirect URI per origin (`http://localhost:3000` and your Vercel URL). Set the matching env variables, redeploy, then test the buttons. Social login is not claimed to work until you have configured credentials and tried it.

## 🔌 API resources

Endpoints (relative to a base): `/products`, `/products?category=chal`, `/products/1`, `/categories`, `/categories/chal`.

Bases, tried in this order (a base is accepted only if its response validates):

1. `https://openapi.programming-hero.com/api/bazardor`
2. `https://api.api-store.workers.dev/api/bazardor`
3. `https://api.abcz.workers.dev/api/bazardor`

Expected product fields (from the assignment guide): `id, slug, nameBn, category, categoryNameBn, categoryIcon, unit, image, today, yesterday, lastWeek, lastMonth, change{dir,pct}, markets[{market,division,min,max}]`. Categories: `id, slug, nameBn, icon`.

## ☁️ Deploying to Vercel

1. Push the repo to GitHub.
2. Vercel → **Add New Project** → import the repo (framework preset: Next.js).
3. Add the environment variables above. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production URL.
4. Deploy, then update the OAuth redirect URIs with the production URL.
5. Check: `/category/chal`, `/category/invalid` (404), `/product/<slug>` while logged out (redirects to sign in) and after refresh.

Dynamic routes are rendered on the server, so refreshing `/category/[slug]` or `/product/[slug]` works without extra rewrites.

## ⚠️ Known limitations

- Price changes ("বেড়েছে / কমেছে") use the API's `change` field; when it is missing they are derived from the real `yesterday` price. When neither exists, no badge is shown — nothing is invented.
- Min / max / average on the details page are computed only from valid market rows; without market data the page says so.
- `/product/[slug]` resolves the slug against the product list; a numeric id is only used as a lookup fallback.
- Email verification and password reset are intentionally not implemented (assignment note).

## 🔗 Submission links

- Live site: https://bazardor999.vercel.app/
- GitHub repository: https://github.com/codewithsiyam/bazardor

---

© বাজার দর — সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
