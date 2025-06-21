"use client";

import React, { useState, useEffect, FC } from "react";
import {
  BarChart,
  ClipboardCheck,
  XCircle,
  CalendarDays,
  Clock,
  TrendingUp,
  Users,
  Download,
  LucideProps,
} from "lucide-react";

interface StatCardProps {
  icon: React.ComponentType<LucideProps>;
  title: string;
  value: string | number;
  color: string;
}

const StatCard: FC<StatCardProps> = ({ icon: Icon, title, value, color }) => {
  return (
    <div className="bg-gray-800 border-l-4 border-emerald-600 p-6 rounded-lg shadow-md flex items-center">
      <div className={`mr-4 text-${color}-400`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <h2 className="text-2xl font-semibold text-white">{value}</h2>
      </div>
    </div>
  );
};

interface Log {
    date: string;
    time: string;
    user: string;
    status: string;
    type: string;
}

const FacilityReports: FC = () => {
  const [stats, setStats] = useState({
    confirmationRate: "0",
    totalConfirmed: 0,
    totalCancelled: 0,
    totalHours: 0,
  });
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [filters, setFilters] = useState({
    status: "",
    date: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/reports/facility");
        const data = await res.json();
        if (res.ok) {
          setStats(data.stats);
          setLogs(data.logs);
          setFilteredLogs(data.logs);
        } else {
          throw new Error(data.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered: Log[] = logs;
    if (filters.status) {
      filtered = filtered.filter((log) => log.status === filters.status);
    }
    if (filters.date) {
      filtered = filtered.filter((log) => log.date === filters.date);
    }
    if (filters.type) {
      filtered = filtered.filter((log) => log.type === filters.type);
    }
    setFilteredLogs(filtered);
  }, [filters, logs]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const facilityTypes = [...new Set(logs.map(log => log.type))];

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Date", "Time Slot", "User", "Status", "Field"]
        .join(",") +
      "\n" +
      filteredLogs
        .map((log) =>
          [log.date, `"${log.time}"`, log.user, log.status, log.type].join(",")
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "facility_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-900 text-gray-100 flex justify-center items-center">
        <p className="text-xl">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-4 text-center">
            Facility Utilization Report
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BarChart}
            title="Confirmation Rate"
            value={`${stats.confirmationRate}%`}
            color="green"
          />
          <StatCard
            icon={ClipboardCheck}
            title="Total Reservations"
            value={stats.totalConfirmed}
            color="blue"
          />
          <StatCard
            icon={XCircle}
            title="Total Cancellations"
            value={stats.totalCancelled}
            color="red"
          />
          <StatCard
            icon={CalendarDays}
            title="Total Hours Booked"
            value={stats.totalHours}
            color="yellow"
          />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Filter & Export
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col">
              <label htmlFor="date" className="text-sm mb-1 text-gray-400">Date</label>
              <input
                type="date"
                name="date"
                id="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="bg-gray-700 text-white p-2 rounded-md outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            
            <div className="flex flex-col">
                <label htmlFor="type" className="text-sm mb-1 text-gray-400">Facility Type</label>
                <select
                    name="type"
                    id="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="bg-gray-700 text-white p-2 rounded-md outline-none focus:ring-2 focus:ring-green-400"
                >
                    <option value="">All Types</option>
                    {facilityTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="status" className="text-sm mb-1 text-gray-400">Status</label>
              <select
                name="status"
                id="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="bg-gray-700 text-white p-2 rounded-md outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">All Statuses</option>
                <option value="Reserved">Reserved</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-green-500/25"
            >
              <Download size={18} />
              Export Report
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-gray-800 p-6 rounded-lg shadow-md">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-left p-4 text-gray-100">Date</th>
                <th className="text-left p-4 text-gray-100">Time Slot</th>
                <th className="text-left p-4 text-gray-100">User</th>
                <th className="text-left p-4 text-gray-100">Field</th>
                <th className="text-left p-4 text-gray-100">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-700 transition-colors">
                    <td className="p-4 text-gray-300">{log.date}</td>
                    <td className="p-4 text-gray-300">{log.time}</td>
                    <td className="p-4 text-gray-300">{log.user}</td>
                    <td className="p-4 text-gray-300">{log.type}</td>
                    <td className={`p-4 font-medium ${
                        log.status === "Reserved"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {log.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-400">
                    No logs found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacilityReports;
