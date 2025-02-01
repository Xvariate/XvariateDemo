# SERVER SESSION Documentation

This document explains the functionality of the `serverSession.ts` file, located at `/src/lib/serverSession.ts`. This module provides helper functions to retrieve the current user's session information.

---

## Overview

The module defines two asynchronous functions that utilize the authentication system to return session details:

- **currentUser:** Retrieves the current user object from the session.
- **currentRole:** Retrieves the current user's role from the session.

---

## Functions

### 1. currentUser

**Purpose:**  
Returns the current user's session information.

**How It Works:**

- Calls the `auth()` function to get the session.
- Returns the `user` object from the session.

**Usage Example:**

```typescript
const user = await currentUser();
console.log(user);
```

---

### 2. currentRole

**Purpose:**  
Returns the role of the current user from the session.

**How It Works:**

- Calls the `auth()` function to get the session.
- Returns the `role` property from the `user` object.

**Usage Example:**

```typescript
const role = await currentRole();
console.log(role);
```

---

*End of SERVER SESSION Documentation*