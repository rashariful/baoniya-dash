import React, { useMemo, useState } from "react";
import { Card, message, Button, Input, Select, Space, Badge, Dropdown, Tooltip } from "antd";
import { 
  FileTextOutlined, 
  SearchOutlined, 
  FilterOutlined,
  ReloadOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  ExperimentOutlined,
  LineChartOutlined
} from "@ant-design/icons";
import type { MenuProps } from "antd";
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// StatCard Component with Premium UI - FIXED
const StatCard = ({ title, value, sub, colorClass, icon: Icon, trend }: any) => (
  <div className={`p-6 rounded-2xl border ${colorClass} bg-opacity-10 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group`}>
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60">{title}</h3>
        <div className="text-3xl font-bold mt-2">{value}</div>
        <p className="text-sm opacity-60 mt-1 flex items-center gap-1">
          {trend && <span className="text-emerald-500">↑</span>}
          {sub}
        </p>
      </div>
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
        {Icon && <Icon className="text-2xl" />}
      </div>
    </div>
  </div>
);

// Filter Components
const FilterSection = ({ 
  filters, 
  setFilters, 
  onReset,
  dateRange,
  setDateRange 
}: any) => {
  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Paid', value: 'paid' },
    { label: 'Partial', value: 'partial' },
    { label: 'Unpaid', value: 'unpaid' },
  ];

  const dateOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'Custom', value: 'custom' },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <FilterOutlined className="text-orange-500 text-lg" />
          <span className="font-semibold text-slate-700">Filters</span>
          <Badge count={Object.values(filters).filter(v => v && v !== 'all').length} className="ml-1" />
        </div>

        <div className="flex-1 flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <Select
            placeholder="Status"
            value={filters.status || 'all'}
            onChange={(value) => setFilters({ ...filters, status: value })}
            className="min-w-[140px]"
            options={statusOptions}
            suffixIcon={<FilterOutlined className="text-orange-400" />}
          />

          {/* Class Filter */}
          <Select
            placeholder="Class"
            value={filters.class || undefined}
            onChange={(value) => setFilters({ ...filters, class: value })}
            className="min-w-[140px]"
            options={[
              { label: 'All Classes', value: 'all' },
              { label: 'Class 1', value: '1' },
              { label: 'Class 2', value: '2' },
              { label: 'Class 3', value: '3' },
              { label: 'Class 4', value: '4' },
              { label: 'Class 5', value: '5' },
            ]}
            suffixIcon={<ExperimentOutlined className="text-orange-400" />}
          />

          {/* Date Range Filter */}
          <Select
            placeholder="Date Range"
            value={filters.dateRange || 'today'}
            onChange={(value) => {
              setFilters({ ...filters, dateRange: value });
              if (value !== 'custom') {
                setDateRange(null);
              }
            }}
            className="min-w-[150px]"
            options={dateOptions}
            suffixIcon={<CalendarOutlined className="text-orange-400" />}
          />

          {/* Custom Date Range */}
          {filters.dateRange === 'custom' && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
              <Input
                type="date"
                placeholder="From"
                value={dateRange?.from || ''}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="w-[150px] border-orange-200 focus:border-orange-400"
              />
              <span className="text-slate-400">→</span>
              <Input
                type="date"
                placeholder="To"
                value={dateRange?.to || ''}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="w-[150px] border-orange-200 focus:border-orange-400"
              />
            </div>
          )}

          {/* Reset Button */}
          <Button
            icon={<ReloadOutlined />}
            onClick={onReset}
            className="border-orange-200 text-orange-600 hover:bg-orange-50 transition-all duration-300"
          >
            Reset
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3 text-xs">
          <Tooltip title="Total Records">
            <Badge count={filters.total || 0} style={{ backgroundColor: '#f97316' }} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

const FeesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    class: 'all',
    dateRange: 'today',
  });
  const [dateRange, setDateRange] = useState<{ from: string; to: string } | null>(null);

  const { data, isLoading, refetch } = useGetAllFeesQuery();
  const { data: studentData } = useGetAllStudentQuery();
  const [create] = useCreateFeesMutation();
  const [update] = useUpdateFeesMutation();
  const [remove] = useDeleteFeesMutation();

  // 🔥 ফিল্টারিং লজিক
  const filteredData = useMemo(() => {
    let fees = data?.data || [];

    // Status Filter
    if (filters.status && filters.status !== 'all') {
      fees = fees.filter((fee: any) => fee.status === filters.status);
    }

    // Class Filter
    if (filters.class && filters.class !== 'all') {
      fees = fees.filter((fee: any) => {
        const student = studentData?.data?.find((s: any) => s._id === fee.studentId);
        return student?.classId?._id === filters.class || student?.classId === filters.class;
      });
    }

    // Date Range Filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    fees = fees.filter((fee: any) => {
      const feeDate = new Date(fee.createdAt);
      
      switch (filters.dateRange) {
        case 'today':
          return feeDate >= today;
        case 'yesterday': {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return feeDate >= yesterday && feeDate < today;
        }
        case 'week': {
          const weekStart = new Date(today);
          weekStart.setDate(weekStart.getDate() - 7);
          return feeDate >= weekStart;
        }
        case 'month': {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          return feeDate >= monthStart;
        }
        case 'custom': {
          if (dateRange?.from && dateRange?.to) {
            const from = new Date(dateRange.from);
            const to = new Date(dateRange.to);
            to.setHours(23, 59, 59);
            return feeDate >= from && feeDate <= to;
          }
          return true;
        }
        default:
          return true;
      }
    });

    return fees;
  }, [data, filters, dateRange, studentData]);

  // 🔥 ফিন্যান্সিয়াল ক্যালকুলেশন with filters
  const stats = useMemo(() => {
    const fees = filteredData || [];
    const totalTarget = fees.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
    const totalPaid = fees.reduce((acc: number, curr: any) => acc + (curr.paidAmount || 0), 0);
    const totalDue = totalTarget - totalPaid;
    const partialCount = fees.filter((f: any) => f.status === "partial").length;
    const paidCount = fees.filter((f: any) => f.status === "paid").length;

    return [
      { 
        title: "TOTAL TARGET", 
        value: `৳${totalTarget.toLocaleString()}`, 
        sub: "expected collection", 
        color: "bg-emerald-50 border-emerald-200 text-emerald-700",
        icon: DollarOutlined,
        trend: true
      },
      { 
        title: "TOTAL COLLECTED", 
        value: `৳${totalPaid.toLocaleString()}`, 
        sub: "successfully paid", 
        color: "bg-blue-50 border-blue-200 text-blue-700",
        icon: CheckCircleOutlined,
        trend: true
      },
      { 
        title: "TOTAL DUE", 
        value: `৳${totalDue.toLocaleString()}`, 
        sub: "outstanding balance", 
        color: "bg-red-50 border-red-200 text-red-700",
        icon: ExclamationCircleOutlined
      },
      { 
        title: "PAYMENT STATUS", 
        value: `${paidCount} / ${fees.length}`, 
        sub: `${partialCount} partial payments`, 
        color: "bg-amber-50 border-amber-200 text-amber-700",
        icon: LineChartOutlined,
        trend: true
      },
    ];
  }, [filteredData]);

  const mapOptions = (data: any[] = [], labelKey: string) =>
    data.map((item) => ({ label: item[labelKey], value: item._id }));

  const dynamicFormFields = useMemo(() => {
    const studentOptions = mapOptions(studentData?.data || [], "name");
    return feesFormFields.map((field) =>
      field.name === "studentId" ? { ...field, options: studentOptions } : field
    );
  }, [studentData]);

  // studentId -> student object map
  const studentMap = useMemo(() => {
    const map: Record<string, any> = {};
    (studentData?.data || []).forEach((s: any) => {
      map[s._id] = s;
    });
    return map;
  }, [studentData]);

  const columnsWithInvoice = useMemo(
    () => [
      ...feesColumns,
      {
        title: "Invoice",
        key: "invoice",
        render: (_: any, record: any) => (
          <Button
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => {
              setSelectedFee(record);
              setInvoiceOpen(true);
            }}
            className="bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100 hover:border-orange-300 transition-all duration-200"
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
      message.success("Fees added successfully");
      refetch();
    } catch {
      message.error("Failed to add fees");
    }
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      class: 'all',
      dateRange: 'today',
    });
    setDateRange(null);
    setSearchTerm('');
    message.success('Filters reset successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 rounded-2xl shadow-xl shadow-orange-500/20 p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <DollarOutlined className="text-2xl" />
                Fee Management
              </h1>
              <p className="text-orange-100/90 text-sm mt-1">
                Manage student fees, track payments, and generate invoices
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                count={`${filteredData.length} records`} 
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <Card 
              key={i} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <StatCard 
                title={s.title} 
                value={s.value} 
                sub={s.sub} 
                colorClass={s.color}
                icon={s.icon}
                trend={s.trend}
              />
            </Card>
          ))}
        </div>

        {/* Filter Section */}
        <FilterSection
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        {/* Main Table */}
        <CrudTemplate
          title="Fee Records"
          subtitle={`Showing ${filteredData.length} fee records`}
          data={filteredData}
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
          searchPlaceholder="Search by student name, ID, or fee details..."
          extraActions={
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => refetch()}
              className="border-orange-200 text-orange-600 hover:bg-orange-50 transition-all duration-300"
            >
              Refresh
            </Button>
          }
        />

        {/* Invoice Modal */}
        <InvoiceModal
          open={invoiceOpen}
          onClose={() => setInvoiceOpen(false)}
          fee={selectedFee}
          student={selectedFee ? studentMap[selectedFee.studentId] : null}
        />
      </div>

      <style jsx>{`
        .ant-card {
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        
        .ant-select-selector {
          border-radius: 10px !important;
          border-color: #fcd5b5 !important;
          transition: all 0.3s ease !important;
        }
        
        .ant-select-selector:hover {
          border-color: #f97316 !important;
        }
        
        .ant-select-focused .ant-select-selector {
          border-color: #f97316 !important;
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2) !important;
        }
        
        .ant-input {
          border-radius: 10px !important;
          transition: all 0.3s ease !important;
        }
        
        .ant-input:focus {
          border-color: #f97316 !important;
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2) !important;
        }
        
        .ant-btn {
          border-radius: 10px !important;
          transition: all 0.3s ease !important;
        }
        
        .ant-btn:hover {
          transform: translateY(-1px) !important;
        }
        
        .ant-badge-count {
          border-radius: 8px !important;
          font-weight: 600 !important;
        }
      `}</style>
    </div>
  );
};

