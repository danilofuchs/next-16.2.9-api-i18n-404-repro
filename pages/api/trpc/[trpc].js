// Dynamic (catch-all-style) Pages Router API route — same shape as a tRPC handler
// (pages/api/trpc/[trpc].ts), including the route-level `config` export the reporter uses.
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4.5mb",
    },
  },
};

export default function handler(req, res) {
  res.status(200).json({ ok: true, route: "dynamic /api/trpc/[trpc]", trpc: req.query.trpc });
}
