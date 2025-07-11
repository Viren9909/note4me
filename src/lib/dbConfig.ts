import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number
}

const connection: connectionObject = {}

async function connectDatabase(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected")
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        connection.isConnected = db.connections[0].readyState
        console.log("Database connected successfuly.")

    } catch (error) {
        console.log("Database connection failed.", error)
        process.exit(1)
    }
}

export default connectDatabase