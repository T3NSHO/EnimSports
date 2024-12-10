"use client";
import React, { useState, useMemo } from "react";
import { Mail, Phone, Edit2, Save, X } from "lucide-react";

const AdminProfile = ({
  initialProfile = {
    firstName: "Admin",
    lastName: "User",
    phone: "1234567890",
    email: "admin@example.com",
    birthDate: "1980-01-01",
    bio: "Administrator with extensive experience in managing school operations.",
    generalInfo: {
      preferredRole: "Admin",
      experience: "10+ years",
    },
  },
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);

  // Calculate age from birthdate
  const age = useMemo(() => {
    const birthDate = new Date(profile.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }, [profile.birthDate]);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGeneralInfoChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      generalInfo: {
        ...prev.generalInfo,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log("Saving profile:", profile);
    setIsEditing(false);
  };

  const renderEditableField = (
    value,
    onChange,
    placeholder = "",
    multiline = false
  ) => {
    if (!isEditing) return value;

    if (multiline) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg p-3 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          rows={4}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-2 text-gray-100 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex flex-col items-center gap-6">
      <div className="w-full max-w-4xl bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-8 flex flex-col gap-6">
        {/* Top Action Bar */}
        <div className="flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/25"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-red-500/25"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-green-500/25"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Photo and Basic Info */}
          <div className="w-full md:w-1/2 space-y-6">
            <div className="relative group w-40 h-40 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <img
                src="public/adminProfilePic.jpeg"
                alt="Profile"
                className="relative w-40 h-40 object-cover rounded-full border-2 border-gray-700/50 shadow-xl"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Basic Information */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-100">
                Basic Information
              </h3>
              <div className="space-y-4">
                {"firstName lastName birthDate".split(" ").map((field) => (
                  <div key={field}>
                    <label className="text-sm font-medium text-gray-400 mb-1 block">
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                    <div className="mt-1">
                      {field === "birthDate" && isEditing ? (
                        <input
                          type="date"
                          value={profile[field]}
                          onChange={(e) =>
                            handleInputChange(field, e.target.value)
                          }
                          className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-2 text-gray-100 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      ) : (
                        renderEditableField(
                          profile[field],
                          (value) => handleInputChange(field, value),
                          `Enter ${field
                            .replace(/([A-Z])/g, " $1")
                            .toLowerCase()}`
                        )
                      )}
                    </div>
                  </div>
                ))}
                {/* Display calculated age (non-editable) */}
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-1 block">
                    Age
                  </label>
                  <div className="mt-1 bg-gray-800/50 border border-gray-600/50 rounded-lg p-2 text-gray-100">
                    {age} years
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Content */}
          <div className="w-full md:w-1/2 space-y-6">
            {/* Contact Information */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-100">
                Contact Information
              </h3>
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  {renderEditableField(
                    profile.phone,
                    (value) => handleInputChange("phone", value),
                    "Enter phone number"
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  {renderEditableField(
                    profile.email,
                    (value) => handleInputChange("email", value),
                    "Enter email"
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-100">Bio</h3>
              {renderEditableField(
                profile.bio,
                (value) => handleInputChange("bio", value),
                "Tell us about yourself",
                true
              )}
            </div>

            {/* General Information */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-100">
                General Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(profile.generalInfo).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-gray-400 mb-1 block">
                      {key.charAt(0).toUpperCase() +
                        key.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                    <div className="mt-1">
                      {renderEditableField(
                        value,
                        (newValue) => handleGeneralInfoChange(key, newValue),
                        `Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
