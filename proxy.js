import { NextResponse } from "next/server";

// Next.js 16 "proxy" (the renamed middleware). A no-op pass-through is enough —
// the bug is triggered simply by the matcher running on /api routes while i18n
// has a non-default-prefixed default locale.
export default function proxy() {
  return NextResponse.next();
}

export const config = {
  // The critical ingredient: the matcher runs the proxy on /api (and /trpc) routes.
  matcher: ["/(api|trpc)(.*)"],
};
