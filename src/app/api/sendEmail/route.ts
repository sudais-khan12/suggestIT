import { EmailApiResponse, EmailOptions } from "@/@types/models/Email";
import createTransporter from "@/lib/createTransporter";
import { NextResponse } from "next/server";
interface ErrorResponse {
  error: {
    code: number;
    message: string;
  };
}

const handleErrorResponse = (code: number, message: string): NextResponse => {
  const response: ErrorResponse = {
    error: { code, message },
  };
  return NextResponse.json(response, { status: code });
};

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { to, subject, html, from }: EmailOptions = await request.json();

    if (!to || !subject || !html || !from) {
      return handleErrorResponse(
        400,
        "Missing required fields in the request."
      );
    }

    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    const transporter = createTransporter();
    const { rejected } = await transporter.sendMail(mailOptions);

    if (rejected.length > 0) {
      const rejectedEmails = rejected.join(", ");
      return handleErrorResponse(
        400,
        `The following emails were rejected: ${rejectedEmails}`
      );
    }

    const response: EmailApiResponse = {
      message: "Email sent successfully!",
      success: true,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);

    if (error instanceof Error) {
      return handleErrorResponse(500, error.message);
    }

    return handleErrorResponse(500, "Failed to send email.");
  }
}
