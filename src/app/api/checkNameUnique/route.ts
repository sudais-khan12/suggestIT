import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/Users";
import { z } from "zod";
import { nameValidation } from "@/schemas/signUpSchema";

const userNameQuerySchema = z.object({
  userName: nameValidation,
});

export async function GET(req: Request) {
  if (req.method !== "GET") {
    return Response.json(
      {
        message: "Method not allowed",
        success: false,
      },
      { status: 405 }
    );
  }

  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      userName: searchParams.get("userName"),
    };
    const result = userNameQuerySchema.safeParse(queryParam);
    console.log(result); // TODO: remove

    if (!result.success) {
      const errors = result.error.format().userName?._errors || [];

      return Response.json(
        {
          message: errors.join(", "),
          success: false,
        },
        { status: 400 }
      );
    }

    const { userName } = result.data;
    const exsitingVerifiedUser = await UserModel.findOne({
      userName,
      isVerified: true,
    });
    if (exsitingVerifiedUser) {
      return Response.json(
        {
          message: "Username already taken",
          success: false,
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        message: "Username is Unique",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error, "checking user name ");
    return Response.json(
      {
        message: "Error checking username",
        success: false,
      },
      { status: 500 }
    );
  }
}
