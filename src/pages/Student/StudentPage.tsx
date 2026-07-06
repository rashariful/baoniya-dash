import React, { useMemo, useState } from "react";
import { message } from "antd";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";
import { studentColumns } from "@/utils/tableConfigs";
import { studentFormFields } from "@/utils/formSchemas";
import {
  useCreateStudentMutation,
  useGetAllStudentQuery,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} from "@/redux/api/studentApi";
import { useGetAllClassesQuery } from "@/redux/api/classesApi";
import { Card } from "@/components/ui/card";

// StatCard Component
const StatCard = ({ title, value, sub, colorClass }: any) => (
  <div className={`p-6 rounded-xl border ${colorClass} bg-opacity-5 shadow-sm transition-all hover:shadow-md`}>
    <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60">{title}</h3>
    <div className="text-3xl font-bold mt-2">{value}</div>
    <p className="text-sm opacity-60 mt-1">{sub}</p>
  </div>
);

const StudentPage = () => {
    const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch } = useGetAllStudentQuery(searchTerm
    ? [{ name: "searchTerm", value: searchTerm }]
    : undefined);
  const { data: classData } = useGetAllClassesQuery();

  const [createStudent] = useCreateStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  // 🔥 কার্ডের ডেটা প্রসেসিং
  const stats = useMemo(() => {
    const students = data?.data || [];
    const total = students.length;
    const active = students.filter((s: any) => s.classId?.isActive).length;
    const pendingFees = students.filter((s: any) => !s.classId?.isActive).length; // উদাহরণস্বরূপ

    return [
      { title: "TOTAL STUDENTS", value: total, sub: "across all programmes", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
      { title: "ACTIVE", value: active, sub: "currently enrolled", color: "bg-blue-50 border-blue-200 text-blue-900" },
      { title: "FEE DEFAULTERS", value: pendingFees, sub: "pending payments", color: "bg-red-50 border-red-200 text-red-900" },
    ];
  }, [data]);

  // 🔥 helper
  const mapOptions = (arr: any[] = [], labelKey: string) =>
    arr.map((item) => ({
      label: item[labelKey],
      value: item._id,
    }));

  // 🔥 dynamic form fields
  const dynamicFormFields = useMemo(() => {
    const classOptions = mapOptions(classData?.data || [], "name");
    return studentFormFields.map((field) => {
      if (field.name === "classId") {
        return { ...field, options: classOptions };
      }
      return field;
    });
  }, [classData]);

  const handleAdd = async (data: any) => {
    try {
      await createStudent(data);
      message.success("Student created successfully");
      refetch();
    } catch {
      message.error("Failed to create student");
    }
  };

  const handleEdit = async (id: string, data: any) => {
    try {
      await updateStudent({ id, data });
      message.success("Student updated");
      refetch();
    } catch {
      message.error("Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent(id);
      message.success("Student deleted");
      refetch();
    } catch {
      message.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      {/* কার্ড সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <Card>

            <StatCard key={i} title={s.title} value={s.value} sub={s.sub} colorClass={s.color} />
          </Card>
        ))}
      </div>

      {/* CrudTemplate */}
      <CrudTemplate
        title="Student Management"
        subtitle="Manage all students"
        data={data?.data || []}
        columns={studentColumns}
        formFields={dynamicFormFields}
        loading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
         enableSearch
        onSearch={setSearchTerm}

      />
    </div>
  );
};

export default StudentPage;