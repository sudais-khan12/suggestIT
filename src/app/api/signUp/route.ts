import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/Users";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { name, email, password } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return Response.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    // Check for existing username (verified or unverified)
    const existingUserWithUsername = await UserModel.findOne({
      userName: name,
    });
    if (existingUserWithUsername) {
      return Response.json(
        { message: "Username already taken", success: false },
        { status: 409 }
      );
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return Response.json(
          { message: "User already exists with this email", success: false },
          { status: 409 }
        );
      } else {
        // Update existing unverified user
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 15);

        existingUser.password = hashedPassword;
        existingUser.verifyCode = verificationCode;
        existingUser.verifyCodeExpiresAt = expiryDate;
        existingUser.userName = name;
        existingUser.isVerified = false;
        existingUser.isAcceptingMessages = true;
        existingUser.messages = [];

        await existingUser.save();

        // Send verification email
        const emailResponse = await sendVerificationEmail(
          email,
          name,
          verificationCode
        );

        if (!emailResponse.success) {
          return Response.json(
            { message: "Failed to send verification email", success: false },
            { status: 500 }
          );
        }

        return Response.json(
          {
            message: "Verification email resent. Please verify.",
            success: true,
          },
          { status: 200 }
        );
      }
    }

    // Create new user if no existing record found
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15);

    const newUser = new UserModel({
      userName: name,
      email,
      password: hashedPassword,
      verifyCode: verificationCode,
      isVerified: false,
      verifyCodeExpiresAt: expiryDate,
      isAcceptingMessages: true,
      messages: [],
    });

    await newUser.save();

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      name,
      verificationCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { message: "Failed to send verification email", success: false },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: "User registered successfully. Please verify your email.",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
