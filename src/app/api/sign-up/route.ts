import connectDatabase from "@/lib/dbConfig";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {

    await connectDatabase()
    try {
        const { username, email, password } = await request.json();
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already taken."
            }, { status: 400 })
        }
        const existingUserWithSameEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserWithSameEmail) {
            if (existingUserWithSameEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with same email."
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserWithSameEmail.password = hashedPassword
                existingUserWithSameEmail.verifyCode = verifyCode
                existingUserWithSameEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserWithSameEmail.save()
                return Response.json({
                    success: true,
                    message: "User account already exist. Please verify your Email to login."
                }, { status: 200 })
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const verifyCodeExpiry = new Date()
            verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry,
                isAcceptingMessage: true,
                isVerified: false,
                messages: []
            })

            await newUser.save()

        }
        const emailResponse = await sendVerificationEmail(username, email, verifyCode)

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "User registerd successfuly. Please verify your Email."
        })

    } catch (error) {
        console.error("Error while registering user", error)
        return Response.json({
            success: false,
            message: "Error while registering user"
        }, { status: 500 })
    }
}