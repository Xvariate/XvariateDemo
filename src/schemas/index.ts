// Purpose: Centralizes and cleans up imports for all schema-related files.
// This allows importing schemas from a single location instead of referencing individual files.

// Example Usage:
// Instead of:
// import { loginSchema } from "@/schemas/authSchemas";
// Use:
// import { loginSchema } from "@/schemas";
export * from "@/schemas/authSchemas";