"use client";

import { Calendar, Home, Inbox, Search, Settings, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* Application Name */}
          <SidebarGroupLabel className="my-4">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-white to-yellow-400 text-transparent bg-clip-text">
              EnimSports
            </h1>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="my-4">
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center space-x-4 p-3 rounded-md hover:bg-black-200 transition"
                    >
                      <item.icon className="w-8 h-8" />
                      <span className="text-lg font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-0 w-full">
        <button
          className="flex items-center space-x-4 p-3 rounded-md hover:bg-red-100 text-red-600 transition w-full"
          onClick={() => console.log("Logging out...")}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-lg font-medium">Logout</span>
        </button>
      </div>
    </Sidebar>
  );
}
