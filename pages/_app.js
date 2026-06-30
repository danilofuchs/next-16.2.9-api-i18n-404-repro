import { api } from "../utils/api";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// Wrap the app with tRPC's withTRPC HOC, exactly like the reproducing apps.
export default api.withTRPC(MyApp);
