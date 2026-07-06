import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import NotFound from "@/pages/NotFound";

import { adminRoutes } from "./admin.routes";

import MainLayout from "@/components/layout/MainLayout";
import LoginPage from "@/pages/Auth/Login";
import PrivateRoute from "@/components/PrivateRoute/PrivateRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { routesGenerator } from "@/utils/routesGenerator";
import MentorLayout from "@/components/layout/MentorLayout";
import TeacherLayout from "@/components/layout/TeacherLayout";
import { teacherRoutes } from "./teacher.routes";
import { mentorRoutes } from "./mentor.routes";



const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: "",
    element: <MainLayout/>,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> }, // "/" redirect
      { path: "login", element: <LoginPage /> },
    ],
  },

  // ADMIN ROUTES
  {
    path: "/dashboard",
    element: (
      <PrivateRoute role="admin">
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="home" replace /> }, // /dashboard redirect
      ...routesGenerator(adminRoutes),
      { path: "*", element: <NotFound /> }, // dashboard specific 404
    ],
  },

  // MENTOR ROUTES
  {
    path: "/mentor",
    element: (
      <PrivateRoute role="mentor">
        <MentorLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="home" replace /> }, // /mentor redirect
      ...routesGenerator(mentorRoutes),
      { path: "*", element: <NotFound /> }, // mentor specific 404
    ],
  },
  // teacher ROUTES
  {
    path: "/teacher",
    element: (
      <PrivateRoute role="teacher">
        <TeacherLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="home" replace /> }, // /mentor redirect
      ...routesGenerator(teacherRoutes),
      { path: "*", element: <NotFound /> }, // mentor specific 404
    ],
  },

  // GLOBAL NOT FOUND
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;













// // src/routes/AppRoutes.tsx
// import { Routes, Route } from "react-router-dom";
// import DashboardLayout from "@/components/layout/DashboardLayout";

// // Page components
// import Dashboard from "@/pages/Dashboard";
// import Tours from "@/pages/Tours";

// import Bookings from "@/pages/Bookings";
// import Customers from "@/pages/Customers";
// import Settings from "@/pages/Settings";

// import NotFound from "@/pages/NotFound";
// import Login from "@/pages/Auth/Login"; // if you have
// import OrderPage from "@/pages/Order/OrderPage";
// import ProductPage from "@/pages/Product/ProductPage";
// import ChatHome from "@/pages/Chat/ChatHome";
// import TrackingPage from "@/pages/Tracking/TrackingPage";
// import AssignmentPage from "@/pages/Assignment/AssignmentPage";

// import ModulePage from "@/pages/Module/ModulePage";
// import LessonPage from "@/pages/Lesson/LessonPage";
// import QuizPage from "@/pages/Quiz/QuizPage";
// import CertificatePage from "@/pages/Certificate/CertificatePage";
// import CoursePage from "@/pages/Course/CoursePage";
// import LiveClass from "@/pages/LiveClass/LiveClass";

// const AppRoutes = () => (
//   <Routes>
//     {/* Public route */}
//     <Route path="/login" element={<Login />} />

//     {/* Protected dashboard layout */}
//     <Route path="/" element={<DashboardLayout />}>
//       <Route index element={<Dashboard />} />
//       <Route path="order" element={<OrderPage />} />
//       <Route path="product" element={<ProductPage />} />

//       <Route path="bookings" element={<Bookings />} />
//       <Route path="customers" element={<Customers />} />
//       <Route path="Chat" element={<ChatHome />} />
//       <Route path="live-class" element={<LiveClass />} />
//       <Route path="assignment" element={<AssignmentPage />} />
//       <Route path="course" element={<CoursePage />} />
//       <Route path="module" element={<ModulePage />} />
//       <Route path="lesson" element={<LessonPage />} />
//       <Route path="quiz" element={<QuizPage />} />
//       <Route path="certificate" element={<CertificatePage/>} />
//       <Route path="tracking" element={<TrackingPage />} />

//       <Route path="settings" element={<Settings />} />

//       <Route path="/">
     
        
//       </Route>
//       <Route path="/">

//       </Route>
//     </Route>

//     {/* Fallback */}
//     <Route path="*" element={<NotFound />} />
//   </Routes>
// );

// export default AppRoutes;
