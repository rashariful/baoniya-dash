import React, { useMemo, useState } from "react";
import { message, Button } from "antd";
import { IdcardOutlined } from "@ant-design/icons";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";
import { Card } from "@/components/ui/card";
import { studentColumns } from "@/utils/tableConfigs";
import { studentFormFields } from "@/utils/formSchemas";
import {
  useCreateStudentMutation,
  useDeleteStudentMutation,
  useGetAllStudentQuery,
  useUpdateStudentMutation,
} from "@/redux/api/studentApi";
import { useGetAllClassesQuery } from "@/redux/api/classesApi";
import { useGetAllSectionQuery } from "@/redux/api/sectionApi";
import { useGetAllAcademicSessionQuery } from "@/redux/api/academicSessionApi";
import IDCardModal from "./IDCardModal";

const StatCard = ({ title, value, sub, colorClass }: any) => (
  <div className={`p-6 rounded-xl border ${colorClass} bg-opacity-5 shadow-sm transition-all hover:shadow-md`}>
    <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60">{title}</h3>
    <div className="text-3xl font-bold mt-2">{value}</div>
    <p className="text-sm opacity-60 mt-1">{sub}</p>
  </div>
);

const StudentPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [idCardOpen, setIdCardOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Queries
  const { data, isLoading, refetch } = useGetAllStudentQuery(
    searchTerm ? [{ name: "searchTerm", value: searchTerm }] : undefined
  );

  const { data: classData } = useGetAllClassesQuery([
    { name: "limit", value: 100 },
  ]);

  // ★ সব section নিয়ে আসছি (filter ছাড়া)
  const { data: sectionData } = useGetAllSectionQuery([
    { name: "limit", value: 500 },
  ]);

  const { data: sessionData } = useGetAllAcademicSessionQuery([
    { name: "limit", value: 100 },
  ]);

  // Mutations
  const [createStudent] = useCreateStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  // ★ FIX: populated reference object (e.g. classId, sectionId, sessionId আসলে
  // backend থেকে { _id, name, ... } আকারে populated হয়ে আসতে পারে, বিশেষ করে
  // edit form-এ prefill করার সময়। এমন object কে raw JSON.stringify করে পাঠালে
  // backend ObjectId cast করতে গিয়ে fail করে ("Cast to ObjectId failed").
  // তাই object-এ _id থাকলে শুধু সেই _id string টা পাঠাই।
  const convertToFormData = (data: Record<string, any>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (!value && value !== 0) return;

      if (value?.originFileObj instanceof File) {
        formData.append(key, value.originFileObj);
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (Array.isArray(value)) {
        // array of populated objects/ids হইলে _id গুলা বের করে JSON array পাঠাই
        const normalized = value.map((v) =>
          v && typeof v === "object" && v._id ? v._id : v
        );
        formData.append(key, JSON.stringify(normalized));
      } else if (typeof value === "object" && value !== null) {
        // ★ populated reference object -> শুধু _id পাঠাও
        if (value._id) {
          formData.append(key, String(value._id));
        } else {
          formData.append(key, JSON.stringify(value));
        }
      } else {
        formData.append(key, String(value));
      }
    });
    return formData;
  };

  // ★ classId → class name map
  const classNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    (classData?.data || []).forEach((cls: any) => {
      map[cls._id] = cls.name; // "Class 6", "Class 7" ইত্যাদি
    });
    return map;
  }, [classData]);

  // ★ Section options — label এ class name যোগ করা
  const sectionOptions = useMemo(() => {
    return (sectionData?.data || []).map((sec: any) => {
      const classId = typeof sec.classId === "object" ? sec.classId?._id : sec.classId;
      const className = classNameMap[classId] || "Unknown";

      return {
        label: `${sec.name} (${className})`, // → A (Class 6)
        value: sec._id,
      };
    });
  }, [sectionData, classNameMap]);

  const mapOptions = (arr: any[] = [], labelKey = "name") =>
    arr.map((item) => ({ label: item[labelKey], value: item._id }));

  // CRUD Handlers
  const handleAdd = async (formData: any) => {
    try {
      const payload = convertToFormData(formData);
      await createStudent(payload).unwrap();
      message.success("Student created successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to create student");
    }
  };

  const handleEdit = async (id: string, formData: any) => {
    try {
      const payload = convertToFormData(formData);
      await updateStudent({ id, data: payload }).unwrap();
      message.success("Student updated successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update student");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent(id).unwrap();
      message.success("Student deleted successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete student");
    }
  };

  const stats = useMemo(() => {
    const students = data?.data || [];
    return [
      {
        title: "TOTAL STUDENTS",
        value: students.length,
        sub: "All Students",
        color: "bg-emerald-50 border-emerald-200 text-emerald-900",
      },
      {
        title: "CURRENT SESSION",
        value: students.filter((s: any) => s.sessionId).length,
        sub: "Academic Session",
        color: "bg-blue-50 border-blue-200 text-blue-900",
      },
      {
        title: "PHONE ADDED",
        value: students.filter((s: any) => s.phone).length,
        sub: "Contact Available",
        color: "bg-purple-50 border-purple-200 text-purple-900",
      },
    ];
  }, [data]);

  const dynamicFormFields = useMemo(() => {
    const classOptions = mapOptions(classData?.data);
    const sessionOptions = mapOptions(sessionData?.data);

    return studentFormFields.map((field) => {
      if (field.name === "classId") {
        return { ...field, options: classOptions };
      }

      if (field.name === "sectionId") {
        return {
          ...field,
          options: sectionOptions, // A (Class 6), B (Class 6)...
        };
      }

      if (field.name === "sessionId") {
        return { ...field, options: sessionOptions };
      }

      return field;
    });
  }, [classData, sectionData, sessionData, sectionOptions]);

  const columnsWithIdCard = useMemo(
    () => [
      ...studentColumns,
      {
        title: "আইডি কার্ড",
        key: "idcard",
        render: (_: any, record: any) => (
          <Button
            size="small"
            icon={<IdcardOutlined />}
            onClick={() => {
              setSelectedStudent(record);
              setIdCardOpen(true);
            }}
          >
            ID Card
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((item, index) => (
          <Card key={index}>
            <StatCard {...item} colorClass={item.color} />
          </Card>
        ))}
      </div>

      <CrudTemplate
        title="Student Management"
        subtitle="Manage all students"
        data={data?.data || []}
        columns={columnsWithIdCard}
        formFields={dynamicFormFields}
        loading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        enableSearch
        onSearch={setSearchTerm}
      />

      <IDCardModal
        open={idCardOpen}
        onClose={() => setIdCardOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
};

export default StudentPage;

// import React, { useMemo, useState } from "react";
// import { message, Button } from "antd";
// import { IdcardOutlined } from "@ant-design/icons";
// import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";
// import { Card } from "@/components/ui/card";
// import { studentColumns } from "@/utils/tableConfigs";
// import { studentFormFields } from "@/utils/formSchemas";
// import {
//   useCreateStudentMutation,
//   useDeleteStudentMutation,
//   useGetAllStudentQuery,
//   useUpdateStudentMutation,
// } from "@/redux/api/studentApi";
// import { useGetAllClassesQuery } from "@/redux/api/classesApi";
// import { useGetAllSectionQuery } from "@/redux/api/sectionApi";
// import { useGetAllAcademicSessionQuery } from "@/redux/api/academicSessionApi";
// import IDCardModal from "./IDCardModal";

// // StatCard Component
// const StatCard = ({ title, value, sub, colorClass }: any) => (
//   <div className={`p-6 rounded-xl border ${colorClass} bg-opacity-5 shadow-sm transition-all hover:shadow-md`}>
//     <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60">{title}</h3>
//     <div className="text-3xl font-bold mt-2">{value}</div>
//     <p className="text-sm opacity-60 mt-1">{sub}</p>
//   </div>
// );

// const StudentPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [idCardOpen, setIdCardOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState<any>(null);

//   // Queries
//   const { data, isLoading, refetch } = useGetAllStudentQuery(searchTerm ? [{ name: "searchTerm", value: searchTerm }] : undefined);
//   const { data: classData } = useGetAllClassesQuery();
//   const { data: sectionData } = useGetAllSectionQuery();
//   const { data: sessionData } = useGetAllAcademicSessionQuery();

//   // Mutations
//   const [createStudent] = useCreateStudentMutation();
//   const [updateStudent] = useUpdateStudentMutation();
//   const [deleteStudent] = useDeleteStudentMutation();

//   // FormData Convert Function
//   const convertToFormData = (data: Record<string, any>) => {
//     const formData = new FormData();
//     Object.entries(data).forEach(([key, value]) => {
//       if (!value && value !== 0) return;
//       if (value.originFileObj instanceof File) {
//         formData.append(key, value.originFileObj);
//       } else if (value instanceof File) {
//         formData.append(key, value);
//       } else if (value instanceof Date) {
//         formData.append(key, value.toISOString());
//       } else if (typeof value === "object" && value !== null) {
//         formData.append(key, JSON.stringify(value));
//       } else {
//         formData.append(key, String(value));
//       }
//     });
//     return formData;
//   };

//   // Helper
//   const mapOptions = (arr: any[] = [], labelKey = "name") =>
//     arr.map((item) => ({ label: item[labelKey], value: item._id }));

//   // CRUD Handlers with FormData
//   const handleAdd = async (formData: any) => {
//     try {
//       const payload = convertToFormData(formData);
//       await createStudent(payload).unwrap();
//       message.success("Student created successfully");
//       refetch();
//     } catch (error: any) {
//       message.error(error?.data?.message || "Failed to create student");
//     }
//   };

//   const handleEdit = async (id: string, formData: any) => {
//     try {
//       const payload = convertToFormData(formData);
//       await updateStudent({ id, data: payload }).unwrap();
//       message.success("Student updated successfully");
//       refetch();
//     } catch (error: any) {
//       message.error(error?.data?.message || "Failed to update student");
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteStudent(id).unwrap();
//       message.success("Student deleted successfully");
//       refetch();
//     } catch (error: any) {
//       message.error(error?.data?.message || "Failed to delete student");
//     }
//   };

//   // Stats & Forms Logic
//   const stats = useMemo(() => {
//     const students = data?.data || [];
//     return [
//       { title: "TOTAL STUDENTS", value: students.length, sub: "All Students", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
//       { title: "CURRENT SESSION", value: students.filter((s: any) => s.sessionId).length, sub: "Academic Session", color: "bg-blue-50 border-blue-200 text-blue-900" },
//       { title: "PHONE ADDED", value: students.filter((s: any) => s.phone).length, sub: "Contact Available", color: "bg-purple-50 border-purple-200 text-purple-900" },
//     ];
//   }, [data]);

//   const dynamicFormFields = useMemo(() => {
//     const classOptions = mapOptions(classData?.data);
//     const sectionOptions = mapOptions(sectionData?.data);
//     const sessionOptions = mapOptions(sessionData?.data);

//     return studentFormFields.map((field) => {
//       if (field.name === "classId") return { ...field, options: classOptions };
//       if (field.name === "sectionId") return { ...field, options: sectionOptions };
//       if (field.name === "sessionId") return { ...field, options: sessionOptions };
//       return field;
//     });
//   }, [classData, sectionData, sessionData]);

//   const columnsWithIdCard = useMemo(() => [
//     ...studentColumns,
//     {
//       title: "আইডি কার্ড",
//       key: "idcard",
//       render: (_: any, record: any) => (
//         <Button size="small" icon={<IdcardOutlined />} onClick={() => { setSelectedStudent(record); setIdCardOpen(true); }}>ID Card</Button>
//       ),
//     },
//   ], [studentColumns]);

//   return (
//     <div className="space-y-6 p-4">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {stats.map((item, index) => (
//           <Card key={index}>
//             <StatCard {...item} colorClass={item.color} />
//           </Card>
//         ))}
//       </div>

//       <CrudTemplate
//         title="Student Management"
//         subtitle="Manage all students"
//         data={data?.data || []}
//         columns={columnsWithIdCard}
//         formFields={dynamicFormFields}
//         loading={isLoading}
//         onAdd={handleAdd}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//         enableSearch
//         onSearch={setSearchTerm}
//       />

//       <IDCardModal open={idCardOpen} onClose={() => setIdCardOpen(false)} student={selectedStudent} />
//     </div>
//   );
// };

// export default StudentPage;

// import React, { useMemo, useState } from "react";
// import { message } from "antd";

// import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";
// import { Card } from "@/components/ui/card";

// import { studentColumns } from "@/utils/tableConfigs";
// import { studentFormFields } from "@/utils/formSchemas";

// import {
//   useCreateStudentMutation,
//   useDeleteStudentMutation,
//   useGetAllStudentQuery,
//   useUpdateStudentMutation,
// } from "@/redux/api/studentApi";

// import { useGetAllClassesQuery } from "@/redux/api/classesApi";
// import { useGetAllSectionQuery } from "@/redux/api/sectionApi";
// import { useGetAllAcademicSessionQuery } from "@/redux/api/academicSessionApi";

// const StatCard = ({ title, value, sub, colorClass }: any) => (
//   <div
//     className={`p-6 rounded-xl border ${colorClass} bg-opacity-5 shadow-sm transition-all hover:shadow-md`}
//   >
//     <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60">
//       {title}
//     </h3>

//     <div className="text-3xl font-bold mt-2">{value}</div>

//     <p className="text-sm opacity-60 mt-1">{sub}</p>
//   </div>
// );

// const StudentPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   // ==========================
//   // Queries
//   // ==========================

//   const { data, isLoading, refetch } = useGetAllStudentQuery(
//     searchTerm
//       ? [{ name: "searchTerm", value: searchTerm }]
//       : undefined
//   );

//   const { data: classData } = useGetAllClassesQuery();

//   const { data: sectionData } = useGetAllSectionQuery();

//   const { data: sessionData } = useGetAllAcademicSessionQuery();

//   // ==========================
//   // Mutations
//   // ==========================

//   const [createStudent] = useCreateStudentMutation();

//   const [updateStudent] = useUpdateStudentMutation();

//   const [deleteStudent] = useDeleteStudentMutation();

//   // ==========================
//   // Helper
//   // ==========================

//   const mapOptions = (arr: any[] = [], labelKey = "name") =>
//     arr.map((item) => ({
//       label: item[labelKey],
//       value: item._id,
//     }));

//   const formatPayload = (data: any) => ({
//     ...data,

//     classId: data.classId?._id || data.classId,

//     sectionId: data.sectionId?._id || data.sectionId,

//     sessionId: data.sessionId?._id || data.sessionId,
//   });

//   // ==========================
//   // Statistics
//   // ==========================

//   const stats = useMemo(() => {
//     const students = data?.data || [];

//     const totalStudents = students.length;

//     const sessionStudents = students.filter(
//       (student: any) => student.sessionId
//     ).length;

//     const phoneAdded = students.filter(
//       (student: any) => student.phone
//     ).length;

//     return [
//       {
//         title: "TOTAL STUDENTS",
//         value: totalStudents,
//         sub: "All Students",
//         color:
//           "bg-emerald-50 border-emerald-200 text-emerald-900",
//       },

//       {
//         title: "CURRENT SESSION",
//         value: sessionStudents,
//         sub: "Academic Session",
//         color: "bg-blue-50 border-blue-200 text-blue-900",
//       },

//       {
//         title: "PHONE ADDED",
//         value: phoneAdded,
//         sub: "Contact Available",
//         color:
//           "bg-purple-50 border-purple-200 text-purple-900",
//       },
//     ];
//   }, [data]);

//   // ==========================
//   // Dynamic Form
//   // ==========================

//   const dynamicFormFields = useMemo(() => {
//     const classOptions = mapOptions(classData?.data);

//     const sectionOptions = mapOptions(sectionData?.data);

//     const sessionOptions = mapOptions(sessionData?.data);

//     return studentFormFields.map((field) => {
//       switch (field.name) {
//         case "classId":
//           return {
//             ...field,
//             options: classOptions,
//           };

//         case "sectionId":
//           return {
//             ...field,
//             options: sectionOptions,
//           };

//         case "sessionId":
//           return {
//             ...field,
//             options: sessionOptions,
//           };

//         default:
//           return field;
//       }
//     });
//   }, [classData, sectionData, sessionData]);

//   // ==========================
//   // CRUD
//   // ==========================

//   const handleAdd = async (formData: any) => {
//     try {
//       await createStudent(formatPayload(formData)).unwrap();

//       message.success("Student created successfully");

//       refetch();
//     } catch (error: any) {
//       message.error(
//         error?.data?.message || "Failed to create student"
//       );
//     }
//   };

//   const handleEdit = async (id: string, formData: any) => {
//     try {
//       await updateStudent({
//         id,
//         data: formatPayload(formData),
//       }).unwrap();

//       message.success("Student updated successfully");

//       refetch();
//     } catch (error: any) {
//       message.error(
//         error?.data?.message || "Failed to update student"
//       );
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteStudent(id).unwrap();

//       message.success("Student deleted successfully");

//       refetch();
//     } catch (error: any) {
//       message.error(
//         error?.data?.message || "Failed to delete student"
//       );
//     }
//   };

//   return (
//     <div className="space-y-6 p-4">
//       {/* Statistics */}

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {stats.map((item, index) => (
//           <Card key={index}>
//             <StatCard
//               title={item.title}
//               value={item.value}
//               sub={item.sub}
//               colorClass={item.color}
//             />
//           </Card>
//         ))}
//       </div>

//       {/* CRUD */}

//       <CrudTemplate
//         title="Student Management"
//         subtitle="Manage all students"

//         data={data?.data || []}

//         columns={studentColumns}

//         formFields={dynamicFormFields}

//         loading={isLoading}

//         onAdd={handleAdd}

//         onEdit={handleEdit}

//         onDelete={handleDelete}

//         enableSearch

//         onSearch={setSearchTerm}
//       />
//     </div>
//   );
// };

// export default StudentPage;

// // import React, { useMemo, useState } from "react";
// // import { message } from "antd";
// // import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";
// // import { studentColumns } from "@/utils/tableConfigs";
// // import { studentFormFields } from "@/utils/formSchemas";
// // import {
// //   useCreateStudentMutation,
// //   useGetAllStudentQuery,
// //   useUpdateStudentMutation,
// //   useDeleteStudentMutation,
// // } from "@/redux/api/studentApi";
// // import { useGetAllClassesQuery } from "@/redux/api/classesApi";
// // import { Card } from "@/components/ui/card";

// // // StatCard Component
// // const StatCard = ({ title, value, sub, colorClass }: any) => (
// //   <div className={`p-6 rounded-xl border ${colorClass} bg-opacity-5 shadow-sm transition-all hover:shadow-md`}>
// //     <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60">{title}</h3>
// //     <div className="text-3xl font-bold mt-2">{value}</div>
// //     <p className="text-sm opacity-60 mt-1">{sub}</p>
// //   </div>
// // );

// // const StudentPage = () => {
// //     const [searchTerm, setSearchTerm] = useState("");

// //   const { data, isLoading, refetch } = useGetAllStudentQuery(searchTerm
// //     ? [{ name: "searchTerm", value: searchTerm }]
// //     : undefined);
// //   const { data: classData } = useGetAllClassesQuery();

// //   const [createStudent] = useCreateStudentMutation();
// //   const [updateStudent] = useUpdateStudentMutation();
// //   const [deleteStudent] = useDeleteStudentMutation();

// //   // 🔥 কার্ডের ডেটা প্রসেসিং
// //   const stats = useMemo(() => {
// //     const students = data?.data || [];
// //     const total = students.length;
// //     const active = students.filter((s: any) => s.classId?.isActive).length;
// //     const pendingFees = students.filter((s: any) => !s.classId?.isActive).length; // উদাহরণস্বরূপ

// //     return [
// //       { title: "TOTAL STUDENTS", value: total, sub: "across all programmes", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
// //       { title: "ACTIVE", value: active, sub: "currently enrolled", color: "bg-blue-50 border-blue-200 text-blue-900" },
// //       { title: "FEE DEFAULTERS", value: pendingFees, sub: "pending payments", color: "bg-red-50 border-red-200 text-red-900" },
// //     ];
// //   }, [data]);

// //   // 🔥 helper
// //   const mapOptions = (arr: any[] = [], labelKey: string) =>
// //     arr.map((item) => ({
// //       label: item[labelKey],
// //       value: item._id,
// //     }));

// //   // 🔥 dynamic form fields
// //   const dynamicFormFields = useMemo(() => {
// //     const classOptions = mapOptions(classData?.data || [], "name");
// //     return studentFormFields.map((field) => {
// //       if (field.name === "classId") {
// //         return { ...field, options: classOptions };
// //       }
// //       return field;
// //     });
// //   }, [classData]);

// //   const handleAdd = async (data: any) => {
// //     try {
// //       await createStudent(data);
// //       message.success("Student created successfully");
// //       refetch();
// //     } catch {
// //       message.error("Failed to create student");
// //     }
// //   };

// //   const handleEdit = async (id: string, data: any) => {
// //     try {
// //       await updateStudent({ id, data });
// //       message.success("Student updated");
// //       refetch();
// //     } catch {
// //       message.error("Failed to update");
// //     }
// //   };

// //   const handleDelete = async (id: string) => {
// //     try {
// //       await deleteStudent(id);
// //       message.success("Student deleted");
// //       refetch();
// //     } catch {
// //       message.error("Failed to delete");
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {/* কার্ড সেকশন */}
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //         {stats.map((s, i) => (
// //           <Card>

// //             <StatCard key={i} title={s.title} value={s.value} sub={s.sub} colorClass={s.color} />
// //           </Card>
// //         ))}
// //       </div>

// //       {/* CrudTemplate */}
// //       <CrudTemplate
// //         title="Student Management"
// //         subtitle="Manage all students"
// //         data={data?.data || []}
// //         columns={studentColumns}
// //         formFields={dynamicFormFields}
// //         loading={isLoading}
// //         onAdd={handleAdd}
// //         onEdit={handleEdit}
// //         onDelete={handleDelete}
// //          enableSearch
// //         onSearch={setSearchTerm}

// //       />
// //     </div>
// //   );
// // };

// // export default StudentPage;