import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    email?: string;
    userName?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      email?: string;
      userName?: string;
    };
  }
  type Session = User & DefaultSession["user"];
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    email?: string;
    userName?: string;
  }
}
