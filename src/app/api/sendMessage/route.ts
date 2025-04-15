import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Users";
import { Message } from "@/models/Users";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { userId, message, senderId } = await request.json();

    if (!userId || !message || !senderId) {
      return Response.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    if (senderId === userId) {
      return Response.json(
        { message: "You cannot send a message to yourself", success: false },
        { status: 400 }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        { message: "User not Accepting Messages", success: false },
        { status: 400 }
      );
    }

    // Initialize senderName as "unknown" by default
    let senderName = "unknown";

    // If senderId is not "unknown", look up the sender's name
    if (senderId !== "unknown") {
      const sender = await UserModel.findOne({ _id: senderId }).select(
        "userName"
      );
      if (sender) {
        senderName = sender.userName;
      }
    }

    const newMessage = {
      content: message,
      createdAt: new Date(),
      senderId: senderId,
      senderName: senderName, // Now we're saving the name directly
    };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { message: "Message sent successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json(
      { message: "Error sending message", success: false },
      { status: 500 }
    );
  }
}
