# 🛒 বাজার দর (BazarDor)

**প্রয়োজনীয় পণ্যের দাম এক নজরে।** BazarDor is a Bangladeshi daily-essentials price tracker: prices for rice, lentils, oil, vegetables, fish, meat, eggs and spices, with daily price movement, category filtering and per-market price comparison.

- **Live site:** _add your deployed URL here_
- **Repository:** _add your GitHub URL here_

## ✨ Key features
1. **Price ticker + Bangla date** – an infinite marquee of today's prices with ▲/▼ change, under a responsive navbar with a highlighted active category.
2. **Risers & fallers** – the home page shows the top 6 price increases and decreases, plus an all-products grid (the hero CTA scrolls to `#সব-পণ্য`).
3. **Category pages with numeric sorting** – default / low→high / high→low, sorted on real numbers (never Bengali strings), with skeleton loading and a friendly empty/404 state.
4. **Protected product details** – min / max / average price and a per-bazaar price table, behind login (checked in `proxy.ts` *and* on the server).
5. **BetterAuth authentication** – email/password plus Google and GitHub, toasts for every outcome, profile page and name-update flow.

## 🧰 Tech stack
Next.js (App Router, TypeScript) · Tailwind CSS v4 · BetterAuth · MongoDB · react-hot-toast · Hind Siliguri (Bengali) font

## 🚀 Run locally
```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

### Environment variables
| Variable | Purpose |
|---|---|
| `BETTER_AUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Site URL (`http://localhost:3000` locally, your domain in production) |
| `MONGODB_URI`, `MONGODB_DB` | MongoDB connection (Atlas free tier is fine) |
| `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET` | OAuth apps. Callback: `{BETTER_AUTH_URL}/api/auth/callback/google` or `/github` |
| `BAZARDOR_API_URL`, `BAZARDOR_API_URL_FALLBACK` | Optional API overrides |

Never commit `.env.local`.

## 🌐 API
Primary `https://api.api-store.workers.dev/api/bazardor`, fallback `https://api.abcz.workers.dev/api/bazardor` (tried automatically). Endpoints: `/products`, `/products?category=`, `/products/:id`, `/categories`, `/categories/:slug`. All access goes through `src/lib/api.ts`; `src/lib/normalize.ts` turns raw JSON into typed `Product` / `Category` objects.

## 🗂 Structure
```
src/app          routes: /, /category/[slug], /product/[slug], /signin, /signup, /profile(/update), not-found
src/components   Navbar, Ticker, Hero, ProductCard/Grid/Section, CategoryView, AuthForm, skeletons…
src/lib          api, normalize, bn (Bengali numerals), auth, auth-client, session
src/proxy.ts     optimistic redirect for protected routes
```

## ☁️ Deployment (Vercel)
1. Push to GitHub and import the repo in Vercel.
2. Add all environment variables; set `BETTER_AUTH_URL` to the production URL.
3. Add the production callback URLs to your Google and GitHub OAuth apps.
4. After deploy, hard-reload `/product/<slug>`, `/category/<slug>`, `/profile` and check the console.
