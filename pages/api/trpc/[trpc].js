import { initTRPC } from "@trpc/server";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import superjson from "superjson";

// A real tRPC router served via the official Next adapter (same shape as the apps
// that reproduce the bug), with the superjson transformer.
const t = initTRPC.create({ transformer: superjson });

const appRouter = t.router({
  hello: t.procedure.query(() => ({ ok: true, route: "trpc hello" })),
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4.5mb",
    },
  },
};

export default createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
