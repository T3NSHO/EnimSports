import React from "react";
import AdminDashboard from "./components/admin/AdminDashboard"; // Import your component
import StudentDashboard from "./components/student/StudentDashboard";
import OrganizerDashboard from "./components/organizer/page";
const Page = () => {
  return (
    <div>
      <OrganizerDashboard />
    </div>
  );
};

export default Page;
