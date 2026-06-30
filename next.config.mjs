import { withSentryConfig } from "@sentry/nextjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  typedRoutes: true,
  // Pages Router i18n with a NON-English default locale.
  i18n: {
    locales: ["en", "pt-BR"],
    defaultLocale: "pt-BR",
  },
  // salvy-dashboard-style redirects, including DYNAMIC (:param) sources — these
  // exercise the same parametrized route-table machinery implicated in the
  // 16.2.x "catch-all router.query corruption with rewrites" regression.
  redirects: async () => [
    { source: "/settings", destination: "/settings/company", permanent: false },
    { source: "/saas/invoice/:id", destination: "/saas/invoice", permanent: false },
    { source: "/phone-account/new/:formId", destination: "/phone-account/new/:formId/x", permanent: false },
  ],
};

const sentryBuildOptions = { silent: true };

export default withSentryConfig(config, sentryBuildOptions);
