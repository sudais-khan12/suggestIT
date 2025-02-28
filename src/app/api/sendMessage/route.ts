import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Users";
import { Message } from "@/models/Users";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { userId, message } = await request.json();

    if (!userId || !message) {
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

    if (!user.isAcceptingMessages) {
      return Response.json(
        { message: "User not Accepting Messages", success: false },
        { status: 400 }
      );
    }

    const newMessage = {
      content: message,
      createdAt: new Date(),
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
