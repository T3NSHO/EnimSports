"use client"

import React from "react";
import AdminDashboard from "./components/admin/AdminDashboard"; // Import your component
import StudentDashboard from "./components/student/StudentDashboard";
import OrganizerDashboard from "./components/organizer/page";
import { useSession } from "next-auth/react";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
const Page = () => {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>User is not authenticated. Please log in.</p>;
  }

  console.log(session);


  if (session.user.role === "admin") {
  return (
    <div className="w-full">
      <AdminDashboard />
    </div>
  );
};
  if (session.user.role === "user") {
    return (
      <div className="w-full">
        <StudentDashboard />
      </div>
    );
  }
  if (session.user.role === "organizer") {
    return (
      <div className="w-full">
        <OrganizerDashboard />
      </div>
    );
  }

}

export default Page;
