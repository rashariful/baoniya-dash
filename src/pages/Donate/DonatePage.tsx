import React, { useMemo, useState } from "react";
import { message } from "antd";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";
import { donationColumns } from "@/utils/tableConfigs";
import { donationFormFields } from "@/utils/formSchemas";
import {
  useCreateDonateMutation,
  useGetAllDonateQuery,
  useUpdateDonateMutation,
  useDeleteDonateMutation,
} from "@/redux/api/donateApi";
import ExamResultPage from "../ExamResult/ExamResultPage";

// StatCard Component
const StatCard = ({ title, value, sub, colorClass }: any) => (
  <div className={`p-6 rounded-xl border ${colorClass} bg-opacity-5 shadow-sm`}>
    <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60">{title}</h3>
    <div className="text-3xl font-bold mt-2">{value}</div>
    <p className="text-sm opacity-60 mt-1">{sub}</p>
  </div>
);

const DonatePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, refetch } = useGetAllDonateQuery();
  const [createDonation] = useCreateDonateMutation();
  const [updateDonation] = useUpdateDonateMutation();
  const [deleteDonation] = useDeleteDonateMutation();

  // 🔥 ডোনেশন ক্যালকুলেশন
  const stats = useMemo(() => {
    const donations = data?.data || [];
    const totalAmount = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const completed = donations.filter((d) => d.status === "completed").length;
    const pending = donations.filter((d) => d.status === "pending").length;

    return [
      { title: "TOTAL DONATION", value: `৳${totalAmount}`, sub: "all time contributions", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
      { title: "COMPLETED", value: completed, sub: "successfully processed", color: "bg-blue-50 border-blue-200 text-blue-900" },
      { title: "PENDING", value: pending, sub: "awaiting verification", color: "bg-amber-50 border-amber-200 text-amber-900" },
      { title: "TOTAL RECORDS", value: donations.length, sub: "unique donors", color: "bg-violet-50 border-violet-200 text-violet-900" },
    ];
  }, [data]);

  const handleAdd = async (formData: any) => {
    try {
      await createDonation(formData).unwrap();
      message.success("Donation created successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to create donation");
    }
  };

  const handleEdit = async (id: string, formData: any) => {
    try {
      await updateDonation({ id, data: formData }).unwrap();
      message.success("Donation updated successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update donation");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDonation(id).unwrap();
      message.success("Donation deleted successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete donation");
    }
  };

  return (
    <div className="space-y-6">
      {/* কার্ড সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} sub={s.sub} colorClass={s.color} />
        ))}
      </div>
      {/* <ExamResultPage/> */}

      <CrudTemplate
        title="Donation Management"
        subtitle="Manage all donations"
        data={data?.data || []}
        columns={donationColumns}
        formFields={donationFormFields}
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

export default DonatePage;