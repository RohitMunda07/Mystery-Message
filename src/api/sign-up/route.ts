import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/src/lib/connectDB";
import { UserModel } from "../../models/user.modal";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "@/src/helper/sendVerificationEmail";


export default async function POST(request: NextRequest) {
    connectDB();
    try {
        const { username, email, password } = await request.json();

        // ================= Avalilability of Username Check ==========================
        const existingUserVerificationByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerificationByUsername) {
            return NextResponse.json(
                { success: false, message: `${username} already taken` },
                { status: 400 }
            )
        }

        // ================= Verification Code =========================
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const existingUserByEmail = await UserModel.findOne({ email });
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json(
                    { success: false, message: "Email Already Exist" },
                    { status: 400 }
                )
            }
            // email exist but not verified
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
        // Not Exist -> new user
        else {
            // ================= Password Hashing ==========================
            const hashedPassword = await bcrypt.hash(password, 10);

            // ================= Verification Code Expiry ==========================
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            // ================= Creating New User ==========================
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                isVerified: false,
                message: []
            })

            await newUser.save();
        }

        // ================= Send Verification Email ==========================
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        // ================= Verification Email Failed ==========================
        if (!emailResponse.success) {
            return Response.json(
                { success: false, message: emailResponse.message },
                { status: 500 }
            )
        }

        // ================= Verification Email Successfull ==========================
        return Response.json(
            { success: true, message: "User Register Successfully. Please verify your email" },
            { status: 200 }
        )

    } catch (error: any) {
        console.error("Error Registering User", error);
        return NextResponse.json(
            { success: false, message: "Error Registering User" },
            { status: 500 }
        )
    }
}

// const reqBody = await request.json();
// const { username, email, password } = reqBody;
