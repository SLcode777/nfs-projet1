import { NextRequest, NextResponse } from "next/server";


export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }



    return NextResponse.next();
}

export const config = {
    matcher: ["/posts/:path*"], // protège les routes /posts/*
  }