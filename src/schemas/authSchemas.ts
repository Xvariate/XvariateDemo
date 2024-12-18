import { z } from "zod";

// Schema for user sign-up validation
export const SignUpSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name must be less than 50 characters" }),
    email: z
        .string()
        .email({ message: "Please provide a valid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(50, { message: "Password cannot exceed 50 characters" }),
});


// Schema for user sign-in validation
export const SignInSchema = z.object({
    email: z
        .string()
        .email({ message: "Please provide a valid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
    code: z.optional(z.string()),
});


// Extended schema for server-side sign-in validation
export const SignInServerSchema = SignInSchema.extend({
    // Add a 'secret' field to the existing SignInSchema
    serverSecret: z.string().min(25, { message: "Secret key is required" }),
});