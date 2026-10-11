# 🛒 বাজার দর (BazarDor)

**প্রয়োজনীয় পণ্যের দাম এক নজরে।** BazarDor is a Bangladeshi daily-essentials price tracker: today's prices for rice, lentils, oil, vegetables, fish, meat, eggs and spices, with daily price movement, category filtering and per-bazar price comparison.

- **Live Link:** _add your deployed URL here after deploying_
- **GitHub Repository:** _add your GitHub repository URL here_

## ✨ Key features
1. **Price ticker + Bangla date** – an infinite, smooth marquee of today's prices (emoji, name, Bengali-formatted price/unit and a ▲/▼ % badge) under a responsive navbar with a highlighted active category.
2. **Risers & fallers** – the home page shows the top 6 genuine price increases and decreases (from the API's change data or real current vs. previous prices — never invented), plus an all-products grid. The hero CTA scrolls to `#সব-পণ্য` on the same page.
3. **Category pages with numeric sorting** – `ডিফল্ট` / `দাম: কম থেকে বেশি` / `দাম: বেশি থেকে কম`, sorted on real numbers (Bengali numerals are parsed, never string-sorted), with skeleton loading, retry on errors and a friendly empty/404 state.
4. **Protected product details** – `/product/[slug]` shows min / max / average price and a per-bazar price table, behind login (checked in `proxy.ts` *and* on the server).
5. **BetterAuth authentication** – email/password plus Google and GitHub (MongoDB), toasts for every outcome, profile page and a name-update flow (`authClient.updateUser`).
6. **Responsive & accessible** – mobile / tablet / desktop layouts, Bengali typography (Hind Siliguri), keyboard-friendly menus and reduced-motion support.

## 🧰 Technologies
Next.js 16 (App Router, TypeScript) · React 19 · Tailwind CSS v4 · BetterAuth · MongoDB · react-hot-toast · Hind Siliguri (Bengali) font · Vercel

## 🚀 Setup & run
```bash
npm ci
cp .env.example .env.local   # fill in at least BETTER_AUTH_SECRET and MONGODB_URI
npm run dev                  # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates route types, then `tsc --noEmit` |

### Environment variables (see `.env.example`)
| Variable | Required | Purpose |
|---|---|---|
| `BETTER_AUTH_SECRET` | **Yes** | Random secret (`openssl rand -base64 32`) |
| `MONGODB_URI` | **Yes** | MongoDB connection string (Atlas free tier is fine) |
| `BETTER_AUTH_URL` | Recommended | Site URL: `http://localhost:3000` locally, your Vercel URL in production (no trailing slash) |
| `MONGODB_DB` | No | Database name (default `bazardor`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | For Google login | OAuth app credentials |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | For GitHub login | OAuth app credentials |
| `BAZARDOR_API_URL`, `BAZARDOR_API_URL_FALLBACK` | No | API base-URL overrides |

If a required variable is missing, auth endpoints answer with a clear `503` message and protected pages send you to sign-in; a social button without credentials is shown disabled. Put real values ONLY in `.env.local` (git-ignored) and in Vercel's environment settings — never in `.env.example`, which is committed.

## 🌐 API
Primary `https://api.api-store.workers.dev/api/bazardor`, fallback `https://api.abcz.workers.dev/api/bazardor` (tried automatically on network errors / non-OK responses). Endpoints: `/products`, `/products?category=`, `/products/:id`, `/categories`, `/categories/:slug`. All access goes through `src/lib/api.ts`; `src/lib/normalize.ts` turns raw JSON into typed `Product` / `Category` objects. 
Real response shape (verified): each product has `id, slug, nameBn, category, categoryNameBn, categoryIcon, unit ("kg"|"litre"|"dozen"|"piece"), image (emoji), today, yesterday, lastWeek, lastMonth, change { dir, pct }, markets [{ market, division, min, max }]`.

- **Price change %** = the API's `change.pct` (signed; `dir` = up/down/flat). If it were missing it is calculated as `((today − yesterday) / yesterday) × 100`; if neither exists the badge shows "no data" — it is never turned into `0%`, `NaN` or `Infinity`. Shown as `▲ +২.১০%`, `▼ -২.৯০%`, `— ০.০০%`.
- **Product page** min / max / average are calculated from the per-bazar ranges: min = lowest bazar minimum, max = highest bazar maximum, average = mean of each bazar's (min + max) / 2.
- The API has no free-text description field, so the summary line under the title is built from the real `yesterday / lastWeek / lastMonth` prices.

## 🗂 Structure
```
src/app          routes: /, /category/[slug], /product/[slug], /signin, /signup, /profile(/update), not-found
src/components   Navbar, UserMenu, Ticker, Hero, ProductCard/Grid/Section, CategoryView, AuthForm, skeletons…
src/lib          api, normalize, bn (Bengali numerals), date, env, auth, auth-client, session
src/proxy.ts     optimistic redirect for protected routes
```

## ☁️ Deployment (Vercel)
1. Push to GitHub and import the repo in Vercel (framework preset: Next.js, no custom rewrites needed — dynamic `[slug]` routes work on refresh).
2. Add the environment variables above. Set `BETTER_AUTH_URL` to the production URL (e.g. `https://your-app.vercel.app`).
3. MongoDB Atlas → Network Access: allow Vercel (e.g. `0.0.0.0/0` for the assignment).
4. Google Cloud Console → Credentials → your OAuth client: add *Authorized JavaScript origin* `https://your-app.vercel.app` and *Authorized redirect URI* `https://your-app.vercel.app/api/auth/callback/google` (keep the `http://localhost:3000` ones for local work). While the consent screen is in **Testing**, only the Gmail addresses listed under *Audience → Test users* can sign in.
   GitHub → Settings → Developer settings → OAuth Apps: homepage `https://your-app.vercel.app`, callback `https://your-app.vercel.app/api/auth/callback/github` (a GitHub OAuth app accepts one callback URL, so create a second app for localhost).
5. Redeploy, then hard-reload `/product/<slug>`, `/category/<slug>`, `/profile` and check the browser console.
