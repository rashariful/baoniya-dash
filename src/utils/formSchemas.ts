import { FormField } from "../components/common/FormBuilder/FormBuilder";


/* =========================
   🏫 ACADEMIC SESSION
========================= */
export const academicSessionFormFields: FormField[] = [
  {
    name: "year",
    label: "Year",
    type: "text",
    placeholder: "e.g. 2026",
    span: 12,
    required: true,
  },
  {
    name: "name",
    label: "Session Name",
    type: "text",
    placeholder: "e.g. 2026 Session",
    span: 12,
    required: true,
  },
  // {
  //   name: "status",
  //   label: "Status",
  //   type: "select",
  //   options: [
  //     { label: "Active", value: "active" },
  //     { label: "Inactive", value: "inactive" },
  //   ],
  //   span: 12,
  // },
];

/* =========================
   🏫 CLASS
========================= */
export const classesFormFields: FormField[] = [
  {
    name: "name",
    label: "Class Name",
    type: "text",
    placeholder: "e.g. Class 1",
    span: 12,
    required: true,
  },
  {
    name: "code",
    label: "Class Code",
    type: "number",
    placeholder: "1",
    span: 12,
  },
];

/* =========================
   🏷️ SECTION
========================= */
export const sectionFormFields: FormField[] = [
  {
    name: "name",
    label: "Section Name",
    type: "text",
    span: 12,
    required: true,
  },

  {
    name: "classId",
    label: "Class",
    type: "select",
    span: 12,
    required: true,
    dynamicOptions: true,
  },
];

/* =========================
   📚 SUBJECT
========================= */
export const subjectFormFields: FormField[] = [
  {
    name: "name",
    label: "Subject Name",
    type: "text",
    placeholder: "e.g. Mathematics",
    span: 12,
    required: true,
  },
  {
    name: "code",
    label: "Subject Code",
    type: "text",
    placeholder: "e.g. MATH-101",
    span: 12,
  },
  {
    name: "fullMarks",
    label: "Full Marks",
    type: "number",
    span: 12,
  },
  {
    name: "passMarks",
    label: "Pass Marks",
    type: "number",
    span: 12,
  },
  {
    name: "classId",
    label: "Class",
    type: "select",
    span: 12,
    options: [],
        dynamicOptions: true,

  },
];

/* =========================
   📝 EXAM
========================= */
export const examFormFields: FormField[] = [
  {
    name: "name",
    label: "Exam Name",
    type: "text",
    placeholder: "e.g. Final Exam",
    span: 12,
    required: true,
  },
  {
    name: "type",
    label: "Type",
    type: "select",
    span: 12,
    options: [
      { label: "Final", value: "final" },
      { label: "Midterm", value: "midterm" },
      { label: "Class Test", value: "class_test" },
    ],
  },
  {
    name: "sessionId",
    label: "Session",
    type: "select",
    span: 12,
    options: [],
  },
];

/* =========================
   📊 GRADE RULE
========================= */
export const gradeRuleFormFields: FormField[] = [
  {
    name: "boardType",
    label: "Board Type",
    type: "select",
    span: 12,
    required: true,
    options: [
      { label: "NCTB", value: "NCTB" },
      { label: "Madrasha", value: "Madrasha" },
      { label: "English Version", value: "English Version" },
    ],
  },
  {
    name: "sessionId",
    label: "Academic Session",
    type: "select",
    span: 12,
    required: true,
    dynamicOptions: true,
  },
  {
    name: "applicableClasses",
    label: "Applicable Classes",
    type: "select",
    span: 24,
    required: true,
    dynamicOptions: true,
        options: [],

  },
  {
    name: "rules",
    label: "Grade Rules",
 type: "dynamicList",

    span: 24,
    fields: [
      {
        name: "grade",
        label: "Grade",
        type: "text",
        required: true,
      },
      {
        name: "minMark",
        label: "Min Mark",
        type: "number",
        required: true,
      },
      {
        name: "maxMark",
        label: "Max Mark",
        type: "number",
        required: true,
      },
      {
        name: "gradePoint",
        label: "Grade Point",
        type: "number",
        required: true,
      },
    ],
  },
];

