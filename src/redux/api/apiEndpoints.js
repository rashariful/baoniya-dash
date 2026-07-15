const apiEndpoints = {
  auth: {
    login: "/auth/login",
    changePassword: "/auth/change-password",
    forgotPassword: "/auth/forget-password",
    resetPassword: "/auth/reset-password",
  },

  user: {
    admin: "/users/admin",
    vendor: "/users/vendor",
    customer: "/users/customer",
    myInfo: "/auth/me",
  },

  admin: {
    all: "/admins",
    withId: (id) => `/admins/${id}`,
  },

  customer: {
    all: "/customer",
    withId: (id) => `/customer/${id}`,
  },

  dashboard: {
    all: "/dashboard",
    withId: (id) => `/dashboard/${id}`,
  },

  admission: {
    all: "/admission",
    withId: (id) => `/admission/${id}`,
  },

  attendance: {
    all: "/attendance",
    withId: (id) => `/attendance/${id}`,
  },

  banner: {
    all: "/banner",
    withId: (id) => `/banner/${id}`,
  },

  classes: {
    all: "/classes",
    withId: (id) => `/classes/${id}`,
  },

  contact: {
    all: "/contact",
    withId: (id) => `/contact/${id}`,
  },

  donate: {
    all: "/donate",
    withId: (id) => `/donate/${id}`,
  },

  event: {
    all: "/event",
    withId: (id) => `/event/${id}`,
  },

  examination: {
    all: "/examination",
    withId: (id) => `/examination/${id}`,
  },

  fees: {
    all: "/fees",
    withId: (id) => `/fees/${id}`,
  },

  notice: {
    all: "/notice",
    withId: (id) => `/notice/${id}`,
  },

  parents: {
    all: "/parents",
    withId: (id) => `/parents/${id}`,
  },

  report: {
    all: "/report",
    withId: (id) => `/report/${id}`,
  },
  gallery: {
    all: "/gallery",
    withId: (id) => `/gallery/${id}`,
  },

  settings: {
    all: "/settings",
    withId: (id) => `/settings/${id}`,
  },

  staff: {
    all: "/staff",
    withId: (id) => `/staff/${id}`,
  },

  student: {
    all: "/student",
    withId: (id) => `/student/${id}`,
  },

  teacher: {
    all: "/teacher",
    withId: (id) => `/teacher/${id}`,
  },

  // ================= Academic =================

  academicSession: {
    all: "/academic-session",
    withId: (id) => `/academic-session/${id}`,
  },

  section: {
    all: "/section",
    withId: (id) => `/section/${id}`,
  },

  subject: {
    all: "/subject",
    withId: (id) => `/subject/${id}`,
  },

  exam: {
    all: "/exam",
    withId: (id) => `/exam/${id}`,
  },

  examResult: {
    all: "/exam-result",
    withId: (id) => `/exam-result/${id}`,
  },

  gradeRule: {
    all: "/grade-rule",
    withId: (id) => `/grade-rule/${id}`,
  },

  resultSetting: {
    all: "/result-setting",
    withId: (id) => `/result-setting/${id}`,
  },

  routine: {
    all: "/routine",
    withId: (id) => `/routine/${id}`,
  },

  syllabus: {
    all: "/syllabus",
    withId: (id) => `/syllabus/${id}`,
  },

  payment: {
    all: "/payment",
    withId: (id) => `/payment/${id}`,
  },

  role: {
    all: "/role",
    withId: (id) => `/role/${id}`,
  },

  permission: {
    all: "/permission",
    withId: (id) => `/permission/${id}`,
  },
};

export const {
  auth,
  user,
  admin,
  customer,
  dashboard,
  admission,
  attendance,
  banner,
  classes,
  contact,
  donate,
  event,
  examination,
  fees,
  notice,
  parents,
  report,
  settings,
  staff,
  student,
  teacher,
  gallery,

  academicSession,
  section,
  subject,
  exam,
  examResult,
  gradeRule,
  resultSetting,
  routine,
  syllabus,
  payment,
  role,
  permission,
} = apiEndpoints;

// const apiEndpoints = {
//   auth: {
//     login: "/auth/login",
//     changePassword: "/auth/change-password",
//     forgotPassword: "/auth/forget-password",
//     resetPassword: "/auth/reset-password",
//   },

//   user: {
//     admin: "/users/admin",
//     vendor: "/users/vendor",
//     customer: "/users/customer",
//     myInfo: "/auth/me",
//   },

//   admin: {
//     all: "/admins",
//     withId: (id) => `/admins/${id}`,
//   },

//   customer: {
//     all: "/customer",
//     withId: (id) => `/customer/${id}`,
//   },

//   dashboard: {
//     all: "/dashboard",
//     withId: (id) => `/dashboard/${id}`,
//   },

//   admission: {
//     all: "/admission",
//     withId: (id) => `/admission/${id}`,
//   },

//   attendance: {
//     all: "/attendance",
//     withId: (id) => `/attendance/${id}`,
//   },

//   banner: {
//     all: "/banner",
//     withId: (id) => `/banner/${id}`,
//   },

//   classes: {
//     all: "/classes",
//     withId: (id) => `/classes/${id}`,
//   },

//   contact: {
//     all: "/contact",
//     withId: (id) => `/contact/${id}`,
//   },

//   donate: {
//     all: "/donate",
//     withId: (id) => `/donate/${id}`,
//   },

//   event: {
//     all: "/event",
//     withId: (id) => `/event/${id}`,
//   },

//   examination: {
//     all: "/examination",
//     withId: (id) => `/examination/${id}`,
//   },

//   fees: {
//     all: "/fees",
//     withId: (id) => `/fees/${id}`,
//   },

//   notice: {
//     all: "/notice",
//     withId: (id) => `/notice/${id}`,
//   },

//   parents: {
//     all: "/parents",
//     withId: (id) => `/parents/${id}`,
//   },

//   report: {
//     all: "/report",
//     withId: (id) => `/report/${id}`,
//   },

//   settings: {
//     all: "/settings",
//     withId: (id) => `/settings/${id}`,
//   },

//   staff: {
//     all: "/staff",
//     withId: (id) => `/staff/${id}`,
//   },

//   student: {
//     all: "/student",
//     withId: (id) => `/student/${id}`,
//   },

//   teacher: {
//     all: "/teacher",
//     withId: (id) => `/teacher/${id}`,
//   },
// };

// export const {
//   auth,
//   user,
//   admin,
//   customer,
//   dashboard,
//   admission,
//   attendance,
//   banner,
//   classes,
//   contact,
//   donate,
//   event,
//   examination,
//   fees,
//   notice,
//   parents,
//   report,
//   settings,
//   staff,
//   student,
//   teacher,
// } = apiEndpoints;