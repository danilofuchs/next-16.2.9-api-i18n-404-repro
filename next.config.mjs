/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pages Router i18n with a NON-English default locale.
  // This is one of the three ingredients of the bug.
  i18n: {
    locales: ["en", "pt-BR"],
    defaultLocale: "pt-BR",
  },
};

export default nextConfig;
