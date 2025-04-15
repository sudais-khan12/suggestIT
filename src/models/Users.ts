import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  _id: string;
  content: string;
  createdAt: Date;
  senderId?: string;
  senderName: string;
}

export interface User extends Document {
  userName: string;
  email: string;
  password: string;
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiresAt: Date;
  isAcceptingMessages: boolean;
  messages: Message[];
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  senderId: {
    type: String,
    required: false,
    default: null,
  },
  senderName: {
    type: String,
    required: true,
    default: "unknown",
  },
});

const UserSchema: Schema<User> = new Schema({
  userName: {
    type: String,
    required: [true, "name is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCode: {
    type: String,
    required: [true, "verifyCode is required"],
  },
  verifyCodeExpiresAt: {
    type: Date,
    required: [true, "verifyCodeExpiresAt is required"],
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
