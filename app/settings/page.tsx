"use client";

import { useAuth } from "@/context/AuthProvider";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function SettingsPage() {
  const { user, dbUser, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen bg-[#030712]">
        <Sidebar />

        <div className="flex-1">
          <Header />

          <div className="flex min-h-[80vh] items-center justify-center p-8">
            <p className="text-slate-400">
              Loading settings...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
  <ProtectedRoute>
    <main className="flex min-h-screen bg-[#030712]">
      {/* existing settings content */}
    </main>
  </ProtectedRoute>
);
}