export type EmailServiceProvider = "Gmail" | "Outlook" | "Imap";

export type EmailStatus = {
  id: string;
  associated_customer: string;
  sent_email: string;
  type: "Introduction" | "Update";
  status: boolean;
};

export type EmailStatusId = Pick<EmailStatus, "id">;
export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from: string;
}

export interface EmailApiResponse {
  message: string;
  messageId: string;
}
