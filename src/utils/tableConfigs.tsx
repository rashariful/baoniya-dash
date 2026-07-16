import { ColumnsType, ColumnType } from "antd/es/table";
import { Tag, Typography, Tooltip, Image } from "antd";

// টাইপ এরর সমাধানের জন্য এসএল কলাম
const slColumn: ColumnType<any> = {
  title: "SL",
  width: 60,
  align: "center", // 'left' | 'center' | 'right' এর মধ্যে একটি
  render: (_: any, __: any, index: number) => index + 1,
};

/* =========================
   🎓 STUDENT
========================= */
export const studentColumns: ColumnsType<any> = [
  slColumn,
  {
    title: "Student ID",
    dataIndex: "studentId",
    width: 140,
  },
  {
    title: "Student Name",
    dataIndex: "name",
  },
  {
    title: "Class",
    dataIndex: ["classId", "name"],
  },
  {
    title: "Roll",
    dataIndex: "roll",
    width: 80,
    align: "center",
  },
  {
    title: "Guardian",
    dataIndex: "guardianName",
  },
  {
    title: "Guardian Phone",
    dataIndex: "guardianPhone",
    render: (value) => (
      <Typography.Text copyable>
        {value}
      </Typography.Text>
    ),
  },
  {
    title: "Login Phone",
    dataIndex: ["userId", "phone"],
    render: (value) => (
      <Typography.Text copyable>
        {value}
      </Typography.Text>
    ),
  },
  {
    title: "Status",
    dataIndex: ["userId", "isActive"],
    render: (value) => (
      <Tag color={value ? "success" : "error"}>
        {value ? "Active" : "Inactive"}
      </Tag>
    ),
  },
];

/* =========================
   👨‍🏫 TEACHER
========================= */

export const teacherColumns: ColumnsType<any> = [
  slColumn,
  {
    title: "Thumbnail",
    dataIndex: "thumbnail",
    key: "thumbnail",
    render: (thumbnail: string) =>
      thumbnail ? (
        <Image width={50} height={50} src={thumbnail} alt="Banner" />
      ) : (
        "No Image"
      ),
  },

  {
    title: "Teacher",
    dataIndex: "name",
  },

  {
    title: "Teacher Index",
    dataIndex: "teacherId",
  },

  {
    title: "Teacher ID",
    dataIndex: "teacherId",
  },
   

  {
    title: "Designation",
    dataIndex: "designation",
  },

  {
    title: "Subject",
    dataIndex: "subject",
  },

  {
    title: "Phone",
    dataIndex: "phone",
    render: (value) => (
      <Typography.Text copyable>
        {value || "-"}
      </Typography.Text>
    ),
  },

  // {
  //   title: "Experience",
  //   dataIndex: "teachingExperience",
  //   render: (value) => `${value || 0} Years`,
  // },

  {
    title: "Status",
    dataIndex: "status",
    render: (value) => (
      <Tag color={value === "Active" ? "green" : value === "Inactive" ? "orange" : "red"}>
        {value}
      </Tag>
    ),
  },
];

/* =========================
   👨‍👩‍👧 PARENTS
========================= */
export const parentColumns: ColumnsType<any> = [
  slColumn,
  { title: "Father's Name", dataIndex: "fatherName" },
  { title: "Mother's Name", dataIndex: "motherName" },
  { title: "Phone", dataIndex: "phone", render: (v) => <Typography.Text copyable>{v || "-"}</Typography.Text> },


  //   // 🔥 FIXED HERE
  {
    title: "Student Name",
    dataIndex: ["studentId", "name"],
    key: "studentName",
    render: (name: string) => name || "-",
  },

  {
    title: "Student Roll",
    dataIndex: ["studentId", "roll"],
    key: "studentRoll",
    render: (roll: string) => roll || "-",
  },


];

