"use client";

import React, { useState } from "react";
import {
  LucideHome,
  LucideUserPlus,
  Pen,
  LucideSettings,
  UserSquare,
  UserCheck,
  UserX,
  UserCog,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { title } from "process";

const statistcsArry = [
  { title: "numbre of students", number: "20", key: 1, icon: UsersRound },
  { title: "numbre of Organizer", number: "10", key: 2, icon: UserRound },
  { title: "numbre of Admin", number: "5", key: 3, icon: UserCog },
  { title: "active accounts", number: "91", key: 4, icon: UserCheck },
  { title: "inactive accounts", number: "9", key: 5, icon: UserX },
];

const Statistics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {statistcsArry.map((stat) => (
        <div
          key={stat.key}
          className={`bg-gray-800 border-l border-t ${
            stat.icon == UserX ? "border-red-500 " : "border-emerald-600"
          }  p-4 sm:p-6 rounded-lg shadow-md flex items-center`}
        >
          <div className="mr-4">
            <stat.icon
              className={`${
                stat.icon == UserX ? "text-red-500 " : "text-green-400 "
              }w-6 h-6 sm:w-8 sm:h-8`}
            />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-400">{stat.title}</p>
            <h2
              className={`text-xl sm:text-2xl font-semibold  ${
                stat.icon == UserX ? "text-red-400 " : "text-green-400 "
              }`}
            >
              {stat.number}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      school: "Enim",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Organizer",
      school: "Enim",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Alex Brown",
      email: "alex@example.com",
      role: "Student",
      school: "Enim",
      status: "Active",
    },
  ]);
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    id: null,
    name: "",
    email: "",
    role: "Student",
    status: "Active",
  });

  const handleAddUser = () => {
    setShowAddUserForm(true);
  };

  const handleSaveUser = () => {
    if (newUser.id) {
      // Edit existing user
      setUsers(users.map((user) => (user.id === newUser.id ? newUser : user)));
    } else {
      // Add new user
      const newUserWithId = {
        ...newUser,
        id: users.length + 1,
      };
      setUsers([...users, newUserWithId]);
    }
    setShowAddUserForm(false);
    setNewUser({
      id: null,
      name: "",
      email: "",
      role: "Student",
      status: "Active",
    });
  };

  const handleAddRole = () => {
    alert("Add New Role functionality is not yet implemented.");
    setShowAddUserForm(true);
  };

  const handleEditUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    if (userToEdit) {
      setNewUser(userToEdit);
      setShowAddUserForm(true);
    }
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const filteredUsers = users.filter(
    (user) =>
      (!filterRole || user.role === filterRole) &&
      (!searchQuery ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 space-y-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full max-w-full">
          <h1 className="text-5xl font-bold text-green-400 flex items-center gap-4">
            <LucideHome size={40} /> User Management
          </h1>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 w-full mt-6">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 text-white p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-0"
            />
            <select
              title="filter"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-gray-800 text-white p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Organizer">Organizer</option>
              <option value="Student">Student</option>
            </select>
            <button
              onClick={handleAddUser}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-green-500/25"
            >
              <LucideUserPlus size={20} /> Add New User
            </button>
          </div>

          {/* Add User Form */}
          {showAddUserForm && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full mt-8">
              <h2 className="text-3xl font-bold text-green-400 mb-4">
                {newUser.id ? "Edit User" : "Add New User"}
              </h2>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="bg-gray-700 text-white p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="bg-gray-700 text-white p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="bg-gray-700 text-white p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Organizer">Organizer</option>
                  <option value="Student">Student</option>
                </select>
                <button
                  onClick={handleSaveUser}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-green-500/25"
                >
                  Save User
                </button>
              </div>
            </div>
          )}

          {/* User Table */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full mt-8 overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="text-left p-4 text-white">Name</th>
                  <th className="text-left p-4 text-white">Email</th>
                  <th className="text-left p-4 text-white">Role</th>
                  <th className="text-left p-4 text-white">School</th>
                  <th className="text-left p-4 text-white">Status</th>
                  <th className="text-left p-4 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <td className="p-4 text-gray-300 break-all">
                        {user.name}
                      </td>
                      <td className="p-4 text-gray-300 break-all">
                        {user.email}
                      </td>
                      <td className="p-4 text-gray-300">{user.role}</td>
                      <td className="p-4 text-gray-300">{user.school}</td>
                      <td
                        className={`p-4 ${
                          user.status === "Active"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {user.status}
                      </td>
                      <td className="p-4 text-gray-300 space-y-1">
                        <button
                          onClick={() => handleEditUser(user.id)}
                          className="flex items-center gap-2 px-5 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/25"
                        >
                          <Pen size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-red-500/25"
                        >
                          <X size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Management Section */}
        <div className="w-full max-w-full space-y-8 ">
          <div className="bg-gray-800 p-6  rounded-lg shadow-md w-full">
            <h2 className="text-3xl font-bold text-green-400 flex items-center gap-4">
              <LucideSettings size={30} /> Role Management
            </h2>
            <ul className="list-disc list-inside text-gray-300 mt-4">
              <li>Admin: Full access to the system.</li>
              <li>Organizer: Can manage events and schedules.</li>
              <li>Student: Limited access to personal reservations.</li>
            </ul>
          </div>
          <div className="w-full max-w-full  bg-gray-800 p-6 rounded-lg shadow-md w-full">
            <Statistics />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
