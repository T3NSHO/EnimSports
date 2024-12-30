"use client";

import React, { useState } from "react";

const NotificationForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All Users");

  const handleSubmit = () => {
    console.log("Sending notification:", { title, message, audience });
  };

  return (
    <form className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Send Notification
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300">Title</label>
        <input
          placeholder="next game"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300">Message</label>
        <textarea
          value={message}
          placeholder="next game will starts at ..."
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300">Audience</label>
        <select
          title="reciver"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="All Users">All Users</option>
          <option value="Students">Students</option>
          <option value="Organizers">Organizers</option>
        </select>
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="flex items-center gap-2 px-5 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/25"
      >
        Send Notification
      </button>
    </form>
  );
};

const NotificationsTable: React.FC = () => {
  const notifications = [
    {
      title: "Event Reminder",
      audience: "Students",
      date: "2024-11-20",
      status: "Delivered",
    },
    {
      title: "System Maintenance",
      audience: "All Users",
      date: "2024-11-19",
      status: "Failed",
    },
  ];

  return (
    <table className="min-w-full bg-white rounded-lg dark:bg-gray-700 shadow-md">
      <thead>
        <tr>
          <th className="text-left px-6 py-3 text-gray-900 dark:text-green-400">
            Title
          </th>
          <th className="text-left px-6 py-3 text-gray-900 dark:text-green-400">
            Audience
          </th>
          <th className="text-left px-6 py-3 text-gray-900 dark:text-green-400">
            Date
          </th>
          <th className="text-left px-6 py-3 text-gray-900 dark:text-green-400">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {notifications.map((notification, index) => (
          <tr key={index}>
            <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
              {notification.title}
            </td>
            <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
              {notification.audience}
            </td>
            <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
              {notification.date}
            </td>
            <td
              className={`px-6 py-4 ${
                notification.status === "Delivered"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {notification.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const NotificationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-green-400 text-center mb-8">
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
};

export default NotificationsPage;
