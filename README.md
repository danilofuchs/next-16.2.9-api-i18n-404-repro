# next 16.2.x — Pages Router API routes 404 on Vercel with i18n + proxy matcher

Minimal reproduction of **[vercel/next.js#92114](https://github.com/vercel/next.js/issues/92114)**.

A Pages Router API route works locally with `next build && next start` but returns **404 on
Vercel deployments**. The request is internally normalized to the default-locale prefix
(`/pt-BR/api/hello`) and never reaches the API handler.

## The three ingredients

1. **Pages Router i18n with a non-default-prefixed default locale** — `next.config.mjs`:
   ```js
   i18n: { locales: ["en", "pt-BR"], defaultLocale: "pt-BR" }
   ```
2. **A Next.js 16 `proxy` (renamed middleware) whose matcher runs on API routes** — `proxy.js`:
   ```js
   export const config = { matcher: ["/(api|trpc)(.*)"] };
   ```
   (A no-op pass-through proxy is enough — it does not need to do anything.)
3. **A Pages Router API route** — `pages/api/hello.js`.

Suspected cause: the security patch **GHSA-36qx-fr4f-26g5** (shipped in 16.2.5+) prepends the
default locale to locale-less paths to close a middleware-bypass hole; on Vercel's build output
this normalization is incorrectly applied to `/api/*`.

## Versions

- `next` 16.2.9 (latest stable; bug present across the whole 16.2.x line, first reported on 16.2.1)
- `react` / `react-dom` 19.2.4

## Reproduce locally (WORKS ✅)

```bash
pnpm install
pnpm build
pnpm start
curl -i http://localhost:3000/api/hello
# → HTTP/1.1 200 OK, content-type: application/json
# → {"ok":true,"message":"API route reached"}
```

## Reproduce on Vercel (BROKEN ❌)

Deploy this repo to Vercel, then:

```bash
curl -sS -D - -o /dev/null "https://<your-deployment>.vercel.app/api/hello" \
  | grep -iE 'HTTP/|x-matched-path|content-type'
# → HTTP/2 404
# → x-matched-path: /pt-BR/404      (locale prefix applied to the API path)
# → content-type: text/html
```

The `x-matched-path: /pt-BR/404` header is the tell: the API request was matched against the
localized 404 page instead of the API function.

## Expected

`/api/hello` should return `200` JSON on Vercel, identically to `next start`, with
`x-matched-path: /api/hello`.
