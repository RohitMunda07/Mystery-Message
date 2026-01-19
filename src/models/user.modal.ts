import mongoose, { Schema, Document } from "mongoose"

export interface Message extends Document {
    message: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
}, { timestamps: true })

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
    isVerified: boolean;
    message: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        match: [/.+\@\..+/, "Please use a valid email"],
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "VerifyCode is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code Expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    message: [MessageSchema]
}, { timestamps: true })

export const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("UserModel", UserSchema))