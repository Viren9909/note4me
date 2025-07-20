import { NextAuthOptions } from "next-auth";
import UserModel from "@/model/User";
import Credentials from "next-auth/providers/credentials";
import connectDatabase from "@/lib/dbConfig";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            id: "credentials",
            name: "Credential",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials: any): Promise<any> => {
                await connectDatabase();
                try {
                    if (!credentials) {
                        throw new Error("Provide credentials")
                    }
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error("User not found.")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your Email first.")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect password.")
                    }
                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isAcceptingMessage = user.isAcceptingMessage
                token.isVerified = user.isVerified
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user = {
                    ...session.user,
                    _id: token._id as string,
                    isAcceptingMessage: token.isAcceptingMessage as boolean,
                    isVerified: token.isVerified as boolean,
                    username: token.username as string
                }
            }
            return session
        },
    },

    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}