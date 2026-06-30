export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 40, lineHeight: 1.6 }}>
      <h1>next 16.2.9 — dynamic API route 404 on Vercel</h1>
      <p>
        Minimal reproduction of{" "}
        <a href="https://github.com/vercel/next.js/issues/92114">
          vercel/next.js#92114
        </a>
        . Both endpoints return 200 with <code>next build &amp;&amp; next start</code> locally.
        On Vercel, the dynamic one 404s while the static one keeps working.
      </p>
      <ul>
        <li>
          <a href="/api/trpc/hello"><code>/api/trpc/hello</code></a> — dynamic{" "}
          <code>[trpc]</code> route → <strong>404 on Vercel</strong> ❌
        </li>
        <li>
          <a href="/api/hello"><code>/api/hello</code></a> — static route →{" "}
          <strong>200 on Vercel</strong> ✅
        </li>
      </ul>
    </main>
  );
}
