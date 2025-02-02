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


// Schema for credential provider
export const CredentialProviderSchema = z.object({
    // Validate that email is a valid email address.
    email: z.string().email({ message: "Please provide a valid email address" }),

    // Validate that the credential provider secret is at least 25 characters.
    credentialProvderSecret: z.string().min(25, { message: "Credential Provider key is required" }),

    // Validate that the server secret is at least 25 characters.
    serverSecret: z.string().min(25, { message: "Secret key is required" }),

    // For the user field, first run a preprocessing step:
    user: z.preprocess(
        (arg) => {
            // If 'user' is a string, try to convert it to an object using JSON.parse.
            if (typeof arg === "string") {
                try {
                    return JSON.parse(arg);
                } catch {
                    // If parsing fails, return the value as is.
                    return arg;
                }
            }
            // If it's already an object, use it directly.
            return arg;
        },
        // Now validate that the user object has the correct shape.
        z.object({
            // 'id' must be a string.
            id: z.string(),

            // 'name' can be a string or null (optional field).
            name: z.string().nullable(),

            // 'email' must be a string.
            email: z.string(),

            // 'role' must be one of these specific values.
            role: z.enum(["XVARIATE", "CLIENT", "FREELANCER", "AMBASSADOR"]),

            // For 'image', allow null or a string.
            image: z.preprocess(
                (val) => (val === null ? null : val),
                z.string().nullable()
            ),

            // For 'emailVerified', if it's a string, convert it to a Date; allow null.
            emailVerified: z.preprocess(
                (val) => {
                    if (val === null) return null;
                    if (typeof val === "string") {
                        const d = new Date(val);
                        return isNaN(d.getTime()) ? val : d;
                    }
                    return val;
                },
                z.date().nullable()
            ),

            // 'isTwoFactorEnabled' must be a boolean.
            isTwoFactorEnabled: z.boolean(),
        }, { message: "User object is required" })
    ),
});
