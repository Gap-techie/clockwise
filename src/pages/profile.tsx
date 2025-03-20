import React from "react";
import Header from "@/components/timesheet/Header";
import UserProfile from "@/components/profile/UserProfile";
import { useAuth } from "@/components/auth/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userName={user?.name || "User"}
        userRole={(user?.role as "employee" | "admin") || "employee"}
        userAvatar={user?.avatar_url || ""}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600 mt-2">
            View and update your personal information
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <UserProfile />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
