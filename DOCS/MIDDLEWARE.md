# MIDDLEWARE Documentation

This document explains how our middleware works to manage authentication and role-based redirection. It is located at `/src/middleware.ts` and ensures that users are either allowed to access public pages or are redirected to the correct login or dashboard pages based on their status and role.

---

## Overview

The middleware performs the following tasks:

- **Authentication Check:**  
  It verifies if a user is logged in or not.

- **Route Classification:**  
  It determines if the current request is for a public page, an authentication page, or a protected dashboard.

- **Role-Based Redirection:**  
  It checks if the logged-in user has permission to access a specific dashboard and redirects them accordingly.

---

## Dashboard Permissions

This section maps dashboard paths to the allowed user roles.

- **Example:**  
  - `/xvariate` can only be accessed by users with the **XVARIATE** role.
  - `/ambassador` can only be accessed by users with the **AMBASSADOR** role.
  - `/client` and `/freelancer` have similar restrictions.

```typescript
const DASHBOARD_PERMISSIONS: Record<string, UserRole[]> = {
    "/xvariate": [UserRole.XVARIATE],
    "/ambassador": [UserRole.AMBASSADOR],
    "/client": [UserRole.CLIENT],
    "/freelancer": [UserRole.FREELANCER],
};
```

---

## Path to Login Mapping

This mapping determines the correct login page for a dashboard if a user is not authenticated.

- **Example:**  
  - If a user tries to access `/ambassador` without being logged in, they will be redirected to `/login/ambassador`.

```typescript
const PATH_TO_LOGIN_ROUTE: Record<string, string> = {
    '/ambassador': '/login/ambassador',
    '/client': '/login/client',
    '/freelancer': '/login/freelancer',
    '/xvariate': '/login/xvariate'
};
```

---

## Normalizing the Pathname

The helper function `normalizePathname` removes any trailing slashes from the URL (except for the root "/") to ensure consistent matching.

```typescript
function normalizePathname(pathname: string): string {
    if (pathname !== "/" && pathname.endsWith("/")) {
        return pathname.slice(0, -1);
    }
    return pathname;
}
```

---

## Middleware Function Explained

The middleware function is the core of this file. It uses our authentication system (`auth`) to decide what to do with each incoming request.

### Step-by-Step Process

1. **API and Home Page Check:**  
   - If the URL starts with our API prefix or is the home page, the request is allowed without further checks.
  
2. **Route Classification:**  
   - The middleware checks if the route is public (e.g., contact, about pages) or an authentication route (e.g., `/login` or `/signup`).

3. **Handling Auth Routes:**  
   - If the request is for an authentication page and the user is already logged in, the user is redirected to their default dashboard based on their role.
   - If the user is not logged in, the request is allowed to continue.

4. **Protected Routes for Non-Logged-In Users:**  
   - If the user is not logged in and the page is not public, the middleware determines the proper login page based on the requested dashboard and redirects the user.

5. **Role-Based Access for Logged-In Users:**  
   - If the user is logged in, the middleware checks if the user’s role matches the allowed roles for the requested dashboard.
   - If the user’s role does not have permission, they are redirected to their default dashboard.

6. **Default Behavior:**  
   - If none of the above rules apply, the user is allowed to proceed.

```typescript
export default auth(async (req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;  // Check if the user is logged in
    let pathname = req.nextUrl.pathname.toLowerCase();
    pathname = normalizePathname(pathname);
    const userRole = req.auth?.user?.role;  // User role if logged in

    // 1. Allow API auth routes and the home page without checks.
    if (pathname.startsWith(apiAuthPrefix)) return;
    if (pathname === HOME_ROUTE) return;

    // 2. Determine if the route is public or an auth route.
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // If it's an auth route and the user is logged in, redirect them to their dashboard.
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT(userRole as UserRole), nextUrl));
        }
        // Otherwise, allow access to login/signup pages.
        return;
    }

    // 3. If not logged in and not on a public page, force login.
    if (!isLoggedIn && !isPublicRoute) {
        let loginPath = '/login/client'; // Default login path

        // Find the correct login path based on the requested dashboard.
        for (const [dashboardPath, loginRoute] of Object.entries(PATH_TO_LOGIN_ROUTE)) {
            if (pathname.startsWith(dashboardPath)) {
                loginPath = loginRoute;
                break;
            }
        }

        // Redirect to the determined login page.
        return NextResponse.redirect(new URL(loginPath, nextUrl));
    }

    // 4. For logged-in users, check role permissions for dashboards.
    if (isLoggedIn) {
        for (const [dashPath, allowedRoles] of Object.entries(DASHBOARD_PERMISSIONS)) {
            if (pathname.startsWith(dashPath)) {
                if (!allowedRoles.includes(userRole!)) {
                    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT(userRole as UserRole), nextUrl));
                }
            }
        }
    }

    // 5. Allow the request to proceed if no rules are violated.
    return;
});
```

---

## Middleware Configuration

The `config` export specifies which routes the middleware should run on. It skips Next.js internals and static files but always runs for API routes.

```typescript
export const config = {
    matcher: [
        // Skip Next.js internals and static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
```

---

*End of MIDDLEWARE Documentation*