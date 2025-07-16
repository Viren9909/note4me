import connectDatabase from "@/lib/dbConfig";
import UserModel from "@/model/User";
import { z } from "zod"
import { userNameValidation } from '@/schemas/signUpSchema'

const usernameQuerySchema = z.object({
    username: userNameValidation
})

export async function GET(request: Request) {

    await connectDatabase();
    try {

        const { searchParams } = new URL(request.url)
        const queryUsername = {
            username: searchParams.get("username")
        }

        const result = usernameQuerySchema.safeParse(queryUsername)

        if (!result.success) {
            const usenameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usenameError.length > 0 ? usenameError.join(', ') : "Username is not valid"
            }, { status: 400 })
        }

        const username = result.data.username

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already taken"
            }, { status: 409 })
        }
        return Response.json({
            success: true,
            message: "Username available"
        }, { status: 200 })

    } catch (error) {
        console.error("Error while checking username: ", error)
        return Response.json({
            success: false,
            message: "Error while checking username"
        }, { status: 500 })
    }
}