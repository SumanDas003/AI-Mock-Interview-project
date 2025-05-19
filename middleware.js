import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)']);
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
    if (isPublicRoute(req)) {
        return; // Allow public routes without authentication
    }

    if (isProtectedRoute(req)) {
        await auth.protect(); // Ensure authentication for protected routes
    }
});

export const config = {
  matcher: [
    '/((?!_next|.*\\.(?:css|js|jpg|png|gif|svg|ico|woff|woff2|ttf|eot|json)).*)', // Avoid static files
    '/(api|trpc)(.*)', // Always run for API routes
  ],
};
