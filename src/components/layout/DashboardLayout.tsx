// src/layouts/DashboardLayout.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTypedSelector } from '@/redux/hooks';
import { SidebarProvider } from '@/components/ui/sidebar';

import { TopBar } from '@/components/layout/TopBar';
import {getUserInfo} from "@/utils/auth"
import {AppSidebar} from "@/components/layout/AppSidebar"

const DashboardLayout: React.FC = () => {
  const userInfo =getUserInfo()
  // console.log(userInfo, "dashboard layout user info")

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="bg-[#FAF4E9] p-4 flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
