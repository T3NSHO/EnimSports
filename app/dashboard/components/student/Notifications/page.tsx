"use client";
import React, { useState, useMemo } from "react";
import {
  Eye,
  Bell,
  CheckCircle,
  X,
  SortAsc,
  SortDesc,
  Filter,
  Clock,
} from "lucide-react";

const StudentNotifications = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [readNotifications, setReadNotifications] = useState([]);
  const [sortField, setSortField] = useState("time");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterRead, setFilterRead] = useState("all");

  const notifications = [
    {
      key: 1,
      message:
        "Your football field reservation for the date 10-12-2024 has been saved successfully.",
      read: false,
      sender: "Ahmed Ben Ali",
      senderProfile: {
        src: `https://ui-avatars.com/api/?name=Ahmed+Ben+Ali&background=random`,
      },
      time: "2024-01-15T10:30:00Z",
      details:
        "Your reservation for the football field on 10-12-2024 at 5 PM has been confirmed. Please ensure to arrive 15 minutes before the match time.",
    },
    {
      key: 2,
      message:
        "Your reservation for the basketball court on 12-12-2024 has been confirmed.",
      read: false,
      sender: "Sara El Fassi",
      senderProfile: {
        src: `https://ui-avatars.com/api/?name=Sara+El+Fassi&background=random`,
      },
      time: "2024-01-16T09:00:00Z",
      details:
        "Your reservation for the basketball court on 12-12-2024 at 3 PM is confirmed. Please be there 15 minutes earlier to prepare for the game.",
    },
    {
      key: 3,
      message:
        "The registration for the volleyball tournament is now open. Register your team by January 20, 2024.",
      read: false,
      sender: "Mohamed Oukal",
      senderProfile: {
        src: `https://ui-avatars.com/api/?name=Mohamed+Oukal&background=random`,
      },
      time: "2024-01-16T11:30:00Z",
      details:
        "The volleyball tournament registration is now open. Please ensure to register your team before January 20, 2024, to participate.",
    },
    {
      key: 4,
      message:
        "Your reservation for the tennis court on 15-12-2024 has been successfully confirmed.",
      read: false,
      sender: "Imane Boudali",
      senderProfile: {
        src: `https://ui-avatars.com/api/?name=Imane+Boudali&background=random`,
      },
      time: "2024-01-17T10:00:00Z",
      details:
        "Your reservation for the tennis court on 15-12-2024 at 9 AM has been confirmed. Please arrive 15 minutes before the match.",
    },
    {
      key: 5,
      message:
        "Reminder: The basketball tournament registration ends in 3 days. Don't miss out!",
      read: false,
      sender: "Laila Amine",
      senderProfile: {
        src: `https://ui-avatars.com/api/?name=Laila+Amine&background=random`,
      },
      time: "2024-01-18T08:00:00Z",
      details:
        "The registration for the basketball tournament ends on January 21st. Make sure to register your team before the deadline!",
    },
  ];

  // Sorting and Filtering Logic
  const processedNotifications = useMemo(() => {
    let filteredNotifs = notifications;

    // Filter by read status
    if (filterRead === "unread") {
      filteredNotifs = filteredNotifs.filter(
        (n) => !n.read && !readNotifications.includes(n.key)
      );
    } else if (filterRead === "read") {
      filteredNotifs = filteredNotifs.filter(
        (n) => n.read || readNotifications.includes(n.key)
      );
    }

    // Sort notifications
    return [...filteredNotifs].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "time":
          comparison = new Date(b.time).getTime() - new Date(a.time).getTime();
          break;
        case "sender":
          comparison = a.sender.localeCompare(b.sender);
          break;
        case "message":
          comparison = a.message.localeCompare(b.message);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === "desc" ? comparison : -comparison;
    });
  }, [sortField, sortDirection, filterRead, readNotifications]);

  const handleSeeDetails = (notification) => {
    setSelectedNotification(notification);
  };

  const handleMarkAsRead = (notificationKey) => {
    setReadNotifications((prev) => [...prev, notificationKey]);
  };

  const handleCloseDetails = () => {
    setSelectedNotification(null);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      // If sorting by a new field, default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gradient-to-br rounded-md from-gray-900 to-gray-800 text-gray-100 min-h-screen font-sans">
      <h1 className="text-3xl md:text-4xl mb-8 text-white font-extrabold tracking-tight">
        Welcome Back, Oualid
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Notifications Column */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-400 flex items-center">
              <Bell className="mr-3 text-blue-400 w-7 h-7" />
              Notifications
            </h2>

            {/* Sorting and Filtering Controls */}
            <div className="flex items-center space-x-2">
              {/* Sort Dropdown */}
              <div className="relative group">
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => toggleSort("time")}
                >
                  {sortField === "time" && sortDirection === "desc" ? (
                    <SortDesc className="w-5 h-5" />
                  ) : (
                    <SortAsc className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Filter Dropdown */}
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="bg-gray-700 text-gray-200 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {processedNotifications.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No notifications to display
              </div>
            ) : (
              processedNotifications.map((notification) => (
                <div
                  key={notification.key}
                  className={`
                    flex items-center bg-gray-700 rounded-xl p-4 
                    ${
                      readNotifications.includes(notification.key) ||
                      notification.read
                        ? "opacity-60"
                        : "hover:bg-gray-600 hover:shadow-md"
                    }
                    transition-all duration-300 ease-in-out
                  `}
                >
                  <div className="mr-4">
                    <img
                      src={notification.senderProfile.src || "/profilPic.jpeg"}
                      alt="sender profile"
                      className="w-14 h-14 rounded-full object-cover shadow-md"
                    />
                    <p className="text-xs text-gray-400 text-center mt-1 truncate max-w-[80px]">
                      {notification.sender}
                    </p>
                  </div>

                  <div className="flex-grow">
                    <p className="text-sm text-gray-100 mb-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(notification.time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMarkAsRead(notification.key)}
                        className="
                          flex items-center bg-green-700 hover:bg-green-600 
                          text-white px-3 py-1 rounded-full text-xs 
                          transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark as read
                      </button>
                      <button
                        onClick={() => handleSeeDetails(notification)}
                        className="
                          flex items-center bg-blue-700 hover:bg-blue-600 
                          text-white px-3 py-1 rounded-full text-xs 
                          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        See Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Details Column */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 min-h-[600px] border border-gray-700">
          {selectedNotification ? (
            <div className="relative">
              <button
                onClick={handleCloseDetails}
                className="absolute top-0 right-0 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="mt-8">
                <h3 className="text-2xl font-bold text-blue-400 mb-6">
                  Notification Details
                </h3>

                <div className="flex items-center mb-6">
                  <img
                    src={
                      selectedNotification.senderProfile.src ||
                      "/profilPic.jpeg"
                    }
                    alt="sender profile"
                    className="w-20 h-20 rounded-full mr-6 object-cover shadow-lg"
                  />
                  <div>
                    <p className="text-xl font-semibold text-white">
                      {selectedNotification.sender}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(selectedNotification.time).toLocaleString(
                        "en-US",
                        {
                          dateStyle: "full",
                          timeStyle: "short",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-xl p-6 shadow-inner">
                  <p className="text-base text-gray-100 mb-4">
                    <strong className="text-blue-400 block mb-2">
                      Message:
                    </strong>
                    {selectedNotification.message}
                  </p>
                  <p className="text-base text-gray-300">
                    <strong className="text-blue-400 block mb-2">
                      Details:
                    </strong>
                    {selectedNotification.details}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p className="text-lg">Select a notification to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentNotifications;
