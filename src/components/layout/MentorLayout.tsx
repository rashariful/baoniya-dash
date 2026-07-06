// src/layouts/MentorLayout.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserInfo } from "@/utils/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";

const MentorLayout: React.FC = () => {
  const userInfo = getUserInfo();

  // যদি mentor না লগইন করে থাকে
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MentorLayout;
