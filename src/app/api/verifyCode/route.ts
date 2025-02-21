import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/Users";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { userName, code } = await req.json();

    if (!userName || !code) {
      return Response.json(
        {
          message: "Username and verification code are required",
          success: false,
        },
        { status: 400 }
      );
    }

    const decodedUserName = decodeURIComponent(userName);

    const user = await UserModel.findOne({ userName: decodedUserName });

    if (!user) {
      return Response.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    const isValidCode = user.verifyCode === code;
    const isCodeExpired = user.verifyCodeExpiresAt < new Date();

    if (!isValidCode) {
      return Response.json(
        {
          message: "Invalid verification code",
          success: false,
        },
        { status: 400 }
      );
    }

    if (isCodeExpired) {
      return Response.json(
        {
          message: "Verification code has expired",
          success: false,
        },
        { status: 400 }
      );
    }

    user.isVerified = true;
    await user.save();

    return Response.json(
      {
        message: "User verified successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json(
      {
        message: "Error verifying user",
        success: false,
      },
      { status: 500 }
    );
  }
}
