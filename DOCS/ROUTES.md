# ROUTES Documentation

This document explains the configuration and purpose of the routes defined in the `/src/routes.ts` file. The file organizes the routes for public access, authentication-related paths, API endpoints, and default redirects based on user roles.

---

## Public Routes

**Purpose:**  
Lists the routes that are accessible without authentication.

**Details:**

- **HOME_ROUTE:**  
  The home page route ("/").
  
- **publicRoutes:**  
  An array of routes that do not require the user to be authenticated. These include pages such as the home page, services, contact, about, privacy, and pricing pages.

```typescript
export const HOME_ROUTE: string = "/";
export const publicRoutes: string[] = [
    "/",
    "/new-verification",
    "/services",
    "/contact",
    "/about",
    "/privacy",
    "/pricing",
];
```

---

## Authentication Routes

**Purpose:**  
Specifies the routes related to authentication, such as login, signup, reset, and error pages.

### Static Authentication Routes

- **staticAuthRoutes:**  
  A fixed list of routes that are always part of the authentication flow, including:
  - `/error`
  - `/reset`
  - `/new-password`
  - `/login`
  - `/signup`

```typescript
const staticAuthRoutes: string[] = [
    "/error",
    "/reset",
    "/new-password",
    "/login",
    "/signup",
];
```

### Dynamic Authentication Routes

**Purpose:**  
Automatically generates authentication routes based on user roles defined in the `UserRole` enum.

- **dynamicSignupRoutes:**  
  Creates signup routes for each user role. For example, if a role is "CLIENT", the route becomes `/signup/client`.

- **dynamicLoginRoutes:**  
  Creates login routes for each user role. For example, if a role is "AMBASSADOR", the route becomes `/login/ambassador`.

```typescript
const dynamicSignupRoutes: string[] = Object.values(UserRole).map(
    (role) => `/signup/${role.toLowerCase()}`
);

const dynamicLoginRoutes: string[] = Object.values(UserRole).map(
    (role) => `/login/${role.toLowerCase()}`
);
```

### Combined Authentication Routes

- **authRoutes:**  
  Combines both the static and dynamically generated routes into one array for authentication-related pages.

```typescript
export const authRoutes: string[] = [...staticAuthRoutes, ...dynamicSignupRoutes, ...dynamicLoginRoutes];
```

---

## API Authentication Prefix

**Purpose:**  
Defines a prefix for API routes that are related to authentication.  
This helps in grouping and managing authentication endpoints separately.

```typescript
export const apiAuthPrefix: string = "/api/auth";
```

---

## Default Login Redirect

**Purpose:**  
Determines the default dashboard or landing page for users after a successful login based on their role.

**Logic:**

- **XVARIATE:**  
  Redirects to `/xvariate`.
- **FREELANCER:**  
  Redirects to `/freelancer`.
- **AMBASSADOR:**  
  Redirects to `/ambassador`.
- **CLIENT (or any other role):**  
  Redirects to `/client`.

```typescript
export const DEFAULT_LOGIN_REDIRECT = (role: UserRole): string => {
    if (role === UserRole.XVARIATE) {
        return "/xvariate";
    } else if (role === UserRole.FREELANCER) {
        return "/freelancer";
    } else if (role === UserRole.AMBASSADOR) {
        return "/ambassador";
    } else {
        return "/client";
    }
};
```

---

*End of ROUTES Documentation*