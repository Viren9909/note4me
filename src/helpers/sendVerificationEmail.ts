import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    username: string,
    email: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Note4me Verification Code.",
            react: VerificationEmail({ username, otp: verifyCode })
        })
        return {
            success: true,
            message: "verification email send successfuly."
        }
    } catch (emailError) {
        console.error("Error while sending Verification Email.")
        return {
            success: false,
            message: "Failed to send verification email."
        }
    }
}