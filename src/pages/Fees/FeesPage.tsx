import React, { useMemo, useState } from "react";
import { Card, message, Button } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";
import { feesColumns } from "@/utils/tableConfigs";
import { feesFormFields } from "@/utils/formSchemas";
import {
  useCreateFeesMutation,
  useGetAllFeesQuery,
  useUpdateFeesMutation,
  useDeleteFeesMutation,
} from "@/redux/api/feesApi";
import { useGetAllStudentQuery } from "@/redux/api/studentApi";
import InvoiceModal from "./InvoiceModal";
// import InvoiceModal from "@/components/invoice/InvoiceModal";

// StatCard Component
const StatCard = ({ title, value, sub, colorClass }: any) => (
  <div className={`p-6 rounded-xl border ${colorClass} bg-opacity-5 shadow-sm`}>
    <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60">{title}</h3>
    <div className="text-3xl font-bold mt-2">{value}</div>
    <p className="text-sm opacity-60 mt-1">{sub}</p>
  </div>
);

const FeesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);

  const { data, isLoading, refetch } = useGetAllFeesQuery();
  const { data: studentData } = useGetAllStudentQuery();

  const [create] = useCreateFeesMutation();
  const [update] = useUpdateFeesMutation();
  const [remove] = useDeleteFeesMutation();

  // 🔥 ফিন্যান্সিয়াল ক্যালকুলেশন
  const stats = useMemo(() => {
    const fees = data?.data || [];
    const totalTarget = fees.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalPaid = fees.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
    const totalDue = totalTarget - totalPaid;
    const partialCount = fees.filter((f) => f.status === "partial").length;

    return [
      { title: "TOTAL TARGET", value: `৳${totalTarget}`, sub: "expected collection", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
      { title: "TOTAL COLLECTED", value: `৳${totalPaid}`, sub: "successfully paid", color: "bg-blue-50 border-blue-200 text-blue-900" },
      { title: "TOTAL DUE", value: `৳${totalDue}`, sub: "outstanding balance", color: "bg-red-50 border-red-200 text-red-900" },
      { title: "PARTIAL PAYMENTS", value: partialCount, sub: "in-progress accounts", color: "bg-amber-50 border-amber-200 text-amber-900" },
    ];
  }, [data]);

  const mapOptions = (data: any[] = [], labelKey: string) =>
    data.map((item) => ({ label: item[labelKey], value: item._id }));

  const dynamicFormFields = useMemo(() => {
    const studentOptions = mapOptions(studentData?.data || [], "name");
    return feesFormFields.map((field) =>
      field.name === "studentId" ? { ...field, options: studentOptions } : field
    );
  }, [studentData]);

  // studentId -> student object map (invoice e name/class/roll dekhanor jonno)
  const studentMap = useMemo(() => {
    const map: Record<string, any> = {};
    (studentData?.data || []).forEach((s: any) => {
      map[s._id] = s;
    });
    return map;
  }, [studentData]);

  // feesColumns er sathe extra "Invoice" action column jog kora
  const columnsWithInvoice = useMemo(
    () => [
      ...feesColumns,
      {
        title: "ইনভয়েস",
        key: "invoice",
        render: (_: any, record: any) => (
          <Button
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => {
              setSelectedFee(record);
              setInvoiceOpen(true);
            }}
          >
            Invoice
          </Button>
        ),
      },
    ],
    [feesColumns]
  );

  const handleAdd = async (data: any) => {
    try {
      await create(data);
      message.success("Fees added");
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
          <Card key={i}>
            <StatCard title={s.title} value={s.value} sub={s.sub} colorClass={s.color} />
          </Card>
        ))}
      </div>

      <CrudTemplate
        title="Fees Management"
        subtitle="Manage student fees"
        data={data?.data || []}
        columns={columnsWithInvoice}
        formFields={dynamicFormFields}
        loading={isLoading}
        onAdd={handleAdd}
        onEdit={async (id, data) => {
          await update({ id, data });
          refetch();
        }}
        onDelete={async (id) => {
          await remove(id);
          refetch();
        }}
        enableSearch
        onSearch={setSearchTerm}
      />

      <InvoiceModal

        open={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        fee={selectedFee}
        student={selectedFee ? studentMap[selectedFee.studentId] : null}
      />
    </div>
  );
};

