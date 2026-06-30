import { geolocation } from "@vercel/functions";
import { NextResponse } from "next/server";

// Mirrors the proxy of both apps that reproduce the bug: it reads @vercel/functions
// geolocation and forwards the request with a modified header.
export default function proxy(req) {
  const requestHeaders = new Headers(req.headers);
  const { country } = geolocation(req);
  if (process.env.NODE_ENV === "production" && country) {
    requestHeaders.set("x-geo-country", country);
  }
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/",
  ],
};
