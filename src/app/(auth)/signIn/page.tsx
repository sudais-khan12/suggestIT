"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signInSchema } from "@/schemas/signInSchema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AxiosError } from "axios";
import { ApiResponse } from "@/@types/models/Email";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { DotPattern } from "@/components/ui/dot-pattern";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        if (result.error.startsWith("not verified:")) {
          const userName = result.error.split(":")[1];
          router.push(`/verify/${userName}?purpose=user verification`);
        } else {
          toast.error(result.error);
        }
      } else {
        toast.success("Sign-in successful");
        router.push("/dashboard");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Error signing In");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in with Google.");
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
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your credentials to access your account
          </p>
        </div>
        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Image
            src="https://www.google.com/favicon.ico"
            alt="Google"
            width={16}
            height={16}
            className="w-4 h-4"
          />
          Sign In with Google
        </Button>
        <div className="flex items-center justify-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700" />
          <span className="px-2 text-sm text-gray-500 dark:text-gray-400">
            OR
          </span>
          <div className="w-full border-t border-gray-300 dark:border-gray-700" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="User Name or Email"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="User Password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a strong and secure password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
              Sign In
            </Button>
          </form>
        </Form>
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            New Here?{" "}
            <Link
              href="/signUp"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Sign Up
            </Link>
          </p>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            <Link
              href="/resetPassword"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Reset Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
