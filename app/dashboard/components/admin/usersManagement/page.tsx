"use client";

import React, { useState, useEffect } from "react";
import {
  LucideHome,
  LucideUserPlus,
  Pen,
  LucideSettings,
  X,
} from "lucide-react";

// Example statistics data
const statistcsArry = [
  { title: "number of students", number: "20", key: 1 },
  { title: "number of organizers", number: "10", key: 2 },
  { title: "number of admins", number: "5", key: 3 },
  { title: "total accounts", number: "35", key: 4 },
];

// Statistics sub-component
const Statistics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {statistcsArry.map((stat) => (
        <div
          key={stat.key}
          className="bg-gray-800 border-l border-t border-emerald-600 p-4 sm:p-6 rounded-lg shadow-md flex items-center"
        >
          <div className="mr-4">
            <h2 className="text-green-400 text-2xl font-bold">{stat.number}</h2>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-400">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main user management component
const UserControling: React.FC = () => {
  interface User {
    _id: string;
    full_name: string;
    email: string;
    role: string;
    school: string;
    password: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [editUser, setEditUser] = useState({
    _id: "",
    full_name: "",
    email: "",
    role: "Student",
    school: "",
    password: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/get_all_users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentPageUsers = users.slice(startIndex, startIndex + usersPerPage);

  const handleDeleteUser = (_id: string) => {
    setUsers(users.filter((user) => user._id !== _id));
  };

  const handleEditUser = (_id: string) => {
    const userToEdit = users.find((user) => user._id === _id);
    if (userToEdit) {
      setEditUser(userToEdit);
      setShowEditUserForm(true);
    }
  };

  const handleSaveUser = async () => {
    try {
      // Compare the original user data with the edited user data
      const originalUser = users.find((user) => user._id === editUser._id);
      if (!originalUser) {
        alert('Original user not found');
        return;
      }
  
      // Find only the fields that were modified
      const updatedFields: Partial<User> = {};
      for (const key in editUser) {
        if (editUser[key as keyof User] !== originalUser[key as keyof User]) {
          updatedFields[key as keyof User] = editUser[key as keyof User];
        }
      }
  
      // Send the updated fields to the API only if changes exist
      if (Object.keys(updatedFields).length > 0) {
        const response = await fetch('/api/update_user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: editUser._id, ...updatedFields }),
        });
  
        const data = await response.json();
        if (!response.ok) {
          console.error('Error updating user:', data.error);
          alert('Failed to update user');
        } else {
          alert('User updated successfully');
          setUsers(
            users.map((user) =>
              user._id === editUser._id
                ? { ...user, ...updatedFields } // Update the user in the state
                : user
            )
          );
          setShowEditUserForm(false);
          setEditUser({
            _id: '',
            full_name: '',
            email: '',
            role: 'Student',
            school: '',
            password: '',
          });
        }
      } else {
        alert('No changes made');
        setShowEditUserForm(false);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('An unexpected error occurred');
    }
  };
  

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 space-y-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN: User Management */}
        <div className="w-full max-w-full">
          <h1 className="text-5xl font-bold text-green-400 flex items-center gap-4">
            <LucideHome size={40} /> User Management
          </h1>

          {/* User Table */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full mt-8 overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="text-left p-4 text-white">Name</th>
                  <th className="text-left p-4 text-white">Email</th>
                  <th className="text-left p-4 text-white">Role</th>
                  <th className="text-left p-4 text-white">School</th>
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
                      <td className="p-4 text-gray-300 break-all">
                        {user.full_name}
                      </td>
                      <td className="p-4 text-gray-300 break-all">
                        {user.email}
                      </td>
                      <td className="p-4 text-gray-300">{user.role}</td>
                      <td className="p-4 text-gray-300">{user.school}</td>
                      <td className="p-4 text-gray-300 space-y-1">
                        <button
                          onClick={() => handleEditUser(user._id)}
                          className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/25"
                        >
                          <Pen size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-red-500/25"
                        >
                          <X size={16} /> Delete
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* Edit User Form */}
          {showEditUserForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-green-400 mb-4">Edit User</h2>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={editUser.full_name}
                    onChange={(e) =>
                      setEditUser({ ...editUser, full_name: e.target.value })
                    }
                    className="bg-gray-700 text-white p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={editUser.email}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                    className="bg-gray-700 text-white p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={editUser.role}
                    onChange={(e) =>
                      setEditUser({ ...editUser, role: e.target.value })
                    }
                    className="bg-gray-700 text-white p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Organizer">Organizer</option>
                    <option value="User">User</option>
                  </select>
                  <input
                    type="text"
                    placeholder="School"
                    value={editUser.school}
                    onChange={(e) =>
                      setEditUser({ ...editUser, school: e.target.value })
                    }
                    className="bg-gray-700 text-white p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={editUser.password}
                    onChange={(e) =>
                      setEditUser({ ...editUser, password: e.target.value })
                    }
                    className="bg-gray-700 text-white p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      onClick={() => setShowEditUserForm(false)}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveUser}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-green-500/25"
                    >
                      Save User
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Statistics */}
        <div className="w-full max-w-full space-y-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full">
            <h2 className="text-3xl font-bold text-green-400 flex items-center gap-4">
              <LucideSettings size={30} /> Role Management
            </h2>
            <ul className="list-disc list-inside text-gray-300 mt-4">
              <li>Admin: Full access to the system.</li>
              <li>Organizer: Can manage events and schedules.</li>
              <li>Student: Limited access to personal reservations.</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full">
            <Statistics />
          </div>
        </div>
      </div>
    </div>
  );
};

// Page component that renders UserControling
export default function Page() {
  return (
    <div>
      <UserControling />
    </div>
  );
}
