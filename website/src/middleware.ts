import { type NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // For CSR, we only handle static file exclusions and basic routing
  // Authentication and locale handling will be done client-side
  
  // Exclude specific file types and paths
  if (
    path === "/manifest.json" ||
    /\.(png|jpg|jpeg|svg|gif|webp|ico|js|css)$/.test(path) ||
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // For static export, all routes should be handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
