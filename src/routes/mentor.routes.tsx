import {
  Home,
  UserPlus,
  CalendarCheck,
  GraduationCap,
  Users,
  HeartHandshake,
  CalendarDays,
  ClipboardCheck,
  Wallet,
  Bell,
  UserRound,
  FileBarChart,
  Settings as SettingsIcon,
  Briefcase,
  BookOpen,
  File,
  BookCopy,
  ListChecks,
  Sigma,
  Sliders,
  ClipboardList,
} from "lucide-react";

/* =========================
   PAGES
========================= */
import AdminDashboard from "@/pages/Dashboard";
import AdmissionPage from "@/pages/Admission/AdmissionPage";
import AttendancePage from "@/pages/Attendance/AttendancePage";
import BannerPage from "@/pages/Banner/BannerPage";
import ClassesPage from "@/pages/Classes/ClassesPage";
import ContactPage from "@/pages/Contact/ContactPage";
import DonatePage from "@/pages/Donate/DonatePage";
import EventPage from "@/pages/Event/EventPage";
import ExaminationPage from "@/pages/Examination/ExaminationPage";
import FeesPage from "@/pages/Fees/FeesPage";
import ReportPage from "@/pages/Report/ReportPage";
import StudentPage from "@/pages/Student/StudentPage";
import TeacherPage from "@/pages/Teacher/TeacherPage";
import Noticepage from "@/pages/Notice/Noticepage";
import Staffpage from "@/pages/Staff/Staffpage";
import ParentPage from "@/pages/Parent/ParentPage";

/* =========================
   ACADEMIC ERP MODULES (NEW)
========================= */
import AcademicSessionPage from "@/pages/AcademicSession/AcademicSessionPage";
import SectionPage from "@/pages/Section/SectionPage";
import SubjectPage from "@/pages/Subject/SubjectPage";
import GradeRulePage from "@/pages/GradeRule/GradeRulePage";
import ResultSettingPage from "@/pages/ResultSetting/ResultSettingPage";
import ExamResultPage from "@/pages/ExamResult/ExamResultPage";

export const mentorRoutes = [
  {
    name: "Dashboard",
    path: "home",
    index: true,
    icon: <Home />,
    group: "Overview",
    element: <AdminDashboard />,
  },

  /* =========================
     ACADEMIC CORE
  ========================= */
  {
    name: "Student",
    path: "student",
    icon: <Users />,
    group: "Academic",
    element: <StudentPage />,
  }, 
  {
    name: "Admission",
    path: "admission",
    icon: <UserPlus />,
    group: "Academic",
    element: <AdmissionPage />,
  },
  // {
  //   name: "Attendance",
  //   path: "attendance",
  //   icon: <CalendarCheck />,
  //   group: "Academic",
  //   element: <AttendancePage />,
  // },
  {
    name: "Classes",
    path: "classes",
    icon: <GraduationCap />,
    group: "Academic",
    element: <ClassesPage />,
  },
  {
    name: "Teacher",
    path: "teacher",
    icon: <BookOpen />,
    group: "Academic",
    element: <TeacherPage />,
  },

  // /* =========================
  //    📘 ACADEMIC ERP (NEW MODULES)
  // ========================= */
  // {
  //   name: "Academic Session",
  //   path: "academic-session",
  //   icon: <CalendarDays />,
  //   group: "Academic Setup",
  //   element: <AcademicSessionPage />,
  // },
  // {
  //   name: "Section",
  //   path: "section",
  //   icon: <ListChecks />,
  //   group: "Academic Setup",
  //   element: <SectionPage />,
  // },
  // {
  //   name: "Subject",
  //   path: "subject",
  //   icon: <BookCopy />,
  //   group: "Academic Setup",
  //   element: <SubjectPage />,
  // },
  // {
  //   name: "Exam",
  //   path: "exam",
  //   icon: <ClipboardCheck />,
  //   group: "Examination",
  //   element: <ExaminationPage />,
  // },
  // {
  //   name: "Exam Result",
  //   path: "exam-result",
  //   icon: <Sigma />,
  //   group: "Examination",
  //   element: <ExamResultPage />,
  // },
  // {
  //   name: "Grade Rule",
  //   path: "grade-rule",
  //   icon: <Sliders />,
  //   group: "Examination",
  //   element: <GradeRulePage />,
  // },
  // {
  //   name: "Result Setting",
  //   path: "result-setting",
  //   icon: <ClipboardList />,
  //   group: "Examination",
  //   element: <ResultSettingPage />,
  // },

  // /* =========================
  //    OPERATIONS
  // ========================= */
  // {
  //   name: "Fees",
  //   path: "fees",
  //   icon: <Wallet />,
  //   group: "Operations",
  //   element: <FeesPage />,
  // },
  // {
  //   name: "Staff",
  //   path: "staff",
  //   icon: <Briefcase />,
  //   group: "Operations",
  //   element: <Staffpage />,
  // },
  // {
  //   name: "Donate",
  //   path: "donate",
  //   icon: <HeartHandshake />,
  //   group: "Operations",
  //   element: <DonatePage />,
  // },

  // /* =========================
  //    ENGAGEMENT
  // ========================= */
  // {
  //   name: "Notice",
  //   path: "notice",
  //   icon: <Bell />,
  //   group: "Engagement",
  //   element: <Noticepage />,
  // },
  // {
  //   name: "Event",
  //   path: "event",
  //   icon: <CalendarDays />,
  //   group: "Engagement",
  //   element: <EventPage />,
  // },
  // {
  //   name: "Banner",
  //   path: "banner",
  //   icon: <CalendarDays />,
  //   group: "Engagement",
  //   element: <BannerPage />,
  // },
  // {
  //   name: "Contact",
  //   path: "contact",
  //   icon: <CalendarDays />,
  //   group: "Engagement",
  //   element: <ContactPage />,
  // },
  // {
  //   name: "Parents",
  //   path: "parents",
  //   icon: <UserRound />,
  //   group: "Engagement",
  //   element: <ParentPage />,
  // },

  /* =========================
     SYSTEM
  ========================= */
  {
    name: "Report",
    path: "report",
    icon: <FileBarChart />,
    group: "System",
    element: <ReportPage />,
  },
  {
    name: "Website",
    path: "website",
    icon: <File />,
    group: "System",
    element: <ReportPage />,
  },
  {
    name: "Settings",
    path: "settings",
    icon: <SettingsIcon />,
    group: "System",
    element: <ReportPage />,
  },
];



// import { Home, } from "lucide-react";


// export const mentorRoutes = [
//   {
//     name: "Dashboard",
//     path: "home", // → /mentor
//     icon: <Home />,
//     element: "",
//   },
 
// ];
