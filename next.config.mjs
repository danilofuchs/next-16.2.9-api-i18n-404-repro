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
};

// withSentryConfig's build-time config transformation is the missing ingredient
// that triggers the dynamic-/api 404 on Vercel. No DSN / instrumentation files are
// needed — wrapping the config is enough (this mirrors the reporter's repro).
const sentryBuildOptions = { silent: true };

export default withSentryConfig(config, sentryBuildOptions);
