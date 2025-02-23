"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        router.push(`/verify-otp/${email}`); // Redirect to OTP verification page
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      toast.error("An error occurred while requesting a password reset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email to receive an OTP.
          </p>
        </div>
        <div className="space-y-6">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Sending..." : "Send OTP"}
          </Button>
        </div>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Remember your password?{" "}
          <Link
            href="/signin"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
