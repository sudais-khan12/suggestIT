"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { setPasswordSchema } from "@/schemas/setPasswordSchema";
import { ApiResponse } from "@/@types/models/Email";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DotPattern } from "@/components/ui/dot-pattern";
import Link from "next/link";

const SetNewPasswordPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof setPasswordSchema>) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("/api/setNewPassword", {
        userId,
        newPassword: data.password,
      });
      toast.success(response.data.message);
      router.push("/signIn");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Error Resetting Password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <DotPattern className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-5 flex justify-center items-center">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(255,255,255,0.7)_70%)] backdrop-blur-sm dark:bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(0,0,0,0.7)_70%)]"
          style={{
            mask: "radial-gradient(circle at center, transparent 30%, black 70%)",
            WebkitMask:
              "radial-gradient(circle at center, transparent 30%, black 70%)",
          }}
        ></div>
      </div>
      <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Set New Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter a new password for your account.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter Your Password"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
              Update Password
            </Button>
          </form>
        </Form>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Ohh i just remember{" "}
          <Link
            href="/signIn"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SetNewPasswordPage;
