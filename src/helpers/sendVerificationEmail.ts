import createTransporter from "@/lib/createTransporter";
import { EmailVerification } from "@/emails/EmailVerification";
import { ApiResponse, EmailOptions } from "@/@types/models/Email";
import { render } from "@react-email/components";
import React from "react";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    const transporter = createTransporter();
    const emailHtml = await render(
      React.createElement(EmailVerification, { username, verificationCode })
    );

    const mailOptions: EmailOptions = {
      to: email,
      subject: "Email Verification",
      html: emailHtml,
      from: "sudaiskh31@gmail.com",
    };

    const info = await transporter.sendMail(mailOptions);

    if (info.accepted.includes(email)) {
      return {
        message: "Email sent successfully",
        success: true,
        isAcceptingMessages: true,
      };
    } else {
      throw new Error("Email rejected by server");
    }
  } catch (emailError) {
    console.error("Email sending error:", emailError);
    return {
      message: "Error sending email",
      success: false,
    };
  }
}