/* =========================
   💰 DONATION
========================= */
export const donationColumns: ColumnsType<any> = [
  slColumn,
  { title: "Donor Name", dataIndex: "donorName" },
  { title: "Phone", dataIndex: "phone", render: (v) => <Typography.Text copyable>{v}</Typography.Text> },
  { title: "Amount", dataIndex: "amount", render: (v) => `৳ ${v?.toLocaleString()}` },
  { title: "Type", dataIndex: "donationType", render: (v) => <Tag color="blue">{v?.toUpperCase()}</Tag> },
  { 
    title: "Status", 
    dataIndex: "status", 
    render: (v) => <Tag color={v === "completed" ? "green" : "gold"}>{v?.toUpperCase()}</Tag> 
  },
];


export const galleryColumns: ColumnsType<any> = [
  slColumn,
  {
    title: "Thumbnail",
    dataIndex: "thumbnail",
    render: (thumbnail: string) => (
      <Image
        src={thumbnail}
        width={70}
        height={70}
        style={{
          objectFit: "cover",
          borderRadius: 6,
        }}
        preview
      />
    ),
  },
  {
    title: "Gallery Name",
    dataIndex: "name",
  },
   {
    title: "Category Name",
    dataIndex: "category",
    key: "category",
  },

];
/* =========================
   📅 ATTENDANCE
========================= */

export const attendanceColumns: ColumnsType<any> = [
  slColumn,

  {
    title: "User",
    dataIndex: ["userId", "name"],
    render: (value) => value || "N/A",
  },

  {
    title: "Date",
    dataIndex: "date",
    render: (value) =>
      value ? new Date(value).toLocaleDateString() : "N/A",
  },

  {
    title: "Status",
    dataIndex: "status",
    render: (value) => {
      const colors = {
        present: "green",
        absent: "red",
        late: "orange",
      };

      return (
        <Tag color={colors[value as keyof typeof colors]}>
          {value?.toUpperCase()}
        </Tag>
      );
    },
  },

  {
    title: "Source",
    dataIndex: "source",
    render: (value) => (
      <Tag color={value === "manual" ? "blue" : value === "fingerprint" ? "purple" : "cyan"}>
        {value?.toUpperCase()}
      </Tag>
    ),
  },

  {
    title: "Check In",
    dataIndex: "checkInTime",
    render: (value) =>
      value
        ? new Date(value).toLocaleTimeString()
        : "--",
  },

  {
    title: "Check Out",
    dataIndex: "checkOutTime",
    render: (value) =>
      value
        ? new Date(value).toLocaleTimeString()
        : "--",
  },

  {
    title: "Device",
    dataIndex: "deviceId",
    render: (value) => value || "Manual",
  },

  {
    title: "Marked By",
    dataIndex: ["markedBy", "name"],
    render: (value) => value || "--",
  },

  {
    title: "Remarks",
    dataIndex: "remarks",
    render: (value) => value || "--",
  },

  {
    title: "Created",
    dataIndex: "createdAt",
    render: (value) =>
      value ? new Date(value).toLocaleString() : "--",
  },
];
/* =========================
   🏫 ADMISSION & OTHERS
========================= */

import dayjs from "dayjs";

export const admissionColumns: ColumnsType<any> = [
  slColumn,

  {
    title: "Student Name",
    dataIndex: "studentName",
    key: "studentName",
  },

  {
    title: "Father Name",
    dataIndex: "fatherName",
    key: "fatherName",
  },

  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },

  {
    title: "Class",
    dataIndex: ["classId", "name"],
    key: "class",
    render: (_, record) =>
      record.classId
        ? `${record.classId.name} (${record.classId.code})`
        : "-",
  },

  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    ellipsis: true,
  },

 

  {
    title: "Applied On",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) =>
      date ? dayjs(date).format("DD MMM YYYY") : "-",
  },
   {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      const colors = {
        pending: "gold",
        approved: "green",
        rejected: "red",
      };

      return (
        <Tag color={colors[status] || "default"}>
          {status?.toUpperCase()}
        </Tag>
      );
    },
  },
];

export const classColumns: ColumnsType<any> = [
  slColumn,
  { title: "Class Name", dataIndex: "name" },
  { title: "Section", dataIndex: "section" },
  { title: "Teacher", dataIndex: ["teacherId", "name"], render: (v) => v || "-" },
];

