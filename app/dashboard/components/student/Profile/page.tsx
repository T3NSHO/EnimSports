"use client";
import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Edit2,
  Save,
  X,
  School,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface Profile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  school: string;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SessionData {
  user?: {
    id: string;
  };
}

const StudentProfile: React.FC = () => {
  const { data: session } = useSession() as { data: SessionData };

  // Initial state for profile
  const initialProfile: Profile = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    school: "",
  };

  const initialPasswordChange: PasswordChange = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [passwordChange, setPasswordChange] = useState<PasswordChange>(initialPasswordChange);
  const [userRole, setUserRole] = useState<string>("user");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState<string>("");

  // Fetch user data and format it to match initialProfile
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/fetch_user_data/${session?.user?.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userid: session?.user?.id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setUserRole(data.role || "user");

        // Transform data to match initialProfile structure
        const formattedProfile: Profile = {
          firstName: data.full_name?.split(" ")[0] || "Student",
          lastName: data.full_name?.split(" ")[1] || "User",
          phone: data.phone_number || "",
          email: data.email || "",
          school: data.school || "",
        };

        setProfile(formattedProfile);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [session]);

  const handleSave = async () => {
    // Format the profile data to match the UserModel schema
    const formattedData = {
      full_name: `${profile.firstName} ${profile.lastName}`,
      email: profile.email,
      phone_number: profile.phone,
      school: profile.school,
      role: userRole, // Assuming the role is "user" as default
      team: "", // Assuming team is not provided by the UI
    };

    try {
      const response = await fetch(`/api/save_student/${session?.user?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile data");
      }

      console.log("Profile saved successfully:", formattedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  const handlePasswordChange = async () => {
    // Reset error
    setPasswordError("");

    // Validate passwords
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordChange.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch(`/api/update_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: session?.user?.id,
          password: passwordChange.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      console.log("Password updated successfully");
      setPasswordChange(initialPasswordChange);
      setIsChangingPassword(false);
      setShowPasswords({ current: false, new: false, confirm: false });
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError("Failed to update password. Please try again.");
    }
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordInputChange = (field: keyof PasswordChange, value: string) => {
    setPasswordChange((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (passwordError) setPasswordError("");
  };

  const renderEditableField = (
    value: string,
    onChange: (value: string) => void,
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

  const renderPasswordField = (
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
    field: 'current' | 'new' | 'confirm'
  ) => {
    return (
      <div className="relative">
        <input
          type={showPasswords[field] ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-2 text-gray-100 w-full pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
        >
          {showPasswords[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex flex-col items-center gap-6 w-4/5">
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
          {/* Left Column - Basic Info */}
          <div className="w-full md:w-1/2 space-y-6">
            <div className="relative group w-40 h-40 mx-auto">
              <img
                src="/adminProfilePic.jpeg.png"
                alt="Profile"
                className="relative w-40 h-40 object-cover rounded-full border-2 border-gray-700/50 shadow-xl"
              />
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-100">
                Basic Information
              </h3>
              <div className="space-y-4">
                {["firstName", "lastName"].map((field) => (
                  <div key={field}>
                    <label className="text-sm font-medium text-gray-400 mb-1 block">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    {renderEditableField(
                      profile[field as keyof Profile],
                      (value) => handleInputChange(field as keyof Profile, value),
                      `Enter ${field}`
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="w-full md:w-1/2 space-y-6">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-100">
                Contact Information
              </h3>
              {["phone", "email", "school"].map((field) => (
                <div key={field} className="mb-4">
                  <label className="text-sm font-medium text-gray-400 mb-1 block">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {renderEditableField(
                    profile[field as keyof Profile],
                    (value) => handleInputChange(field as keyof Profile, value),
                    `Enter ${field}`
                  )}
                </div>
              ))}
            </div>

            {/* Password Change Section */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </h3>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-purple-500/25 text-sm"
                  >
                    <Lock className="w-4 h-4" />
                    Change
                  </button>
                )}
              </div>

              {isChangingPassword ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-1 block">
                      Current Password
                    </label>
                    {renderPasswordField(
                      passwordChange.currentPassword,
                      (value) => handlePasswordInputChange('currentPassword', value),
                      "Enter current password",
                      'current'
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-1 block">
                      New Password
                    </label>
                    {renderPasswordField(
                      passwordChange.newPassword,
                      (value) => handlePasswordInputChange('newPassword', value),
                      "Enter new password",
                      'new'
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-1 block">
                      Confirm New Password
                    </label>
                    {renderPasswordField(
                      passwordChange.confirmPassword,
                      (value) => handlePasswordInputChange('confirmPassword', value),
                      "Confirm new password",
                      'confirm'
                    )}
                  </div>

                  {passwordError && (
                    <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                      {passwordError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handlePasswordChange}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-green-500/25"
                    >
                      <Save className="w-4 h-4" />
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordChange(initialPasswordChange);
                        setPasswordError("");
                        setShowPasswords({ current: false, new: false, confirm: false });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg hover:shadow-gray-500/25"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  Click the button above to change your password
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
