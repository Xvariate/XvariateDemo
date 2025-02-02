import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { DEFAULT_LOGIN_REDIRECT, authRoutes, publicRoutes, HOME_ROUTE, apiAuthPrefix } from "@/routes"
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

//* Define which roles can access each dashboard path
const DASHBOARD_PERMISSIONS: Record<string, UserRole[]> = {
    "/xvariate": [UserRole.XVARIATE],
    "/ambassador": [UserRole.AMBASSADOR],
    "/client": [UserRole.CLIENT],
    "/freelancer": [UserRole.FREELANCER],
};

//* Map each dashboard path to the right login URL if user is not authenticated
const PATH_TO_LOGIN_ROUTE: Record<string, string> = {
    '/ambassador': '/login/ambassador', // Ambassador dashboard maps to ambassador login
    '/client': '/login/client', // Client dashboard maps to client login
    '/freelancer': '/login/freelancer', // Freelancer dashboard maps to freelancer login
    '/xvariate': '/login/xvariate' // Xvariate dashboard maps to xvariate login
};

function normalizePathname(pathname: string): string {
    // Remove any trailing slash, except if it’s just "/"
    if (pathname !== "/" && pathname.endsWith("/")) {
        return pathname.slice(0, -1);
    }
    return pathname;
}


//* Middleware for handling authentication and role-based redirection
export default auth(async (req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;  // This determines whether the request has a valid session/user.
    // Convert to lowercase and remove trailing slash if not the root "/"
    let pathname = req.nextUrl.pathname.toLowerCase();
    pathname = normalizePathname(pathname)
    const userRole = req.auth?.user?.role; // The role of the user (XVARIATE, FREELANCER, etc.) if they are logged in
    console.log("User Role ---> ", userRole);

    // 1. Allow API auth routes and home page without checks
    if (pathname.startsWith(apiAuthPrefix)) return;
    if (pathname === HOME_ROUTE) return;

    // 2. Figure out if this is a public route or an auth route
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    console.log("Is Logged In Outside---> ", isLoggedIn);
    console.log("Pathname Outside ---> ", pathname);
    console.log("Is Public Route ---> ", isPublicRoute);

    // If it's an auth route (e.g. "/login") but user is already logged in,
    // send them to their default dashboard so they can't go back to login.
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT("XVARIATE"), nextUrl));
        }
        // If not logged in, let them continue to login/signup
        return;
    }

    // 3. If the user is NOT logged in and the route is NOT public,
    // force them to log in via the correct login page
    if (!isLoggedIn && !isPublicRoute) {
        console.log("Is Logged In ---> ", isLoggedIn);
        console.log("Pathname ---> ", pathname);
        let loginPath = '/login/client'; // default path if no match

        // Check if they tried to access a dashboard; if so, pick the right login
        for (const [dashboardPath, loginRoute] of Object.entries(PATH_TO_LOGIN_ROUTE)) {
            if (pathname.startsWith(dashboardPath)) {
                loginPath = loginRoute;
                break;
            }
        }

        // Redirect them to the chosen login page
        return NextResponse.redirect(new URL(loginPath, nextUrl));
    }


    // 4. If the user IS logged in, ensure they have the right role for certain dashboards
    // if (isLoggedIn) {
    //     for (const [dashPath, allowedRoles] of Object.entries(DASHBOARD_PERMISSIONS)) {
    //         // If they visit a path that starts with, say, "/xvariate",
    //         // check if their role is in [UserRole.XVARIATE]
    //         if (pathname.startsWith(dashPath)) {
    //             if (!allowedRoles.includes(userRole!)) {
    //                 return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT(userRole as UserRole), nextUrl));
    //             }
    //         }
    //     }
    // }

    // 5. If none of the above rules apply, just allow the user to proceed
    return;
});


export const config = {
    matcher: [
        // Skip Next.js internals and static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}