export const noticeColumns: ColumnsType<any> = [
  slColumn,
  { title: "Title", dataIndex: "title" },
  { title: "Message", dataIndex: "message", render: (v) => <Tooltip title={v}>{v?.slice(0, 30)}...</Tooltip> },
];

export const eventColumns: ColumnsType<any> = [
  slColumn,
  { title: "Title", dataIndex: "title" },
  { title: "Start Date", dataIndex: "startDate", render: (v) => new Date(v).toLocaleDateString() },
  { title: "Status", dataIndex: "isActive", render: (v) => <Tag color={v ? "green" : "red"}>{v ? "Active" : "Inactive"}</Tag> },
];





/* =========================
   💸 FEES
========================= */

export const feesColumns: ColumnsType<any> = [
  slColumn,
  { title: "Student", dataIndex: ["studentId", "name"], render: (v) => v || "-" },
   { title: "Guardian Name", dataIndex: ["studentId", "guardianName"], },
   { title: "Roll Number", dataIndex: ["studentId", "roll"], },
  { title: "Amount", dataIndex: "amount", render: (v) => `৳ ${v}` },
  { title: "Paid", dataIndex: "paidAmount", render: (v) => `৳ ${v}` },
  {
    title: "Due",
    dataIndex: "dueAmount",
    render: (v) => <Tag color={v > 0 ? "red" : "green"}>৳ {v}</Tag>,
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (v) => (
      <Tag color={v === "paid" ? "green" : v === "partial" ? "orange" : "red"}>
        {v?.toUpperCase()}
      </Tag>
    ),
  },
];

/* =========================
   ⚙️ SETTINGS & REPORTS
========================= */
export const reportColumns: ColumnsType<any> = [
  slColumn,
  { title: "Title", dataIndex: "title" },
  { title: "Type", dataIndex: "type" },
  { title: "Date", dataIndex: "createdAt", render: (v) => new Date(v).toLocaleDateString() },
];

export const settingsColumns: ColumnsType<any> = [
  { title: "Key", dataIndex: "key" },
  { title: "Value", dataIndex: "value" },
];





/* =========================
   🏫 Academic Session
========================= */
export const academicSessionColumns: ColumnsType<any> = [
  slColumn,
  { title: "Year", dataIndex: "year" },
  { title: "Name", dataIndex: "name" },
  
 {
    title: "Status",
    dataIndex: "isActive",
    render: (v) => (
      <Tag color={v ? "green" : "red"}>{v ? "Active" : "Inactive"}</Tag>
    ),
  },

  {
    title: "Created At",
    dataIndex: "createdAt",
    render: (v) => new Date(v).toLocaleDateString(),
  },
];

/* =========================
   🏫 Classes
========================= */
export const classesColumns: ColumnsType<any> = [
  slColumn,
  { title: "Class Name", dataIndex: "name" },
  { title: "Code number", dataIndex: "code" },
  {
    title: "Created At",
    dataIndex: "createdAt",
    render: (v) => new Date(v).toLocaleDateString(),
  },
];

/* =========================
   🏷️ Section
========================= */
export const sectionColumns: ColumnsType<any> = [
  slColumn,
  { title: "Section Name", dataIndex: "name" },
  { title: "Class", dataIndex: ["classId", "name"] },
  {
    title: "Created At",
    dataIndex: "createdAt",
    render: (v) => new Date(v).toLocaleDateString(),
  },
];

/* =========================
   📚 Subject
========================= */
export const subjectColumns: ColumnsType<any> = [
  slColumn,
  { title: "Subject Name", dataIndex: "name" },
  { title: "Code", dataIndex: "code" },
  { title: "Full Marks", dataIndex: "fullMarks" },
  { title: "Pass Marks", dataIndex: "passMarks" },
  { title: "Class", dataIndex: ["classId", "name"] },
  {
    title: "Created At",
    dataIndex: "createdAt",
    render: (v) => new Date(v).toLocaleDateString(),
  },
];

/* =========================
   📝 Exam
========================= */
export const examColumns: ColumnsType<any> = [
  slColumn,
  { title: "Exam Name", dataIndex: "name" },
  { title: "Type", dataIndex: "type" },
  { title: "Session", dataIndex: ["sessionId", "year"] },
  { title: "Status", dataIndex: "status" },
  {
    title: "Created At",
    dataIndex: "createdAt",
    render: (v) => new Date(v).toLocaleDateString(),
  },
];

