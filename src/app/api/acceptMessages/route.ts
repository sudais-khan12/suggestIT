// accept messages
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Users";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!user) {
    return Response.json(
      { message: "User not authenticated", success: false },
      { status: 401 }
    );
  }

  try {
    const userId = user?._id;
    const { isAcceptingMessages } = await req.json();

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { isAcceptingMessages: isAcceptingMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: `Messages Accepted ${isAcceptingMessages ? "Enabled" : "Disabled"}`,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting messages:", error);
    return Response.json(
      { message: "Error accepting messages", success: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!user) {
    return Response.json(
      { message: "User not authenticated", success: false },
      { status: 401 }
    );
  }

  try {
    const userId = user?._id;

    const foundUser = await UserModel.findOne({ _id: userId });

    if (!foundUser) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { isAcceptingMessages: foundUser.isAcceptingMessages, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Getting User:", error);
    return Response.json(
      { message: "Error Getting User", success: false },
      { status: 500 }
    );
  }
}
