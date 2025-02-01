import { Resend } from "resend";
import { VerificationEmailTemplate } from "@/components/email-templates/verificationEmail";
import { TwoFactorEmailTemplate } from "@/components/email-templates/twoFactorEmail";
import { PasswordResetEmailTemplate } from "@/components/email-templates/passwordResetEmail";

// Initialize the Resend API with the provided API key
const resend = new Resend(process.env.RESEND_API_KEY!);
// Get the base URL of the application from environment variables
const domain = process.env.NEXT_PUBLIC_APP_URL;


// Function to send a verification email with a link for email confirmation
// The email includes the recipient's first name and a verification token
export async function sendVerificationEmail(email: string, token: string, firstName: string) {
    const confirmLink = `${domain}/new-verification?token=${token}`;  // Create the verification link

    await resend.emails.send({
        from: "Xvariate <verify@email.xvariate.com>",
        to: email,
        subject: "Confirm your email",
        react: VerificationEmailTemplate({ firstName, token: confirmLink }), // Email content template
    })
}


// Function to send an email with a one-time password (OTP) for two-factor authentication
export async function sendTwoFactorOTPEmail(email: string, otp: string) {
    await resend.emails.send({
        from: "Xvariate <verify@email.xvariate.com>",
        to: email,
        subject: "Two-Factor Authentication",
        react: TwoFactorEmailTemplate({ otp }), // Email content template
    })
}


// Function to send a password reset email with a link to reset the user's password
// The email includes the recipient's first name and a password reset token
export async function sendPasswordResetEmail(email: string, token: string, firstName: string) {
    const resetLink = `${domain}/new-password?token=${token}`;  // Create the password reset link

    await resend.emails.send({
        from: "Xvariate <noreply@email.xvariate.com>",
        to: email,
        subject: "Reset your password",
        react: PasswordResetEmailTemplate({ firstName, resetLink }), // Email content template
    })
}