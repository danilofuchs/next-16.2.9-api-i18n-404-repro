/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  // Pages Router i18n with a NON-English default locale.
  i18n: {
    locales: ["en", "pt-BR"],
    defaultLocale: "pt-BR",
  },
  // The presence of rewrites() appears to be the trigger: the 16.2.x locale
  // normalization mis-handles dynamic /api routes when rewrites exist (cf. the
  // 16.2.x release note "catch-all router.query corruption with basePath + rewrites").
  // A single unrelated rewrite is enough.
  async rewrites() {
    return [{ source: "/healthz", destination: "/api/hello" }];
  },
};

export default nextConfig;