/* =========================
   ⚙️ RESULT SETTING
========================= */
export const resultSettingFormFields: FormField[] = [
  {
    name: "sessionId",
    label: "Session",
    type: "select",
    span: 12,
    required: true,
    dynamicOptions: true,
  },

  {
    name: "classId",
    label: "Class",
    type: "select",
    span: 12,
    required: true,
    dynamicOptions: true,
  },

  {
    name: "examId",
    label: "Exam",
    type: "select",
    span: 12,
    required: true,
    dynamicOptions: true,
  },

  {
    name: "subjectCombination",
    label: "Subjects",
    type: "select",
    multiple: true,
    span: 24,
    dynamicOptions: true,
  },

  {
    name: "attendanceRequired",
    label: "Attendance Required",
    type: "switch",
    span: 12,
  },

  {
    name: "minAttendancePercent",
    label: "Min Attendance %",
    type: "number",
    span: 12,
  },

  {
    name: "isResultPublishAllowed",
    label: "Allow Result Publish",
    type: "switch",
    span: 12,
  },
];
/* =========================
   📊 EXAM RESULT
========================= */
// export const examResultFormFields: FormField[] = [
//   {
//     name: "studentId",
//     label: "Student",
//     type: "select",
//     span: 12,
//     options: [],
//   },
//   {
//     name: "examId",
//     label: "Exam",
//     type: "select",
//     span: 12,
//     options: [],
//   },
//   {
//     name: "sessionId",
//     label: "Session",
//     type: "select",
//     span: 12,
//     options: [],
//   },
// ];

export const examResultFormFields: FormField[] = [
  {
    name: "studentId",
    label: "Student",
    type: "select",
    span: 12,
    required: true,
    dynamicOptions: true,
  },

  {
    name: "examId",
    label: "Exam",
    type: "select",
    span: 12,
    required: true,
    dynamicOptions: true,
  },

  {
    name: "sessionId",
    label: "Session",
    type: "select",
    span: 12,
    required: true,
    dynamicOptions: true,
  },

  {
    name: "subjects",
    label: "Subjects Result",
    type: "dynamicList",
     dynamicOptions: true,
    span: 24,
    fields: [
      {
        name: "subjectId",
        label: "Subject",
        type: "select",
        required: true,
        span: 6,
        dynamicOptions: true,
      },
      {
        name: "written",
        label: "Written",
        type: "number",
        span: 4,
      },
      {
        name: "mcq",
        label: "MCQ",
        type: "number",
        span: 4,
      },
      {
        name: "practical",
        label: "Practical",
        type: "number",
        span: 4,
      },
      {
        name: "total",
        label: "Total",
        type: "number",
        span: 6,
      },
      {
        name: "grade",
        label: "Grade",
        type: "text",
        span: 4,
      },
      {
        name: "gradePoint",
        label: "GPA",
        type: "number",
        span: 4,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        span: 4,
        options: [
          { label: "Pass", value: "Pass" },
          { label: "Fail", value: "Fail" },
          { label: "Absent", value: "Absent" },
        ],
      },
    ],
  },

  {
    name: "isPublished",
    label: "Publish Result",
    type: "switch",
    span: 12,
  },
];








/* =========================
   🏫 ADMISSION
========================= */
export const admissionFormFields: FormField[] = [
  {
    name: "studentName",
    label: "Student Name",
    type: "text",
    placeholder: "Enter student name",
    span: 12,
    required: true,
  },
  {
    name: "fatherName",
    label: "Father Name",
    type: "text",
    placeholder: "Enter father's name",
    span: 12,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    placeholder: "Enter phone number",
    span: 12,
    required: true,
  },
  {
    name: "classId",
    label: "Class",
    type: "select",
    placeholder: "Select a class",
    span: 12,
    dynamicOptions: true,
    options: [],
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    placeholder: "Enter residential address",
    span: 24,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status",
    span: 12,
    options: [
      { label: "Pending", value: "pending" },
      { label: "Approved", value: "approved" },
      { label: "Rejected", value: "rejected" },
    ],
    initialValue: "pending",
  },
];

