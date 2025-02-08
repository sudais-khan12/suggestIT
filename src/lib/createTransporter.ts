import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

const createTransporter = (): Transporter => {
  const transporter = nodemailer.createTransport({
    host: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  return transporter;
};

export default createTransporter;
