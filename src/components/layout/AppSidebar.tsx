import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { useTypedSelector } from "@/redux/hooks";
import { adminRoutes } from "@/routes/admin.routes";
import { mentorRoutes } from "@/routes/mentor.routes";
import { teacherRoutes } from "@/routes/teacher.routes";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  // রিডাক্স থেকে ইউজার ডাটা নেওয়া
  const { user } = useTypedSelector((state) => state.auth);
 
  
  const userRole = user?.role; // no hardcoded fallback to "admin"

  const roleRoutes: Record<string, any[]> = {
    admin: adminRoutes,
    mentor: mentorRoutes,
    teacher: teacherRoutes,
    // student: studentRoutes,
    // librarian: librarianRoutes,
  };

  // role অনুযায়ী base path (admin শুধু /dashboard, বাকিরা /role)
  const roleBasePath: Record<string, string> = {
    admin: "/dashboard",
    mentor: "/mentor",
    teacher: "/teacher",
  };

  // রোল অনুযায়ী রাউট ফিল্টার করা
  const routes = userRole ? roleRoutes[userRole] || [] : [];
  const basePath = userRole ? roleBasePath[userRole] || "/dashboard" : "/dashboard";

  // রাউটগুলো গ্রুপ অনুযায়ী সাজানো
  const groupedRoutes = routes.reduce((acc: any, item: any) => {
    const group = item.group || "Others";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-[#033320]">
      <SidebarHeader className="border-b border-[#0a4a2a] p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#CF962C] text-white shadow-lg">
            <Moon className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-lg leading-tight text-white">বাউনিয়া</p>
              <p className="text-xs uppercase tracking-widest text-[#6b9b7b]">আবদুল জলিল উচ্চ বিদ্যালয়</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 hide-scrollbar overflow-y-auto">
        {Object.entries(groupedRoutes).map(([groupName, items]: any) => (
          <SidebarGroup key={groupName}>
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b9b7b]/80">
                {groupName}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {items.map((item: any) => {
                  const fullPath = item.index ? basePath : `${basePath}/${item.path}`;
                  const isActive = pathname === fullPath;

                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.name}
                        className={`h-8 px-4 transition-all duration-300 rounded-lg ${
                          isActive
                            ? "bg-[#014B27] text-white shadow-md border-l-4 border-[#CF962C]"
                            : "text-[#dbe1eb] hover:bg-[#033320]/60 hover:text-white"
                        }`}
                      >
                        <Link to={fullPath} className="flex items-center gap-4">
                          <div className={`shrink-0 transition-colors ${isActive ? "text-[#CF962C]" : "text-[#6b9b7b]"}`}>
                            {React.cloneElement(item.icon, { size: 20 })}
                          </div>
                          {!collapsed && <span className="text-sm font-semibold">{item.name}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-[#0a4a2a] p-4">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#014B27] text-[#CF962C] font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs text-[#6b9b7b] capitalize">{userRole}</p>
            </div>
          )}
        </div>
      </SidebarFooter>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </Sidebar>
  );
}

// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Moon } from "lucide-react";
// import {
//   Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
//   SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
//   SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
// } from "@/components/ui/sidebar";
// import { useTypedSelector } from "@/redux/hooks";
// import { adminRoutes } from "@/routes/admin.routes";
// import { mentorRoutes } from "@/routes/mentor.routes";
// import { teacherRoutes } from "@/routes/teacher.routes";
// // import { mentorRoutes } from "@/routes/mentor.routes";

// export function AppSidebar() {
//   const { state } = useSidebar();
//   const collapsed = state === "collapsed";
//   const { pathname } = useLocation();
  
//   // রিডাক্স থেকে ইউজার ডাটা নেওয়া
//   const { user } = useTypedSelector((state) => state.auth);
//   const userRole = user?.role || "admin"; 


//    const roleRoutes: Record<string, any[]> = {
//   admin: adminRoutes,
//   mentor: mentorRoutes,
//   teacher: teacherRoutes,
//   // student: studentRoutes,
//   // librarian: librarianRoutes,
// };
//   // রোল অনুযায়ী রাউট ফিল্টার করা
//   const routes = roleRoutes[userRole] || [];

//   // রাউটগুলো গ্রুপ অনুযায়ী সাজানো
//   const groupedRoutes = routes.reduce((acc: any, item: any) => {
//     const group = item.group || "Others";
//     if (!acc[group]) acc[group] = [];
//     acc[group].push(item);
//     return acc;
//   }, {});

//   return (
//     <Sidebar collapsible="icon" className="border-r-0 bg-[#033320]">
//       <SidebarHeader className="border-b border-[#0a4a2a] p-4">
//         <div className="flex items-center gap-3">
//           <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#CF962C] text-white shadow-lg">
//             <Moon className="h-6 w-6" />
//           </div>
//           {!collapsed && (
//             <div className="min-w-0">
//               <p className="font-bold text-lg leading-tight text-white">Al-Noor</p>
//               <p className="text-xs uppercase tracking-widest text-[#6b9b7b]">Madrasha</p>
//             </div>
//           )}
//         </div>
//       </SidebarHeader>

//       <SidebarContent className="px-3 hide-scrollbar overflow-y-auto">
//         {Object.entries(groupedRoutes).map(([groupName, items]: any) => (
//           <SidebarGroup key={groupName}>
//             {!collapsed && (
//               <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b9b7b]/80">
//                 {groupName}
//               </SidebarGroupLabel>
//             )}
//             <SidebarGroupContent>
//               <SidebarMenu className="gap-1">
//                 {items.map((item: any) => {
//                   const fullPath = item.index ? "/dashboard" : `/dashboard/${item.path}`;
//                   const isActive = pathname === fullPath;

//                   return (
//                     <SidebarMenuItem key={item.name}>
//                       <SidebarMenuButton
//                         asChild
//                         tooltip={item.name}
//                         className={`h-8 px-4 transition-all duration-300 rounded-lg ${
//                           isActive
//                             ? "bg-[#014B27] text-white shadow-md border-l-4 border-[#CF962C]"
//                             : "text-[#dbe1eb] hover:bg-[#033320]/60 hover:text-white"
//                         }`}
//                       >
//                         <Link to={fullPath} className="flex items-center gap-4">
//                           <div className={`shrink-0 transition-colors ${isActive ? "text-[#CF962C]" : "text-[#6b9b7b]"}`}>
//                             {React.cloneElement(item.icon, { size: 20 })}
//                           </div>
//                           {!collapsed && <span className="text-sm font-semibold">{item.name}</span>}
//                         </Link>
//                       </SidebarMenuButton>
//                     </SidebarMenuItem>
//                   );
//                 })}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         ))}
//       </SidebarContent>

//       <SidebarFooter className="border-t border-[#0a4a2a] p-4">
//         <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
//           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#014B27] text-[#CF962C] font-bold">
//             {user?.name?.charAt(0) || "U"}
//           </div>
//           {!collapsed && (
//             <div className="min-w-0 flex-1">
//               <p className="text-sm font-bold text-white truncate">{user?.name || "User"}</p>
//               <p className="text-xs text-[#6b9b7b] capitalize">{userRole}</p>
//             </div>
//           )}
//         </div>
//       </SidebarFooter>

//       <style jsx>{`
//         .hide-scrollbar::-webkit-scrollbar { display: none; }
//         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>
//     </Sidebar>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Moon } from "lucide-react";
// import { toast } from "sonner";
// import {
//   Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
//   SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
//   SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
// } from "@/components/ui/sidebar";
// import { adminRoutes } from "@/routes/admin.routes";
// import { mentorRoutes } from "@/routes/mentor.routes";
// import { useTypedSelector } from "@/redux/hooks";

// export function AppSidebar() {
//   const { state } = useSidebar();
//   const collapsed = state === "collapsed";
//   const { pathname } = useLocation();
//   const { user } = useTypedSelector((state) => state.auth);

  
//   // রুটগুলো গ্রুপ অনুযায়ী সাজানোর জন্য একটি অবজেক্ট তৈরি
//   const groupedRoutes = adminRoutes.reduce((acc: any, item: any) => {
//     const group = item.group || "Others";
//     if (!acc[group]) acc[group] = [];
//     acc[group].push(item);
//     return acc;
//   }, {});

//   return (
//     <Sidebar collapsible="icon" className="border-r-0 bg-[#033320]">
//       <SidebarHeader className="border-b border-[#0a4a2a] p-4">
//         <div className="flex items-center gap-3">
//           <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#CF962C] text-white shadow-lg">
//             <Moon className="h-6 w-6" />
//           </div>
//           {!collapsed && (
//             <div className="min-w-0">
//               <p className="font-bold text-lg leading-tight text-white">Al-Noor</p>
//               <p className="text-xs uppercase tracking-widest text-[#6b9b7b]">Madrasha</p>
//             </div>
//           )}
//         </div>
//       </SidebarHeader>

//       <SidebarContent className="px-3  hide-scrollbar overflow-y-auto">
//         {Object.entries(groupedRoutes).map(([groupName, items]: any) => (
//           <SidebarGroup key={groupName}>
//             {!collapsed && (
//               <SidebarGroupLabel className=" text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b9b7b]/80">
//                 {groupName}
//               </SidebarGroupLabel>
//             )}
//             <SidebarGroupContent>
//               <SidebarMenu className="gap-1">
//                 {items.map((item: any) => {
//                   const fullPath = item.index ? "/dashboard" : `/dashboard/${item.path}`;
//                   const isActive = pathname === fullPath;

//                   return (
//                     <SidebarMenuItem key={item.name}>
//                       <SidebarMenuButton
//                         asChild
//                         tooltip={item.name}
//                         className={`h-8 px-4 transition-all duration-300 rounded-lg ${
//                           isActive
//                             ? "bg-[#014B27] text-white shadow-md border-l-4 border-[#CF962C]"
//                             : "text-[#dbe1eb] hover:bg-[#033320]/60 hover:text-white"
//                         }`}
//                       >
//                         <Link to={fullPath} className="flex items-center gap-4">
//                           <div className={`shrink-0 transition-colors ${isActive ? "text-[#CF962C]" : "text-[#6b9b7b]"}`}>
//                             {React.cloneElement(item.icon, { size: 20 })}
//                           </div>
//                           {!collapsed && <span className="text-sm font-semibold">{item.name}</span>}
//                         </Link>
//                       </SidebarMenuButton>
//                     </SidebarMenuItem>
//                   );
//                 })}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         ))}
//       </SidebarContent>

//       <SidebarFooter className="border-t border-[#0a4a2a] p-4">
//         <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
//           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#014B27] text-[#CF962C] font-bold">
//             MA
//           </div>
//           {!collapsed && (
//             <div className="min-w-0 flex-1">
//               <p className="text-sm font-bold text-white truncate">Mufti Abdullah</p>
//               <p className="text-xs text-[#6b9b7b]">Super Admin</p>
//             </div>
//           )}
//         </div>
//       </SidebarFooter>

//       <style jsx>{`
//         .hide-scrollbar::-webkit-scrollbar { display: none; }
//         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>
//     </Sidebar>
//   );
// }

// import React, { useEffect, useState } from "react"; // React এখানে যোগ করুন

// import { Link, useLocation } from "react-router-dom";
// import { Moon } from "lucide-react";
// import { toast } from "sonner";
// import {
//   Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
//   SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
//   SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
// } from "@/components/ui/sidebar";
// // import { useEffect, useState } from "react";
// import { adminRoutes } from "@/routes/admin.routes";
// import { useTypedSelector } from "@/redux/hooks";

// export function AppSidebar() {
//   const { state } = useSidebar();
//   const collapsed = state === "collapsed";
//   const { pathname } = useLocation();
//   const [sidebarItems, setSidebarItems] = useState<any[]>([]);
//   const { user } = useTypedSelector((state) => state.auth);

//   useEffect(() => {
//     if (user?.role === "admin") setSidebarItems(adminRoutes);
//   }, [user]);

//   const handleComingSoon = (e: React.MouseEvent, title: string) => {
//     e.preventDefault();
//     toast.info(`${title} module coming soon`);
//   };

//   return (
//     <Sidebar collapsible="icon" className="border-r-0 bg-[#033320]">
//       <SidebarHeader className="border-b border-[#0a4a2a] p-4">
//         <div className="flex items-center gap-3">
//           <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#CF962C] text-white shadow-lg">
//             <Moon className="h-6 w-6" />
//           </div>
//           {!collapsed && (
//             <div className="min-w-0">
//               <p className="font-bold text-lg leading-tight text-white">Al-Noor</p>
//               <p className="text-xs uppercase tracking-widest text-[#6b9b7b]">Madrasha</p>
//             </div>
//           )}
//         </div>
//       </SidebarHeader>

//       <SidebarContent className="px-3 py-4 hide-scrollbar overflow-y-auto">
//         <SidebarGroup>
//           {/* গ্রুপ লেবেলটি এখন ডাইনামিক */}
//           {!collapsed && (
//             <SidebarGroupLabel className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b9b7b]/80">
//               Management Menu
//             </SidebarGroupLabel>
//           )}
//           <SidebarGroupContent>
//             <SidebarMenu className="gap-1.5">
//               {sidebarItems.map((item) => {
//                 const fullPath = item.index ? "/dashboard" : `/dashboard/${item.path}`;
//                 const isActive = pathname === fullPath;

//                 return (
//                   <SidebarMenuItem key={item.name}>
//                     <SidebarMenuButton
//                       asChild
//                       tooltip={item.name}
//                       className={`h-11 px-4 transition-all duration-300 rounded-lg ${
//                         isActive 
//                           ? "bg-[#014B27] text-white shadow-md border-l-4 border-[#CF962C]" 
//                           : "text-[#94a3b8] hover:bg-[#033320]/60 hover:text-white"
//                       }`}
//                     >
//                       <Link to={fullPath} className="flex items-center gap-4">
//                         {/* আইকন বড় করা হয়েছে */}
//                         <div className={`shrink-0 transition-colors ${isActive ? "text-[#CF962C]" : "text-[#6b9b7b]"}`}>
//                           {React.cloneElement(item.icon, { size: 20 })}
//                         </div>
//                         {!collapsed && <span className="text-sm font-semibold">{item.name}</span>}
//                       </Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 );
//               })}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       <SidebarFooter className="border-t border-[#0a4a2a] p-4">
//         <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
//           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#014B27] text-[#CF962C] font-bold">
//             MA
//           </div>
//           {!collapsed && (
//             <div className="min-w-0 flex-1">
//               <p className="text-sm font-bold text-white truncate">Mufti Abdullah</p>
//               <p className="text-xs text-[#6b9b7b]">Super Admin</p>
//             </div>
//           )}
//         </div>
//       </SidebarFooter>
      
//       <style jsx>{`
//         .hide-scrollbar::-webkit-scrollbar { display: none; }
//         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>
//     </Sidebar>
//   );
// }

// import { Link, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard, Users, GraduationCap, BookOpen, CalendarCheck,
//   ClipboardList, Wallet, Building2, Library, Bus, Megaphone,
//   CalendarDays, MessageSquare, BarChart3, Globe, Settings,
//   UserCog, HeartHandshake, School, BookMarked, Moon,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
//   SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
//   SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
// } from "@/components/ui/sidebar";
// import { useEffect, useState } from "react";
// import { adminRoutes } from "@/routes/admin.routes";
// import { useTypedSelector } from "@/redux/hooks";

// // সাইডবার মেনু গ্রুপ
// const groups = [
//   {
//     label: "Overview",
//     items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, live: true }],
//   },
//   {
//     label: "Academic",
//     items: [
//       { title: "Students", url: "/dashboard/students", icon: Users, live: true },
//       { title: "Admissions", url: "/dashboard/admissions", icon: ClipboardList, live: true },
//       { title: "Teachers", url: "/dashboard/teachers", icon: GraduationCap, live: true },
//       { title: "Hifz Program", url: "/dashboard/hifz", icon: BookMarked, live: true },
//       { title: "Classes & Subjects", url: "/dashboard/classes", icon: School, live: true },
//       { title: "Attendance", url: "/dashboard/attendance", icon: CalendarCheck, live: true },
//       { title: "Examinations", url: "/dashboard/exams", icon: BookOpen, live: true },
//     ],
//   },
//   {
//     label: "Operations",
//     items: [
//       { title: "Fees & Finance", url: "/dashboard/finance", icon: Wallet, live: true },
//       { title: "Hostel", url: "/dashboard/hostel", icon: Building2, live: true },
//       { title: "Library", url: "/dashboard/library", icon: Library, live: true },
//       { title: "Transport", url: "/dashboard/transport", icon: Bus, live: true },
//       { title: "Staff", url: "/dashboard/staff", icon: UserCog, live: true },
//     ],
//   },
//   {
//     label: "Engagement",
//     items: [
//       { title: "Parents", url: "/dashboard/parents", icon: HeartHandshake, live: true },
//       { title: "Notice Board", url: "/dashboard/notices", icon: Megaphone, live: true },
//       { title: "Events & Mahfil", url: "/dashboard/events", icon: CalendarDays, live: true },
//       { title: "Communication", url: "/dashboard/communication", icon: MessageSquare, live: true },
//     ],
//   },
//   {
//     label: "System",
//     items: [
//       { title: "Reports", url: "/dashboard/reports", icon: BarChart3, live: true },
//       { title: "Website", url: "/dashboard/website", icon: Globe, live: true },
//       { title: "Settings", url: "/dashboard/settings", icon: Settings, live: true },
//     ],
//   },
// ];

// export function AppSidebar() {
//   const { state } = useSidebar();
//   const collapsed = state === "collapsed";
//   const { pathname } = useLocation();
//   const [sidebarItems, setSidebarItems] = useState<any[]>([]);
//   const { user, isLoading } = useTypedSelector((state) => state.auth);
// console.log(sidebarItems, "sidebar items form router admin")
//   const handleComingSoon = (e: React.MouseEvent, title: string) => {
//     e.preventDefault();
//     toast.info(`${title} module coming soon`);
//   };


//     useEffect(() => {
//     // if (isLoading) return;

//     if (!user) {
//       setSidebarItems([]);
//       return;
//     }
//     const role = user.role?.toLowerCase();
//     switch (role) {
//       case "admin":
//         setSidebarItems(adminRoutes);
//         break;
//       case "mentor":
        // setSidebarItems(mentorRoutes);
//         break;

//         break;
//       default:
//         setSidebarItems([]);
//     }
//   }, [user, isLoading]);


//   const basePath =
//     user?.role === "admin"
//       ? "/dashboard"
//       : user?.role === "mentor"
//       ? "/mentor"
//       : "/student";



//   return (
//     <Sidebar collapsible="icon" className="border-r-0 bg-[#033320]">
//       <SidebarHeader className="border-b border-[#0a4a2a]">
//         <div className="flex items-center gap-3 px-2 py-3">
//           <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#CF962C] text-white shadow-md">
//             <Moon className="h-5 w-5" />
//           </div>
//           {!collapsed && (
//             <div className="min-w-0">
//               <p className="font-semibold text-base leading-tight text-white">Al-Noor Madrasha</p>
//               <p className="text-[11px] uppercase tracking-wider text-[#6b9b7b]">Management Suite</p>
//             </div>
//           )}
//         </div>
//       </SidebarHeader>
      

// <SidebarContent className="px-1 py-2 hide-scrollbar overflow-y-auto">
//   <SidebarGroup>
//     {!collapsed && (
//       <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b9b7b]">
//         Menu
//       </SidebarGroupLabel>
//     )}
//     <SidebarGroupContent>
//       <SidebarMenu>
//         {sidebarItems.map((item) => {
//           // রুট পাথ ড্যাশবোর্ড হলে "/dashboard/home" হবে
//           const fullPath = item.index ? "/dashboard" : `/dashboard/${item.path}`;
//           const isActive = pathname === fullPath;

//           return (
//             <SidebarMenuItem key={item.name}>
//               <SidebarMenuButton
//                 asChild
//                 tooltip={item.name}
//                 className={`transition-all duration-200 ${
//                   isActive 
//                     ? "bg-[#014B27] text-white border-l-4 border-[#CF962C] hover:bg-[#014B27]" 
//                     : "text-[#94a3b8] hover:bg-[#033320]/50 hover:text-white"
//                 }`}
//               >
//                 <Link to={fullPath} className="flex items-center gap-3">
//                   {/* আইকনটি যেহেতু রুটস ফাইলে কম্পোনেন্ট হিসেবে আছে, তাই সরাসরি রেন্ডার হবে */}
//                   <div className={`h-4 w-4 shrink-0 ${isActive ? "text-[#CF962C]" : ""}`}>
//                     {item.icon}
//                   </div>
//                   <span>{item.name}</span>
//                 </Link>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           );
//         })}
//       </SidebarMenu>
//     </SidebarGroupContent>
//   </SidebarGroup>
// </SidebarContent>

//       {/* <SidebarContent className="px-1 py-2 hide-scrollbar overflow-y-auto">
//         {groups.map((group) => (
//           <SidebarGroup key={group.label}>
//             {!collapsed && (
//               <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b9b7b]">
//                 {group.label}
//               </SidebarGroupLabel>
//             )}
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {group.items.map((item) => {
//                   const isActive = pathname === item.url;
//                   return (
//                     <SidebarMenuItem key={item.title}>
//                       <SidebarMenuButton
//                         asChild
//                         tooltip={item.title}
//                         className={`transition-all duration-200 ${
//                           isActive 
//                             ? "bg-[#014B27] text-white border-l-4 border-[#CF962C] hover:bg-[#014B27]" 
//                             : "text-[#94a3b8] hover:bg-[#033320]/50 hover:text-white"
//                         }`}
//                       >
//                         {item.live ? (
//                           <Link to={item.url} className="flex items-center gap-3">
//                             <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#CF962C]" : ""}`} />
//                             <span>{item.title}</span>
//                           </Link>
//                         ) : (
//                           <button onClick={(e) => handleComingSoon(e, item.title)} className="flex items-center gap-3 w-full">
//                             <item.icon className="h-4 w-4 shrink-0" />
//                             <span>{item.title}</span>
//                           </button>
//                         )}
//                       </SidebarMenuButton>
//                     </SidebarMenuItem>
//                   );
//                 })}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         ))}
//       </SidebarContent> */}

//       <SidebarFooter className="border-t border-[#0a4a2a] p-2">
//         <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : "px-2"}`}>
//           <div className="grid h-9 w-9 place-items-center rounded-full bg-[#014B27] text-[#CF962C] text-sm font-semibold">
//             MA
//           </div>
//           {!collapsed && (
//             <div className="min-w-0 flex-1">
//               <p className="truncate text-sm font-medium text-white">Mufti Abdullah</p>
//               <p className="truncate text-xs text-[#6b9b7b]">Super Admin</p>
//             </div>
//           )}
//         </div>
//       </SidebarFooter>
//       <style jsx>{`
//         /* সাইডবারের স্ক্রলবার লুকানোর জন্য */
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none; /* Chrome, Safari and Opera */
//         }
//         .hide-scrollbar {
//           -ms-overflow-style: none; /* IE and Edge */
//           scrollbar-width: none; /* Firefox */
//         }
//       `}</style>
//     </Sidebar>

//   );
// }


// // src/components/layout/AppSidebar.tsx
// import React, { useState } from "react";
// import { Layout, Spin, Avatar, Tooltip, Modal } from "antd";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useTypedSelector } from "@/redux/hooks";
// import {
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   Power,
//   LayoutDashboard,
//   Users,
//   ClipboardList,
//   GraduationCap,
//   BookMarked,
//   School,
//   CalendarCheck,
//   BookOpen,
//   Wallet,
//   Building2,
//   Library,
//   Bus,
//   UserCog,
//   HeartHandshake,
//   Megaphone,
//   CalendarDays,
//   MessageSquare,
//   BarChart3,
//   Globe,
//   Settings,
//   Moon,
// } from "lucide-react";
// import {
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "../ui/sidebar";

// const { Sider } = Layout;

// export const AppSidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, isLoading } = useTypedSelector((state) => state.auth);

//   const groups = [
//     {
//       label: "OVERVIEW",
//       items: [
//         { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
//       ],
//     },
//     {
//       label: "ACADEMIC",
//       items: [
//         { title: "Students", path: "/dashboard/student", icon: Users },
//         {
//           title: "Admissions",
//           path: "/dashboard/admissions",
//           icon: ClipboardList,
//         },
//         { title: "Teachers", path: "/dashboard/teachers", icon: GraduationCap },
//         { title: "Hifz Program", path: "/dashboard/hifz", icon: BookMarked },
//         {
//           title: "Classes & Subjects",
//           path: "/dashboard/classes",
//           icon: School,
//         },
//         {
//           title: "Attendance",
//           path: "/dashboard/attendance",
//           icon: CalendarCheck,
//         },
//         {
//           title: "Examinations",
//           path: "/dashboard/examinations",
//           icon: BookOpen,
//         },
//       ],
//     },
//     {
//       label: "OPERATIONS",
//       items: [
//         { title: "Fees & Finance", path: "/dashboard/fees", icon: Wallet },
//         { title: "Hostel", path: "/dashboard/hostel", icon: Building2 },
//         { title: "Library", path: "/dashboard/library", icon: Library },
//         { title: "Transport", path: "/dashboard/transport", icon: Bus },
//         { title: "Staff", path: "/dashboard/staff", icon: UserCog },
//       ],
//     },
//     {
//       label: "ENGAGEMENT",
//       items: [
//         { title: "Parents", path: "/dashboard/parents", icon: HeartHandshake },
//         { title: "Notice Board", path: "/dashboard/notice", icon: Megaphone },
//         {
//           title: "Events & Mahfil",
//           path: "/dashboard/events",
//           icon: CalendarDays,
//         },
//         {
//           title: "Communication",
//           path: "/dashboard/communication",
//           icon: MessageSquare,
//         },
//       ],
//     },
//     {
//       label: "SYSTEM",
//       items: [
//         { title: "Reports", path: "/dashboard/reports", icon: BarChart3 },
//         { title: "Website", path: "/dashboard/website", icon: Globe },
//         { title: "Settings", path: "/dashboard/settings", icon: Settings },
//       ],
//     },
//   ];

//   const pathname = location.pathname;

//   const handleLogout = async () => {
//     setIsLoggingOut(true);
//     try {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("user");
//       setTimeout(() => {
//         setIsLoggingOut(false);
//         setShowLogoutModal(false);
//         navigate("/login");
//       }, 1000);
//     } catch (error) {
//       console.error("❌ Logout failed:", error);
//       setIsLoggingOut(false);
//       setShowLogoutModal(false);
//     }
//   };

//   const getInitials = (name: string | undefined) => {
//     if (!name) return "U";
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   const getUserName = () => user?.name || "User";
//   const getUserRole = () => user?.role || "Super Admin";

//   if (isLoading) {
//     return (
//       <Sider
//         width={260}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           background: "#033320",
//         }}
//       >
//         <Spin size="large" />
//       </Sider>
//     );
//   }

//   return (
//     <>
//       <Sider
//         collapsible
//         collapsed={collapsed}
//         onCollapse={() => setCollapsed(!collapsed)}
//         width={260}
//         trigger={null}
//         style={{
//           height: "100vh",
//           position: "sticky",
//           top: 0,
//           left: 0,
//           background: "#033320",
//           boxShadow: "4px 0 20px rgba(0, 0, 0, 0.3)",
//           overflowY: "auto",
//           overflowX: "hidden",
//           display: "flex",
//           flexDirection: "column",
//         }}
//         className="custom-scrollbar"
//       >
//         {/* Logo Section - Al-Noor Madrasha */}

//         <div className="flex-shrink-0">
//           <div className="flex items-center justify-between p-4 border-b border-[#0a4a2a]">
//             {!collapsed && (
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-[#f6673b] to-[#dd0546] rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
//                   <span className="text-white font-bold text-lg"> <Moon className="h-5 w-5" /></span>
//                 </div>
//                 <div>
//                   <span className="text-white font-bold text-base tracking-wide block leading-tight">
//                     Al-Noor
//                   </span>
//                   <span className="text-[10px] text-[#94a3b8] font-medium tracking-wider uppercase">
//                     Madrasha
//                   </span>
//                 </div>
//               </div>
//             )}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className={`p-1.5 rounded-lg hover:bg-[#0a4a2a] transition-all duration-300 ${
//                 collapsed ? "mx-auto" : ""
//               }`}
//             >
//               {collapsed ? (
//                 <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
//               ) : (
//                 <ChevronLeft className="w-4 h-4 text-[#94a3b8]" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Navigation Menu */}
//         <SidebarContent className="px-2 py-2">
//           {groups.map((group) => (
//             <SidebarGroup key={group.label}>
//               {!collapsed && (
//                 <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#014B27]/70 px-3 py-2">
//                   {group.label}
//                 </SidebarGroupLabel>
//               )}
//               <SidebarGroupContent>
//                 <SidebarMenu>
//                   {group.items.map((item) => {
//                     // Fix: Dashboard এর জন্য সঠিক মিল খোঁজা
//                     // যদি আইটেমটি Dashboard হয়, তবে pathname হুবহু dashboard বা root হতে হবে
//                     // অন্যথায় item.path এর সাথে pathname মিলে কি না তা দেখা।
//                     const isActive =
//                       item.path === "/dashboard"
//                         ? pathname === "/dashboard" || pathname === "/"
//                         : pathname.startsWith(item.path);

//                     return (
//                       <SidebarMenuItem key={item.title}>
//                         <SidebarMenuButton
//                           asChild
//                           tooltip={collapsed ? item.title : undefined}
//                           // data-active ব্যবহার করার পাশাপাশি সরাসরি className এও কন্ডিশন রাখা নিরাপদ
//                           className={`
//           w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
//           ${
//             isActive
//               ? "bg-[#014B27] text-white border-l-4 border-[#CF962C]"
//               : "text-[#94a3b8] hover:bg-[#033320]/50 hover:text-white"
//           }
//         `}
//                         >
//                           <Link
//                             to={item.path}
//                             className="flex items-center gap-3 w-full"
//                           >
//                             <item.icon
//                               className={`h-4 w-4 shrink-0 transition-colors duration-200
//               ${isActive ? "text-[#CF962C]" : "text-[#6b9b7b] group-hover:text-white"}
//             `}
//                             />
//                             <span className="text-sm font-medium">
//                               {item.title}
//                             </span>
//                           </Link>
//                         </SidebarMenuButton>
//                       </SidebarMenuItem>
//                     );
//                   })}
//                 </SidebarMenu>
//               </SidebarGroupContent>
//             </SidebarGroup>
//           ))}
//         </SidebarContent>

//         {/* Bottom Section */}


//           <SidebarFooter className="border-t border-sidebar-border/60">
//         {!collapsed ? (
//           <div className="flex items-center gap-3 px-2 py-2">
//             <div className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-sm font-semibold">
//               MA
//             </div>
//             <div className="min-w-0 flex-1">
//               <p className="truncate text-sm font-medium text-sidebar-foreground">Mufti Abdullah</p>
//               <p className="truncate text-xs text-sidebar-foreground/60">Super Admin</p>
//             </div>
//           </div>
//         ) : (
//           <div className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold mx-auto my-1">
//             MA
//           </div>
//         )}
//       </SidebarFooter>






//         <div className="flex-shrink-0 border-t border-[#0a4a2a] bg-[#033320]/95 backdrop-blur-sm">
//           {!collapsed && (
//             <div className="px-4 py-2">
//               <div className="text-[9px] font-bold text-[#6b9b7b] uppercase tracking-widest text-center">
//                 Management Suite
//               </div>
//             </div>
//           )}

//           <div className={`p-4 ${collapsed ? "px-2" : ""} pt-2`}>
//             <Tooltip title={collapsed ? "Logout" : ""} placement="right">
//               <button
//                 onClick={() => setShowLogoutModal(true)}
//                 className={`
//                   w-full relative overflow-hidden group
//                   ${collapsed ? "flex justify-center p-2.5" : "flex items-center space-x-3 px-4 py-2.5"}
//                   rounded-lg transition-all duration-300
//                   hover:bg-[#0a4a2a]
//                 `}
//               >
//                 <LogOut
//                   className={`w-4 h-4 text-[#6b9b7b] group-hover:text-[#94a3b8] transition-colors`}
//                 />
//                 {!collapsed && (
//                   <span className="text-sm font-medium text-[#6b9b7b] group-hover:text-[#94a3b8] transition-colors">
//                     Logout
//                   </span>
//                 )}
//               </button>
//             </Tooltip>
//           </div>
//         </div>


//       </Sider>

//       {/* Logout Confirmation Modal */}
//       <Modal
//         open={showLogoutModal}
//         onCancel={() => !isLoggingOut && setShowLogoutModal(false)}
//         footer={null}
//         closable={false}
//         centered
//         width={400}
//         className="logout-modal"
//         maskClosable={!isLoggingOut}
//       >
//         <div className="text-center p-6">
//           <div className="relative inline-block mb-4">
//             <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
//             <div className="relative bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-4 shadow-lg">
//               <Power className="w-8 h-8 text-white" />
//             </div>
//           </div>
//           <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
//             Sign Out
//           </h3>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">
//             Are you sure you want to sign out from your account?
//           </p>
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => setShowLogoutModal(false)}
//               disabled={isLoggingOut}
//               className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleLogout}
//               disabled={isLoggingOut}
//               className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//             >
//               {isLoggingOut ? (
//                 <>
//                   <Spin size="small" className="mr-2" />
//                   <span>Signing out...</span>
//                 </>
//               ) : (
//                 <>
//                   <LogOut className="w-4 h-4" />
//                   <span>Sign Out</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: rgba(255, 255, 255, 0.02);
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(255, 255, 255, 0.1);
//           border-radius: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgba(255, 255, 255, 0.2);
//         }
//         :global(.logout-modal .ant-modal-content) {
//           background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
//           border-radius: 20px;
//           padding: 0;
//           overflow: hidden;
//         }
//         :global(.dark .logout-modal .ant-modal-content) {
//           background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
//         }
//         :global(.logout-modal .ant-modal-body) {
//           padding: 0;
//         }
//       `}</style>
//     </>
//   );
// };

// // src/components/layout/AppSidebar.tsx
// import { Layout, Menu, Spin, Divider, Avatar, Badge, Tooltip, Modal } from "antd";
// import { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import SubMenu from "antd/es/menu/SubMenu";
// import { useTypedSelector } from "@/redux/hooks";
// import {
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   HelpCircle,
//   Power,
//   Settings,
// } from "lucide-react";

// import { adminRoutes } from "@/routes/admin.routes";
// import { mentorRoutes } from "@/routes/mentor.routes";
// const { Sider } = Layout;

// export const AppSidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [openKeys, setOpenKeys] = useState<string[]>([]);
//   const [sidebarItems, setSidebarItems] = useState<any[]>([]);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const currentPath = location.pathname;
//   const { user, isLoading } = useTypedSelector((state) => state.auth);

//   // Wait for Redux user to load
//   useEffect(() => {
//     // if (isLoading) return;

//     if (!user) {
//       setSidebarItems([]);
//       return;
//     }
//     const role = user.role?.toLowerCase();
//     switch (role) {
//       case "admin":
//         setSidebarItems(adminRoutes);
//         break;
//       case "mentor":
//         setSidebarItems(mentorRoutes);
//         break;

//         break;
//       default:
//         setSidebarItems([]);
//     }
//   }, [user, isLoading]);

//   // base path for roles
//   const basePath =
//     user?.role === "admin"
//       ? "/dashboard"
//       : user?.role === "mentor"
//       ? "/mentor"
//       : "/student";

//   const onOpenChange = (keys: string[]) => {
//     const latestOpenKey = keys.find((key) => !openKeys.includes(key));
//     setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
//   };

//   const handleLogout = async () => {
//     setIsLoggingOut(true);
//     try {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("user");
//       console.log("✅ Logged out successfully");
//       setTimeout(() => {
//         setIsLoggingOut(false);
//         setShowLogoutModal(false);
//         navigate("/login");
//       }, 1000);
//     } catch (error) {
//       console.error("❌ Logout failed:", error);
//       setIsLoggingOut(false);
//       setShowLogoutModal(false);
//     }
//   };

//   // Get user initials for avatar
//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // Get gradient color based on role
//   const getRoleGradient = (role: string) => {
//     switch (role?.toLowerCase()) {
//       case "admin":
//         return "from-red-500 to-pink-500";
//       case "mentor":
//         return "from-blue-500 to-indigo-500";
//       case "student":
//         return "from-green-500 to-emerald-500";
//       default:
//         return "from-gray-500 to-gray-600";
//     }
//   };

//   // Get role badge color
//   const getRoleBadgeColor = (role: string) => {
//     switch (role?.toLowerCase()) {
//       case "admin":
//         return "#f43f5e";
//       case "mentor":
//         return "#3b82f6";
//       case "student":
//         return "#10b981";
//       default:
//         return "#6b7280";
//     }
//   };

//   if (isLoading || !user) {
//     return (
//       <Sider
//         collapsible
//         collapsed={collapsed}
//         width={250}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
//         }}
//       >
//         <Spin size="large" />
//       </Sider>
//     );
//   }

//   return (
//     <>
//       <Sider
//         collapsible
//         collapsed={collapsed}
//         onCollapse={() => setCollapsed(!collapsed)}
//         width={260}
//         trigger={null}
//         style={{
//           height: "100vh",
//           position: "sticky",
//           top: 0,
//           left: 0,
//           background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
//           boxShadow: "4px 0 20px rgba(0, 0, 0, 0.08)",
//           overflowY: "auto",
//           overflowX: "hidden",
//           display: "flex",
//           flexDirection: "column",
//         }}
//         className="custom-scrollbar"
//       >
//         {/* Logo and Collapse Button */}
//         <div className="flex-shrink-0">
//           <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
//             {!collapsed && (
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
//                   <span className="text-white font-bold text-lg">L</span>
//                 </div>
//                 <span className="text-white font-bold text-lg tracking-wide">
//                   Upayon
//                 </span>
//               </div>
//             )}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className={`p-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 ${
//                 collapsed ? "mx-auto" : ""
//               }`}
//             >
//               {collapsed ? (
//                 <ChevronRight className="w-4 h-4 text-gray-400" />
//               ) : (
//                 <ChevronLeft className="w-4 h-4 text-gray-400" />
//               )}
//             </button>
//           </div>

//           {/* User Profile Section */}
//           <div className={`p-4 border-b border-gray-700/50 ${collapsed ? "px-2" : ""}`}>
//             <div className="flex items-center space-x-3">
//               {/* <Badge
//                 dot
//                 offset={[-2, 2]}
//                 color={getRoleBadgeColor(user.role)}
//                 className="animate-pulse"
//               >
//                 <Avatar
//                   size={collapsed ? 40 : 48}
//                   style={{
//                     background: `linear-gradient(135deg, ${getRoleBadgeColor(user.role)}80, ${getRoleBadgeColor(user.role)})`,
//                     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
//                   }}
//                   className="transition-all duration-300"
//                 >
//                   {getInitials(user.name)}
//                 </Avatar>
//               </Badge> */}

//               {!collapsed && (
//                 <div className="flex-1 min-w-0">
//                   <Tooltip title={user.name} placement="top">
//                     <h2 className="text-sm font-semibold text-white truncate">
//                       {user?.name}
//                     </h2>
//                   </Tooltip>
//                   <div className="flex items-center space-x-1 mt-0.5">
//                     <div
//                       className={`w-2 h-2 rounded-full bg-gradient-to-r ${getRoleGradient(
//                         user?.name
//                       )}`}
//                     ></div>
//                     <p className="text-xs text-gray-400 capitalize">{user.role}</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>

//         {/* Navigation Menu - Flexible to take remaining space */}
//         <div className="flex-1 overflow-y-auto">
//           <Menu
//             theme="dark"
//             mode="inline"
//             openKeys={openKeys}
//             onOpenChange={onOpenChange}
//             selectedKeys={[currentPath]}
//             style={{
//               background: "transparent",
//               borderRight: 0,
//               marginTop: "8px",
//             }}
//             className="custom-menu"
//           >
//             {sidebarItems.map((item) => {
//               if (item.children && item.children.length > 0) {
//                 return (
//                   <SubMenu
//                     key={item.name}
//                     icon={item.icon}
//                     title={item.name}
//                     className="custom-submenu"
//                   >
//                     {item.children.map((child) => (
//                       <Menu.Item
//                         key={`${basePath}/${child.path}`}
//                         icon={child.icon}
//                         className="custom-menu-item"
//                       >
//                         <Link to={`${basePath}/${child.path}`}>
//                           <span className="text-sm">{child.name}</span>
//                         </Link>
//                       </Menu.Item>
//                     ))}
//                   </SubMenu>
//                 );
//               }

//               return (
//                 <Menu.Item
//                   key={`${basePath}/${item.path}`}
//                   icon={item.icon}
//                   className="custom-menu-item"
//                 >
//                   <Link to={`${basePath}/${item.path}`}>
//                     <span className="text-sm">{item.name}</span>
//                   </Link>
//                 </Menu.Item>
//               );
//             })}
//           </Menu>
//         </div>

//   {/* Bottom Section - Logout and Options */}
// <div className="flex-shrink-0  sticky bottom-0 border-t bg-slate-900 border-gray-700/50 bg-gradient-to-t from-gray-900/30 to-transparent pt-2 mt-4">

//   {/* Help & Support */}
//   {!collapsed && (
//     <div className="px-4 py-1">
//       <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group">
//         <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
//         <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
//           Help & Support
//         </span>
//       </button>
//     </div>
//   )}

//   {/* Stylish Logout Button */}
//   <div className={`p-4 ${collapsed ? "px-2" : ""} pb-6`}>
//     <Tooltip title={collapsed ? "Logout" : ""} placement="right">
//       <button
//         onClick={() => setShowLogoutModal(true)}
//         className={`
//           w-full relative overflow-hidden group
//           ${collapsed ? "flex justify-center p-2.5" : "flex items-center justify-between p-3"}
//           rounded-xl transition-all duration-300
//           bg-gradient-to-r from-red-500/10 to-red-600/10
//           hover:from-red-500/20 hover:to-red-600/20
//           border border-red-500/20 hover:border-red-500/40
//         `}
//       >
//         {/* Animated Background Effect */}
//         <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

//         <div className="flex items-center space-x-3 relative z-10">
//           <div className="relative">
//             <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
//             {!collapsed && (
//               <span className="absolute -top-1 -right-1 flex h-2 w-2">
//                 {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span> */}
//                 {/* <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span> */}
//               </span>
//             )}
//           </div>
//           {!collapsed && (
//             <span className="text-sm font-medium text-red-400 group-hover:text-red-300 transition-colors">
//               Sign Out
//             </span>
//           )}
//         </div>
//       </button>
//     </Tooltip>

//   </div>
// </div>
//       </Sider>

//       {/* Logout Confirmation Modal */}
//       <Modal
//         open={showLogoutModal}
//         onCancel={() => !isLoggingOut && setShowLogoutModal(false)}
//         footer={null}
//         closable={false}
//         centered
//         width={400}
//         className="logout-modal"
//         maskClosable={!isLoggingOut}
//       >
//         <div className="text-center p-6">
//           {/* Animated Icon */}
//           <div className="relative inline-block mb-4">
//             <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
//             <div className="relative bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-4 shadow-lg">
//               <Power className="w-8 h-8 text-white" />
//             </div>
//           </div>

//           <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
//             Sign Out
//           </h3>

//           <p className="text-gray-600 dark:text-gray-400 mb-6">
//             Are you sure you want to sign out from your account?
//           </p>

//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => setShowLogoutModal(false)}
//               disabled={isLoggingOut}
//               className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleLogout}
//               disabled={isLoggingOut}
//               className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//             >
//               {isLoggingOut ? (
//                 <>
//                   <Spin size="small" className="mr-2" />
//                   <span>Signing out...</span>
//                 </>
//               ) : (
//                 <>
//                   <LogOut className="w-4 h-4" />
//                   <span>Sign Out</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }

//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: rgba(255, 255, 255, 0.05);
//         }

//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(255, 255, 255, 0.2);
//           border-radius: 4px;
//         }

//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgba(255, 255, 255, 0.3);
//         }

//         :global(.custom-menu .ant-menu-item) {
//           margin: 4px 8px !important;
//           border-radius: 8px !important;
//           transition: all 0.2s ease !important;
//         }

//         :global(.custom-menu .ant-menu-item:hover) {
//           background: rgba(255, 255, 255, 0.08) !important;
//         }

//         :global(.custom-menu .ant-menu-item-selected) {
//           background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
//           color: white !important;
//         }

//         :global(.custom-menu .ant-menu-submenu-title) {
//           margin: 4px 8px !important;
//           border-radius: 8px !important;
//           transition: all 0.2s ease !important;
//         }

//         :global(.custom-menu .ant-menu-submenu-title:hover) {
//           background: rgba(255, 255, 255, 0.08) !important;
//         }

//         :global(.custom-menu .ant-menu-submenu-open .ant-menu-submenu-title) {
//           background: rgba(255, 255, 255, 0.05) !important;
//         }

//         :global(.custom-menu .ant-menu-item .ant-menu-item-icon) {
//           font-size: 18px !important;
//         }

//         :global(.custom-menu .ant-menu-submenu .ant-menu-submenu-arrow) {
//           color: rgba(255, 255, 255, 0.5) !important;
//         }

//         :global(.logout-modal .ant-modal-content) {
//           background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
//           border-radius: 20px;
//           padding: 0;
//           overflow: hidden;
//         }

//         :global(.dark .logout-modal .ant-modal-content) {
//           background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
//         }

//         :global(.logout-modal .ant-modal-body) {
//           padding: 0;
//         }
//       `}</style>
//     </>
//   );
// };

// src/components/layout/AppSidebar.tsx

// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { BookOpen, ChevronLeft } from "lucide-react";

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarHeader,
//   useSidebar,
// } from "@/components/ui/sidebar";

// import { useTypedSelector } from "@/redux/hooks";

// import { adminRoutes } from "@/routes/admin.routes";
// import { mentorRoutes } from "@/routes/mentor.routes";
// import { studentRoutes } from "@/routes/student.routes";

// import { Menu } from "antd";
// import SubMenu from "antd/es/menu/SubMenu";

// export const AppSidebar = () => {
//   const { user, isLoading } = useTypedSelector((state) => state.auth);

//   const { open, setOpen } = useSidebar();
//   const location = useLocation();
//   const currentPath = location.pathname;

//   const [openKeys, setOpenKeys] = useState<string[]>([]);
//   const [sidebarItems, setSidebarItems] = useState<any[]>([]);

//   // Role based sidebar
//   useEffect(() => {
//     if (isLoading) return;

//     if (!user) {
//       setSidebarItems([]);
//       return;
//     }

//     const role = user.role?.toLowerCase();

//     switch (role) {
//       case "admin":
//         setSidebarItems(adminRoutes);
//         break;
//       case "mentor":
//         setSidebarItems(mentorRoutes);
//         break;
//       case "student":
//         setSidebarItems(studentRoutes);
//         break;
//       default:
//         setSidebarItems([]);
//     }
//   }, [user, isLoading]);

//   // base path for roles
//   const basePath =
//     user?.role === "admin"
//       ? "/dashboard"
//       : user?.role === "mentor"
//       ? "/mentor"
//       : "/student";

//   const onOpenChange = (keys: string[]) => {
//     const latestOpenKey = keys.find((key) => !openKeys.includes(key));
//     setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
//   };

//   if (isLoading || !user) {
//     return (
//       <Sidebar>
//         <div className="flex h-screen items-center justify-center">
//           <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
//         </div>
//       </Sidebar>
//     );
//   }

//   return (
//     <Sidebar className="border-r border-border bg-card shadow-sm">
//       {/* HEADER */}
//       <SidebarHeader className="p-4 border-b border-border">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
//               <BookOpen className="w-4 h-4 text-white" />
//             </div>

//             {open && (
//               <div>
//                 <h2 className="text-lg font-bold text-foreground">
//                   {user.name || "Welcome"}
//                 </h2>
//                 <p>{user.role}</p>
//               </div>
//             )}
//           </div>

//           {open && (
//             <button
//               onClick={() => setOpen(false)}
//               className="p-1 rounded-md hover:bg-accent transition-colors"
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </button>
//           )}
//         </div>
//       </SidebarHeader>

//       {/* MENU */}
//       <SidebarContent className="p-2">
//         <SidebarGroup>
//           <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
//             MAIN MENU
//           </SidebarGroupLabel>

//           <Menu
//             theme="light"
//             mode="inline"
//             openKeys={openKeys}
//             onOpenChange={onOpenChange}
//             selectedKeys={[currentPath]}
//             style={{ borderRight: 0 }}
//           >
//             {sidebarItems.map((item) => {
//               if (item.children && item.children.length > 0) {
//                 return (
//                   <SubMenu key={item.name} icon={item.icon} title={item.name}>
//                     {item.children.map((child) => (
//                       <Menu.Item
//                         key={`${basePath}/${child.path}`}
//                         icon={child.icon}
//                       >
//                         <Link to={`${basePath}/${child.path}`}>
//                           {child.name}
//                         </Link>
//                       </Menu.Item>
//                     ))}
//                   </SubMenu>
//                 );
//               }

//               return (
//                 <Menu.Item key={`${basePath}/${item.path}`} icon={item.icon}>
//                   <Link to={`${basePath}/${item.path}`}>{item.name}</Link>
//                 </Menu.Item>
//               );
//             })}
//           </Menu>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// };