/* =========================
   🎓 STUDENT
========================= */
export const studentFormFields: FormField[] = [
  {
    name: "name",
    label: "Student Name",
    type: "text",
    placeholder: "Enter full name",
    span: 12,
    required: true,
  },
  {
    name: "roll",
    label: "Roll",
    type: "text",
    placeholder: "Enter roll number",
    span: 12,
    required: true,
  },
  {
    name: "classId",
    label: "Class",
    type: "select",
    placeholder: "Select class",
    span: 12,
    dynamicOptions: true,
    options: [],
  },
    {
    name: "phone",
    label: "Phone",
    type: "text",
    placeholder: "Enter phone number",
    span: 12,
  },
  {
    name: "fatherName",
    label: "Father Name",
    type: "text",
    placeholder: "Enter father's name",
    span: 12,
  },
  {
    name: "motherName",
    label: "Mother Name",
    type: "text",
    placeholder: "Enter mother's name",
    span: 12,
  },
  {
    name: "section",
    label: "Section",
    type: "text",
    placeholder: "Enter section (e.g. A)",
    span: 12,
  },

  {
    name: "address",
    label: "Address",
    type: "textarea",
    placeholder: "Enter full address",
    span: 24,
  },
];

/* =========================
   👨‍🏫 TEACHER
========================= */
export const teacherFormFields: FormField[] = [
  {
    name: "name",
    label: "Teacher Name",
    type: "text",
    placeholder: "Enter full name",
    span: 12,
    required: true,
  },
  {
    name: "subject",
    label: "Subject",
    type: "text",
    placeholder: "e.g. Mathematics",
    span: 12,
  },
  {
    name: "phone",
    label: "Phone",
    type: "text",
    placeholder: "Enter phone number",
    span: 12,
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    placeholder: "Enter email address",
    span: 12,
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    placeholder: "Enter address",
    span: 24,
  },
  {
    name: "salary",
    label: "Salary",
    type: "number",
    placeholder: "0.00",
    span: 12,
  },
];

/* =========================
   📅 ATTENDANCE
========================= */
export const attendanceFormFields: FormField[] = [
  {
    name: "studentId",
    label: "Student",
    type: "select",
    placeholder: "Select student",
    span: 12,
    dynamicOptions: true,
    options: [],
  },
  {
    name: "classId",
    label: "Class",
    type: "select",
    placeholder: "Select class",
    span: 12,
    dynamicOptions: true,
    options: [],
  },
  { name: "date", label: "Date", type: "date", span: 12 },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Select attendance status",
    span: 12,
    options: [
      { label: "Present", value: "present" },
      { label: "Absent", value: "absent" },
      { label: "Late", value: "late" },
    ],
    initialValue: "present",
  },
];

/* =========================
   💰 FEES
========================= */
export const feesFormFields: FormField[] = [
  {
    name: "studentId",
    label: "Student",
    type: "select",
    placeholder: "Select student",
    span: 12,
    required: true,
    dynamicOptions: true,
    options: [],
  },
  {
    name: "month",
    label: "Month",
    type: "text",
    placeholder: "e.g. January",
    span: 12,
    required: true,
  },
  {
    name: "amount",
    label: "Amount",
    type: "number",
    placeholder: "Enter total amount",
    span: 12,
    required: true,
  },
  {
    name: "paidAmount",
    label: "Paid Amount",
    type: "number",
    placeholder: "Enter paid amount",
    span: 12,
    initialValue: 0,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Select payment status",
    span: 12,
    options: [
      { label: "Paid", value: "paid" },
      { label: "Unpaid", value: "unpaid" },
      { label: "Partial", value: "partial" },
    ],
    initialValue: "unpaid",
  },
];

/* =========================
   📚 CLASSES
========================= */
export const classFormFields: FormField[] = [
  {
    name: "name",
    label: "Class Name",
    type: "text",
    placeholder: "e.g. Class 1",
    span: 24,
    required: true,
  },
  {
    name: "section",
    label: "Section",
    type: "text",
    placeholder: "e.g. A",
    span: 12,
  },
  {
    name: "teacherId",
    label: "Class Teacher",
    type: "select",
    placeholder: "Select teacher",
    span: 12,
    dynamicOptions: true,
    options: [],
  },
  {
    name: "capacity",
    label: "Student Capacity",
    type: "number",
    placeholder: "e.g. 50",
    span: 12,
  },
  {
    name: "roomNumber",
    label: "Room Number",
    type: "text",
    placeholder: "e.g. 101",
    span: 12,
  },
  {
    name: "shift",
    label: "Shift",
    type: "select",
    placeholder: "Select shift",
    span: 12,
    options: [
      { label: "Morning", value: "morning" },
      { label: "Day", value: "day" },
      { label: "Evening", value: "evening" },
    ],
  },
  {
    name: "isActive",
    label: "Active Class",
    type: "switch",
    span: 12,
    initialValue: true,
  },
];

