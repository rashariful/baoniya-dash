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
   📦 ASSET FORM FIELDS
========================= */

export const assetFormFields: FormField[] = [
  {
    name: "name",
    label: "Asset Name",
    type: "text",
    placeholder: "Enter asset name",
    span: 12,
    required: true,
  },
  {
    name: "category",
    label: "Category",
    type: "text",
    placeholder: "e.g. Furniture, Electronics",
    span: 12,
    required: false,
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
    placeholder: "Enter quantity",
    span: 12,
    required: true,
    
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status",
    span: 12,
    required: true,
    
    options: [
      { label: "Available", value: "available" },
      { label: "Not Available", value: "not_available" },
      { label: "Damaged", value: "damaged" },
      { label: "In Repair", value: "in_repair" },
    ],
  },
];
/* =========================
   📚 LIBRARY FORM FIELDS
========================= */

export const libraryFormFields: FormField[] = [
  {
    name: "bookName",
    label: "Book Name",
    type: "text",
    placeholder: "Enter book name",
    span: 12,
    required: true,
  },
  {
    name: "student",
    label: "Student",
    type: "select",
    placeholder: "Select student",
    span: 12,
    required: false,
    options: [], // Dynamically populated via useMemo in LibraryPage
  },
  {
    name: "returnDate",
    label: "Return Date",
    type: "date",
    placeholder: "Select return date",
    span: 12,
    required: false,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status",
    span: 12,
    required: true,
    options: [
      { label: "Borrowed", value: "borrowed" },
      { label: "Returned", value: "returned" },
      { label: "Overdue", value: "overdue" },
    ],
  },
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


export const galleryFormFields: FormField[] = [
  {
    name: "name",
    label: "Gallery Name",
    type: "text",
    placeholder: "Enter gallery name",
    span: 12,
    required: true,
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    span: 12,
    required: true,
    options: [
      { label: "ক্যাম্পাস", value: "campus" },
      { label: "সুবিধা", value: "facilities" },
      { label: "ইভেন্ট", value: "events" },
      { label: "ক্রীড়া", value: "sports" },
      { label: "কমিউনিটি", value: "community" },
      { label: "সাংস্কৃতিক অনুষ্ঠান", value: "cultural" },
      { label: "শিক্ষা কার্যক্রম", value: "academic" },
      { label: "বৃক্ষরোপণ", value: "tree_plantation" },
      { label: "জাতীয় দিবস", value: "national_day" },
      { label: "পুরস্কার ও অর্জন", value: "achievement" },
      { label: "শিক্ষা সফর", value: "education_tour" },
      { label: "অন্যান্য", value: "others" },
    ],
  },
  {
    name: "thumbnail",
    label: "Thumbnail",
    type: "upload",
    span: 24,
    required: true,
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
        name: "CA",
        label: "ca",
        type: "number",
        span: 4,
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
  },
  // {
  //   name: "registrationNo",
  //   label: "Registration No",
  //   type: "text",
  //   placeholder: "Enter registration number",
  //   span: 12,
  // },
  {
    name: "classId",
    label: "Class",
    type: "select",
    placeholder: "Select class",
    span: 12,
    dynamicOptions: true,
    options: [],
    required: true,
  },
  {
    name: "sectionId",
    label: "Section",
    type: "select",
    placeholder: "Select section",
    span: 12,
    dynamicOptions: true,
    options: [],
  },
  {
    name: "sessionId",
    label: "Academic Session",
    type: "select",
    placeholder: "Select academic session",
    span: 12,
    dynamicOptions: true,
    options: [],
    required: true,
  },
  {
    name: "phone",
    label: "Student Phone",
    type: "text",
    placeholder: "Enter student phone number",
    span: 12,
    required: true,
  },
  {
    name: "fatherName",
    label: "Father's Name",
    type: "text",
    placeholder: "Enter father's name",
    span: 12,
  },
  {
    name: "motherName",
    label: "Mother's Name",
    type: "text",
    placeholder: "Enter mother's name",
    span: 12,
  },
  {
    name: "guardianName",
    label: "Guardian Name",
    type: "text",
    placeholder: "Enter guardian's name",
    span: 12,
  },
  {
    name: "guardianPhone",
    label: "Guardian Phone",
    type: "text",
    placeholder: "Enter guardian phone number",
    span: 12,
        required: true,

  },
  // {
  //   name: "status",
  //   label: "Status",
  //   type: "select",
  //   placeholder: "Select status",
  //   span: 12,
  //   options: [
  //     { label: "Active", value: "active" },
  //     { label: "Inactive", value: "inactive" },
  //     { label: "Transferred", value: "transferred" },
  //     { label: "Graduated", value: "graduated" },
  //   ],
  //   required: true,
  // },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    placeholder: "Enter full address",
    span: 24,
  },
    {
    name: "dob",
    label: "Date of Birth",
    type: "date",
    placeholder: "Enter Date of Birth",
    span: 12,
  },
 {
    name: "bloodGroup",
    label: "Blood Group",
    type: "select",
    options: [
      { label: "A+", value: "A+" },
      { label: "A-", value: "A-" },
      { label: "B+", value: "B+" },
      { label: "B-", value: "B-" },
      { label: "AB+", value: "AB+" },
      { label: "AB-", value: "AB-" },
      { label: "O+", value: "O+" },
      { label: "O-", value: "O-" },
    ],
    span: 12,
  },
    // =========================
  // Basic Information
  // =========================
  {
    name: "thumbnail",
    label: "Thumbnail",
    type: "upload",
    span: 24,
    required: true,
    rules: [
      {
        validator: (_, value) => {
          if (value && value.size > 2 * 1024 * 1024) {
            return Promise.reject(
              new Error("Image size must be less than 2MB!")
            );
          }
          return Promise.resolve();
        },
      },
    ],
  },
 
];
/* =========================
   👨‍🏫 TEACHER
========================= */
export const teacherFormFields: FormField[] = [
  
  { name: "name", label: "Teacher Name", type: "text", placeholder: "e.g. Md. Abul Hasan", span: 12, required: true },
  { name: "indexNumber", label: "Index Number", type: "text", placeholder: "e.g. Index Number", span: 12, required: true },
  { name: "designation", label: "Designation", type: "text", placeholder: "e.g. Senior Lecturer", span: 12, required: true },
  { name: "phone", label: "Phone", type: "text", placeholder: "e.g. 017xxxxxxxx", span: 12, required: true },
];
// export const teacherFormFields: FormField[] = [
//   // =========================
//   // Basic Information
//   // =========================
//   { name: "thumbnail", label: "Thumbnail", type: "upload", span: 24 },
//   { name: "name", label: "Teacher Name", type: "text", placeholder: "e.g. Md. Abul Hasan", span: 12, required: true },
//   { name: "designation", label: "Designation", type: "text", placeholder: "e.g. Senior Lecturer", span: 12, required: true },
//   { name: "phone", label: "Phone", type: "text", placeholder: "e.g. 017xxxxxxxx", span: 12, required: true },


