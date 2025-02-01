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
    userRole: z.string({ message: "User role is required" }),
});


// Schema for user log-in validation
export const LogInSchema = z.object({
    email: z
        .string()
        .email({ message: "Please provide a valid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
    otp: z.optional(z.string({ message: "OTP is required" })),
});


// Schema for passwordless login
export const NewVerificationLoginSchema = z.object({
    email: z
        .string()
        .email({ message: "Please provide a valid email address" }),
    newVerificationSecret: z.string().min(25, { message: "New-Verification key is required" }),
    serverSecret: z.string().min(25, { message: "Secret key is required" }),
});

// Extended schema for server-side log-in validation
export const LogInServerSchema = LogInSchema.extend({
    // Add a 'secret' field to the existing LogInSchema
    serverSecret: z.string().min(25, { message: "Secret key is required" }),
});

// Oauth server action schema
export const OAuthActionSchema = z.object({
    provider: z.string(),
    userRole: z.string()
});


export const ResetSchema = z.object({
    email: z
        .string()
        .email({ message: "Please provide a valid email address" }),
})


export const NewPasswordSchema = z
    .object({
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters long" }),
        confirmPassword: z
            .string()
            .min(6, { message: "Password must be at least 6 characters long" }),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: "Passwords must match",
            path: ["confirmPassword"], // field that gets the error message
        }
    );