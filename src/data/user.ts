import { extractErrorMessage } from "@/lib/helpers";
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

            return existingUser; // Return the user if found
        } catch (error) {
            console.error("getCachedUserByEmail Error:", error);
            const message = extractErrorMessage(
                {
                    error,
                    defaultMessage: "Internal Server Error: Unable to fetch user data."
                });
            throw new Error(message);
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

        return existingUser; // Return the user if found
    } catch (error) {
        const message = extractErrorMessage(
            {
                error,
                defaultMessage: "Internal Server Error: Unable to fetch user data."
            });
        throw new Error(message);
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