"use client";

import { CalendarSearch,Calendar, Home, Inbox, Search, Settings, LogOut , CalendarRange, Trophy, LandPlot, Dumbbell ,UserRoundPen ,UserRoundCog, ClipboardPlus}  from "lucide-react";

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
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { title } from "process";

// Menu items.
export function AppSidebar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  
  if (!session) {
    return <p>User is not authenticated. Please log in.</p>;
  }

  const items = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Notifications",
      url: "/dashboard/components/student/Notifications",
      icon: Inbox
    },
    {
      title: "Tournaments",
      url: "/dashboard/components/student/TournamentManagement",
      icon: Trophy,
    },
    {
      title: "Fields booking",
      url: "/dashboard/components/student/ReservationSystem",
      icon: LandPlot,
    },
    {
      title: "Profile",
      url: "/dashboard/components/student/Profile",
      icon: UserRoundPen,
    },{
      title:"Create team",
      url:"/dashboard/tournament/team_registration",
      icon: Dumbbell,
    },
    {
      title: "Results",
      url: "/components/HeroSection/Navbare/OngoingTournments",
      icon: CalendarRange,
    },
  ];

  const adminitems = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "System Notifications",
      url: "/dashboard/components/admin/notifications",
      icon: Inbox
    },
    {
      title: "Tournaments",
      url: "/dashboard/components/student/TournamentManagement",
      icon: Trophy,
    },
     {title : "Create a tournament",
      url : "/dashboard/components/organizer/createTournament",
      icon : Calendar
     },
    {
      title: "Profile",
      url: "/dashboard/components/admin/Profile",
      icon: UserRoundPen,
    },{
      title:"User management",
      url:"/dashboard/components/admin/usersManagement",
      icon: UserRoundCog,
    },
    {
      title: "Facility Reports",
      url: "/dashboard/components/admin/reports",
      icon: ClipboardPlus,
    }
  ];

  const organizeritems = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "System Notifications",
      url: "/dashboard/components/organizer/notifications",
      icon: Inbox
    },
    {
      title: "Tournaments",
      url: "/dashboard/components/student/TournamentManagement",
      icon: Trophy,
    },
    {
      title: "Profile",
      url: "/dashboard/components/organizer/Profile",
      icon: UserRoundPen,
    },{
      title:"Facility management",
      url:"/dashboard/components/organizer/FieldManagement",
      icon: LandPlot,
    },
    {
      title: "Facility Reports",
      url: "/dashboard/components/organizer/reports",
      icon: ClipboardPlus,
    }
  ];

  // Determine the items to use based on user role
  let menuItems;
  switch (session.user.role) {
    case "admin":
      menuItems = adminitems;
      break;
    case "organizer":
      menuItems = organizeritems;
      break;
    default:
      menuItems = items;
      break;
  }

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
            <SidebarMenu className="">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="my-2 ">
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center space-x-4 p-3 rounded-md h-full hover:bg-black-200 transition"
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
          onClick={() => signOut()}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-lg font-medium">Logout</span>
        </button>
      </div>
    </Sidebar>
  );
}
