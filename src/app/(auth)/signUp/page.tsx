"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/@types/models/Email";
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
import { Loader2 } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";

const Page = () => {
  const [name, setName] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setName, 300);
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkNameUnique = async () => {
      if (name && form.formState.dirtyFields.name) {
        setIsCheckingName(true);
        setNameMessage("");
        try {
          const response = await axios.get(
            `/api/checkNameUnique?userName=${name}`
          );
          setNameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setNameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingName(false);
        }
      }
    };

    checkNameUnique();
  }, [name, form.formState.dirtyFields.name]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signUp", data);
      toast.success(response.data.message);
      router.replace(`/verify/${name}?purpose=user verification`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Error signing up");
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
            Create your account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sign up to get started
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="User Name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {isCheckingName && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <span
                      className={`text-sm ${nameMessage === "Username is Unique" ? "text-green-500" : "text-red-500"}`}
                    >
                      {nameMessage}
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="User Email" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be used for account verification and
                    communication.
                  </FormDescription>
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
            <Button
              type="submit"
              disabled={isCheckingName || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
              Sign Up
            </Button>
          </form>
        </Form>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
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

export default Page;
