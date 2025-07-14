import UserModel from "@/model/User";
import connectDatabase from "@/lib/dbConfig";

export async function POST(request: Request) {
    await connectDatabase()

    try {

        const { username, code } = await request.json();

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 400 })
        }

        const isValidCode = user.verifyCode === code
        const isNotExpireCode = new Date(user.verifyCodeExpiry) > new Date()
        if (isValidCode && isNotExpireCode) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "User verified successful"
            }, { status: 200 })
        } else if (!isNotExpireCode) {
            return Response.json({
                success: false,
                message: "Verification code expired. Please SignUp again to get new code."
            }, { status: 400 })
        } else {
            return Response.json({
                success: false,
                message: "Invailid code"
            }, { status: 400 })
        }

    } catch (error) {
        console.error("Error while verifing user")
        return Response.json({
            success: false,
            message: "Error while verifing user"
        }, { status: 500 })
    }
}