/* =========================
   📊 RESULT / EXAM
========================= */
export const resultFormFields: FormField[] = [
  {
    name: "studentId",
    label: "Student",
    type: "select",
    placeholder: "Select student",
    span: 12,
    dynamicOptions: true,
    options: [],
  },
  {
    name: "classId",
    label: "Class",
    type: "select",
    placeholder: "Select class",
    span: 12,
    dynamicOptions: true,
    options: [],
  },
  {
    name: "examName",
    label: "Exam Name",
    type: "text",
    placeholder: "e.g. Midterm",
    span: 12,
  },
  {
    name: "marks",
    label: "Marks",
    type: "number",
    placeholder: "Enter marks",
    span: 12,
  },
  {
    name: "grade",
    label: "Grade",
    type: "text",
    placeholder: "e.g. A+",
    span: 12,
  },
];

/* =========================
   📢 NOTICE
========================= */
export const noticeFormFields: FormField[] = [
  {
    name: "title",
    label: "Notice Title",
    type: "text",
    placeholder: "Enter title",
    span: 12,
    required: true,
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    placeholder: "Write notice details here...",
    span: 24,
    required: true,
  },
  {
    name: "audience",
    label: "Audience",
    type: "select",
    placeholder: "Select target group",
    span: 12,
    options: [
      { label: "Public", value: "public" },
      { label: "Students", value: "students" },
      { label: "Teachers", value: "teachers" },
    ],
  },
];

/* =========================
   👨‍👩‍👧 PARENTS
========================= */
export const parentFormFields: FormField[] = [
  {
    name: "fatherName",
    label: "Father Name",
    type: "text",
    span: 12,
    required: true,
  },
  {
    name: "motherName",
    label: "Mother Name",
    type: "text",
    span: 12,
  },
  {
    name: "phone",
    label: "Phone",
    type: "text",
    span: 12,
    required: true,
  },

  // 🔥 Dynamic Student Select
  {
    name: "studentId",
    label: "Student",
    type: "select",
    span: 12,
    dynamicOptions: true,
    options: [],
    required: true,
  },

  {
    name: "address",
    label: "Address",
    type: "textarea",
    span: 24,
  },
];
/* =========================
   💸 DONATION
========================= */
export const donationFormFields: FormField[] = [
  {
    name: "donorName",
    label: "Donor Name",
    type: "text",
    placeholder: "Enter donor name",
    span: 12,
    required: true,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    placeholder: "Enter phone",
    span: 12,
    required: true,
  },
  {
    name: "amount",
    label: "Donation Amount",
    type: "number",
    placeholder: "0.00",
    span: 12,
    required: true,
  },
  {
    name: "donationType",
    label: "Donation Type",
    type: "select",
    placeholder: "Select type",
    span: 12,
    required: true,
    options: [
      { label: "Zakat", value: "zakat" },
      { label: "Sadaqah", value: "sadaqah" },
      { label: "General Donation", value: "general" },
      { label: "Lillah", value: "lillah" },
    ],
  },
  {
    name: "paymentMethod",
    label: "Payment Method",
    type: "select",
    placeholder: "Select method",
    span: 12,
    options: [
      { label: "Cash", value: "cash" },
      { label: "Bank", value: "bank" },
      { label: "Bkash", value: "bkash" },
      { label: "Nagad", value: "nagad" },
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status",
    span: 12,
    initialValue: "pending",
    options: [
      { label: "Pending", value: "pending" },
      { label: "Completed", value: "completed" },
      { label: "Cancelled", value: "cancelled" },
    ],
  },
  {
    name: "note",
    label: "Note",
    type: "textarea",
    placeholder: "Additional notes...",
    span: 24,
  },
];

/* =========================
   📊 EXAMINATION
========================= */
export const examinationFormFields: FormField[] = [
  {
    name: "title",
    label: "Exam Name",
    type: "text",
    placeholder: "e.g. Final Exam",
    span: 12,
    required: true,
  },
  {
    name: "classId",
    label: "Class",
    type: "select",
    placeholder: "Select class",
    span: 12,
    dynamicOptions: true,
    options: [],
  },
  {
    name: "examDate",
    label: "Exam Date",
    type: "date",
    span: 12,
    required: true,
  },
  {
    name: "totalMarks",
    label: "Total Marks",
    type: "number",
    placeholder: "e.g. 100",
    span: 12,
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Select exam status",
    span: 12,
    initialValue: "upcoming",
    options: [
      { label: "Upcoming", value: "upcoming" },
      { label: "Running", value: "running" },
      { label: "Completed", value: "completed" },
    ],
  },
];

/* =========================
   👥 STAFF
========================= */
export const staffFormFields: FormField[] = [
  {
    name: "name",
    label: "Staff Name",
    type: "text",
    placeholder: "Enter staff name",
    span: 12,
    required: true,
  },
  {
    name: "designation",
    label: "Designation",
    type: "text",
    placeholder: "e.g. Clerk",
    span: 12,
    required: true,
  },
  {
    name: "phone",
    label: "Phone",
    type: "text",
    placeholder: "Enter phone",
    span: 12,
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    placeholder: "Enter email",
    span: 12,
  },
  {
    name: "salary",
    label: "Salary",
    type: "number",
    placeholder: "0.00",
    span: 12,
  },
  { name: "joinDate", label: "Join Date", type: "date", span: 12 },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status",
    span: 12,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    initialValue: "active",
  },
];

