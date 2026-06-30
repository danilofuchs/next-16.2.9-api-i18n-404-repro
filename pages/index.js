export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 40, lineHeight: 1.5 }}>
      <h1>next 16.2.9 — API route 404 on Vercel</h1>
      <p>
        Minimal reproduction of{" "}
        <a href="https://github.com/vercel/next.js/issues/92114">
          vercel/next.js#92114
        </a>
        .
      </p>
      <p>
        Call <a href="/api/hello"><code>/api/hello</code></a>. It returns JSON
        with <code>next build &amp;&amp; next start</code> locally, but 404s on
        Vercel deployments.
      </p>
    </main>
  );
}
