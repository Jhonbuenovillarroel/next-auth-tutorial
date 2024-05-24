import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;

  const session = await auth();

  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!session && pathname === "/protected") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});