// import { FormField } from "../components/common/FormBuilder/FormBuilder";

// /* =========================
//    🏫 ADMISSION
// ========================= */
// export const admissionFormFields = [
//   {
//     name: "studentName",
//     label: "Student Name",
//     type: "text",
//     span: 12,
//     required: true,
//   },
//   {
//     name: "fatherName",
//     label: "Father Name",
//     type: "text",
//     span: 12,
//   },
//   {
//     name: "phone",
//     label: "Phone Number",
//     type: "text",
//     span: 12,
//     required: true,
//   },
//   {
//     name: "classId", // ✅ ঠিক আছে
//     label: "Class",
//     type: "select",
//     span: 12,
//     dynamicOptions: true,
//     options: [],
//   },
//   {
//     name: "address",
//     label: "Address",
//     type: "textarea",
//     span: 24,
//   },
//   {
//     name: "status",
//     label: "Status",
//     type: "select",
//     span: 12,
//     options: [
//       { label: "Pending", value: "pending" },
//       { label: "Approved", value: "approved" },
//       { label: "Rejected", value: "rejected" },
//     ],
//     initialValue: "pending",
//   },
// ];
// /* =========================
//    🎓 STUDENT
// ========================= */
// export const studentFormFields: FormField[] = [
//   {
//     name: "name",
//     label: "Student Name",
//     type: "text",
//     span: 12,
//     required: true,
//   },
//   { name: "roll", label: "Roll", type: "text", span: 12, required: true },
//   {
//     name: "classId",
//     label: "Class",
//     type: "select",
//     span: 12,
//     dynamicOptions: true,
//     options: [],
//   },
//   { name: "section", label: "Section", type: "text", span: 12 },
//   { name: "phone", label: "Phone", type: "text", span: 12 },
//   { name: "fatherName", label: "Father Name", type: "text", span: 12 },
//   { name: "motherName", label: "Mother Name", type: "text", span: 12 },
//   { name: "address", label: "Address", type: "textarea", span: 24 },
// ];

// /* =========================
//    👨‍🏫 TEACHER
// ========================= */
// export const teacherFormFields: FormField[] = [
//   {
//     name: "name",
//     label: "Teacher Name",
//     type: "text",
//     span: 12,
//     required: true,
//   },
//   { name: "subject", label: "Subject", type: "text", span: 12 },
//   { name: "phone", label: "Phone", type: "text", span: 12 },
//   { name: "email", label: "Email", type: "text", span: 12 },
//   { name: "address", label: "Address", type: "textarea", span: 24 },
//   { name: "salary", label: "Salary", type: "number", span: 12 },
// ];

