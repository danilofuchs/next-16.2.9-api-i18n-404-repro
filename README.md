# next 16.2.x — Pages Router dynamic API routes 404 on Vercel (i18n + proxy + tRPC)

Faithful minimal match of the setup reported in
**[vercel/next.js#92114](https://github.com/vercel/next.js/issues/92114)**: a Pages Router app
with i18n (non-default-prefixed default locale), a `proxy` whose matcher runs on `/api`, and a
tRPC API route. In the affected environments the dynamic API route (`/api/trpc/*`) is normalized
to the default-locale prefix (`/pt-BR/...`) and returns **404** on Vercel, while working locally.

## ⚠️ Reproduction status (important)

- **Locally (`next build && next start`): always works** — `/api/trpc/hello` → `200` JSON.
- **On Vercel Hobby (this project's deploys): also works** — `/api/trpc/hello` → `200`,
  `x-matched-path: /api/trpc/[trpc]`. I could **not** reproduce the 404 here even after matching
  the reporting app's full stack (see below).
- **The 404 reproduces in the original reporter's environment and in a separate production app
  running this exact configuration on a Vercel _Pro_ team.** Current evidence points to the
  trigger living in Vercel's build/routing infrastructure (tier/builder-version dependent),
  not in the Next.js app config alone.

So this repo is a faithful **configuration** reproduction; whether the 404 manifests appears to
depend on the Vercel build environment.

## Ingredients (all present here)

1. Pages Router i18n, non-default-prefixed default locale — `next.config.mjs`:
   `i18n: { locales: ["en", "pt-BR"], defaultLocale: "pt-BR" }`
2. A Next.js 16 `proxy` (renamed middleware) whose matcher runs on `/api` — `proxy.js`
   (broad negative-lookahead matcher + `"/(api|trpc)(.*)"`), using `@vercel/functions`
   `geolocation()` like the reporting apps.
3. A real tRPC router via `createNextApiHandler` at `pages/api/trpc/[trpc].js`, plus the tRPC
   client integration (`api.withTRPC` in `pages/_app.js`).
4. `typedRoutes: true`, `@sentry/nextjs` (`withSentryConfig`), and `redirects()` — all matching
   the reporting apps.

A **static** API route (`pages/api/hello.js`) is included for contrast.

## Versions

- `next` 16.2.9 (latest stable), `react`/`react-dom` 19.2.4, `@trpc/*` 11, `@sentry/nextjs` 10.

## Verify

```bash
pnpm install && pnpm build && pnpm start
curl -i http://localhost:3000/api/trpc/hello   # 200 JSON locally

# On a deployment, check which route handled the request:
curl -sS -D - -o /dev/null "https://<deployment>/api/trpc/hello" | grep -iE 'HTTP/|x-matched-path|content-type'
# Working : x-matched-path: /api/trpc/[trpc] , application/json , 200
# Bug     : x-matched-path: /pt-BR/404       , text/html        , 404
```

Suspected cause: the security patch **GHSA-36qx-fr4f-26g5** (16.2.5+) prepends the default
locale to locale-less paths; in affected build environments this is applied to dynamic `/api/*`
routes, rewriting `/api/trpc/x` → `/pt-BR/api/trpc/x`, which misses the API function.