//   // { name: "teacherId", label: "Teacher ID", type: "text", placeholder: "e.g. TCH-2026-001", span: 12, required: true },
//   { name: "indexNumber", label: "Index Number", type: "text", placeholder: "e.g. 12345678", span: 12 },
//   { name: "nid", label: "NID Number", type: "text", placeholder: "e.g. 19901234567890123", span: 12 },
//   { name: "birthCertificateNo", label: "Birth Certificate No", type: "text", placeholder: "e.g. 20001234567890123", span: 12 },
//   { name: "gender", label: "Gender", type: "select", options: [{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }, { label: "Other", value: "Other" }], span: 12 },
//   { name: "dateOfBirth", label: "Date of Birth", type: "date", span: 12 },
//   { name: "bloodGroup", label: "Blood Group", type: "select", options: [{ label: "A+", value: "A+" }, { label: "A-", value: "A-" }, { label: "B+", value: "B+" }, { label: "B-", value: "B-" }, { label: "AB+", value: "AB+" }, { label: "AB-", value: "AB-" }, { label: "O+", value: "O+" }, { label: "O-", value: "O-" }], span: 12 },
//   { name: "religion", label: "Religion", type: "text", placeholder: "e.g. Islam", span: 12 },
//   { name: "maritalStatus", label: "Marital Status", type: "select", options: [{ label: "Single", value: "Single" }, { label: "Married", value: "Married" }, { label: "Divorced", value: "Divorced" }, { label: "Widowed", value: "Widowed" }], span: 12 },

