# AUTH Documentation

This document explains the configuration and functionality of the authentication setup in the project. The file is located at `/src/auth.ts` and uses NextAuth with a Prisma adapter for secure authentication.

---

## Overview

The authentication system supports both traditional email/password logins and OAuth sign-ins (e.g., Google). It also provides a passwordless login flow using a verification secret. The configuration includes custom pages, session management with JSON Web Tokens (JWT), and callbacks for enriching session data.

---

## Configuration

### Prisma Adapter

- **Purpose:**  
  Uses Prisma to interact with the database.
  
- **Setup:**  
  The Prisma adapter is configured with the `prisma` client instance.
  
  ```typescript
  adapter: PrismaAdapter(prisma)
  ```

---

### Custom Pages

- **Sign-In Page:**  
  Redirects users to `/login` for sign-in.
  
- **Error Page:**  
  Uses `/auth/error` for handling authentication errors.
  
  ```typescript
  pages: {
      signIn: "/login",
      error: "/auth/error",
  },
  ```

---

### Session Management

- **JWT-Based Sessions:**  
  Sessions are managed using JSON Web Tokens.
  
- **Settings:**  
  - **Max Age:** 7 days  
  - **Update Age:** Every 12 hours (to revalidate the token)
  
  ```typescript
  session: {
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
      updateAge: 12 * 60 * 60,
  },
  ```

---

## Callbacks

Callbacks customize the behavior during sign-in, token creation, and session management.

### Sign-In Callback

- **Purpose:**  
  Validates the sign-in attempt. For credentials-based logins, it checks that the provided server secret matches the expected value.
  
- **Logic:**  
  - If the provider is not "credentials" (i.e., OAuth), sign-in is allowed.
  - For credentials, it compares `credentials.serverSecret` to the environment variable.
  
  ```typescript
  async signIn({ account, credentials }) {
      if (account?.provider !== 'credentials') return true;
      const envServerSecret = process.env.SERVER_SECRET;
      if (envServerSecret !== credentials?.serverSecret) return false;
      return true;
  }
  ```

### JWT Callback

- **Purpose:**  
  Enriches the JWT token with user information after sign-in.
  
- **Logic:**  
  - Retrieves the user by ID (from the token's `sub`).
  - If the user is not found, forces logout by returning an empty object.
  - Checks if the user has an associated OAuth account.
  - Adds details such as name, email, role, and 2FA status to the token.
  
  ```typescript
  async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return {};
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.isOAuth = !!existingAccount;
      return token;
  }
  ```

### Session Callback

- **Purpose:**  
  Uses the enriched JWT token to build the session object that is available on the client.
  
- **Logic:**  
  - Copies token details into the session’s user object.
  
  ```typescript
  async session({ session, token }) {
      if (session.user) {
          if (token.sub) session.user.id = token.sub;
          if (token.name) session.user.name = token.name;
          if (token.email) session.user.email = token.email;
          if (token.role) session.user.role = token.role as UserRole;
          if (token.isTwoFactorEnabled) session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
          if (token.isOAuth) session.user.isOAuth = token.isOAuth as boolean;
      }
      return session;
  }
  ```

---

## Events

### Link Account Event

- **Purpose:**  
  When a user signs in via OAuth, this event checks if a pending user role is stored in cookies and updates the user record accordingly.
  
- **Logic:**  
  - Retrieves the pending role from cookies.
  - Updates the user's role and marks the email as verified.
  - Clears the pending role cookie.
  
  ```typescript
  async linkAccount({ user }) {
      try {
          const cookieStore = await cookies();
          const pendingRole = cookieStore.get("pending_oauth_role")?.value as UserRole | undefined;
          if (pendingRole) {
              await prisma.user.update({
                  where: { id: user.id },
                  data: {
                      role: pendingRole,
                      emailVerified: new Date(),
                  },
              });
              cookieStore.set("pending_oauth_role", "", { maxAge: 0 });
          }
      } catch (error) {
          console.error("Error linking account:", error);
      }
  }
  ```

---

## Providers

The configuration includes two main providers: Google and Credentials.

### Google Provider

- **Purpose:**  
  Enables OAuth sign-in with Google.
  
- **Setup:**  
  Uses the client ID and secret from environment variables.
  
  ```typescript
  Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })
  ```

### Credentials Provider

- **Purpose:**  
  Handles custom authentication using user credentials.
  
- **Logic:**  
  - **Passwordless Flow:**  
    If `newVerificationSecret` is provided, validates it against the environment value. If valid, retrieves the user by email.
    
  - **Traditional Flow:**  
    Validates email and password using a Zod schema (`LogInServerSchema`), then verifies the password with bcrypt.
  
  ```typescript
  Credentials({
      async authorize(credentials) {
          if (credentials.newVerificationSecret) {
              const validateNewVerificationFields = NewVerificationLoginSchema.safeParse(credentials);
              if (validateNewVerificationFields.success) {
                  const envNewVerificationSecret = process.env.NEW_VERIFICATION_SECRET;
                  if (!envNewVerificationSecret) return null;
                  const { email, newVerificationSecret } = validateNewVerificationFields.data;
                  if (newVerificationSecret === envNewVerificationSecret) {
                      const user = await getUserByEmail(email);
                      if (!user || !user.password) return null;
                      return user;
                  }
              }
          }
          const validatedFields = LogInServerSchema.safeParse(credentials);
          if (validatedFields.success) {
              const { email, password } = validatedFields.data;
              const user = await getUserByEmail(email);
              if (!user || !user.password) return null;
              const passwordMatch = await bcrypt.compare(password, user.password);
              if (passwordMatch) return user;
          }
          return null;
      }
  })
  ```

---

## Exported Functions

The file exports several functions for use in other parts of the application:

- **handlers** – Request handlers provided by NextAuth.
- **auth** – The primary authentication middleware.
- **signIn** – Function to initiate a sign-in.
- **signOut** – Function to log the user out.

These exports are used throughout the application to manage user authentication and session management.

---

*End of AUTH Documentation*