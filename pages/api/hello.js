// Plain Pages Router API route. Works locally; 404s on Vercel under next 16.2.x
// because the request gets normalized to /pt-BR/api/hello and never reaches here.
export default function handler(req, res) {
  res.status(200).json({ ok: true, message: "API route reached" });
}