//   // =========================
//   // Professional Information
//   // =========================
//   { name: "department", label: "Department", type: "text", placeholder: "e.g. Computer Science", span: 12 },
//   { name: "subject", label: "Subject", type: "text", placeholder: "e.g. Mathematics", span: 12 },
//   { name: "qualification", label: "Highest Qualification", type: "text", placeholder: "e.g. M.Sc in CSE", span: 12 },
//   { name: "teachingExperience", label: "Teaching Experience (Years)", type: "number", placeholder: "e.g. 5", span: 12 },
//   { name: "salary.governmentSalary", label: "Government Salary", type: "number", placeholder: "e.g. 25000", span: 12 },
//   { name: "salary.schoolSalary", label: "School Salary", type: "number", placeholder: "e.g. 15000", span: 12 },
//   { name: "joinDate", label: "Joining Date", type: "date", span: 12 },
//   { name: "schoolJoinDate", label: "School Joining Date", type: "date", span: 12 },
//   { name: "employmentType", label: "Employment Type", type: "select", options: [{ label: "Permanent", value: "Permanent" }, { label: "Contract", value: "Contract" }, { label: "Part Time", value: "Part Time" }], span: 12 },
//   { name: "status", label: "Status", type: "select", options: [{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }, { label: "Resigned", value: "Resigned" }], span: 12 },
//   { name: "bio", label: "Biography", type: "textarea", placeholder: "Write something about the teacher...", span: 24 },

//   // =========================
//   // Contact Information
//   // =========================
//   { name: "alternativePhone", label: "Alternative Phone", type: "text", placeholder: "e.g. 018xxxxxxxx", span: 12 },
//   { name: "email", label: "Email", type: "email", placeholder: "e.g. teacher@example.com", span: 12 },
//   { name: "presentAddress", label: "Present Address", type: "textarea", placeholder: "House, Road, Area, City", span: 12 },
//   { name: "permanentAddress", label: "Permanent Address", type: "textarea", placeholder: "House, Road, Area, City", span: 12 },

//   // =========================
//   // Emergency Contact
//   // =========================
//   { name: "emergencyContact.name", label: "Emergency Name", type: "text", placeholder: "e.g. Father/Brother Name", span: 8 },
//   { name: "emergencyContact.relation", label: "Relation", type: "text", placeholder: "e.g. Father", span: 8 },
//   { name: "emergencyContact.phone", label: "Emergency Phone", type: "text", placeholder: "e.g. 019xxxxxxxx", span: 8 },

//   // =========================
//   // Dynamic Arrays
//   // =========================
//   {
//     name: "education",
//     label: "Education Qualification",
//     type: "dynamicList",
//     span: 24,
//     fields: [
//       { name: "label", label: "Degree/Exam", type: "text", placeholder: "e.g. B.Sc" },
//       { name: "institute", label: "Institute", type: "text", placeholder: "e.g. University of Dhaka" },
//       { name: "year", label: "Passing Year", type: "number", placeholder: "e.g. 2020" },
//       { name: "grade", label: "GPA/CGPA", type: "text", placeholder: "e.g. 3.50" },
//     ]
//   },
//   {
//     name: "bankAccounts",
//     label: "Bank Information",
//     type: "dynamicList",
//     span: 24,
//     fields: [
//       { name: "bankName", label: "Bank Name", type: "text", placeholder: "e.g. Sonali Bank" },
//       { name: "accountName", label: "Account Name", type: "text", placeholder: "e.g. MD. ABUL HASAN" },
//       { name: "accountNumber", label: "Account Number", type: "text", placeholder: "e.g. 1234567890" },
//       { name: "branchName", label: "Branch Name", type: "text", placeholder: "e.g. Gulshan Branch" },
//       { name: "routingNumber", label: "Routing Number", type: "text", placeholder: "e.g. 012345678" },
//     ]
//   },
//   {
//     name: "social",
//     label: "Social Links",
//     type: "dynamicList",
//     span: 24,
//     fields: [
//       { name: "platform", label: "Platform Name", type: "text", placeholder: "e.g. Facebook / LinkedIn" },
//       { name: "link", label: "Profile Link", type: "text", placeholder: "e.g. https://linkedin.com/in/..." },
//     ]
//   },
// ];
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

const monthOptions = [
  { label: "January", value: "january" },
  { label: "February", value: "february" },
  { label: "March", value: "march" },
  { label: "April", value: "april" },
  { label: "May", value: "may" },
  { label: "June", value: "june" },
  { label: "July", value: "july" },
  { label: "August", value: "august" },
  { label: "September", value: "september" },
  { label: "October", value: "october" },
  { label: "November", value: "november" },
  { label: "December", value: "december" },
];

