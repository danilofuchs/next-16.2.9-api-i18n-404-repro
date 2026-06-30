// Dynamic (catch-all-style) Pages Router API route — same shape as a tRPC handler
// (pages/api/trpc/[trpc].ts). This is the route that 404s on Vercel under next
// 16.2.x: the request is normalized to /pt-BR/api/trpc/... and never reaches here.
export default function handler(req, res) {
  res.status(200).json({ ok: true, route: "dynamic /api/trpc/[trpc]", trpc: req.query.trpc });
}
