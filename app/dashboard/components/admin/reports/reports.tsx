"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  ClipboardCheck,
  XCircle,
  BarChart,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";

const UsageStats = [
  { key: 1, title: "Utilization Rate", number: "200", icon: BarChart },
  { key: 2, title: "Total Reservations", number: "1234", icon: ClipboardCheck },
  { key: 3, title: "Total Cancelled", number: "20", icon: XCircle },
  { key: 4, title: "Total Hours Played", number: "3000", icon: CalendarDays },
];

const Statistics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {UsageStats.map((stat) => (
        <div
          key={stat.key}
          className="bg-gray-800 border-l border-t border-emerald-600 p-4 sm:p-6 rounded-lg shadow-md flex items-center"
        >
          <div className="mr-4">
            <stat.icon className="text-green-400 w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-400">{stat.title}</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-green-400">
              {stat.number}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

const FacilityReports: React.FC = () => {
  const facilityLogs = [
    {
      date: "2024-11-21",
      time: "10:00 - 11:00 AM",
      user: "FANATIC",
      status: "Reserved",
      type: "Football Stadium",
    },
    {
      date: "2024-11-20",
      time: "2:00 - 3:00 PM",
      user: "AZEMRAY",
      status: "Cancelled",
      type: "Basketball field",
    },
    {
      date: "2024-11-19",
      time: "6:00 - 7:00 PM",
      user: "MCQ",
      status: "Reserved",
      type: "Volleyball field",
    },
    {
      date: "2024-11-19",
      time: "6:00 - 7:00 PM",
      user: "LACAVE",
      status: "Reserved",
      type: "Football field",
    },
  ];

  const [filteredLogs, setFilteredLogs] = useState(facilityLogs);
  const [statusFilter, setStatusFilter] = useState("");
  const [dayDate, setdayDate] = useState("");
  const [showStatistics, setShowStatistics] = useState(false);

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    applyFilters(dayDate, status);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setdayDate(value);
    applyFilters(value, statusFilter);
  };

  const applyFilters = (start: string, status: string) => {
    let filtered = facilityLogs;

    if (start) {
      filtered = filtered.filter((log) => log.date == start);
    }

    if (status) {
      filtered = filtered.filter((log) => log.status === status);
    }

    setFilteredLogs(filtered);
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

  const toggleStatistics = () => {
    setShowStatistics(!showStatistics);
  };

  return (
    <div className="w-full h-full min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-green-400 mb-4 text-center">
            Facility Utilization Reports
          </h1>
          <button
            onClick={toggleStatistics}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-green-500/25"
          >
            {showStatistics ? "Hide Statistics" : "Show Statistics"}
          </button>
        </header>

        {/* Statistics Section */}
        {showStatistics && (
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-100 mb-4">
              Usage Statistics
            </h2>
            <Statistics />
          </div>
        )}

        {/* Logs and Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Logs Table */}
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-100 mb-4">
              Filter Logs
            </h2>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <label className="text-sm sm:text-base">
                Day:
                <input
                  type="date"
                  name="day"
                  value={dayDate}
                  onChange={handleDateChange}
                  className="bg-gray-700 text-white p-2 rounded-md ml-2 outline-none focus:ring-2 focus:ring-green-400"
                />
              </label>

              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded-md outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
              >
                <option value="">Status</option>
                <option value="Reserved">Reserved</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-green-500/25"
              >
                Export Report
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="text-left p-2 sm:p-4 text-gray-100 text-xs sm:text-sm">
                      Date
                    </th>
                    <th className="text-left p-2 sm:p-4 text-gray-100 text-xs sm:text-sm">
                      Time Slot
                    </th>
                    <th className="text-left p-2 sm:p-4 text-gray-100 text-xs sm:text-sm">
                      User
                    </th>
                    <th className="text-left p-2 sm:p-4 text-gray-100 text-xs sm:text-sm">
                      Status
                    </th>
                    <th className="text-left p-2 sm:p-4 text-gray-100 text-xs sm:text-sm">
                      field
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log, index) => (
                      <tr
                        key={index}
                        className="bg-gray-800 hover:bg-gray-700 transition-colors"
                      >
                        <td className="p-2 sm:p-4 text-gray-300 text-xs sm:text-sm">
                          {log.date}
                        </td>
                        <td className="p-2 sm:p-4 text-gray-300 text-xs sm:text-sm">
                          {log.time}
                        </td>
                        <td className="p-2 sm:p-4 text-gray-300 text-xs sm:text-sm">
                          {log.user}
                        </td>
                        <td
                          className={`p-2 sm:p-4 text-xs sm:text-sm ${
                            log.status === "Reserved"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {log.status}
                        </td>
                        <td className="p-2 sm:p-4 text-gray-300 text-xs sm:text-sm">
                          {log.type}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-2 sm:p-4 text-center text-gray-400 text-xs sm:text-sm"
                      >
                        No logs available for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Insights Section */}
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-100 mb-4">
              Insights
            </h2>
            <ul className="list-disc list-inside text-gray-400 text-xs sm:text-sm">
              <li className="flex items-center mb-2">
                <Clock className="w-4 h-4 mr-2 text-green-400" /> Early mornings
                (6 AM - 8 AM) have low utilization (25%).
              </li>
              <li className="flex items-center mb-2">
                <TrendingUp className="w-4 h-4 mr-2 text-green-400" /> Weekends
                are the most booked with 90% utilization.
              </li>
              <li className="flex items-center mb-2">
                <Users className="w-4 h-4 mr-2 text-green-400" /> Peak hours are
                typically between 5 PM - 8 PM on weekdays.
              </li>
              <li className="flex items-center mb-2">
                <ClipboardCheck className="w-4 h-4 mr-2 text-green-400" />{" "}
                Football fields have the highest reservation rate among all
                facilities.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityReports;
