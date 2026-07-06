import React, { useMemo, useState } from "react";
import { Card, message } from "antd";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";
import { admissionColumns } from "@/utils/tableConfigs";
import { admissionFormFields } from "@/utils/formSchemas";
import {
  useCreateAdmissionMutation,
  useGetAllAdmissionQuery,
  useUpdateAdmissionMutation,
  useDeleteAdmissionMutation,
} from "@/redux/api/admissionApi";
import { useGetAllClassesQuery } from "@/redux/api/classesApi";

// StatCard Component
const StatCard = ({ title, value, sub, colorClass }: any) => (
  <div className={`p-6 rounded-xl border ${colorClass} bg-opacity-5 shadow-sm`}>
    <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60">{title}</h3>
    <div className="text-3xl font-bold mt-2">{value}</div>
    <p className="text-sm opacity-60 mt-1">{sub}</p>
  </div>
);

const AdmissionPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, refetch } = useGetAllAdmissionQuery(
    searchTerm ? [{ name: "searchTerm", value: searchTerm }] : undefined
  );
  const { data: classData } = useGetAllClassesQuery();

  const [createAdmission] = useCreateAdmissionMutation();
  const [updateAdmission] = useUpdateAdmissionMutation();
  const [deleteAdmission] = useDeleteAdmissionMutation();

  // 🔥 কার্ডের ডেটা প্রসেসিং
  const stats = useMemo(() => {
    const admissions = data?.data || [];
    const total = admissions.length;
    const pending = admissions.filter((a: any) => a.status === "pending").length;
    const approved = admissions.filter((a: any) => a.status === "approved").length;
    
    return [
      { title: "THIS MONTH", value: total, sub: "new applications", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
      { title: "APPROVED", value: approved, sub: "ready for orientation", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
      { title: "PENDING REVIEW", value: pending, sub: "awaiting decision", color: "bg-amber-50 border-amber-200 text-amber-900" },
      { title: "WAITING LIST", value: 0, sub: "limited seats", color: "bg-orange-50 border-orange-200 text-orange-900" },
    ];
  }, [data]);

  const mapOptions = (data: any[] = [], labelKey: string) =>
    data.map((item) => ({
      label: item[labelKey],
      value: item._id,
    }));

  const dynamicFormFields = useMemo(() => {
    const classOptions = mapOptions(classData?.data || [], "name");
    return admissionFormFields.map((field) => {
      if (field.name === "classId") {
        return { ...field, options: classOptions };
      }
      return field;
    });
  }, [classData]);

  const handleAdd = async (data: any) => {
    try {
      await createAdmission(data);
      message.success("Admission created");
      refetch();
    } catch {
      message.error("Failed");
    }
  };

  const handleEdit = async (id: string, data: any) => {
    try {
      await updateAdmission({ id, data });
      message.success("Updated");
      refetch();
    } catch {
      message.error("Failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdmission(id);
      message.success("Deleted");
      refetch();
    } catch {
      message.error("Failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* কার্ড সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card>

            <StatCard key={i} title={s.title} value={s.value} sub={s.sub} colorClass={s.color} />
          </Card>
        ))}
      </div>

      <CrudTemplate
        title="Admission Management"
        subtitle="Manage student admission"
        data={data?.data || []}
        columns={admissionColumns}
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

export default AdmissionPage;