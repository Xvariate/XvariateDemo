# SESSION HOOKS Documentation

This document describes two custom React hooks that provide a seamless way to access session information on the client-side. These hooks are located in the `/src/hooks/` folder.

---

## 1. useCurrentUser

**Purpose:**  
Retrieves the current user's session data without the need for additional boilerplate code. This hook allows client-side components to easily access user information.

**How It Works:**

- Uses NextAuth's `useSession` hook to obtain the session.
- Returns the `user` object from the session data.

**Usage Example:**

```typescript
import { useCurrentUser } from "@/hooks/useCurrentUser";

function UserProfile() {
    const user = useCurrentUser();

    return (
        <div>
            <h1>Welcome, {user?.name}</h1>
            <p>Your email: {user?.email}</p>
        </div>
    );
}
```

---

## 2. useCurrentRole

**Purpose:**  
Retrieves the current user's role from the session data. This hook makes it easy for developers to enforce role-based logic on the client-side.

**How It Works:**

- Uses NextAuth's `useSession` hook to access the session.
- Returns the `role` property from the user object in the session data.

**Usage Example:**

```typescript
import { useCurrentRole } from "@/hooks/useCurrentRole";

function Dashboard() {
    const role = useCurrentRole();

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Your role: {role}</p>
        </div>
    );
}
```

---

*End of SESSION HOOKS Documentation*