"use client";
import { Card, CardHeader } from "@/components/ui/card";
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
import { formatDistanceToNow } from "date-fns";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDelete = async () => {
    const response = await axios.delete<ApiResponse>("/api/deleteMessage", {
      data: { messageId: message._id },
    });
    if (response.data.success) {
      onMessageDelete(message._id);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  const createdAtDate = message.createdAt ? new Date(message.createdAt) : null;
  const timeAgo = createdAtDate
    ? formatDistanceToNow(createdAtDate, { addSuffix: true })
    : "Invalid date";

  return (
    <Card className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between p-4 gap-4">
        <div className="flex-1 space-y-2">
          <p className="text-gray-900 dark:text-white text-sm sm:text-base">
            {message.content}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="text-gray-600 dark:text-gray-400">{timeAgo}</span>
            {message.senderName && (
              <>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="text-gray-600 dark:text-gray-400">
                  by{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {message.senderName}
                  </span>
                </span>
              </>
            )}
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
            >
              <X className="w-3 h-3" />
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
    </Card>
  );
};

export default MessageCard;