/* =========================
   📊 Grade Rule
========================= */
export const gradeRuleColumns: ColumnsType<any> = [
  slColumn,

  {
    title: "Board",
    dataIndex: "boardType",
    key: "boardType",
  },

  {
    title: "Session",
    dataIndex: ["sessionId", "year"],
    key: "session",
  },

{
  title: "Applicable Classes",
  key: "applicableClasses",
  render: (_, record) => {
    return (
      <div className="flex flex-wrap gap-1">
        {record.applicableClasses?.map((item: any) => (
          <Tag key={item._id} color="blue">
            {item.name}
          </Tag>
        ))}
      </div>
    );
  },
},

  {
    title: "Grade Rules",
    dataIndex: "rules",
    key: "rules",
    render: (rules: any[]) => (
      <div className="space-y-1">
        {rules?.map((rule) => (
          <div
            key={rule._id}
            className="flex items-center gap-2 text-sm"
          >
            <Tag color="green">{rule.grade}</Tag>
            <span>
              {rule.minMark} - {rule.maxMark}
            </span>
            <Tag color="gold">GPA: {rule.gradePoint}</Tag>
          </div>
        ))}
      </div>
    ),
  },

  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (value: string) =>
      new Date(value).toLocaleDateString("en-GB"),
  },
];
/* =========================
   ⚙️ Result Setting
========================= */
export const resultSettingColumns: ColumnsType<any> = [
  slColumn,

  {
    title: "Session",
    dataIndex: ["sessionId", "year"],
    render: (v) => <Tag color="blue">{v}</Tag>,
  },

  {
    title: "Class",
    dataIndex: ["classId", "name"],
    render: (v) => <Tag color="green">{v}</Tag>,
  },

  {
    title: "Exam",
    dataIndex: ["examId", "name"],
    render: (v) => <Tag color="purple">{v}</Tag>,
  },

  {
    title: "Attendance Required",
    dataIndex: "attendanceRequired",
    render: (v: boolean) => (
      <Tag color={v ? "green" : "red"}>
        {v ? "Required" : "Not Required"}
      </Tag>
    ),
  },

  {
    title: "Min Attendance %",
    dataIndex: "minAttendancePercent",
    render: (v: number) => `${v || 0}%`,
  },

  {
    title: "Subject Count",
    dataIndex: "subjectCombination",
    render: (arr: any[]) => (
      <Tag color="blue">{arr?.length || 0} Subjects</Tag>
    ),
  },

  {
    title: "Result Publish",
    dataIndex: "isResultPublishAllowed",
    render: (v: boolean) => (
      <Tag color={v ? "green" : "orange"}>
        {v ? "Allowed" : "Blocked"}
      </Tag>
    ),
  },

  {
    title: "Created At",
    dataIndex: "createdAt",
    render: (v: string) =>
      new Date(v).toLocaleDateString("en-GB"),
  },
];
/* =========================
   📊 Exam Result (IMPORTANT)
========================= */
export const examResultColumns: ColumnsType<any> = [
  slColumn,
  { title: "Student", dataIndex: ["studentId", "name"] },
  { title: "Roll", dataIndex: ["studentId", "roll"] },
  { title: "Exam", dataIndex: ["examId", "name"] },
  { title: "Session", dataIndex: ["sessionId", "year"] },

  {
    title: "Total Marks",
    render: (_, record) =>
      record.subjects?.reduce((sum, s) => sum + (s.total || 0), 0),
  },

  {
    title: "GPA",
    render: (_, record) => {
      const totalGp =
        record.subjects?.reduce((sum, s) => sum + (s.gradePoint || 0), 0) || 0;
      const count = record.subjects?.length || 1;
      return (totalGp / count).toFixed(2);
    },
  },

  {
    title: "Status",
    render: (_, record) =>
      record.subjects?.some((s) => s.status === "Fail") ? "Fail" : "Pass",
  },

  {
    title: "Created At",
    dataIndex: "createdAt",
    render: (v) => new Date(v).toLocaleDateString(),
  },
];

























