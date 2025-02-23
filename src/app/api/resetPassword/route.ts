import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/Users";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { message: "Email is required", success: false },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return Response.json(
        { message: "No user found with this email", success: false },
        { status: 404 }
      );
    }

    // Generate a new verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15); // OTP expires in 15 minutes

    // Save the verification code and expiry in the database
    user.verifyCode = verificationCode;
    user.verifyCodeExpiresAt = expiryDate;
    await user.save();

    // Send OTP to the user's email
    const emailResponse = await sendVerificationEmail(
      email,
      user.userName,
      verificationCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { message: "Failed to send OTP", success: false },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "OTP sent to your email", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset password:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
