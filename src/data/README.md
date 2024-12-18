# 📂 Data Folder

This folder is where we organize all the functions and utilities to **query** or **fetch data** from our database. These functions are reusable, clean, and make it easy to manage data like `users`, `sessions`, `verificationTokens`, `twoFactorTokens`, and more.

By using this folder, we keep our codebase neat and ensure all database-related logic is centralized.

---

## 🛠️ What’s Inside?

You’ll find files here, each handling specific types of data queries. For example:

- **`user.ts`**: Functions to query and manage user data.
- **`session.ts`**: Functions to handle session-related queries.
- **`verificationToken.ts`**: Functions for managing email/phone verification tokens.
- **`twoFactorToken.ts`**: Functions for managing 2FA tokens.

Each file focuses on one specific entity, making it simple to locate and update when needed.

---


## Example Code

Here’s an example of a utility function to fetch and cache a user by their email:

```typescript
import prisma from "@/prisma";
import { cache } from "react";

export const getCachedUserByEmail = cache(async (email: string) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        return existingUser;
    } catch {
        return null;
    }
});