// import { ColumnsType } from "antd/es/table";
// import { Tag, Typography, Tooltip } from "antd";

// /* =========================
//    SHARED TYPES
// ========================= */

// interface BaseUser {
//   _id: string;
//   name: string;
//   phone?: string;
//   email?: string;
// }

// /* =========================
//    STUDENT
// ========================= */

// interface Student {
//   _id: string;
//   name: string;
//   roll: string;
//   class: string;
//   section?: string;
//   phone?: string;
//   isActive: boolean;
// }

// export const studentColumns: ColumnsType<Student> = [
//   {
//     title: "SL",
//     render: (_, __, i) => i + 1,
//     width: 60,
//     align: "center",
//   },
//   {
//     title: "Name",
//     dataIndex: "name",
//     key: "name",
//   },
//   {
//     title: "Roll",
//     dataIndex: "roll",
//     key: "roll",
//   },
//   {
//     title: "Class",
//     dataIndex: "class",
//     key: "class",
//   },
//   {
//     title: "Phone",
//     dataIndex: "phone",
//     render: (v) => <Typography.Text copyable>{v}</Typography.Text>,
//   },
//   {
//     title: "Status",
//     dataIndex: "isActive",
//     render: (v) => (
//       <Tag color={v ? "green" : "red"}>{v ? "Active" : "Inactive"}</Tag>
//     ),
//   },
// ];

// /* =========================
//    TEACHER
// ========================= */

// interface Teacher {
//   _id: string;
//   name: string;
//   subject: string;
//   phone: string;
//   email?: string;
//   isActive: boolean;
// }

// export const teacherColumns: ColumnsType<Teacher> = [
//   { title: "SL", render: (_, __, i) => i + 1, width: 60 },
//   { title: "Name", dataIndex: "name" },
//   { title: "Subject", dataIndex: "subject" },
//   {
//     title: "Phone",
//     dataIndex: "phone",
//     render: (v) => <Typography.Text copyable>{v}</Typography.Text>,
//   },
//   {
//     title: "Status",
//     dataIndex: "isActive",
//     render: (v) => (
//       <Tag color={v ? "green" : "red"}>{v ? "Active" : "Inactive"}</Tag>
//     ),
//   },
// ];

// /* =========================
//    ATTENDANCE
// ========================= */

// interface Attendance {
//   studentName: string;
//   date: string;
//   status: "present" | "absent" | "late";
// }

// export const attendanceColumns: ColumnsType<Attendance> = [
//   { title: "SL", render: (_, __, i) => i + 1 },
//   { title: "Student", dataIndex: "studentName" },
//   { title: "Date", dataIndex: "date" },
//   {
//     title: "Status",
//     dataIndex: "status",
//     render: (v) => {
//       const color =
//         v === "present" ? "green" : v === "absent" ? "red" : "orange";
//       return <Tag color={color}>{v.toUpperCase()}</Tag>;
//     },
//   },
// ];

// /* =========================
//    FEES
// ========================= */

// interface Fees {
//   studentName: string;
//   amount: number;
//   paid: number;
//   due: number;
//   status: string;
// }

// export const feesColumns: ColumnsType<Fees> = [
//     {
//     title: "SL",
//     render: (_, __, i) => i + 1,
//     width: 60,
//     align: "center",
//   },
//   { title: "Student", dataIndex: "studentName" },
//   {
//     title: "Amount",
//     dataIndex: "amount",
//     render: (v) => `৳ ${v}`,
//   },
//   {
//     title: "Paid",
//     dataIndex: "paid",
//     render: (v) => `৳ ${v}`,
//   },
//   {
//     title: "Due",
//     dataIndex: "due",
//     render: (v) => (
//       <Tag color={v > 0 ? "red" : "green"}>৳ {v}</Tag>
//     ),
//   },
//   {
//     title: "Status",
//     dataIndex: "status",
//     render: (v) => (
//       <Tag color={v === "paid" ? "green" : "orange"}>{v}</Tag>
//     ),
//   },
// ];

