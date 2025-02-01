# PRISMA Documentation

This document provides an overview of the Prisma setup in this project. It covers two key files:

- **schema.prisma** – Defines the database schema and models.
- **prisma.ts** – Configures and initializes the Prisma Client using a Neon adapter.

---

## File: `/prisma/schema.prisma`

This file uses Prisma's schema language to define the structure of the database.

### Datasource & Generator

- **Datasource:**  
  Uses PostgreSQL as the database provider.  
  ```prisma
  datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
  }
  ```

- **Generator:**  
  Configures Prisma Client for JavaScript and enables preview features for driver adapters.  
  ```prisma
  generator client {
      provider        = "prisma-client-js"
      previewFeatures = ["driverAdapters"]
  }
  ```

### Enum: UserRole

Defines the available user roles within the system:
```prisma
enum UserRole {
    XVARIATE
    CLIENT
    FREELANCER
    AMBASSADOR
}
```

### Models

- **User:**  
  Contains user information, including name, email, password, role, and related authentication details.
  
- **Account:**  
  Manages OAuth accounts linked to users.

- **VerificationToken:**  
  Stores tokens used for email verification.

- **PasswordResetToken:**  
  Stores tokens used for password resets.

- **TwoFactorOTP:**  
  Manages One-Time Passwords for two-factor authentication.

- **TwoFactorConfirmation:**  
  Records confirmations of successful two-factor authentication.

Each model is set up with fields, types, relations, and constraints (such as unique fields) to ensure data integrity.

---

## File: `/src/prisma.ts`

This file sets up and exports the Prisma Client, optimized for serverless environments using Neon.

### Key Points

- **Neon Adapter Configuration:**  
  Enables optimized fetching with the `fetch` API to reduce connection overhead:
  ```typescript
  import { Pool, neonConfig } from "@neondatabase/serverless";
  import { PrismaNeon } from "@prisma/adapter-neon";
  import { PrismaClient } from "@prisma/client";
  
  neonConfig.poolQueryViaFetch = true;
  ```

- **Prisma Client Initialization:**  
  Implements a singleton pattern to maintain a single instance of the Prisma Client:
  ```typescript
  const prismaClientSingleton = () => {
      // Create a Neon connection pool using the database URL
      const neon = new Pool({ connectionString: process.env.DATABASE_URL });
  
      // Create an adapter to bridge Prisma and Neon
      const adapter = new PrismaNeon(neon);
  
      // Return a PrismaClient instance configured with the Neon adapter
      return new PrismaClient({ adapter });
  };
  
  // Declare a global variable to hold the Prisma client instance for reuse
  declare global {
      var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
  }
  
  // Initialize the Prisma client
  const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
  
  // Export the Prisma client instance for use in other parts of the application
  export default prisma;
  
  // In development, store the Prisma client in the global object to avoid multiple instances
  if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
  ```

- **Usage:**  
  Import this module in other parts of the application to interact with the database using Prisma.

---

*End of PRISMA Documentation*