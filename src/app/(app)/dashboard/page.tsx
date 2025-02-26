"use client";

import MessageCard from "@/components/MessageCard";
import Navbar from "@/components/Navbar";
import { Message } from "@/models/Users";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const sampleMessage: Message = {
    _id: "1",
    content: "This is a sample message.",
    createdAt: new Date(),
  };

  const [messages, setMessages] = useState<Message[]>([sampleMessage]);

  const handleMessageDelete = (messageId: string | unknown) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
    toast.success("Message deleted successfully!");
  };

  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageCard
              key={message?._id}
              message={message}
              onMessageDelete={handleMessageDelete}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
