import type { EmailOptions } from "@/@types/models/Email";

const sendEmail = async (emailOptions: EmailOptions): Promise<Response> => {
  const response = await fetch("/api/sendEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailOptions),
  });

  return response;
};

export default sendEmail;
