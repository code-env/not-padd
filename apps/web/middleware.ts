import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = new Set(["/auth/login", "/login"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.has(pathname);

  try {
    const sessionCookie = getSessionCookie(request.headers, {});

    if (isPublic && sessionCookie && pathname !== "/") {
      return NextResponse.redirect(new URL("/app", request.url));
    }

    if (!isPublic && !sessionCookie) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
