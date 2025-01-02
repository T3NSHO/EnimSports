"use client";

import React, { useState, useEffect } from "react";
import { LucideHome, Pen, LucideSettings, X } from "lucide-react";

const statistcsArry = [
  { title: "number of students", number: "20", key: 1 },
  { title: "number of organizers", number: "10", key: 2 },
  { title: "number of admins", number: "5", key: 3 },
  { title: "total accounts", number: "35", key: 4 },
];

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

const UserControling: React.FC = () => {
  interface User {
    _id: string;
    full_name: string;
    email: string;
    role: string;
    school?: string; // Made optional
    password: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [editUser, setEditUser] = useState<User>({
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
      const originalUser = users.find((user) => user._id === editUser._id);
      if (!originalUser) {
        alert("Original user not found");
        return;
      }

      const updatedFields: Partial<User> = {};
      for (const key in editUser) {
        if (editUser[key as keyof User] !== originalUser[key as keyof User]) {
          updatedFields[key as keyof User] = editUser[key as keyof User];
        }
      }

      if (Object.keys(updatedFields).length > 0) {
        const response = await fetch("/api/update_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: editUser._id, ...updatedFields }),
        });

        const data = await response.json();
        if (!response.ok) {
          console.error("Error updating user:", data.error);
          alert("Failed to update user");
        } else {
          alert("User updated successfully");
          setUsers(
            users.map((user) =>
              user._id === editUser._id ? { ...user, ...updatedFields } : user
            )
          );
          setShowEditUserForm(false);
          setEditUser({
            _id: "",
            full_name: "",
            email: "",
            role: "Student",
            school: "",
            password: "",
          });
        }
      } else {
        alert("No changes made");
        setShowEditUserForm(false);
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("An unexpected error occurred");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 space-y-8 w-full">
      {/* User Management */}
      <div className="w-full max-w-full">
        <h1 className="text-5xl font-bold text-green-400 flex items-center gap-4">
          <LucideHome size={40} /> User Management
        </h1>
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
                  <tr key={user._id} className="bg-gray-800">
                    <td className="p-4">{user.full_name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.role}</td>
                    <td className="p-4">{user.school || "N/A"}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEditUser(user._id)}
                        className="bg-blue-500 text-white rounded-md p-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 text-white rounded-md p-2 ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return <UserControling />;
}
