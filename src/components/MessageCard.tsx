"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/Users";
import axios from "axios";
import { ApiResponse } from "@/@types/models/Email";
import { toast } from "sonner";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string | unknown) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDelete = async () => {
    const response = await axios.delete<ApiResponse>(
      "/api/messages/" + message._id
    );
    if (response.data.success) {
      onMessageDelete(message?._id);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <Card className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-lg shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {message.content}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(message.createdAt).toLocaleString()}
          </CardDescription>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900 dark:text-white">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                This action cannot be undone. This will permanently delete this
                message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-100/50 dark:bg-gray-700/50 hover:bg-gray-200/50 dark:hover:bg-gray-600/50">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500/90 hover:bg-red-600/90 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-gray-700 dark:text-gray-300">{message.content}</p>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
