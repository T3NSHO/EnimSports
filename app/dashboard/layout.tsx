"use client"
import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar";
import { AppSidebar } from "@/app/components/app-sidebar";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
    <SidebarProvider>
      <div className="w-full flex min-h-screen justify-center items-center">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="h-full flex-1 transition-all duration-300 flex flex-col justify-center items-center">
          <header className="flex p-4 border-b w-full border-gray-200 dark:border-gray-700">
            <SidebarTrigger />
            <h1 className="ml-4 text-xl font-semibold">Dashboard</h1>
          </header>
          <main className="p-6 w-full h-full flex justify-center items-center">{children}</main>
        </div>
      </div>
    </SidebarProvider>
    </SessionProvider>
  );
}
