import React from "react";
import NotificationForm from "./NotificationForm";
import NotificationsTable from "./NotificationsTable";

function Page() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold  text-green-400 text-center mb-8">
          System Notifications Management
        </h1>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Notification Form */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <NotificationForm />
          </div>
          {/* Notifications Table */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <NotificationsTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
