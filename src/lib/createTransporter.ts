import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

const createTransporter = (): Transporter => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    logger: true,
  });

  return transporter;
};

export default createTransporter;
