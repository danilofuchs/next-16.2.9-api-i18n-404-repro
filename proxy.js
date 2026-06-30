import { NextResponse } from "next/server";

// Next.js 16 "proxy" (the renamed middleware). It just forwards the request with
// a modified header — it doesn't need to do anything meaningful. The bug is
// triggered by the matcher (below) running on /api routes while i18n has a
// non-default-prefixed default locale.
export default function proxy(req) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-repro", "1");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // Broad matcher: skip Next.js internals and static files. NOTE: this also
    // matches /api/* (the negative lookahead only excludes _next and static file
    // extensions) — and that is the critical ingredient of the bug.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for the root
    "/",
  ],
};