export default FeesPage;

// import React, { useMemo, useState } from "react";
// import { Card, message, Button } from "antd";
// import { FileTextOutlined } from "@ant-design/icons";
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
// import InvoiceModal from "./InvoiceModal";
// // import InvoiceModal from "@/components/invoice/InvoiceModal";

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
//   const [invoiceOpen, setInvoiceOpen] = useState(false);
//   const [selectedFee, setSelectedFee] = useState<any>(null);

//   const { data, isLoading, refetch } = useGetAllFeesQuery();
//   const { data: studentData } = useGetAllStudentQuery();

//   const [create] = useCreateFeesMutation();
//   const [update] = useUpdateFeesMutation();
//   const [remove] = useDeleteFeesMutation();

//   // 🔥 ফিন্যান্সিয়াল ক্যালকুলেশন
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

//   // studentId -> student object map (invoice e name/class/roll dekhanor jonno)
//   const studentMap = useMemo(() => {
//     const map: Record<string, any> = {};
//     (studentData?.data || []).forEach((s: any) => {
//       map[s._id] = s;
//     });
//     return map;
//   }, [studentData]);

//   // feesColumns er sathe extra "Invoice" action column jog kora
//   const columnsWithInvoice = useMemo(
//     () => [
//       ...feesColumns,
//       {
//         title: "ইনভয়েস",
//         key: "invoice",
//         render: (_: any, record: any) => (
//           <Button
//             size="small"
//             icon={<FileTextOutlined />}
//             onClick={() => {
//               setSelectedFee(record);
//               setInvoiceOpen(true);
//             }}
//           >
//             Invoice
//           </Button>
//         ),
//       },
//     ],
//     [feesColumns]
//   );

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
//           <Card key={i}>
//             <StatCard title={s.title} value={s.value} sub={s.sub} colorClass={s.color} />
//           </Card>
//         ))}
//       </div>

//       <CrudTemplate
//         title="Fees Management"
//         subtitle="Manage student fees"
//         data={data?.data || []}
//         columns={columnsWithInvoice}
//         formFields={dynamicFormFields}
//         loading={isLoading}
//         onAdd={handleAdd}
//         onEdit={async (id, data) => {
//           await update({ id, data });
//           refetch();
//         }}
//         onDelete={async (id) => {
//           await remove(id);
//           refetch();
//         }}
//         enableSearch
//         onSearch={setSearchTerm}
//       />

//       <InvoiceModal

//         open={invoiceOpen}
//         onClose={() => setInvoiceOpen(false)}
//         fee={selectedFee}
//         student={selectedFee ? studentMap[selectedFee.studentId] : null}
//       />
//     </div>
//   );
// };

// export default FeesPage;

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