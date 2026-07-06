// src/layouts/MainLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="">
     

      <main className="bg-gray-50">
        <Outlet />
      </main>

   
    </div>
  );
};

export default MainLayout;