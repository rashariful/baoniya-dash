import React from 'react';
import {
  Users, UserCheck, GraduationCap, BookMarked, Building2,
  UserPlus, TrendingUp, TrendingDown, Wallet, ArrowUpRight, Bell,
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Cell,
  Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --- Data ---
const stats = [
  { label: "Total Students", value: "1,284", delta: "+4.2% vs last period", up: true, icon: Users, accent: "primary" },
  { label: "Active Students", value: "1,196", delta: "+2.1% vs last period", up: true, icon: UserCheck, accent: "primary" },
  { label: "Total Teachers", value: "86", delta: "+3 vs last period", up: true, icon: GraduationCap, accent: "primary" },
  { label: "Hifz Students", value: "312", delta: "+12 vs last period", up: true, icon: BookMarked, accent: "accent" },
  { label: "Boarding Students", value: "428", delta: "−6 vs last period", up: false, icon: Building2, accent: "primary" },
  { label: "New Admissions", value: "57", delta: "This month vs last period", up: true, icon: UserPlus, accent: "accent" },
];

const growthData = [
  { month: "Muh", students: 980 }, { month: "Saf", students: 1020 },
  { month: "Rab1", students: 1064 }, { month: "Rab2", students: 1112 },
  { month: "Jum1", students: 1150 }, { month: "Jum2", students: 1184 },
];

const programMix = [
  { name: "Hifz", value: 312 }, { name: "Qaumi", value: 540 },
  { name: "Alia", value: 286 }, { name: "Kitab", value: 146 },
];

// --- Components ---
function StatCard({ s }: { s: (typeof stats)[number] }) {
  const Icon = s.icon;
  // Apply specific colors based on accent type
  const iconBg = s.accent === "accent" ? "bg-accent/20 text-accent-foreground" : "bg-primary/10 text-primary";
  
  return (
    <Card className="border-border/60 transition-all hover:shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-foreground">{s.value}</p>
          </div>
          <div className={`grid h-10 w-10 place-items-center rounded-xl ${iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {s.up ? <ArrowUpRight className="h-3.5 w-3.5 text-primary" /> : <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
          <span className={s.up ? "text-primary font-medium" : "text-destructive font-medium"}>
            {s.delta}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
    {/* Hero Section - Matching Emerald Theme */}
<div className="relative overflow-hidden rounded-2xl p-8 bg-[#064e3b]">
  {/* Decorative circle on the right */}
  <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
  
  <div className="relative text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div>
      <p className="text-xs uppercase tracking-widest opacity-80">As-salāmu ʿalaykum.</p>
      <h1 className="text-3xl md:text-4xl font-semibold mt-1">বাউনিয়া আবদুল জলিল উচ্চ বিদ্যালয়</h1>
      <p className="opacity-90 text-sm mt-2 max-w-lg">1,284 students, 86 teachers and 312 ssc students under your stewardship. All sections reporting normal activity.</p>
    </div>
    
    <div className="flex gap-2 shrink-0">
      <Button 
        variant="outline" 
        className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
      >
        <span className="mr-2">+</span> New Admission
      </Button>
      <Button 
        className="bg-[#facc15] text-black hover:bg-[#eab308] font-medium"
      >
        <span className="mr-2">🔔</span> Publish Notice
      </Button>
    </div>
  </div>
</div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => <StatCard key={s.label} s={s} />)}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader><CardTitle className="font-display text-lg">Student Growth</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="students" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle className="font-display text-lg">Programme Mix</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={programMix} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={5}>
                  {programMix.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "var(--color-primary)" : "var(--color-accent)"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
// // src/pages/admin/Dashboard.tsx
// import { useMemo, useState } from "react";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";
// import { useGetAllSalesQuery } from "@/redux/api/salesApi";
// import { FaBangladeshiTakaSign } from "react-icons/fa6";

// // shadcn components
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Progress } from "@/components/ui/progress";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import {
//   Package,
//   Clock,
//   Truck,
//   CheckCircle2,
//   XCircle,
//   RefreshCw,
//   TrendingUp,
//   ShoppingCart,
//   ArrowUpRight,
//   ArrowDownRight,
//   MoreVertical,
//   Search,
//   Download,
//   Eye,
//   Edit,
//   FileText,
//   RotateCcw,
//   TrendingDown,
//   type LucideIcon,
// } from "lucide-react";

// // ────────────────────────────────────────────────
// // Status helper (fix for your data)
// const getStatusInfo = (status: string) => {
//   const map: Record<
//     string,
//     { label: string; color: string; bg: string; icon: JSX.Element }
//   > = {
//     pending: {
//       label: "Pending",
//       color: "text-amber-700",
//       bg: "bg-amber-50 border-amber-200",
//       icon: <Clock className="h-3 w-3" />,
//     },
//     "ready to delivery": {
//       label: "Ready to Delivery",
//       color: "text-blue-700",
//       bg: "bg-blue-50 border-blue-200",
//       icon: <Truck className="h-3 w-3" />,
//     },
//     delivered: {
//       label: "Delivered",
//       color: "text-emerald-700",
//       bg: "bg-emerald-50 border-emerald-200",
//       icon: <CheckCircle2 className="h-3 w-3" />,
//     },
//     canceled: {
//       label: "Cancelled",
//       color: "text-rose-700",
//       bg: "bg-rose-50 border-rose-200",
//       icon: <XCircle className="h-3 w-3" />,
//     },
//     returned: {
//       label: "Returned",
//       color: "text-purple-700",
//       bg: "bg-purple-50 border-purple-200",
//       icon: <RefreshCw className="h-3 w-3" />,
//     },
//     "no answer": {
//       label: "No Answer",
//       color: "text-gray-700",
//       bg: "bg-gray-50 border-gray-200",
//       icon: <Clock className="h-3 w-3" />,
//     },
//   };
//   return (
//     map[status] || {
//       label: status,
//       color: "text-gray-700",
//       bg: "bg-gray-50 border-gray-200",
//       icon: <Package className="h-3 w-3" />,
//     }
//   );
// };

// // ────────────────────────────────────────────────
// // StatusCard component
// type StatusVariant =
//   | "pending"
//   | "ready"
//   | "delivered"
//   | "cancelled"
//   | "returned";

// interface StatusCardProps {
//   variant: StatusVariant;
//   label: string;
//   amount: number;
//   count: number;
//   subtitle?: string;
//   currency?: string;
//   trend?: number;
//   index?: number;
// }

// const variantConfig: Record<
//   StatusVariant,
//   { icon: LucideIcon; cardClass: string }
// > = {
//   pending: {
//     icon: Clock,
//     cardClass: "bg-gradient-to-br from-amber-500 to-amber-600",
//   },
//   ready: {
//     icon: FileText,
//     cardClass: "bg-gradient-to-br from-blue-500 to-blue-600",
//   },
//   delivered: {
//     icon: Truck,
//     cardClass: "bg-gradient-to-br from-emerald-500 to-emerald-600",
//   },
//   cancelled: {
//     icon: XCircle,
//     cardClass: "bg-gradient-to-br from-rose-500 to-rose-600",
//   },
//   returned: {
//     icon: RotateCcw,
//     cardClass: "bg-gradient-to-br from-purple-500 to-purple-600",
//   },
// };

// const StatusCard = ({
//   variant,
//   label,
//   amount,
//   count,
//   subtitle,
//   currency = "৳",
//   trend,
//   index = 0,
// }: StatusCardProps) => {
//   const { icon: Icon, cardClass } = variantConfig[variant];

//   return (
//     <div
//       className={cn(
//         cardClass,
//         "rounded-2xl p-5 flex flex-col justify-between min-h-[160px] cursor-pointer",
//         "group relative overflow-hidden transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1",
//         "shadow-lg",
//       )}
//       style={{ animationDelay: `${index * 100}ms` }}
//     >
//       <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-500 group-hover:scale-110" />
//       <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/5 group-hover:bg-white/15 transition-all duration-700 group-hover:scale-125" />
//       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

//       <div className="flex items-start justify-between relative z-10">
//         <div>
//           <span className="text-sm font-medium text-white/90 tracking-wide uppercase">
//             {label}
//           </span>
//           {trend !== undefined && (
//             <div className="flex items-center gap-1 mt-1">
//               {trend >= 0 ? (
//                 <TrendingUp size={12} className="text-white/80" />
//               ) : (
//                 <TrendingDown size={12} className="text-white/80" />
//               )}
//               <span className="text-xs text-white/70">
//                 {trend >= 0 ? "+" : ""}
//                 {trend}%
//               </span>
//             </div>
//           )}
//         </div>
//         <div className="rounded-xl p-2.5 bg-white/15 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
//           <Icon size={20} strokeWidth={1.8} className="text-white" />
//         </div>
//       </div>

//       <div className="relative z-10 mt-auto">
//         <p className="text-3xl font-extrabold text-white tracking-tight">
//           {currency}
//           {amount.toLocaleString()}
//         </p>
//         <div className="flex items-center gap-2 mt-1.5">
//           <span className="bg-white/20 backdrop-blur-sm text-xs text-white font-semibold px-2.5 py-0.5 rounded-full">
//             {count} orders
//           </span>
//           {subtitle && (
//             <span className="text-xs text-white/60">{subtitle}</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ────────────────────────────────────────────────
// // Main Dashboard
// // ────────────────────────────────────────────────
// export default function AdminDashboard() {
//   const { data, isLoading, refetch } = useGetAllSalesQuery({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
  
//   const orders = (data?.data ?? []);
  
//   // Filter orders based on search and status
//   const filteredOrders = useMemo(() => {
//     let filtered = [...orders];
    
//     if (statusFilter !== "all") {
//       filtered = filtered.filter(order => order.status === statusFilter);
//     }
    
//     if (searchTerm) {
//       filtered = filtered.filter(order => 
//         order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.customer?.number?.includes(searchTerm)
//       );
//     }
    
//     return filtered;
//   }, [orders, statusFilter, searchTerm]);
  
//   // Calculate stats directly from your data structure
//   const stats = useMemo(() => {
//     const statsData = {
//       total: orders.length,
//       pending: 0,
//       ready: 0,
//       delivered: 0,
//       canceled: 0,
//       returned: 0,
//       pendingAmount: 0,
//       readyAmount: 0,
//       deliveredAmount: 0,
//       canceledAmount: 0,
//       returnedAmount: 0,
//     };

//     orders.forEach((order) => {
//       // Use grandTotal directly from root level
//       const amount = order.grandTotal || 0;
      
//       switch (order.status) {
//         case "pending":
//           statsData.pending++;
//           statsData.pendingAmount += amount;
//           break;
//         case "ready to delivery":
//           statsData.ready++;
//           statsData.readyAmount += amount;
//           break;
//         case "delivered":
//           statsData.delivered++;
//           statsData.deliveredAmount += amount;
//           break;
//         case "canceled":
//           statsData.canceled++;
//           statsData.canceledAmount += amount;
//           break;
//         case "returned":
//           statsData.returned++;
//           statsData.returnedAmount += amount;
//           break;
//       }
//     });

//     return statsData;
//   }, [orders]);

//   // Calculate conversion rate (delivered / total * 100)
//   const conversionRate = useMemo(() => {
//     if (stats.total === 0) return 0;
//     return (stats.delivered / stats.total) * 100;
//   }, [stats.delivered, stats.total]);

//   // Calculate average order value from delivered orders
//   const avgOrderValue = useMemo(() => {
//     if (stats.delivered === 0) return 0;
//     return stats.deliveredAmount / stats.delivered;
//   }, [stats.deliveredAmount, stats.delivered]);

//   // Recent orders (fixed to use correct field paths)
//   const recentOrders = useMemo(
//     () =>
//       [...filteredOrders]
//         .sort(
//           (a, b) =>
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//         )
//         .slice(0, 6),
//     [filteredOrders],
//   );

  

//   const statusItems = [
//     {
//       variant: "pending" as const,
//       label: "Pending",
//       amount: stats.pendingAmount,
//       count: stats.pending,
//       trend: 4.2,
//     },
//     {
//       variant: "ready" as const,
//       label: "Ready",
//       amount: stats.readyAmount,
//       count: stats.ready,
//       trend: -1.8,
//     },
//     {
//       variant: "delivered" as const,
//       label: "Delivered",
//       amount: stats.deliveredAmount,
//       count: stats.delivered,
//       trend: 9.7,
//     },
//     {
//       variant: "cancelled" as const,
//       label: "Cancelled",
//       amount: stats.canceledAmount,
//       count: stats.canceled,
//       trend: 2.3,
//     },
//     {
//       variant: "returned" as const,
//       label: "Returned",
//       amount: stats.returnedAmount,
//       count: stats.returned,
//       trend: -3.1,
//     },
//   ];

//   // Get unique statuses for filter dropdown
//   const uniqueStatuses = useMemo(() => {
//     const statuses = new Set(orders.map(o => o.status));
//     return Array.from(statuses);
//   }, [orders]);
  
// if (isLoading) return <DashboardSkeleton />;
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/60 p-4 md:p-6 lg:p-8 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">
//             Dashboard Overview
//           </h1>
//           <p className="text-muted-foreground mt-1.5">
//             Orders, revenue & status at a glance
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-3">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search orders..."
//               className="pl-9 w-full sm:w-64"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <Button variant="outline" onClick={refetch} className="gap-2">
//             <RefreshCw className="h-4 w-4" /> Refresh
//           </Button>
//           <Button className="gap-2">
//             <Download className="h-4 w-4" /> Export
//           </Button>
//         </div>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         <StatCard
//           title="Total Revenue"
//           value={`৳${stats.deliveredAmount.toLocaleString()}`}
//           icon={<FaBangladeshiTakaSign />}
//           trend="+11%"
//           trendUp
//           color="from-emerald-500 to-emerald-600"
//         />
//         <StatCard
//           title="Total Orders"
//           value={stats.total.toString()}
//           icon={<ShoppingCart />}
//           trend="+7%"
//           trendUp
//           color="from-blue-500 to-blue-600"
//         />
//         <StatCard
//           title="Conversion Rate"
//           value={`${conversionRate.toFixed(1)}%`}
//           icon={<TrendingUp />}
//           trend="+2.8%"
//           trendUp
//           color="from-violet-500 to-violet-600"
//         />
//         <StatCard
//           title="Avg Order Value"
//           value={`৳${avgOrderValue.toFixed(0)}`}
//           icon={<Package />}
//           trend="-1.9%"
//           trendUp={false}
//           color="from-amber-500 to-amber-600"
//         />
//       </div>

//       {/* Status Cards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
//         {statusItems.map((item, i) => (
//           <StatusCard key={item.variant} {...item} index={i} />
//         ))}
//       </div>

//       {/* Recent Orders + Side column */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-2 shadow-md border-none">
//           <CardHeader className="pb-3">
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle>Recent Orders</CardTitle>
//                 <CardDescription>
//                   Showing {recentOrders.length} of {filteredOrders.length} orders
//                 </CardDescription>
//               </div>
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="w-40">
//                   <SelectValue placeholder="Filter by status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Orders</SelectItem>
//                   {uniqueStatuses.map((status) => (
//                     <SelectItem key={status} value={status}>
//                       {getStatusInfo(status).label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {recentOrders.length === 0 ? (
//               <div className="py-12 text-center text-muted-foreground">
//                 <Package className="mx-auto h-12 w-12 mb-3 opacity-50" />
//                 <p>No orders found</p>
//               </div>
//             ) : (
//               <div className="rounded-lg border overflow-hidden">
//                 <Table>
//                   <TableHeader className="bg-muted/30">
//                     <TableRow>
//                       <TableHead className="w-28">Order ID</TableHead>
//                       <TableHead>Customer</TableHead>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Amount</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead className="w-12"></TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {recentOrders.map((order) => {
//                       const si = getStatusInfo(order.status);
//                       return (
//                         <TableRow
//                           key={order._id}
//                           className="hover:bg-muted/40 transition-colors"
//                         >
//                           <TableCell className="font-mono font-medium">
//                             {order.orderId || order._id.slice(-8).toUpperCase()}
//                           </TableCell>
//                           <TableCell>
//                             <div className="font-medium">
//                               {order.customer?.name || "N/A"}
//                             </div>
//                             <div className="text-xs text-muted-foreground">
//                               {order.customer?.number || "N/A"}
//                             </div>
//                           </TableCell>
//                           <TableCell className="text-sm">
//                             {format(new Date(order.createdAt), "dd MMM yyyy")}
//                           </TableCell>
//                           <TableCell className="font-medium">
//                             ৳{(order.grandTotal || 0).toLocaleString()}
//                           </TableCell>
//                           <TableCell>
//                             <Badge
//                               variant="outline"
//                               className={cn(
//                                 "gap-1.5 px-3 py-1 text-xs",
//                                 si.bg,
//                                 si.color,
//                               )}
//                             >
//                               {si.icon} {si.label}
//                             </Badge>
//                           </TableCell>
//                           <TableCell>
//                             <DropdownMenu>
//                               <DropdownMenuTrigger asChild>
//                                 <Button
//                                   variant="ghost"
//                                   size="icon"
//                                   className="h-8 w-8"
//                                 >
//                                   <MoreVertical className="h-4 w-4" />
//                                 </Button>
//                               </DropdownMenuTrigger>
//                               <DropdownMenuContent align="end">
//                                 <DropdownMenuItem>
//                                   <Eye className="mr-2 h-4 w-4" /> View
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem>
//                                   <Edit className="mr-2 h-4 w-4" /> Edit
//                                 </DropdownMenuItem>
//                               </DropdownMenuContent>
//                             </DropdownMenu>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <div className="space-y-6">
//           <Card className="shadow-md border-none">
//             <CardHeader>
//               <CardTitle>Status Distribution</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-5">
//               {[
//                 { label: "Delivered", value: stats.delivered, color: "bg-emerald-500" },
//                 { label: "Pending", value: stats.pending, color: "bg-amber-500" },
//                 { label: "Ready", value: stats.ready, color: "bg-blue-500" },
//                 { label: "Cancelled", value: stats.canceled, color: "bg-rose-500" },
//                 { label: "Returned", value: stats.returned, color: "bg-purple-500" },
//               ].map((item, index) => {
//                 const total = stats.total || 0;
//                 const percentage =
//                   total > 0 ? Math.min((item.value / total) * 100, 100) : 0;

//                 return (
//                   <div
//                     key={item.label}
//                     className="space-y-2 group"
//                     style={{ animationDelay: `${index * 100}ms` }}
//                   >
//                     <div className="flex justify-between text-sm">
//                       <span className="font-medium">{item.label}</span>
//                       <span className="text-muted-foreground font-semibold">
//                         {item.value} ({percentage.toFixed(0)}%)
//                       </span>
//                     </div>
//                     <Progress
//                       value={percentage}
//                       className="h-2.5 bg-gray-200 rounded-full overflow-hidden"
//                       indicatorClassName={`
//                         ${item.color}
//                         transition-all
//                         duration-900
//                         ease-out
//                         rounded-full
//                         group-hover:brightness-110
//                       `}
//                     />
//                   </div>
//                 );
//               })}
//             </CardContent>
//           </Card>

//           <Card className="shadow-md border-none">
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="grid gap-2">
//               <Button variant="outline" className="justify-start">
//                 <Truck className="mr-2 h-4 w-4" /> Update Shipping
//               </Button>
//               <Button variant="outline" className="justify-start">
//                 <Clock className="mr-2 h-4 w-4" /> View Pending
//               </Button>
//               <Button variant="outline" className="justify-start">
//                 <Download className="mr-2 h-4 w-4" /> Export Report
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// // StatCard component
// function StatCard({
//   title,
//   value,
//   icon,
//   trend,
//   trendUp,
//   color,
// }: {
//   title: string;
//   value: string;
//   icon: JSX.Element;
//   trend: string;
//   trendUp: boolean;
//   color: string;
// }) {
//   return (
//     <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
//       <CardContent className="p-6">
//         <div className="flex justify-between">
//           <div className="space-y-1">
//             <p className="text-sm text-muted-foreground">{title}</p>
//             <p className="text-2xl lg:text-3xl font-bold">{value}</p>
//             <div className="flex items-center gap-1.5 text-xs mt-1">
//               {trendUp ? (
//                 <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
//               ) : (
//                 <ArrowDownRight className="h-3.5 w-3.5 text-rose-600" />
//               )}
//               <span
//                 className={cn(
//                   trendUp ? "text-emerald-600" : "text-rose-600",
//                   "font-medium",
//                 )}
//               >
//                 {trend}
//               </span>
//             </div>
//           </div>
//           <div
//             className={cn(
//               "p-3 rounded-lg text-white shadow-sm bg-gradient-to-br",
//               color,
//             )}
//           >
//             {icon}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function DashboardSkeleton() {
//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between">
//         <Skeleton className="h-10 w-64" />
//         <div className="flex gap-3">
//           <Skeleton className="h-10 w-64" />
//           <Skeleton className="h-10 w-28" />
//         </div>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         {Array(4)
//           .fill(0)
//           .map((_, i) => (
//             <Skeleton key={i} className="h-40 rounded-xl" />
//           ))}
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
//         {Array(5)
//           .fill(0)
//           .map((_, i) => (
//             <Skeleton key={i} className="h-40 rounded-2xl" />
//           ))}
//       </div>
//       <div className="grid lg:grid-cols-3 gap-6">
//         <Skeleton className="h-[420px] rounded-xl lg:col-span-2" />
//         <div className="space-y-6">
//           <Skeleton className="h-64 rounded-xl" />
//           <Skeleton className="h-48 rounded-xl" />
//         </div>
//       </div>
//     </div>
//   );
// }