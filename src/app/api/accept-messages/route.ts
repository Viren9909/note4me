import connectDatabase from "@/lib/dbConfig";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";

export async function POST(request: Request) {
    await connectDatabase()
    try {

        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Not Authorize",
            }, { status: 401 })
        }
        const user: User = session?.user as User
        const userId = user._id
        const { acceptMessage } = await request.json()

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: acceptMessage
            },
            {
                new: true
            }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to updated message status."
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "Status updated",
            updatedUser
        }, { status: 200 })

    } catch (error) {
        console.error("Error while updating user messages status.", error)
        return Response.json({
            success: false,
            message: "Error while updating user messages status."
        }, { status: 500 })
    }
}

export async function GET(request: Request) {
    await connectDatabase()
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Not Authorize",
            }, { status: 401 })
        }
        const user: User = session?.user as User
        const userId = user._id

        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage
        }, { status: 200 })

    } catch (error) {
        console.error("Error while fetching user messages status.", error)
        return Response.json({
            success: false,
            message: "Error while fetching user messages status."
        }, { status: 500 })
    }
}