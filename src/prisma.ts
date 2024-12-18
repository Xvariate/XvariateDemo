import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// Enable optimized fetching for Neon
neonConfig.poolQueryViaFetch = true;
// This tells Neon to use the `fetch` API for making queries in a serverless environment,
// improving performance and reducing connection overhead.

// Function to initialize a Prisma Client instance with the Neon adapter
const prismaClientSingleton = () => {
    //* Create a new Neon connection pool using the database URL from environment variables
    const neon = new Pool({ connectionString: process.env.DATABASE_URL });

    //* Create an adapter to bridge Prisma and Neo
    const adapter = new PrismaNeon(neon);

    // Return a PrismaClient instance configured with the Neon adapter
    return new PrismaClient({ adapter });
};

// Declare a global variable to hold the Prisma client instance for reuse
declare global {
    // eslint-disable-next-line no-var
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Initialize the Prisma client
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Export the Prisma client instance for use in other parts of the application
export default prisma;

// During development, persist the Prisma instance in the global object
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
// In non-production environments (like development),
// we store the Prisma client in `globalThis.prismaGlobal` to avoid creating multiple instances.
// This is crucial for serverless environments to prevent connection issues or performance degradation.