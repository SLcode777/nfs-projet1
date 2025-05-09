import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const betterToken = req.cookies.get("better-auth.session_token")?.value;

  //   if (!token || !betterToken)

  //   if (req.nextUrl.pathname.startsWith("/posts") && !betterToken) {
  //     return NextResponse.redirect(new URL("/auth/signin", req.url));
  //   }

  //   if (req.nextUrl.pathname.startsWith("/auth/signin") && betterToken) {
  //     return NextResponse.redirect(new URL("/posts", req.url));
  //   }

  if (req.nextUrl.pathname.startsWith("/posts") && (!token && !betterToken)) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (
    req.nextUrl.pathname.startsWith("/auth/signin") &&
    (token || betterToken)
  ) {
    return NextResponse.redirect(new URL("/posts", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/:path*", "/auth/signin"],
};
