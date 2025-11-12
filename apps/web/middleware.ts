import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = ["/", "/auth", "/auth/login", "/login"];
const isProduction = process.env.NODE_ENV === "development";

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  if (isProduction && pathName !== "/waitlist")
    return NextResponse.redirect(new URL("/waitlist", request.url));

  if (isProduction) return NextResponse.next();

  const session = getSessionCookie(request.headers, {});

  if (!session) {
    if (publicRoutes.includes(pathName)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
