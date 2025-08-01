import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
	content: string,
	createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
	content: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	}
})

export interface User extends Document {
	username: string,
	email: string,
	password: string,
	verifyCode: string,
	verifyCodeExpiry: Date,
	isAcceptingMessage: boolean,
	isVerified: boolean,
	messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
	username: {
		type: String,
		required: [true, "User name required."],
		trim: true,
		unique: true
	},
	email: {
		type: String,
		unique: true,
		required: [true, "Email name required."],
		match: [/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, "Please enter valid email."]
	},
	password: {
		type: String,
		required: true,
	},
	verifyCode: {
		type: String,
		required: [true, "Verify code name required."]
	},
	verifyCodeExpiry: {
		type: Date,
		required: [true, "Verify code expiry name required."]
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	isAcceptingMessage: {
		type: Boolean,
		default: true
	},
	messages: [MessageSchema]
})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema)

export default UserModel