// /* =========================
//    📅 ATTENDANCE
// ========================= */
// export const attendanceFormFields: FormField[] = [
//   {
//     name: "studentId",
//     label: "Student",
//     type: "select",
//     span: 12,
//     dynamicOptions: true,
//     options: [],
//   },
//   {
//     name: "classId",
//     label: "Class",
//     type: "select",
//     span: 12,
//     dynamicOptions: true,
//     options: [],
//   },
//   { name: "date", label: "Date", type: "date", span: 12 },
//   {
//     name: "status",
//     label: "Status",
//     type: "select",
//     span: 12,
//     options: [
//       { label: "Present", value: "present" },
//       { label: "Absent", value: "absent" },
//       { label: "Late", value: "late" },
//     ],
//     initialValue: "present",
//   },
// ];

// /* =========================
//    💰 FEES
// ========================= */
// export const feesFormFields: FormField[] = [
//   {
//     name: "studentId",
//     label: "Student",
//     type: "select",
//     span: 12,
//         required: true,

//     dynamicOptions: true,
//     options: [],
//   },
//   { name: "month", label: "Month", type: "text", span: 12 ,    required: true,
//  },
//   { name: "amount", label: "Amount", type: "number", span: 12,    required: true,
//  },
//   {
//     name: "paidAmount",
//     label: "Paid Amount",
//     type: "number",
//     span: 12,
//     initialValue: 0,
//   },
//   {
//     name: "status",
//     label: "Status",
//     type: "select",
//     span: 12,
//     options: [
//       { label: "Paid", value: "paid" },
//       { label: "Unpaid", value: "unpaid" },
//       { label: "Partial", value: "partial" },
//     ],
//     initialValue: "unpaid",
//   },
// ];

// /* =========================
//    📚 CLASSES
// ========================= */
// export const classesFormFields: FormField[]  = [
//   {
//     name: "name",
//     label: "Class Name",
//     type: "text",
//   },
//   {
//     name: "section",
//     label: "Section",
//     type: "text",
//   },
//   {
//     name: "teacherId",   // 🔥 FIXED HERE
//     label: "Teacher",
//     type: "select",
//     dynamicOptions: true,
//      options: [],
//   },
//   {
//     name: "isActive",
//     label: "Active",
//     type: "switch",
//   },
// ];
// // export const classesFormFields: FormField[] = [
// //   { name: "name", label: "Class Name", type: "text", span: 12, required: true },
// //   { name: "section", label: "Section", type: "text", span: 12 },
// //   {
// //     name: "teacherId",   // 🔥 FIXED HERE
// //     label: "Teacher",
// //     type: "select",
// //     span: 12,
// //     dynamicOptions: true,
// //     options: [],
// //   },
// // ];

// /* =========================
//    📊 RESULT / EXAM
// ========================= */
// export const resultFormFields: FormField[] = [
//   {
//     name: "studentId",
//     label: "Student",
//     type: "select",
//     span: 12,
//     dynamicOptions: true,
//     options: [],
//   },
//   {
//     name: "classId",
//     label: "Class",
//     type: "select",
//     span: 12,
//     dynamicOptions: true,
//     options: [],
//   },
//   { name: "examName", label: "Exam Name", type: "text", span: 12 },
//   { name: "marks", label: "Marks", type: "number", span: 12 },
//   { name: "grade", label: "Grade", type: "text", span: 12 },
// ];

// /* =========================
//    📢 NOTICE
// ========================= */
// export const noticeFormFields: FormField[] = [
//   {
//     name: "title",
//     label: "Notice Title",
//     type: "text",
//     span: 12,
//     required: true,
//   },
//   {
//     name: "message",
//     label: "Message",
//     type: "textarea",
//     span: 24,
//     required: true,
//   },
//   {
//     name: "audience",
//     label: "Audience",
//     type: "select",
//     span: 12,
//     options: [
//       { label: "Public", value: "public" },
//       { label: "Students", value: "students" },
//       { label: "Teachers", value: "teachers" },
//     ],
//   },
// ];

// /* =========================
//    💸 DONATION
// ========================= */
// export const donateFormFields: FormField[] = [
//   { name: "name", label: "Donor Name", type: "text", span: 12 },
//   { name: "amount", label: "Amount", type: "number", span: 12 },
//   { name: "purpose", label: "Purpose", type: "text", span: 24 },
// ];