const feeHeadOptions = [
  { label: "বকেয়া", value: "due" },
  { label: "চলতি মাস", value: "current_month" },
  { label: "অগ্রিম বেতন", value: "advance_tuition" },
  { label: "সেশন ফি", value: "session_fee" },
  { label: "ভর্তি/পুনঃ ভর্তি/ছাড়পত্র/জরিমানা", value: "admission_fee" },
  { label: "রশিদ বই", value: "receipt_book" },
  { label: "ক্যালেন্ডার, ডায়েরি ও পরিচিতি পত্র", value: "calendar_diary_id" },
  { label: "সিলেবাস", value: "syllabus" },
  { label: "নির্মাণ/মেরামত ফি", value: "maintenance_fee" },
  { label: "বিজ্ঞানাগার ফি", value: "laboratory_fee" },
  { label: "ক্রীড়া/বার্ষিক পুরস্কার বিতরণী ফি", value: "sports_fee" },
  { label: "ছাত্র কল্যাণ তহবিল", value: "student_welfare" },
  { label: "পাঠাগার ফি", value: "library_fee" },
  { label: "মিলাদ ফি", value: "milad_fee" },
  { label: "স্কাউট/গার্লস গাইড ফি", value: "scout_guide_fee" },
  { label: "পরীক্ষা ও প্রিন্টিং ফি", value: "exam_printing_fee" },
  { label: "ম্যাগাজিন ফি", value: "magazine_fee" },
  { label: "ফলাফল বিবরণী ফি", value: "result_sheet_fee" },
  { label: "কম্পিউটার বিজ্ঞান ফি", value: "computer_fee" },
  { label: "শিক্ষক-কর্মচারী কল্যাণ তহবিল", value: "staff_welfare" },
  { label: "বিদ্যুৎ, ওয়াসা ও টেলিফোন ফি", value: "utility_fee" },
  { label: "বোর্ড ফি/রেজিস্ট্রেশন ফি", value: "board_registration_fee" },
  { label: "হোস্টেল চার্জ", value: "hostel_charge" },
  { label: "শিক্ষা সার্ভিস/আইসিটি ফি", value: "ict_service_fee" },
  { label: "বিবিধ", value: "others" },
];

export const feesFormFields: FormField[] = [
  {
    name: "studentId",
    label: "Student",
    type: "select",
    placeholder: "Select Student",
    span: 12,
    required: true,
    dynamicOptions: true,
    options: [],
  },

  {
    name: "paidAmount",
    label: "Paid Amount",
    type: "number",
    placeholder: "Enter Paid Amount",
    span: 12,
    initialValue: 0,
  },

  {
    name: "feeItems",
    label: "Fee Items",
    type: "dynamicList",
    span: 24,
    fields: [
      {
        name: "feeHead",
        label: "Fee Head",
        type: "select",
        placeholder: "Select Fee Head",
        required: true,
        options: feeHeadOptions,
      },
      {
        name: "month",
        label: "Month",
        type: "select",
        placeholder: "Select Month",
        required: false,
        options: monthOptions,
      },
      {
        name: "amount",
        label: "Amount",
        type: "number",
        placeholder: "Enter Amount",
        required: true,
      },
    ],
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
   📢 NOTICE FORM FIELDS
========================= */
export const noticeFormFields = [
  {
    name: "title",
    label: "Notice Title",
    type: "text",
    placeholder: "Enter title",
    span: 24,
    required: true,
  },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    placeholder: "Select priority",
    span: 12,
    required: true,
    options: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],
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
    required: true,
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    placeholder: "Write notice details here...",
    span: 24,
    required: false, // যেহেতু স্কিমা অনুযায়ী মেসেজ বা থাম্বনেইল যেকোনো একটি থাকলেই হবে
  },
   {
    name: "thumbnail",
    label: "Thumbnail / Image URL",
    type: "upload", // অথবা আপনার প্রজেক্ট অনুযায়ী ফাইল আপলোড টাইপ থাকলে সেটি দিতে পারেন
    placeholder: "Enter image URL or upload file",
    span: 12,
  },
];
/* =========================
   📩 CONTACT
========================= */
export const contactFormFields: FormField[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter your name",
    span: 12,
    required: true,
  },

  {
    name: "email",
    label: "Email",
    type: "text",
    placeholder: "Enter email address",
    span: 12,
    required: false,
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
    name: "subject",
    label: "Subject",
    type: "text",
    placeholder: "Enter subject",
    span: 12,
    required: false,
  },

  {
    name: "message",
    label: "Message",
    type: "textarea",
    placeholder: "Write your message here...",
    span: 24,
    required: true,
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
