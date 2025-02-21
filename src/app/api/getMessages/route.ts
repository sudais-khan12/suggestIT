import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/Users";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  // Get the session and user
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as User;

  // Check if the user is authenticated
  if (!sessionUser || !sessionUser._id) {
    return Response.json(
      { message: "User not authenticated", success: false },
      { status: 401 }
    );
  }

  try {
    // Convert the user ID to a Mongoose ObjectId
    const userId = new mongoose.Types.ObjectId(sessionUser._id);

    // Aggregation pipeline to get user messages
    const userWithMessages = await UserModel.aggregate([
      {
        $match: {
          _id: userId, // Match the user by ID
        },
      },
      {
        $unwind: {
          path: "$messages",
          preserveNullAndEmptyArrays: true, // Include users with no messages
        },
      },
      {
        $sort: {
          "messages.createdAt": -1, // Sort messages by createdAt in descending order
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: {
              content: "$messages.content",
              createdAt: "$messages.createdAt",
            },
          },
        },
      },
    ]);

    // Check if the user was found
    if (!userWithMessages || userWithMessages.length === 0) {
      return Response.json(
        { message: "User not found or no messages available", success: false },
        { status: 404 }
      );
    }

    // Return the messages
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