export default FeesPage;

// import React, { useMemo, useState } from "react";
// import { Card, message } from "antd";
// import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";
// import { feesColumns } from "@/utils/tableConfigs";
// import { feesFormFields } from "@/utils/formSchemas";
// import {
//   useCreateFeesMutation,
//   useGetAllFeesQuery,
//   useUpdateFeesMutation,
//   useDeleteFeesMutation,
// } from "@/redux/api/feesApi";
// import { useGetAllStudentQuery } from "@/redux/api/studentApi";

// // StatCard Component
// const StatCard = ({ title, value, sub, colorClass }: any) => (
//   <div className={`p-6 rounded-xl border ${colorClass} bg-opacity-5 shadow-sm`}>
//     <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60">{title}</h3>
//     <div className="text-3xl font-bold mt-2">{value}</div>
//     <p className="text-sm opacity-60 mt-1">{sub}</p>
//   </div>
// );

// const FeesPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const { data, isLoading, refetch } = useGetAllFeesQuery();
//   const { data: studentData } = useGetAllStudentQuery();

//   const [create] = useCreateFeesMutation();
//   const [update] = useUpdateFeesMutation();
//   const [remove] = useDeleteFeesMutation();

//   // 🔥 ফিন্যান্সিয়াল ক্যালকুলেশন
//   const stats = useMemo(() => {
//     const fees = data?.data || [];
//     const totalTarget = fees.reduce((acc, curr) => acc + (curr.amount || 0), 0);
//     const totalPaid = fees.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
//     const totalDue = totalTarget - totalPaid;
//     const partialCount = fees.filter((f) => f.status === "partial").length;

//     return [
//       { title: "TOTAL TARGET", value: `৳${totalTarget}`, sub: "expected collection", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
//       { title: "TOTAL COLLECTED", value: `৳${totalPaid}`, sub: "successfully paid", color: "bg-blue-50 border-blue-200 text-blue-900" },
//       { title: "TOTAL DUE", value: `৳${totalDue}`, sub: "outstanding balance", color: "bg-red-50 border-red-200 text-red-900" },
//       { title: "PARTIAL PAYMENTS", value: partialCount, sub: "in-progress accounts", color: "bg-amber-50 border-amber-200 text-amber-900" },
//     ];
//   }, [data]);

//   const mapOptions = (data: any[] = [], labelKey: string) =>
//     data.map((item) => ({ label: item[labelKey], value: item._id }));

//   const dynamicFormFields = useMemo(() => {
//     const studentOptions = mapOptions(studentData?.data || [], "name");
//     return feesFormFields.map((field) => 
//       field.name === "studentId" ? { ...field, options: studentOptions } : field
//     );
//   }, [studentData]);

//   const handleAdd = async (data: any) => {
//     try {
//       await create(data);
//       message.success("Fees added");
//       refetch();
//     } catch {
//       message.error("Failed");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* কার্ড সেকশন */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((s, i) => (
//           <Card>

//             <StatCard key={i} title={s.title} value={s.value} sub={s.sub} colorClass={s.color} />
//           </Card>
//         ))}
//       </div>

//       <CrudTemplate
//         title="Fees Management"
//         subtitle="Manage student fees"
//         data={data?.data || []}
//         columns={feesColumns}
//         formFields={dynamicFormFields}
//         loading={isLoading}
//         onAdd={handleAdd}
//         onEdit={async (id, data) => { await update({ id, data }); refetch(); }}
//         onDelete={async (id) => { await remove(id); refetch(); }}
//         enableSearch
//         onSearch={setSearchTerm}
//       />
//     </div>
//   );
// };

// export default FeesPage;