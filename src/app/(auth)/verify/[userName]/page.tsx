"use client";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/@types/models/Email";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const VerifyAccount = () => {
  const router = useRouter();
  const param = useParams<{ userName: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/verifyCode", {
        userName: param.userName,
        code: data.code,
      });
      toast.success(response.data.message);
      router.replace("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Error verifying code");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    const values = form.getValues("code").split("");
    values[index] = value;
    form.setValue("code", values.join(""));

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (
      event.key === "Backspace" &&
      !form.getValues("code").split("")[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-between space-x-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          maxLength={1}
                          value={form.getValues("code").split("")[index] || ""}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          ref={(el) => (inputsRef.current[index] = el)}
                          className="text-center"
                          inputMode="numeric"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
              Verify
            </Button>
          </form>
        </Form>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Did not receive the code?{" "}
          <Link
            href="/resendCode"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Resend
          </Link>
        </p>
      </div>
    </div>
  );
};
export default VerifyAccount;
