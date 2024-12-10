"use client"; // This file will be executed on the client side

import Image from "next/image";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import Navbar from "@/app/components/HeroSection/Navbare/page";
import { FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/app/components/ui/toast";
import { useRouter } from "next/navigation";
import delay from "@/lib/sleep";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  async function Register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const full_name = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const school = formData.get("school") as string;

    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ full_name, email, password, phone, school }),
    });
    if (response.status === 201) {
      toast({
        variant: "success",
        title: "User created successfully",
        description: "You will redirect to the login page",
      });
      delay(1500);
      router.push("/login");
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "User not created succesfully retry again please",
      });
    }
  }
  return (
    <div>
      <Navbar />
      <>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black px-4">
          <div className="relative w-full max-w-lg mt-12">
            <div className="rounded-xl bg-white/10 p-8 shadow-lg backdrop-blur-md transition duration-300 hover:bg-white/20">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">
                  Create Your Account
                </h3>
                <p className="mt-2 text-sm text-gray-300">
                  Join us and start your journey today.
                </p>
              </div>
              <div className="mt-8">
                <form onSubmit={Register}>
                  {/* Full Name Field */}
                  <div className="mb-6">
                    <label
                      htmlFor="full_name"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Full Name
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <input
                        type="text"
                        name="full_name"
                        placeholder="Enter your full name"
                        className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-sm text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-3"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
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

                  {/* Password Field */}
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

                  {/* Phone Number Field */}
                  <div className="mb-6">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Phone Number
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-sm text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-3"
                      />
                    </div>
                  </div>

                  {/* School Field */}
                  <div className="mb-6">
                    <label
                      htmlFor="school"
                      className="block text-sm font-medium text-gray-300"
                    >
                      School
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <input
                        type="text"
                        name="school"
                        placeholder="Enter your school name"
                        className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-sm text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none p-3"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4">
                    <a
                      href="/login"
                      className="inline-flex items-center justify-center rounded-lg bg-gray-700 text-sm text-gray-300 hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none px-4 py-2"
                    >
                      Login
                    </a>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-lg bg-blue-500 text-sm text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none px-4 py-2"
                    >
                      Register
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
