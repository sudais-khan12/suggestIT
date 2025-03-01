import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Users";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter your email or username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Identifier and password are required.");
        }

        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
          throw new Error("Missing Google OAuth environment variables");
        }

        try {
          // Find user by email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { userName: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email or username.");
          }

          // Check if password is valid
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValidPassword) {
            throw new Error("Invalid password.");
          }

          // Check if user is verified
          if (!user.isVerified) {
            // Generate a new verification code
            const verificationCode = Math.floor(
              100000 + Math.random() * 900000
            ).toString();
            const expiryDate = new Date();
            expiryDate.setMinutes(expiryDate.getMinutes() + 15);

            // Update user with new verification code
            user.verifyCode = verificationCode;
            user.verifyCodeExpiresAt = expiryDate;
            await user.save();

            // Send verification email
            const emailResponse = await sendVerificationEmail(
              user.email,
              user.userName,
              verificationCode
            );

            if (!emailResponse.success) {
              throw new Error("Failed to send verification email.");
            }

            // Return the username along with the error
            throw new Error(`not verified:${user.userName}`);
          }

          return {
            _id: user?._id,
            email: user.email,
            userName: user.userName,
            isVerified: user.isVerified,
            isAcceptingMessages: user.isAcceptingMessages,
          };
        } catch (error: unknown) {
          throw new Error(
            error instanceof Error ? error.message : "Failed to log in."
          );
        }
      },
    }),
    // Add Google Provider
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID || "",
      clientSecret: GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // Ensure cookies are only sent over HTTPS in production
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },

  pages: {
    signIn: "/signIn",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id ? user._id.toString() : undefined;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.email = user.email;
        token.userName = user.userName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id?.toString(),
          isVerified: token.isVerified,
          isAcceptingMessages: token.isAcceptingMessages,
          email: token.email,
          userName: token.userName,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
