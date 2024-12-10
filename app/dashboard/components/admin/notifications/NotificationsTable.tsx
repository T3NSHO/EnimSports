import React from "react";

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

const NotificationsTable: React.FC = () => {
  return (
    <table className="min-w-full bg-white rounded-lg  dark:bg-gray-700     shadow-md">
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

export default NotificationsTable;
