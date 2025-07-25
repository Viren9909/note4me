import { NextRequest, NextResponse } from 'next/server';
import connectDatabase from "@/lib/dbConfig";
import UserModel from "@/model/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { messageid: string } }
) {
    const messageId = params.messageid;
    await connectDatabase();

    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({
                success: false,
                message: "Not authorized",
            }, { status: 401 });
        }

        const user: User = session.user as User;
        const userId = new mongoose.Types.ObjectId(user._id);

        const result = await UserModel.updateOne(
            { _id: userId },
            { $pull: { messages: { _id: messageId } } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                message: "Message not found or already deleted.",
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Message deleted successfully.",
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting message:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
        }, { status: 500 });
    }
}
