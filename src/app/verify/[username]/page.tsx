"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface VerifyPageProps {
  params: {
    username: string;
  };
}

const VerifyPage = ({ params }: VerifyPageProps) => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill("")); // Array to store OTP digits
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null)); // Refs for each input box
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to the previous box if the current box is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6); // Get first 6 digits
    const newOtp = [...otp];

    pasteData.split("").forEach((char, index) => {
      if (/^\d*$/.test(char)) {
        newOtp[index] = char;
      }
    });

    setOtp(newOtp);
  };

  // Handle OTP verification
  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: params.username,
          code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        router.push("/signin"); // Redirect to sign-in page after successful verification
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("An error occurred while verifying your account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Verify Your Account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter the 6-digit verification code sent to your email
          </p>
        </div>
        <div className="flex justify-center space-x-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Input
              key={index}
              type="text"
              maxLength={1}
              value={otp[index]}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handleOtpPaste : undefined} // Allow paste only in the first box
              ref={(el) => (inputRefs.current[index] = el as HTMLInputElement)}
              className="w-12 h-12 text-center text-lg"
            />
          ))}
        </div>
        <Button
          onClick={handleVerify}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </Button>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Did not receive a code?{" "}
          <Link
            href="/resend-verification"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Resend Code
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyPage;
