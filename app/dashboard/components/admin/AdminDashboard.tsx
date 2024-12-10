"use client"; // Mark this component as a client component
import React from "react";
import { UserCog, BarChart, Bell, User2 } from "lucide-react";
import DashboardCard from "../DashboardCard"; // Import the card component

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        title="User Management"
        description="Manage users, roles, and access controls."
        icon={<UserCog size={32} className="text-blue-500" />}
        path="dashboard/components/admin/usersManagment"
      />
      <DashboardCard
        title="Facility Utilization Reports"
        description="View reports and statistics on field usage."
        icon={<BarChart size={32} className="text-green-500" />}
        path="dashboard/components/admin/reports"
      />
      <DashboardCard
        title="System Notifications"
        description="Manage system notifications and logs."
        icon={<Bell size={32} className="text-yellow-500" />}
        path="dashboard/components/admin/notifications"
      />
      <DashboardCard
        title="Profile"
        description=" personal information."
        icon={<User2 size={32} className="text-yellow-500" />}
        path="dashboard/components/admin/Profile
        "
      />
    </div>
  );
};

export default AdminDashboard;
