# AUTH-ACTIONS Documentation

This document provides detailed information about the server actions that handle authentication in the project. These actions are located in the `/src/actions/auth-actions/` directory and cover various authentication flows, including user sign-up, email verification, login (with two-factor support), OAuth sign-in, password resets, and token resets.

---

## 1. signup-action.ts

**Purpose:**  
Handles new user sign-up by validating input, creating a user record, encrypting the password, and sending an email verification link.

**Key Steps:**

- **Input Validation:**  
  Validates sign-up data using a Zod schema.

- **User Creation:**  
  Checks for duplicate users and hashes the password using bcrypt.  
  Creates the user record in the database with the specified role.

- **Email Verification:**  
  Generates a verification token using the upsert function and sends a verification email.

**Error Handling:**  
Returns user-friendly error messages if validation fails or if any step encounters an error.

---

## 2. new-verification-action.ts

**Purpose:**  
Verifies a user's email using a token received via email. Once verified, it signs in the user using a passwordless flow.

**Key Steps:**

- **Token Verification:**  
  Retrieves and validates the verification token.  
  Checks token expiration.

- **Email Confirmation:**  
  Marks the user's email as verified and deletes the used token.

- **Passwordless Sign-In:**  
  Uses environment secrets (`NEW_VERIFICATION_SECRET` and `SERVER_SECRET`) to initiate a passwordless sign-in and redirects the user to a role-based dashboard.

**Error Handling:**  
Handles errors related to token invalidity, expiration, missing secrets, and sign-in issues.

---

## 3. login-action.ts

**Purpose:**  
Handles traditional login, including support for two-factor authentication (2FA).

**Key Steps:**

- **Input Validation:**  
  Validates login credentials using a Zod schema.

- **User Lookup & Password Check:**  
  Retrieves the user by email and verifies the password using bcrypt.

- **Email Verification Check:**  
  If the user's email is unverified, triggers a verification email.

- **Two-Factor Authentication (2FA):**

  - If 2FA is enabled, checks for the OTP.
  - Verifies the OTP's validity and expiry.
  - Creates or updates two-factor confirmation records.

- **Sign-In & Redirection:**  
  Signs in the user using NextAuth and redirects based on the user's role.

**Error Handling:**  
Provides clear error messages for invalid credentials, unverified email, OTP issues, and other potential errors.

---

## 4. logout-action.ts

**Purpose:**  
Logs out the user and redirects them to the homepage.

**Key Steps:**

- **Sign-Out:**  
  Uses NextAuth's `signOut` method to terminate the session.
- **Redirection:**  
  Redirects the user to the homepage after sign-out.

---

## 5. reset-action.ts

**Purpose:**  
Initiates the password reset process by validating the user's email and sending a password reset token via email.

**Key Steps:**

- **Input Validation:**  
  Uses a Zod schema to validate the reset request.

- **User Verification:**  
  Checks if the user exists for the provided email.

- **Token Generation & Email:**  
  Generates (or updates) a password reset token using the upsert function.  
  Sends a password reset email with the token and personalized message.

**Error Handling:**  
Returns errors if validation fails or if the user does not exist.

---

## 6. new-password-action.ts

**Purpose:**  
Allows users to set a new password after verifying the password reset token.

**Key Steps:**

- **Token & Input Validation:**  
  Confirms the presence of a token and validates the new password inputs.

- **Token Validation:**  
  Retrieves and verifies the token, including expiration checks.

- **Password Update:**  
  Encrypts the new password and updates the user record in the database.

- **Cleanup:**  
  Deletes the used password reset token from the database.

- **Redirection:**  
  Returns a success message and a redirect URL based on the user's role.

**Error Handling:**  
Handles errors for invalid tokens, expired tokens, mismatched passwords, and update failures.

---

## 7. oauth-action.ts

**Purpose:**  
Handles OAuth-based sign-in by validating input, storing the intended user role in a secure cookie, and redirecting the user after successful authentication.

**Key Steps:**

- **Input Validation:**  
  Validates the OAuth request using a Zod schema.

- **Role Validation:**  
  Confirms that the provided user role is valid.

- **Cookie Management:**  
  Stores the intended user role in a secure cookie (with different settings based on the environment).

- **OAuth Sign-In:**  
  Initiates the OAuth sign-in process with the specified provider and redirects the user to a role-based dashboard.

**Error Handling:**  
Returns validation errors and rethrows any unexpected errors during the OAuth flow.

---

## 8. reset-verificationtoken-action.ts

**Purpose:**  
Resets the verification token by generating a new token and sending a new verification email.

**Key Steps:**

- **Token Retrieval:**  
  Retrieves the existing verification token based on the provided token.

- **Token Renewal:**  
  Upserts a new verification token using the email from the old token.

- **Email Resend:**  
  Sends a new verification email to the user with the new token.

**Error Handling:**  
Provides error responses if no user is associated with the token or if any step fails.

---

_End of AUTH-ACTIONS Documentation_
