# UPSERT Tokens Documentation

This document explains the functionality provided in the `upsert-tokens.ts` file (located in `/src/lib/upsert-tokens.ts`). This module handles the creation and updating of various tokens used for user authentication processes.

---

## Overview

The module provides functions to upsert (create or update) tokens for:

- **Password Reset Tokens:** For secure password reset operations.
- **Verification Tokens:** For email verification during user sign-up or verification flows.
- **Two-Factor Authentication OTPs:** For generating one-time passwords used in two-factor authentication.

Each function generates a unique token or OTP, sets an expiration time, and upserts the record into the database using Prisma. Error handling is implemented to ensure user-friendly error messages.

---

## upsertPasswordResetToken

**Purpose:**  
Creates or updates a password reset token for a given email address.

**Process:**

1. Generates a unique token using UUID.
2. Sets an expiration time of 5 minutes.
3. Uses Prisma's `upsert` method to either create a new record or update an existing one.
4. Returns the password reset token record.

**Key Code Snippet:**

```typescript
export const upsertPasswordResetToken = async (email: string) => {
    const token = uuidv4();  // Generate a unique token
    const expires = expiryInMinutes(5); // Expires in 5 minutes

    try {
        const passwordResetToken = await prisma.passwordResetToken.upsert({
            where: { email },
            create: { email, token, expires },
            update: { token, expires },
        });
        return passwordResetToken;
    } catch (error) {
        const message = extractErrorMessage({
            error,
            defaultMessage: "Internal Server Error: Unable to fetch password reset token."
        });
        throw new Error(message);
    }
}
```

---

## upsertVerificationToken

**Purpose:**  
Creates or updates a verification token for a given email address.

**Process:**

1. Generates a unique token using UUID.
2. Sets an expiration time of 5 minutes.
3. Upserts the verification token record in the database.
4. Returns the verification token record.

**Key Code Snippet:**

```typescript
export const upsertVerificationToken = async (email: string) => {
    const token = uuidv4(); // Generate a unique token
    const expires = expiryInMinutes(5); // Expires in 5 minutes

    try {
        const verificationToken = await prisma.verificationToken.upsert({
            where: { email },
            create: { email, token, expires },
            update: { token, expires },
        });
        return verificationToken;
    } catch (error) {
        const message = extractErrorMessage({
            error,
            defaultMessage: "Internal Server Error: Unable to fetch verification token."
        });
        throw new Error(message);
    }
}
```

---

## upsertTwoFactorOTP

**Purpose:**  
Creates or updates a Two-Factor Authentication OTP for a given email address.

**Process:**

1. Generates a random 6-digit OTP using Node's `crypto` module.
2. Sets an expiration time of 5 minutes.
3. Upserts the OTP record in the database.
4. Returns the two-factor OTP record.

**Key Code Snippet:**

```typescript
export const upsertTwoFactorOTP = async (email: string) => {
    const otp = crypto.randomInt(100_000, 1_000_000).toString();  // Generate a random 6-digit OTP
    const expires = expiryInMinutes(5); // Expires in 5 minutes

    try {
        const twoFactorOTP = await prisma.twoFactorOTP.upsert({
            where: { email },
            create: { email, otp, expires },
            update: { otp, expires },
        });
        return twoFactorOTP;
    } catch (error) {
        const message = extractErrorMessage({
            error,
            defaultMessage: "Internal Server Error: Unable to fetch two-factor authentication OTP."
        });
        throw new Error(message);
    }
}
```

---

*End of UPSERT Tokens Documentation*