// /* =========================
//    ADMISSION
// ========================= */
// interface Admission {
//   studentName: string;
//   classId?: {
//     name: string;
//   } | string;
//   phone: string;
//   status: "pending" | "approved" | "rejected";
// }

// export const admissionColumns: ColumnsType<Admission> = [
//     {
//     title: "SL",
//     render: (_, __, i) => i + 1,
//     width: 60,
//     align: "center",
//   },
//   {
//     title: "Name",
//     dataIndex: "studentName",
//     key: "studentName",
//   },

//   {
//     title: "Class",
//     dataIndex: "classId",
//     key: "classId",
//     render: (value) => {
//       // support both: populated object OR string
//       const className =
//         typeof value === "object" && value?.name ? value.name : value;

//       return className || "-";
//     },
//   },

//   {
//     title: "Phone",
//     dataIndex: "phone",
//     key: "phone",
//     render: (v: string) => (
//       <Typography.Text copyable>{v}</Typography.Text>
//     ),
//   },

//   {
//     title: "Status",
//     dataIndex: "status",
//     key: "status",
//     render: (v: string) => {
//       const color =
//         v === "approved"
//           ? "green"
//           : v === "rejected"
//           ? "red"
//           : "gold";

//       return (
//         <Tag color={color}>
//           {v?.toUpperCase()}
//         </Tag>
//       );
//     },
//   },
// ];
// /* =========================
//    CLASS
// ========================= */

// export const classColumns = [
//   {
//     title: "Class Name",
//     dataIndex: "name",
//   },
//   {
//     title: "Section",
//     dataIndex: "section",
//   },
//   {
//     title: "Teacher",
//     dataIndex: "teacherId",
//     key: "teacherId",
//     render: (value) => {
//       return value?.name || "-";
//     },
//   },
// ];
// /* =========================
//    NOTICE
// ========================= */

// export const noticeColumns = [
//   { title: "Title", dataIndex: "title" },
//   {
//     title: "Message",
//     dataIndex: "message",
//     render: (v) => (
//       <Tooltip title={v}>
//         <span>{v?.slice(0, 40)}...</span>
//       </Tooltip>
//     ),
//   },
//   {
//     title: "Priority",
//     dataIndex: "priority",
//     render: (v) => (
//       <Tag color={v === "important" ? "red" : "blue"}>{v}</Tag>
//     ),
//   },
// ];

// /* =========================
//    EVENT
// ========================= */

// export const eventColumns = [
//   {
//     title: "Title",
//     dataIndex: "title",
//   },
//   {
//     title: "Event Type",
//     dataIndex: "eventType",
//   },
//   {
//     title: "Start Date",
//     dataIndex: "startDate",
//   },
//   {
//     title: "End Date",
//     dataIndex: "endDate",
//   },
//   {
//     title: "Location",
//     dataIndex: "location",
//   },
//   {
//     title: "Status",
//     dataIndex: "isActive",
//     render: (isActive: boolean) => (isActive ? "Active" : "Inactive"),
//   },
// ];

// /* =========================
//    PARENTS
// ========================= */
// export const parentColumns = [
//   {
//     title: "Father's Name",
//     dataIndex: "fatherName",
//     key: "fatherName",
//   },
//   {
//     title: "Mother's Name",
//     dataIndex: "motherName",
//     key: "motherName",
//   },
//   {
//     title: "Phone",
//     dataIndex: "phone",
//     key: "phone",
//     render: (v: string) => (
//       <Typography.Text copyable>{v}</Typography.Text>
//     ),
//   },
//   {
//     title: "Address",
//     dataIndex: "address",
//     key: "address",
//     ellipsis: true,
//   },

//   // 🔥 FIXED HERE
//   {
//     title: "Student Name",
//     dataIndex: ["studentId", "name"],
//     key: "studentName",
//     render: (name: string) => name || "-",
//   },

//   {
//     title: "Student Roll",
//     dataIndex: ["studentId", "roll"],
//     key: "studentRoll",
//     render: (roll: string) => roll || "-",
//   },

