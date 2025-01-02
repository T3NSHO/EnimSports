"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Eye,
  Bell,
  CheckCircle,
  X,
  SortAsc,
  SortDesc,
  Clock,
} from "lucide-react";

interface Notification {
  key: string; // This will be _id from the API
  title: string;
  message: string; // This will be the description from the API
  read: boolean;
  sender: string;
  senderProfile: {
    src: string;
  };
  time: string; // ISO string for date
}

const StudentNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<string>("desc");
  const [filterRead, setFilterRead] = useState<string>("all");

  // Initialize readNotifications from localStorage on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedReadNotifications = localStorage.getItem("readNotifications");
      if (storedReadNotifications) {
        setReadNotifications(JSON.parse(storedReadNotifications));
      }
    }
  }, []);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/get_notifications" , {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        const mappedNotifications: Notification[] = data.map((item: any) => ({
          key: item._id, // Using _id as the unique key
          title: item.title,
          message: item.description, // Using description as the message
          read: false,
          sender: "Administrator",
          senderProfile: {
            src: `https://ui-avatars.com/api/?name=Administrator&background=random`,
          },
          time: item.date,
        }));
        setNotifications(mappedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Update localStorage when readNotifications changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("readNotifications", JSON.stringify(readNotifications));
    }
  }, [readNotifications]);

  // Sorting and Filtering Logic
  const processedNotifications = useMemo(() => {
    let filteredNotifs = notifications;

    // Filter by read status
    if (filterRead === "unread") {
      filteredNotifs = filteredNotifs.filter(
        (n) => !readNotifications.includes(n.key)
      );
    } else if (filterRead === "read") {
      filteredNotifs = filteredNotifs.filter((n) =>
        readNotifications.includes(n.key)
      );
    }

    // Sort notifications
    return [...filteredNotifs].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "date":
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
  }, [sortField, sortDirection, filterRead, readNotifications, notifications]);

  const handleSeeDetails = (notification: Notification) => {
    setSelectedNotification(notification);
  };

  const handleMarkAsRead = (notificationKey: string) => {
    if (!readNotifications.includes(notificationKey)) {
      setReadNotifications((prev) => [...prev, notificationKey]);
    }
  };

  const handleCloseDetails = () => {
    setSelectedNotification(null);
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
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
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-400 flex items-center">
              <Bell className="mr-3 text-blue-400 w-7 h-7" />
              Notifications
            </h2>

            <div className="flex items-center space-x-2">
              <button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => toggleSort("date")}
              >
                {sortField === "date" && sortDirection === "desc" ? (
                  <SortDesc className="w-5 h-5" />
                ) : (
                  <SortAsc className="w-5 h-5" />
                )}
              </button>

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
                  className={`flex items-center bg-gray-700 rounded-xl p-4 ${
                    readNotifications.includes(notification.key)
                      ? "opacity-60"
                      : "hover:bg-gray-600 hover:shadow-md"
                  } transition-all duration-300 ease-in-out`}
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
                    <p className="text-sm text-gray-100 mb-1 font-semibold">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-100 mb-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(notification.time).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMarkAsRead(notification.key)}
                        className="flex items-center bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark as read
                      </button>
                      <button
                        onClick={() => handleSeeDetails(notification)}
                        className="flex items-center bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      Title:
                    </strong>
                    {selectedNotification.title}
                  </p>
                  <p className="text-base text-gray-300">
                    <strong className="text-blue-400 block mb-2">
                      Message:
                    </strong>
                    {selectedNotification.message}
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
