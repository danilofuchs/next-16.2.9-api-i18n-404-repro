# next 16.2.x — dynamic Pages Router API routes 404 on Vercel with i18n + proxy matcher

Minimal reproduction of **[vercel/next.js#92114](https://github.com/vercel/next.js/issues/92114)**.

A **dynamic** Pages Router API route (`pages/api/trpc/[trpc].js`) works locally with
`next build && next start` but returns **404 on Vercel deployments**. The request is internally
normalized to the default-locale prefix (`x-matched-path: /pt-BR/404`) and never reaches the API
handler.

A **static** API route (`pages/api/hello.js`) in the same app keeps working on Vercel — so the
bug is specific to **dynamic/parametrized API routes**.

## Live demo

Deployed on Vercel (next 16.2.9):

```bash
BASE=https://next-16-2-9-api-i18n-404-repro.vercel.app

# Dynamic API route — BROKEN on Vercel ❌
curl -sS -D - -o /dev/null "$BASE/api/trpc/hello" | grep -iE 'HTTP/|x-matched-path|content-type'
# → HTTP/2 404 ; x-matched-path: /pt-BR/404 ; content-type: text/html

# Static API route — works on Vercel ✅
curl -sS -D - -o /dev/null "$BASE/api/hello" | grep -iE 'HTTP/|x-matched-path|content-type'
# → HTTP/2 200 ; x-matched-path: /api/hello ; content-type: application/json
```

## The ingredients

1. **Pages Router i18n with a non-default-prefixed default locale** — `next.config.mjs`:
   ```js
   i18n: { locales: ["en", "pt-BR"], defaultLocale: "pt-BR" }
   ```
2. **A Next.js 16 `proxy` (renamed middleware) with a broad matcher that also matches `/api`** —
   `proxy.js`. The critical entry is the broad negative-lookahead matcher (it only excludes
   `_next` and static file extensions, so `/api/*` is matched as if it were a page):
   ```js
   export const config = {
     matcher: [
       "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
       "/(api|trpc)(.*)",
       "/",
     ],
   };
   ```
   (The proxy body is a no-op pass-through; only the matcher matters.)
3. **A dynamic Pages Router API route** — `pages/api/trpc/[trpc].js`.

Suspected cause: the security patch **GHSA-36qx-fr4f-26g5** (shipped in 16.2.5+) prepends the
default locale to locale-less paths to close a middleware-bypass hole; on Vercel's build output
this normalization is incorrectly applied to dynamic `/api/*` routes, rewriting
`/api/trpc/x` → `/pt-BR/api/trpc/x`, which misses the API function and falls to the localized
404 page.

## Versions

- `next` 16.2.9 (latest stable; bug present across the whole 16.2.x line, first reported on 16.2.1)
- `react` / `react-dom` 19.2.4

## Reproduce locally (everything WORKS ✅)

```bash
pnpm install
pnpm build
pnpm start
curl -i http://localhost:3000/api/trpc/hello   # → 200 application/json
curl -i http://localhost:3000/api/hello         # → 200 application/json
```

## Reproduce on Vercel (dynamic route BROKEN ❌)

Deploy this repo to Vercel and run the `curl` commands under **Live demo** above. The dynamic
route returns `404` with `x-matched-path: /pt-BR/404`; the static route still returns `200`.

## Expected

`/api/trpc/hello` should return `200` JSON on Vercel, identically to `next start`, with
`x-matched-path: /api/trpc/[trpc]`.
