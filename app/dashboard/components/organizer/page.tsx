import React from "react";
import { Trophy, CalendarPlus, Users, UserCog } from "lucide-react";
import DashboardCard from "../DashboardCard"; // Import the card component

const OrganizerDashboard: React.FC = () => {
  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        title="Create Tournament"
        description="Set up and configure new sports tournaments."
        icon={<Trophy size={32} className="text-blue-500" />}
        path="dashboard/components/organizer/createTournament"
      />
      <DashboardCard
        title="Tournament Management"
        description="Manage ongoing and upcoming tournaments."
        icon={<CalendarPlus size={32} className="text-green-500" />}
        path="dashboard/components/organizer/tournaments"
      />
      <DashboardCard
        title="Participant Management"
        description="Manage tournament registrations and participants."
        icon={<Users size={32} className="text-purple-500" />}
        path="dashboard/components/organizer/participants"
      />
      <DashboardCard
        title="Match Scheduling"
        description="Create and manage tournament match schedules."
        icon={<UserCog size={32} className="text-orange-500" />}
        path="dashboard/components/organizer/matchScheduling"
      />
    </div>
  );
};

export default OrganizerDashboard;