// /* =========================
//    👨‍👩‍👧 PARENTS
// ========================= */
// export const parentsFormFields: FormField[] = [
//   { name: "fatherName", label: "Father Name", type: "text", span: 12 },
//   { name: "motherName", label: "Mother Name", type: "text", span: 12 },
//   { name: "phone", label: "Phone", type: "text", span: 12 },
//   { name: "address", label: "Address", type: "textarea", span: 24 },
// ];

// /* =========================
//    👥 STAFF
// ========================= */
// export const staffFormFields: FormField[] = [
//   {
//     name: "name",
//     label: "Staff Name",
//     type: "text",
//     span: 12,
//     required: true,
//   },
//   {
//     name: "designation",
//     label: "Designation",
//     type: "text",
//     span: 12,
//     required: true,
//   },
//   {
//     name: "phone",
//     label: "Phone",
//     type: "text",
//     span: 12,
//   },
//   {
//     name: "email",
//     label: "Email",
//     type: "text",
//     span: 12,
//   },
//   {
//     name: "salary",
//     label: "Salary",
//     type: "number",
//     span: 12,
//   },
//   {
//     name: "joinDate",
//     label: "Join Date",
//     type: "date",
//     span: 12,
//   },
//   {
//     name: "status",
//     label: "Status",
//     type: "select",
//     span: 12,
//     options: [
//       { label: "Active", value: "active" },
//       { label: "Inactive", value: "inactive" },
//     ],
//     initialValue: "active",
//   },
// ];

// /* =========================
//    ⚙️ SETTINGS
// ========================= */
// export const settingsFormFields: FormField[] = [
//   { name: "instituteName", label: "Institute Name", type: "text", span: 12 },
//   { name: "address", label: "Address", type: "textarea", span: 24 },
//   { name: "phone", label: "Phone", type: "text", span: 12 },
//   { name: "email", label: "Email", type: "text", span: 12 },
// ];

// /* =========================
//    📊 REPORT
// ========================= */
// export const reportFormFields: FormField[] = [
//   {
//     name: "type",
//     label: "Report Type",
//     type: "select",
//     span: 12,
//     options: [
//       { label: "Attendance", value: "attendance" },
//       { label: "Fees", value: "fees" },
//       { label: "Result", value: "result" },
//     ],
//   },
//   { name: "fromDate", label: "From Date", type: "date", span: 12 },
//   { name: "toDate", label: "To Date", type: "date", span: 12 },
// ];
// /* =========================
//    📊 Ecent
// ========================= */

export const eventFormFields: FormField[] = [
  {
    name: "title",
    label: "Event Title",
    type: "text",
    placeholder: "Enter event title",
    span: 24,
    required: true,
  },

  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Write event details",
    span: 24,
  },

  {
    name: "location",
    label: "Location",
    type: "text",
    placeholder: "Enter event location",
    span: 12,
  },

  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    span: 12,
    required: true,
  },

  {
    name: "endDate",
    label: "End Date",
    type: "date",
    span: 12,
  },

  {
    name: "eventType",
    label: "Event Type",
    type: "select",
    span: 12,
    options: [
      { label: "Exam", value: "exam" },
      { label: "Program", value: "program" },
      { label: "Holiday", value: "holiday" },
      { label: "Meeting", value: "meeting" },
    ],
  },

  {
    name: "thumbnail",
    label: "Event Image",
    type: "upload",
    span: 24,
    multiple: false,
  },

  {
    name: "isActive",
    label: "Active Event",
    type: "switch",
    span: 12,
    initialValue: true,
  },
];

// /* =========================
//    📊 Classes
// ========================= */

// export const classFormFields: FormField[] = [
//   {
//     name: "name",
//     label: "Class Name",
//     type: "text",
//     placeholder: "Enter class name (e.g. Class 1)",
//     span: 24,
//     required: true,
//   },

//   {
//     name: "section",
//     label: "Section",
//     type: "text",
//     placeholder: "Enter section (A, B, C)",
//     span: 12,
//   },

//   {
//     name: "teacherId",
//     label: "Class Teacher",
//     type: "select",
//     placeholder: "Select teacher",
//     span: 12,
//     dynamicOptions: true,
//     options: [],
//   },

//   {
//     name: "capacity",
//     label: "Student Capacity",
//     type: "number",
//     placeholder: "Enter max students",
//     span: 12,
//   },

//   {
//     name: "roomNumber",
//     label: "Room Number",
//     type: "text",
//     placeholder: "Enter room no",
//     span: 12,
//   },

