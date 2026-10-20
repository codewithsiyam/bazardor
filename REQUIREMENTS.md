# Requirement → implementation map

Status legend: ✅ implemented · 🧪 logic tested with Node + mock API · ⏳ NOT VERIFIED (needs `npm install`, network, MongoDB credentials or a deployment).

| # | Requirement (assignment) | Implemented in | Status |
|---|---|---|---|
| 1 | Navbar: logo `🛒 বাজার দর` + Bangla date | `components/Navbar.tsx`, `BanglaDate.tsx`, `lib/format.ts#getBanglaDate` | ✅ 🧪 date · ⏳ visual |
| 2 | Category links, active highlighted | `Navbar.tsx` (`aria-current`, filled chip) | ✅ ⏳ |
| 3 | Auth buttons / profile + sign-out | `Navbar.tsx` (UserMenu), `SignOutButton.tsx` | ✅ ⏳ |
| 4 | Infinite price ticker | `PriceTicker.tsx`, `globals.css` (reduced-motion aware) | ✅ ⏳ |
| 5 | Mobile menu | `Navbar.tsx` (hamburger, `aria-expanded`) | ✅ ⏳ |
| 6 | Hero + CTA → `#সব-পণ্য` | `Hero.tsx`, section id in `app/page.tsx` | ✅ ⏳ |
| 7 | Top-6 risers / fallers | `PriceMovers.tsx`, `lib/products.ts` | ✅ 🧪 |
| 8 | All products grid + cards | `ProductGrid.tsx`, `ProductCard.tsx` | ✅ ⏳ |
| 9 | Card click → detail page | `ProductCard.tsx` (`/product/[slug]`) | ✅ ⏳ |
| 10 | Product details (protected) | `app/product/[slug]/page.tsx`, `lib/session.ts`, `proxy.ts` | ✅ ⏳ |
| 11 | Min / max / avg + market table | `lib/products.ts#computeMarketStats` | ✅ 🧪 |
| 12 | Category page + title/icon | `app/category/[slug]/page.tsx` | ✅ 🧪 data · ⏳ page |
| 13 | Sort (numeric, Bengali-safe) | `CategoryProducts.tsx`, `lib/products.ts#sortProducts` | ✅ 🧪 |
| 14 | Skeleton loading | `app/loading.tsx`, `category/[slug]/loading.tsx`, `product/[slug]/loading.tsx` | ✅ ⏳ |
| 15 | Empty state / invalid slug 404 + "হোম পেজে ফিরে যান" | category page, `not-found.tsx` | ✅ 🧪 logic · ⏳ |
| 16 | Sign Up → toast → redirect to Sign In | `SignUpForm.tsx` (`autoSignIn: false` in `lib/auth.ts`) | ✅ ⏳ needs MongoDB |
| 17 | Sign In → home, error toast | `SignInForm.tsx` | ✅ ⏳ needs MongoDB |
| 18 | Google / GitHub login | `SocialButtons.tsx`, `lib/auth.ts` | ✅ ⏳ needs OAuth credentials |
| 19 | Toasts for auth + protected redirect | `ToasterProvider.tsx`, `SignInForm.tsx` (`reason=login-required`) | ✅ ⏳ |
| 20 | Footer text | `Footer.tsx` | ✅ |
| 21 | 404 page | `app/not-found.tsx` | ✅ ⏳ |
| 22 | Reload of dynamic routes works | server-rendered `[slug]` routes, no static export | ✅ ⏳ deployed check |
| C1 | Sort dropdown | see #13 | ✅ 🧪 |
| C2 | README | `README.md` | ✅ |
| C3 | Profile → update route + form (`updateUser`) | `app/profile/*`, `ProfileUpdateForm.tsx` | ✅ ⏳ needs MongoDB |
| — | ≥ 8 meaningful Git commits | `git log` | ✅ |
