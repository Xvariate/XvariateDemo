# OVERVIEW

---

## Project Overview

This project delivers a secure and robust authentication and authorization system. It supports multiple sign-in methods including traditional email/password, two-factor authentication, OAuth, and a passwordless login flow using email verification. 

*Note: The portfolio section and dashboards are under development.*

---

## Key Features

- **Secure Authentication & Authorization**  
  Supports:
  - Traditional login (email/password)
  - Two-factor authentication with OTP
  - OAuth sign-in (e.g., Google) with role-specific redirection
  - Passwordless login via email verification using a new verification secret

- **Role-Based Access Control**  
  User roles include:
  - **XVARIATE:** For internal xvariate members
  - **CLIENT:** For xvariate's clients
  - **FREELANCER:** For xvariate's freelance partners
  - **AMBASSADOR:** For xvariate's referral partners

- **Email Verification & Password Management**  
  - Sends verification emails with tokens
  - Handles secure password resets with token-based email notifications
  - Uses encrypted passwords and safe token management practices

---

## Server Actions & Endpoints

- **signup-action.ts**  
  - Validates sign-up data  
  - Encrypts passwords and creates new user records  
  - Sends verification emails with tokens

- **new-verification-action.ts**  
  - Verifies the email token and checks expiry  
  - Marks the user's email as verified  
  - Signs in the user using a passwordless flow with `NEW_VERIFICATION_SECRET`

- **login-action.ts**  
  - Manages traditional login with password verification  
  - Supports two-factor authentication via OTP  
  - Redirects users to role-specific dashboards

- **oauth-action.ts**  
  - Handles OAuth sign-in by storing the intended user role in a secure cookie  
  - Redirects users to the appropriate dashboard

- **logout-action.ts**  
  - Logs out the user and redirects to the homepage

- **reset-action.ts & new-password-action.ts**  
  - Facilitate password reset using secure tokens and email notifications  
  - Allow users to update their password after verification

- **reset-verification-token-action.ts**  
  - Generates and sends a new verification token when needed

---

## Authentication Configuration

- **NextAuth Setup (auth.ts)**  
  - Uses Prisma as the database adapter  
  - Manages sessions with JSON Web Tokens (JWT)  
  - Supports both traditional credentials and OAuth sign-ins  
  - Integrates passwordless login via the `NEW_VERIFICATION_SECRET`  
  - Enriches session data with user details and handles role-based redirection

- **Routes & Middleware**  
  - Clearly defines public, authentication, and dynamic role-based routes  
  - Enforces role-based access control by redirecting users to the correct login or dashboard pages

---

## Database & Environment

- **Database Schema (schema.prisma)**  
  - Models include users, accounts, verification tokens, password reset tokens, and two-factor tokens  
  - Uses a PostgreSQL database with Prisma, optimized for serverless environments using Neon

- **Environment Configuration (.env)**  
  Essential variables:
  - `DATABASE_URL`
  - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
  - `AUTH_SECRET` & `SERVER_SECRET`
  - **`NEW_VERIFICATION_SECRET`** – for passwordless verification
  - `RESEND_API_KEY`
  - `NEXT_PUBLIC_APP_URL` (e.g., `http://localhost:3000` for development)

- **Prisma Client Setup (prisma.ts)**  
  - Initializes the Prisma client with a Neon adapter  
  - Uses a singleton pattern to maintain a single database connection in both development and production

---

## Next Steps

- **Portfolio Section**  
  Under development. Future documentation will detail its features and integration.

- **Dashboards**  
  Planned for upcoming releases with detailed guides on usage and role-based access

---

*End of Overview*
