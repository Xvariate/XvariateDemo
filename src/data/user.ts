// Import the Prisma client for interacting with the database
import prisma from "@/prisma";
// Import the `cache` utility from React to enable caching of function results
import { cache } from "react";

// Function to retrieve a user by email, using caching to avoid redundant database queries
export const getCachedUserByEmail = cache(
    async (email: string) => {
        try {
            const existingUser = await prisma.user.findUnique({
                where: {
                    email,
                }
            })

            return existingUser;
        } catch {
            return null;
        }
    }
)

// Function to retrieve a user by ID, using caching for efficiency
export const getCachedUserById = cache(
    async (id: string) => {
        try {
            const existingUser = await prisma.user.findUnique({
                where: {
                    id,
                }
            })

            return existingUser;
        } catch {
            return null;
        }
    }
)


// Function to retrieve a user by email without caching
export const getUserByEmail = async (email: string) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            }
        })

        return existingUser;
    } catch {
        return null;
    }
}


// Function to retrieve a user by ID without caching
export const getUserById = async (id: string) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                id,
            }
        })

        return existingUser;
    } catch {
        return null;
    }
}