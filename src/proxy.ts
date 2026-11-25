import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic auth check: send signed-out visitors to /login before rendering
 * a private page. This only checks that a session cookie EXISTS — real
 * authorisation happens in lib/auth/session.ts (and, later, in the backend API
 * on every request).
 */
const SESSION_COOKIE = "p1_mock_session"; // keep in sync with lib/auth/session.ts

export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?next=${encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/seller/:path*", "/admin/:path*"],
};
