import connectDatabase from "@/lib/dbConfig";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import mongoose from "mongoose";

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
        const userId = new mongoose.Types.ObjectId(user._id)

        const userWithMessages = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ])

        if (!userWithMessages || userWithMessages.length === 0) {
            return Response.json({
                success: false,
                message: "There is no messages for you.",
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            messages: userWithMessages[0].messages
        }, { status: 200 })

    } catch (error) {
        console.error("Error while fetching messages.", error)
        return Response.json({
            success: false,
            message: "Error while fetching messages."
        }, { status: 500 })
    }
}