//   {
//     name: "shift",
//     label: "Shift",
//     type: "select",
//     span: 12,
//     options: [
//       { label: "Morning", value: "morning" },
//       { label: "Day", value: "day" },
//       { label: "Evening", value: "evening" },
//     ],
//   },

//   {
//     name: "isActive",
//     label: "Active Class",
//     type: "switch",
//     span: 12,
//     initialValue: true,
//   },
// ];

// export const parentFormFields: FormField[] = [
//   {
//     name: "fatherName",
//     label: "Father Name",
//     type: "text",
//     span: 12,
//     required: true,
//   },

//   {
//     name: "motherName",
//     label: "Mother Name",
//     type: "text",
//     span: 12,
//     required: true,
//   },

//   {
//     name: "phone",
//     label: "Phone Number",
//     type: "text",
//     span: 12,
//     required: true,
//   },

//   {
//     name: "email",
//     label: "Email",
//     type: "text",
//     span: 12,
//   },

//   {
//     name: "occupation",
//     label: "Occupation",
//     type: "text",
//     span: 12,
//   },

//   {
//     name: "address",
//     label: "Address",
//     type: "textarea",
//     span: 24,
//   },

//   {
//     name: "status",
//     label: "Status",
//     type: "select",
//     span: 12,
//     options: [
//       { label: "Active", value: "active" },
//       { label: "Inactive", value: "inactive" },
//     ],
//     initialValue: "active",
//   },
// ];

// export const donationFormFields: FormField[] = [
//   {
//     name: "donorName",
//     label: "Donor Name",
//     type: "text",
//     span: 12,
//     required: true,
//   },

//   {
//     name: "phone",
//     label: "Phone Number",
//     type: "text",
//     span: 12,
//     required: true,
//   },

//   {
//     name: "amount",
//     label: "Donation Amount",
//     type: "number",
//     span: 12,
//     required: true,
//   },

//   {
//     name: "donationType",
//     label: "Donation Type",
//     type: "select",
//     span: 12,
//     required: true,
//     options: [
//       {
//         label: "Zakat",
//         value: "zakat",
//       },
//       {
//         label: "Sadaqah",
//         value: "sadaqah",
//       },
//       {
//         label: "General Donation",
//         value: "general",
//       },
//       {
//         label: "Lillah",
//         value: "lillah",
//       },
//     ],
//   },

//   {
//     name: "paymentMethod",
//     label: "Payment Method",
//     type: "select",
//     span: 12,
//     options: [
//       {
//         label: "Cash",
//         value: "cash",
//       },
//       {
//         label: "Bank",
//         value: "bank",
//       },
//       {
//         label: "Bkash",
//         value: "bkash",
//       },
//       {
//         label: "Nagad",
//         value: "nagad",
//       },
//     ],
//   },

//   {
//     name: "status",
//     label: "Status",
//     type: "select",
//     span: 12,
//     initialValue: "pending",
//     options: [
//       {
//         label: "Pending",
//         value: "pending",
//       },
//       {
//         label: "Completed",
//         value: "completed",
//       },
//       {
//         label: "Cancelled",
//         value: "cancelled",
//       },
//     ],
//   },

//   {
//     name: "note",
//     label: "Note",
//     type: "textarea",
//     span: 24,
//   },
// ];

// export const examinationFormFields: FormField[] = [
//   {
//     name: "title",
//     label: "Exam Name",
//     type: "text",
//     span: 12,
//     required: true,
//   },

//   {
//     name: "classId",
//     label: "Class",
//     type: "select",
//     span: 12,
//     dynamicOptions: true,
//     options: [],
//   },

//   {
//     name: "examDate",
//     label: "Exam Date",
//     type: "date",
//     span: 12,
//     required: true,
//   },

//   {
//     name: "totalMarks",
//     label: "Total Marks",
//     type: "number",
//     span: 12,
//     required: true,
//   },

//   {
//     name: "status",
//     label: "Status",
//     type: "select",
//     span: 12,
//     initialValue: "upcoming",
//     options: [
//       {
//         label: "Upcoming",
//         value: "upcoming",
//       },
//       {
//         label: "Running",
//         value: "running",
//       },
//       {
//         label: "Completed",
//         value: "completed",
//       },
//     ],
//   },
// ];
