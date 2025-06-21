"use client";

import React, { useState, useEffect } from "react";
import {
  LucideHome,
  LucideUserPlus,
  Pen,
  LucideSettings,
  UserRound,
  UsersRound,
  UserCheck,
  UserX,
  X,
  Users,
  ShieldCheck,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface StatisticsProps {
  stats: {
    total: number;
    admins: number;
    active: number;
    inactive: number;
  };
}

// Statistics sub-component
const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  const statistcsArry = [
    { title: "Total Accounts", number: stats.total, icon: Users },
    { title: "Admins", number: stats.admins, icon: ShieldCheck },
    { title: "Active Users", number: stats.active, icon: UserCheck },
    { title: "Disabled Users", number: stats.inactive, icon: UserX },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {statistcsArry.map((stat) => (
        <div
          key={stat.title}
          className="bg-gray-800 border-l-4 border-emerald-600 p-6 rounded-lg shadow-md flex items-center"
        >
          <div className="mr-4">
            <stat.icon
              className={`w-8 h-8 ${
                stat.title === "Disabled Users"
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            />
          </div>
          <div>
            <p className="text-sm text-gray-400">{stat.title}</p>
            <h2 className="text-2xl font-semibold text-white">{stat.number}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

interface User {
  _id: string;
  full_name: string;
  email: string;
  role: "Admin" | "User" | "Organizer";
  school: string;
  password?: string;
  status: "active" | "inactive";
}

// Main user management component
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    active: 0,
    inactive: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [editUser, setEditUser] = useState<Partial<User> | null>(null);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/get_all_users", {
          method: "POST",
        });
        const data = await response.json();
        const filteredData = data.filter((user: User) => user.role !== 'Organizer');
        setUsers(filteredData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "Admin").length;
    const active = users.filter((u) => u.status === "active").length;
    const inactive = users.filter((u) => u.status === "inactive").length;
    setStats({ total, admins, active, inactive });
  }, [users]);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentPageUsers = users.slice(startIndex, startIndex + usersPerPage);

  const handleEditUser = (user: User) => {
    setEditUser({ ...user, password: "" }); // Clear password for editing
    setShowEditUserForm(true);
  };

  const handleToggleStatusConfirmation = (user: User) => {
    setUserToToggle(user);
  };

  const handleToggleStatus = async () => {
    if (!userToToggle) return;
    const newStatus = userToToggle.status === "active" ? "inactive" : "active";
    try {
      const response = await fetch("/api/update_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: userToToggle._id, status: newStatus }),
      });

      if (response.ok) {
        alert(`User ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully.`);
        setUsers(
          users.map((u) => (u._id === userToToggle._id ? { ...u, status: newStatus } : u))
        );
      } else {
        const data = await response.json();
        alert(`Failed to update user status: ${data.error}`);
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      alert("An unexpected error occurred.");
    } finally {
      setUserToToggle(null);
    }
  };

  const handleSaveUser = async () => {
    if (!editUser) return;

    const originalUser = users.find((user) => user._id === editUser._id);
    if (!originalUser) {
      alert("Original user not found");
      return;
    }

    const updatedFields: Partial<User> = {};
    Object.keys(editUser).forEach((key) => {
      const uKey = key as keyof User;
      if (uKey === "password") {
        if (editUser.password) updatedFields.password = editUser.password;
      } else if (editUser[uKey] !== originalUser[uKey]) {
        updatedFields[uKey] = editUser[uKey];
      }
    });

    if (Object.keys(updatedFields).length > 0) {
      try {
        const response = await fetch("/api/update_user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: editUser._id, ...updatedFields }),
        });

        if (response.ok) {
          const updatedUserFromServer = await response.json();
          alert("User updated successfully");
          setUsers(
            users.map((user) =>
              user._id === editUser._id ? { ...originalUser, ...updatedUserFromServer } : user
            )
          );
          setShowEditUserForm(false);
          setEditUser(null);
        } else {
          const data = await response.json();
          alert(`Failed to update user: ${data.error}`);
        }
      } catch (error) {
        console.error("Error saving user:", error);
        alert("An unexpected error occurred");
      }
    } else {
      alert("No changes made");
      setShowEditUserForm(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 space-y-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: User Management */}
        <div className="w-full lg:col-span-2">
          <h1 className="text-4xl font-bold text-green-400 flex items-center gap-4 mb-8">
            <LucideHome size={36} /> User Management
          </h1>

          {/* User Table */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="text-left p-4 text-white">Name</th>
                  <th className="text-left p-4 text-white">Email</th>
                  <th className="text-left p-4 text-white">Role</th>
                  <th className="text-left p-4 text-white">Status</th>
                  <th className="text-left p-4 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPageUsers.length > 0 ? (
                  currentPageUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <td className="p-4 text-gray-300">{user.full_name}</td>
                      <td className="p-4 text-gray-300">{user.email}</td>
                      <td className="p-4 text-gray-300">{user.role}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.status === "active"
                              ? "bg-green-500 text-green-900"
                              : "bg-red-500 text-red-900"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300 space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="flex-shrink-0 inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
                        >
                          <Pen size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatusConfirmation(user)}
                          className={`flex-shrink-0 inline-flex items-center gap-2 px-3 py-1 text-white rounded-lg transition-all text-sm ${
                            user.status === "active"
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {user.status === "active" ? (
                            <><X size={14} /> Disable</>
                          ) : (
                            <><UserCheck size={14} /> Enable</>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Statistics */}
        <div className="w-full space-y-8 lg:pt-20">
          <Statistics stats={stats} />
        </div>
      </div>

      {/* Confirmation Dialog for toggling status */}
      <Dialog open={!!userToToggle} onOpenChange={() => setUserToToggle(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              You are about to {userToToggle?.status === 'active' ? 'disable' : 'enable'} the account for {userToToggle?.full_name}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all">Cancel</button>
            </DialogClose>
            <button
              onClick={handleToggleStatus}
              className={`px-6 py-2 text-white rounded-lg transition-all ${userToToggle?.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              Confirm
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Form */}
      {showEditUserForm && editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h2 className="text-3xl font-bold text-green-400 mb-6">Edit User</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={editUser.full_name || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, full_name: e.target.value })
                }
                className="bg-gray-700 text-white p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={editUser.email || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                className="bg-gray-700 text-white p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value as "Admin" | "User" })
                }
                className="bg-gray-700 text-white p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
              <input
                type="password"
                placeholder="New Password (optional)"
                value={editUser.password || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, password: e.target.value })
                }
                className="bg-gray-700 text-white p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowEditUserForm(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
