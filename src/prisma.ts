import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from 'ws';

// Enable optimized fetching for Neon using the `fetch` API
// This improves performance and reduces connection overhead in serverless environments
neonConfig.poolQueryViaFetch = true;
neonConfig.webSocketConstructor = ws;

// Function to initialize a Prisma Client instance with the Neon adapter
const prismaClientSingleton = () => {
    // Create a Neon connection pool using the database URL from environment variables
    const neon = new Pool({ connectionString: process.env.DATABASE_URL });

    // Create an adapter to bridge Prisma and Neon
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

// In development, store the Prisma client in the global object to avoid multiple instances
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;