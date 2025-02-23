"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, use } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Params {
  username: string;
}

interface VerifyPageProps {
  params: Params;
}

const VerifyPage = ({ params }: VerifyPageProps) => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { username } = use<Params>(params);

  // Load timer from localStorage on page load
  useEffect(() => {
    const storedStartTime = localStorage.getItem("verificationStartTime");
    if (storedStartTime) {
      const startTime = parseInt(storedStartTime, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      const elapsedTime = currentTime - startTime;
      const remainingTime = Math.max(15 * 60 - elapsedTime, 0); // 15 minutes in seconds
      setTimeLeft(remainingTime);

      if (remainingTime > 0) {
        const timerInterval = setInterval(() => {
          setTimeLeft((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(timerInterval);
      }
    } else {
      // Set the start time in localStorage if not already set
      const startTime = Math.floor(Date.now() / 1000);
      localStorage.setItem("verificationStartTime", startTime.toString());
      setTimeLeft(15 * 60); // 15 minutes in seconds

      const timerInterval = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0));
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, []);

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
      const response = await fetch("/api/verifyCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username,
          code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        localStorage.removeItem("verificationStartTime");
        router.push("/dashboard");
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

  // Format time left as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
          {timeLeft > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Time remaining: {formatTime(timeLeft)}
            </p>
          )}
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
          disabled={isSubmitting || timeLeft === 0}
          className="w-full"
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </Button>
        {timeLeft === 0 && (
          <p className="text-sm text-center text-red-500 dark:text-red-400">
            The verification code has expired. Please request a new one.
          </p>
        )}
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
