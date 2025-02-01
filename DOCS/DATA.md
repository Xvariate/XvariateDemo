# DATA Documentation

This document provides an overview of the data access layer in the project. The source files are located in the `src/data` directory and handle database interactions using Prisma. The following files are covered:

- **account.ts**
- **passwordResetToken.ts**
- **user.ts**
- **twoFactorConfirmation.ts**
- **verification-tokens.ts**
- **twoFactorOtps.ts**

---

## File: `src/data/account.ts`

**Purpose:**  
Retrieves account information for a user.

**Key Function:**  
- **getAccountByUserId(userId: string)**  
  - Queries the database for an account matching the given user ID.
  - Handles errors by extracting a meaningful error message.

---

## File: `src/data/passwordResetToken.ts`

**Purpose:**  
Manages password reset tokens.

**Key Functions:**  
- **getPasswordResetTokenByEmail(email: string)**  
  - Retrieves the password reset token for a given email.
  - Provides error handling with a default message if retrieval fails.

- **getPasswordResetTokenByToken(token: string)**  
  - Retrieves the password reset token using the token value.
  - Uses similar error handling to ensure consistent error messages.

---

## File: `src/data/twoFactorConfirmation.ts`

**Purpose:**  
Handles two-factor confirmation records.

**Key Function:**  
- **getTwoFactorConfirmationByUserId(userId: string)**  
  - Looks up the two-factor confirmation record for the specified user.
  - Returns `null` if no record is found or an error occurs.

---

## File: `src/data/verification-tokens.ts`

**Purpose:**  
Manages email verification tokens.

**Key Functions:**  
- **getVerificationTokenByEmail(email: string)**  
  - Fetches the verification token for the provided email.
  - Includes error handling with a default error message.

- **getVerificationTokenByToken(token: string)**  
  - Retrieves the verification token using the token string.
  - Handles errors in a similar manner to ensure clarity.

---

## File: `src/data/user.ts`

**Purpose:**  
Handles user retrieval with and without caching.

**Key Functions:**  
- **getCachedUserByEmail(email: string)**  
  - Uses React's `cache` utility to fetch a user by email.
  - Optimizes performance by avoiding redundant database queries.

- **getCachedUserById(id: string)**  
  - Retrieves a user by ID with caching enabled for efficiency.

- **getUserByEmail(email: string)**  
  - Retrieves a user by email without caching.
  - Provides detailed error handling.

- **getUserById(id: string)**  
  - Fetches a user by ID without caching.
  - Returns `null` if the user is not found or an error occurs.

---

## File: `src/data/twoFactorOtps.ts`

**Purpose:**  
Manages two-factor authentication OTPs.

**Key Functions:**  
- **getTwoFactorOTPByOTP(otp: string)**  
  - Retrieves a two-factor OTP record by the OTP value.
  - Returns `null` if not found or if an error occurs.

- **getTwoFactorOTPByEmail(email: string)**  
  - Fetches the two-factor OTP record for a specific email.
  - Returns `null` in case of errors or if no record exists.

---

*End of DATA Documentation*
