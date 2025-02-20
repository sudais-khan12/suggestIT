import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/Users";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.email },
              { userName: credentials.email }, // Allow login with username
            ],
          });

          if (!user) {
            throw new Error("No user found with this email or username.");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email before logging in.");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error("Invalid password.");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.userName,
          };
        } catch (error: any) {
          throw new Error(error.message || "Failed to log in.");
        }
      },
    }),
  ],

  // Optional: Customize session and JWT settings
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Optional: Customize pages (e.g., sign-in, error pages)
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  // Optional: Callbacks for custom logic
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },

  // Optional: Secret for signing tokens
  secret: process.env.NEXTAUTH_SECRET,
};
