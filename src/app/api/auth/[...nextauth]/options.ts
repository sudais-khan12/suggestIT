// next-auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/Users";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

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

            // Return the user's email along with the error
            throw new Error(`not verified:${user.userName}`);
          }

          return {
            id: user._id?.toString() as unknown as string,
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
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/signin",
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
