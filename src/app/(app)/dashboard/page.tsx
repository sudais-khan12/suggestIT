"use client";

import { ApiResponse } from "@/@types/models/Email";
import MessageCard from "@/components/MessageCard";
import Navbar from "@/components/Navbar";
import { Message } from "@/models/Users";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCw } from "lucide-react";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false); // State for clipboard icon
  const router = useRouter();

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
    fetchMessages(true);
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/acceptMessages");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      console.error("Error fetching accept messages:", error);
      toast.error("Error fetching accept messages");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/getMessages");
        setMessages(response.data.messages ?? []);

        if (refresh) {
          fetchAcceptMessage();
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Error fetching messages");
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setMessages, setIsLoading, setIsSwitchLoading, fetchAcceptMessage]
  );

  useEffect(() => {
    if (!session || !session.user) {
      toast.error("Please sign in to access your dashboard.");
      return;
    }

    fetchMessages();
    fetchAcceptMessage();
  }, [fetchMessages, session, setValue, fetchAcceptMessage, router]);

  const handleSwitchChange = async () => {
    try {
      const newAcceptMessages = !acceptMessages;
      const response = await axios.post<ApiResponse>("/api/acceptMessages", {
        isAcceptingMessages: newAcceptMessages,
      });
      setValue("acceptMessages", newAcceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error updating accept message:", error);
      toast.error("Error updating accept message");
    }
  };

  const userId = session?.user?._id;

  if (!session || !session.user) {
    return null;
  }

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${userId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopied(true); // Set copied state to true
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000); // Revert to clipboard icon after 2 seconds
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Error copying to clipboard");
    }
  };

  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              User Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your messages and settings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Updated Profile URL Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Profile URL
              </h2>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="flex-1 bg-gray-100 dark:bg-gray-700 pr-10" // Add padding for the icon
                />
                <div
                  className="relative -ml-8 cursor-pointer" // Position the icon inside the input
                  onClick={copyToClipboard}
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-500" /> // Show tick icon when copied
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" /> // Show clipboard icon
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Accept Messages
              </h2>
              <div className="flex items-center gap-2">
                <Switch
                  {...register("acceptMessages")}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {acceptMessages ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Messages
            </h2>
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <MessageCard
                    key={message._id || `message-${index}`} // Fallback to index if _id is not available
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No messages found.
                </p>
              )}
            </div>
            <Button
              onClick={() => fetchMessages(true)}
              className="mt-4 w-full md:w-auto"
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh Messages
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
