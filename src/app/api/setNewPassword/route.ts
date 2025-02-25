import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/Users";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { newPassword, userId } = await request.json();

    if (!newPassword) {
      return Response.json(
        { message: "New password is required", success: false },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    user.password = hashedPassword;
    await user.save();

    return Response.json(
      { message: "Password updated successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error setting new password:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
