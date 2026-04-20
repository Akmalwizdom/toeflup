import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/practice/:path*",
    "/vocabulary/:path*",
    "/simulation/:path*",
    "/analytics/:path*",
    "/study-plan/:path*",
    "/api/questions/:path*",
  ],
};
