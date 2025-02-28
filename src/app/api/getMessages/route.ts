import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Users";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as User;

  if (!sessionUser || !sessionUser._id) {
    return Response.json(
      { message: "User not authenticated", success: false },
      { status: 401 }
    );
  }

  try {
    const userId = new mongoose.Types.ObjectId(sessionUser._id);

    const userWithMessages = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: {
          path: "$messages",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: {
              _id: "$messages._id",
              content: "$messages.content",
              createdAt: "$messages.createdAt",
            },
          },
        },
      },
    ]);

    if (!userWithMessages || userWithMessages.length === 0) {
      return Response.json(
        { message: "User not found or no messages available", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { messages: userWithMessages[0].messages, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to get messages:", error);
    return Response.json(
      { message: "Failed to get messages", success: false },
      { status: 500 }
    );
  }
}