//   // {
//   //   title: "Student ID",
//   //   dataIndex: ["studentId", "_id"],
//   //   key: "studentId",
//   //   render: (id: string) => (
//   //     <Typography.Text copyable>
//   //       {id?.slice(-6) || "-"}
//   //     </Typography.Text>
//   //   ),
//   // },
// ];
// /* =========================
//    REPORT
// ========================= */

// export const reportColumns = [
//   { title: "Title", dataIndex: "title" },
//   { title: "Type", dataIndex: "type" },
//   { title: "Date", dataIndex: "createdAt" },
// ];

// /* =========================
//    SETTINGS
// ========================= */

// export const settingsColumns = [
//   { title: "Key", dataIndex: "key" },
//   { title: "Value", dataIndex: "value" },
// ];

// /* =========================
//    STAFF
// ========================= */


export const staffColumns = [
  {
    title: "SL",
    key: "index",
    width: 60,
    align: "center",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Designation",
    dataIndex: "designation",
    key: "designation",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
    render: (v) => <Typography.Text copyable>{v || "-"}</Typography.Text>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Salary",
    dataIndex: "salary",
    key: "salary",
    render: (v) => `৳ ${v || 0}`,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (v: string) => (
      <Tag color={v === "active" ? "green" : "red"}>
        {v?.toUpperCase()}
      </Tag>
    ),
  },
];

// /* =========================
//    DONATE
// ========================= */

// export const donateColumns = [
//   { title: "Name", dataIndex: "name" },
//   { title: "Amount", dataIndex: "amount" },
//   { title: "Purpose", dataIndex: "purpose" },
// ];


// interface Donation {
//   donorName: string;
//   phone: string;
//   amount: number;
//   donationType: string;
//   paymentMethod: string;
//   status: "pending" | "completed" | "cancelled";
//   createdAt?: string;
// }

// export const donationColumns: ColumnsType<Donation> = [
//   {
//     title: "Donor Name",
//     dataIndex: "donorName",
//     key: "donorName",
//   },

//   {
//     title: "Phone",
//     dataIndex: "phone",
//     key: "phone",
//     render: (value: string) => (
//       <Typography.Text copyable>
//         {value}
//       </Typography.Text>
//     ),
//   },

//   {
//     title: "Amount",
//     dataIndex: "amount",
//     key: "amount",
//     sorter: (a, b) => a.amount - b.amount,
//     render: (amount: number) => (
//       <Typography.Text strong>
//         ৳ {amount?.toLocaleString()}
//       </Typography.Text>
//     ),
//   },

//   {
//     title: "Donation Type",
//     dataIndex: "donationType",
//     key: "donationType",
//     render: (type: string) => (
//       <Tag color="blue">
//         {type}
//       </Tag>
//     ),
//   },

//   {
//     title: "Payment",
//     dataIndex: "paymentMethod",
//     key: "paymentMethod",
//     render: (method: string) => (
//       <Tag color="purple">
//         {method}
//       </Tag>
//     ),
//   },

//   {
//     title: "Status",
//     dataIndex: "status",
//     key: "status",
//     render: (status: string) => {
//       const color =
//         status === "completed"
//           ? "green"
//           : status === "pending"
//           ? "gold"
//           : "red";

//       return (
//         <Tag color={color}>
//           {status.toUpperCase()}
//         </Tag>
//       );
//     },
//   },

//   {
//     title: "Date",
//     dataIndex: "createdAt",
//     key: "createdAt",
//     render: (date: string) =>
//       date
//         ? new Date(date).toLocaleDateString()
//         : "-",
//   },
// ];


interface Examination {
  name: string;
  className: string;
  examDate: string;
  totalMarks: number;
  status: "upcoming" | "running" | "completed";
}

export const examinationColumns: ColumnsType<Examination> = [
  {
    title: "Exam Name",
    dataIndex: "title",
    key: "title",
  },

  {
    title: "Total Marks",
    dataIndex: "totalMarks",
    key: "totalMarks",
    render: (marks: number) => (
      <Typography.Text strong>{marks}</Typography.Text>
    ),
  },

  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) =>
      date ? new Date(date).toLocaleDateString() : "-",
  },
];