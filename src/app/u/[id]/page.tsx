"use client";

import { ApiResponse } from "@/@types/models/Email";
import Navbar from "@/components/Navbar";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RefreshCw } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "next-auth/react";
import { User } from "@/models/Users";

const Page = () => {
  const [isSending, setIsSending] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

  const { data: session, status } = useSession();
  const user: User | undefined = session?.user as User;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const pathname = usePathname();
  const userId = pathname.split("/").pop();

  useEffect(() => {
    getSuggestedMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSending(true);
    try {
      // Check if the recipient ID is valid
      if (!userId) {
        toast.error("Invalid recipient");
        return;
      }

      const response = await axios.post<ApiResponse>(`/api/sendMessage`, {
        userId,
        message: data.content,
        senderId: user?._id || "unknown", // Send "unknown" if user is not authenticated
      });

      toast.success(response.data.message);
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Error sending message");
    } finally {
      setIsSending(false);
    }
  };

  const getSuggestedMessages = async () => {
    // Only allow fetching suggestions if user is authenticated
    if (status !== "authenticated") {
      toast.info("Please sign in to get message suggestions");
      return;
    }

    setIsFetchingSuggestions(true);
    try {
      const response = await axios.post(`/api/suggestMessages`);
      const result = response.data;
      const messages = result.split("||").map((msg: string) => msg.trim());
      setSuggestedMessages(messages);
      toast.success("Suggestions fetched successfully");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Error fetching suggestions"
      );
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    form.setValue("content", suggestion);
  };

  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Send a Message
            </h1>

            {status === "unauthenticated" && (
              <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
                You are sending this message anonymously. Sign in to track your
                messages.
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-white">
                        Your Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here..."
                          {...field}
                          className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                          rows={5}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-600 dark:text-gray-400">
                        Write a meaningful message to the user.
                      </FormDescription>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full sm:w-auto bg-gray-900 hover:bg-gray-700 text-white rounded-lg transition-all duration-300"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </Form>

            {status === "authenticated" && (
              <div className="mt-10">
                <Button
                  onClick={getSuggestedMessages}
                  disabled={isFetchingSuggestions}
                  className="w-full sm:w-auto bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 mb-6"
                >
                  {isFetchingSuggestions ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Fetching Suggestions...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Get Suggested Messages
                    </>
                  )}
                </Button>

                {suggestedMessages.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Suggested Messages
                    </h2>
                    <div className="space-y-3">
                      {suggestedMessages.map((message, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                          onClick={() => handleSuggestionClick(message)}
                        >
                          <p className="text-gray-900 dark:text-white">
                            {message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
