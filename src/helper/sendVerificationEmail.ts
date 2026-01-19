import { resend } from "../lib/resend";
import VerificationEmailTemplate from "@/emailsTemplates/verificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: '<onboarding@resend.dev>',
            to: email,
            subject: 'Mystry message | Verification Code',
            react: VerificationEmailTemplate({ username, otp: verifyCode }),
        });
        return { success: true, message: "Verification Email sent successfully" }
    } catch (emailError) {
        console.error("Error Sending Verification Email", emailError)
        return { success: false, message: "Failed to send verification email" }
    }
}