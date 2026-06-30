/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // typedRoutes changes how routes are registered/validated — present in the
  // apps that reproduce the bug.
  typedRoutes: true,
  // Pages Router i18n with a NON-English default locale. One of the ingredients.
  i18n: {
    locales: ["en", "pt-BR"],
    defaultLocale: "pt-BR",
  },
};

export default nextConfig;
