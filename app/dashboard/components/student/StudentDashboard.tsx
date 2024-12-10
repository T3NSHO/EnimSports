import React from "react";
import {
  Bell,
  User2,
  Medal,
  Calendar,
  ChartPie,
  MessageCircle,
  Clock,
} from "lucide-react";
import DashboardCard from "../DashboardCard";

function StudentDashboard() {
  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        title="Profile"
        description="Manage your personal information."
        icon={<User2 size={32} className="text-yellow-500" />}
        path="dashboard/components/admin/Profile"
      />

      <DashboardCard
        title="Tournament Management"
        description="Overview of upcoming and ongoing tournaments."
        icon={<Medal size={32} className="text-green-500" />}
        path="dashboard/components/student/TournamentManagement"
      />

      <DashboardCard
        title="Reservation System"
        description="Book sports facilities and view real-time availability."
        icon={<Calendar size={32} className="text-blue-500 " />}
        path="dashboard/components/student/ReservationSystem"
      />

      <DashboardCard
        title="Notifications"
        description="Alerts for upcoming events and announcements."
        iconColor="text-red-500"
        icon={<Bell size={32} className="text-red-500" />}
        path="dashboard/components/student/Notifications"
      />

      <DashboardCard
        title=" Gym Timetable Overview"
        description="View opening hours and calendar for gym."
        icon={<Clock size={32} className="text-purple-500" />}
        path="dashboard/components/student/GymTimeTable"
      />
      <DashboardCard
        title=" roles and policies "
        description="Roles and Policies of the Platform and School"
        icon={<MessageCircle size={32} className="text-pink-500" />}
        path="dashboard/components/student/RolesAndPolicies "
      />
    </div>
  );
}

export default StudentDashboard;
