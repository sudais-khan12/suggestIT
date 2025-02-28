// api route for delete a message
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/models/Users";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function DELETE(req: Request) {
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
    const { messageId } = await req.json();

    if (!messageId) {
      return Response.json(
        { message: "Message ID is required", success: false },
        { status: 400 }
      );
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Message deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { message: "Error deleting message", success: false },
      { status: 500 }
    );
  }
}
