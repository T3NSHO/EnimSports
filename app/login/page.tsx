"use client";

import Image from "next/image";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import Navbar from "@/app/components/HeroSection/Navbare/page";
import { useFormState } from "react-dom";
import { FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/app/components/ui/toast";
import { useRouter } from "next/navigation";
import delay from "@/lib/sleep";

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();
  async function Login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!response) {
        throw new Error("Email and password are required");
      }
      console.log(response.status);
      if (response.status == 200) {
        console.log("hit");
        toast({
          variant: "success",
          title: "Logged in successfully",
        });
        await delay(1500);
        router.push("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "The email or password you entered is incorrect.",
        });
      }
    } catch (error) {
      console.log(error);
      alert("Failed to login");
    }
  }
  return (
    <div>
      <Navbar />
      <>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black px-4">
          <div className="relative mt-12 w-full max-w-lg">
            <div className="rounded-xl bg-white/10 p-8 shadow-lg backdrop-blur-md transition duration-300 hover:bg-white/20">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">Welcome Back!</h3>
                <p className="mt-2 text-sm text-gray-300">
                  Enter your credentials to access your account.
                </p>
              </div>
              <div className="mt-8">
                <form onSubmit={Login}>
                  {/* Email Input */}
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Email
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-sm text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-3"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Password
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-sm text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-3"
                      />
                    </div>
                  </div>

                  {/* Remember Me + Forgot Password */}
                  <div className="flex items-center justify-between mb-6">
                    <label className="flex items-center text-sm text-gray-400">
                      <input
                        type="checkbox"
                        name="remember"
                        className="mr-2 h-4 w-4 rounded border-gray-500 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                      Remember Me
                    </label>
                    <a
                      href="/forgot-password"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-4">
                    <a
                      href="/register"
                      className="inline-flex items-center justify-center rounded-lg bg-gray-700 text-sm text-gray-300 hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none px-4 py-2"
                    >
                      Register
                    </a>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-lg bg-blue-500 text-sm text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none px-4 py-2"
                    >
                      Log In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
