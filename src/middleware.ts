import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/shop(.*)",
  "/about",
  "/history",
  "/blog(.*)",
  "/contact",
  "/faq",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/privacy-policy",
  "/terms",
  "/refund-policy",
  "/shipping-policy",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isProtectedRoute = createRouteMatcher([
  "/profile(.*)",
  "/checkout",
  "/wishlist",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  if ((isProtectedRoute(req) || isAdminRoute(req)) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    const returnTo = `${req.nextUrl.pathname}${req.nextUrl.search}`;
    signInUrl.searchParams.set("redirect_url", returnTo);
    return NextResponse.redirect(signInUrl);
  }

  if (isAdminRoute(req)) {
    const role = (sessionClaims?.publicMetadata as { role?: string } | undefined)?.role;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
