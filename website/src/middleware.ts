import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { formatExternalUrl } from "@/lib/utils";

// Create the intl middleware
const intlMiddleware = createMiddleware(routing);

// Specify protected routes (including localized versions)
const protectedRoutes = [
  "/my-organizations",
  "/org-register",
  "/dashboard",
  "/team-management",
  "/org-management",
  "/job-management",
  "/event-management",
  "/admin",
];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Exclude specific file types and paths
  if (
    path === "/manifest.json" || // Ensure manifest.json is served directly
    /\.(png|jpg|jpeg|svg|gif|webp|ico)$/.test(path) || // Skip processing for other static file types
    path.startsWith("/_next") ||
    path.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Run the intl middleware
  const intlResult = intlMiddleware(req);

  // Check if the current route is protected (including localized versions)
  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      path === route ||
      RegExp(new RegExp(`^/(${routing.locales.join("|")})${route}`)).exec(path)
  );

  if (isProtectedRoute) {
    // Get the token from the cookies or headers
    const token =
      cookies().get("authToken")?.value ?? // Get token from httpOnly cookies
      req.headers.get("Authorization")?.replace("Bearer ", ""); // Get token from Authorization header

    if (!token) {
      // Store the original URL to redirect back after authentication
      const redirectUrl = req.nextUrl.pathname + req.nextUrl.search;
      const signinUrl = new URL("/signin", req.url);

      // Remove locale prefix if present and strip leading slash
      const localePattern = new RegExp(
        `^/(${routing.locales.join("|")})(/.*)$`
      );
      const localeMatch = RegExp(localePattern).exec(redirectUrl);
      let cleanRedirectUrl = localeMatch ? localeMatch[2] : redirectUrl;

      // Remove the leading slash
      cleanRedirectUrl = cleanRedirectUrl.replace(/^\//, "");

      // Add the redirect URL as a query parameter
      signinUrl.searchParams.set("redirect", cleanRedirectUrl);

      return NextResponse.redirect(signinUrl);
    }

    try {
      const apiUrl = formatExternalUrl("protected-route");
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn(`Protected route access denied: ${path}`);
        return NextResponse.redirect(new URL("/signin", req.url));
      }
    } catch (error) {
      console.error("Token validation error:", error);
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  // Return the result of the intl middleware
  return intlResult;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
