"use client";

import React, { useState, useEffect } from "react";

// Notification Form Component
const NotificationForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All Users");

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/send_notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          message,
          audience,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }

      console.log("Notification sent successfully");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
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

// Notifications Table Component
const NotificationsTable: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/get_notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        console.log("Fetched notifications:", data);
        setNotifications(data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <p className="text-white">Loading notifications...</p>;
  }

  return (
    <table className="w-full bg-white rounded-lg dark:bg-gray-700 shadow-md">
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
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <tr key={notification._id}>
              <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                {notification.title || "N/A"}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                {notification.audience || "N/A"}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                {new Date(notification.date).toLocaleString() || "N/A"}
              </td>
              <td
                className={`px-6 py-4 ${
                  notification.status === "Delivered"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {notification.status || "N/A"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={4}
              className="px-6 py-4 text-gray-900 dark:text-gray-100 text-center"
            >
              No notifications available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

// Notifications Page Component
const NotificationsPage: React.FC = () => {
  return (
    <div className="h-full w-full bg-gray-900 text-white flex items-center justify-center p-6">
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
          <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg">
            <NotificationsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
