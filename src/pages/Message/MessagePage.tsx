import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { 
  AppstoreOutlined, 
  SearchOutlined, 
  TeamOutlined, 
  UserOutlined, 
  SaveOutlined, 
  SendOutlined, 
  LeftOutlined, 
  RightOutlined 
} from "@ant-design/icons";
import { Card, Input, Button, Checkbox, Badge, Table, message as antMessage } from "antd";
import { 
  useGetStudentRecipientsQuery, 
  useGetTeacherRecipientsQuery, 
  useBroadcastToSelectedMutation 
} from "@/redux/api/notificationApi.js";

export const Route = createFileRoute("/send")({
  head: () => ({
    meta: [
      { title: "Send SMS — EduConnect" },
      { name: "description", content: "Compose and send bulk SMS to students, teachers, or guardians with smart filters." },
    ],
  }),
  component: MessagePage,
});

type Audience = "Students" | "Teachers" | "Guardians";
type Row = { id: string; name: string; class: string; phone: string; dueStatus: "Paid" | "Due" | "—" };

const PAGE_SIZE = 8;

export function MessagePage() {
  const [audience, setAudience] = useState<Audience>("Students");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [message, setMessage] = useState("");

  const { data: studentResponse, isLoading: isLoadingStudents } = useGetStudentRecipientsQuery(undefined, {
    skip: audience !== "Students" && audience !== "Guardians",
  });
  
  const { data: teacherResponse, isLoading: isLoadingTeachers } = useGetTeacherRecipientsQuery(undefined, {
    skip: audience !== "Teachers",
  });

  const [broadcastToSelected, { isLoading: isSending }] = useBroadcastToSelectedMutation();

  const rows: Row[] = useMemo(() => {
    let list: Row[] = [];
    
    if (audience === "Teachers") {
      const teachers = Array.isArray(teacherResponse) 
        ? teacherResponse 
        : (teacherResponse?.data || []);
      
      list = teachers.map((t: any) => ({ 
        id: t.id, 
        name: t.name, 
        class: t.designation || "—", 
        phone: t.phone, 
        dueStatus: "—" as const 
      }));
    } else {
      const studentDataObj = studentResponse?.data || studentResponse || {};
      const allStudents: any[] = [];

      if (Array.isArray(studentDataObj)) {
        studentDataObj.forEach((s: any) => {
          allStudents.push({ ...s, className: s.class || "General" });
        });
      } else if (typeof studentDataObj === "object" && studentDataObj !== null) {
        Object.entries(studentDataObj).forEach(([className, studentsArray]) => {
          if (Array.isArray(studentsArray)) {
            studentsArray.forEach((s: any) => {
              allStudents.push({ ...s, className });
            });
          }
        });
      }

      if (audience === "Students") {
        list = allStudents.map((s) => ({ 
          id: s.id, 
          name: s.name, 
          class: `Class: ${s.className} (Roll: ${s.roll || s.studentId || "—"})`, 
          phone: s.phone, 
          dueStatus: "—" as const 
        }));
      } else {
        list = allStudents.map((s) => ({ 
          id: s.id, 
          name: `${s.guardianName || "Guardian"} (${s.name})`, 
          class: `Class: ${s.className}`, 
          phone: s.phone, 
          dueStatus: "—" as const 
        }));
      }
    }

    return list.filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.phone.includes(search)) return false;
      return true;
    });
  }, [audience, studentResponse, teacherResponse, search]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allChecked = pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));

  const toggleAll = () => {
    const next = new Set(selected);
    if (allChecked) pageRows.forEach((r) => next.delete(r.id));
    else pageRows.forEach((r) => next.add(r.id));
    setSelected(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const chars = message.length;
  const smsCount = Math.max(1, Math.ceil(chars / 160));
  const totalCost = smsCount * selected.size;

  const handleSendSMS = async () => {
    if (selected.size === 0 || !message) return;

    // Payload formatted cleanly as required by backend (studentIds & message)
    const payload = {
      studentIds: Array.from(selected),
      message,
    };

    // Console logging to verify the request payload before dispatching
    console.log("Sending Broadcast Payload:", payload);

    try {
      await broadcastToSelected(payload).unwrap();
      antMessage.success(`SMS successfully queued for ${selected.size} recipients`);
      setSelected(new Set());
      setMessage("");
    } catch (error: any) {
      console.error("Broadcast Error Response:", error);
      antMessage.error(error?.data?.message || "Failed to send SMS. Please try again.");
    }
  };

  const teacherListSource = Array.isArray(teacherResponse) ? teacherResponse : (teacherResponse?.data || []);
  const teacherCount = teacherListSource.length;

  const studentDataContainer = studentResponse?.data || studentResponse || {};
  const studentCount = Array.isArray(studentDataContainer) 
    ? studentDataContainer.length 
    : Object.values(studentDataContainer).reduce((acc: number, curr: any) => acc + (Array.isArray(curr) ? curr.length : 0), 0);

  const audiences = [
    { key: "Students" as Audience, icon: <UserOutlined />, count: studentCount },
    { key: "Teachers" as Audience, icon: <TeamOutlined />, count: teacherCount },
    { key: "Guardians" as Audience, icon: <AppstoreOutlined />, count: studentCount },
  ];

  const tableColumns = [
    {
      title: <Checkbox checked={allChecked} onChange={toggleAll} />,
      dataIndex: "id",
      key: "checkbox",
      width: 40,
      render: (id: string) => (
        <Checkbox 
          checked={selected.has(id)} 
          onChange={() => toggleOne(id)} 
          onClick={(e) => e.stopPropagation()} 
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: audience === "Teachers" ? "Designation" : "Details",
      dataIndex: "class",
      key: "class",
      render: (text: string) => <span className="text-gray-500">{text}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => <span className="font-mono text-xs">{text}</span>,
    },
    {
      title: "Due Status",
      dataIndex: "dueStatus",
      key: "dueStatus",
      render: (status: string) => {
        if (status === "—") return <span className="text-gray-400">—</span>;
        return (
          <span className={`px-2 py-0.5 text-xs rounded-full border ${
            status === "Paid" 
              ? "bg-green-50 text-green-600 border-green-200" 
              : "bg-red-50 text-red-600 border-red-200"
          }`}>
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Send SMS</h1>
        <p className="text-sm text-gray-500">Reach the right audience with targeted communication</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        {/* LEFT: Filters */}
        <div className="xl:sticky xl:top-24 xl:self-start">
          <Card title={<span className="text-sm font-semibold">Audience</span>} className="rounded-2xl shadow-sm">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 xl:grid-cols-1">
                {audiences.map(({ key, icon, count }) => {
                  const active = audience === key;
                  return (
                    <button
                      key={key}
                      onClick={() => { setAudience(key); setPage(1); setSelected(new Set()); }}
                      className={`flex items-center gap-3 w-full rounded-xl border p-3 text-left transition-all ${
                        active ? "border-blue-500 bg-blue-50 text-blue-900 shadow-sm" : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {icon}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{key}</div>
                        <div className="text-xs text-gray-500">{count} contacts</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">Filters</div>
                <div>
                  <label className="mb-1.5 block text-xs text-gray-600">Search</label>
                  <Input 
                    value={search} 
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
                    placeholder="Name or phone" 
                    prefix={<SearchOutlined className="text-gray-400" />}
                    className="rounded-lg" 
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* CENTER: Recipients Table */}
        <Card 
          title={
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold">Recipients</span>
                <p className="text-xs font-normal text-gray-500">{rows.length} matching • {selected.size} selected</p>
              </div>
              <Badge status="processing" text={audience} />
            </div>
          } 
          className="rounded-2xl shadow-sm"
        >
          <Table 
            dataSource={pageRows} 
            columns={tableColumns} 
            rowKey="id" 
            pagination={false}
            loading={isLoadingStudents || isLoadingTeachers}
            onRow={(record) => ({
              onClick: () => toggleOne(record.id),
              className: "cursor-pointer"
            })}
          />
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 mt-4">
            <div className="text-xs text-gray-500">Page {page} of {totalPages}</div>
            <div className="flex gap-1">
              <Button 
                icon={<LeftOutlined />} 
                size="small" 
                onClick={() => setPage((p) => Math.max(1, p - 1))} 
                disabled={page === 1} 
              />
              <Button 
                icon={<RightOutlined />} 
                size="small" 
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages} 
              />
            </div>
          </div>
        </Card>

        {/* RIGHT: Composer */}
        <div className="xl:sticky xl:top-24 xl:self-start">
          <Card 
            title={
              <div>
                <span className="text-sm font-semibold">SMS Composer</span>
                <p className="text-xs font-normal text-gray-500">Craft your message</p>
              </div>
            } 
            className="rounded-2xl shadow-sm"
          >
            <div className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs text-gray-600">Message</label>
                  <span className="text-xs text-gray-400">{chars}/160 • {smsCount} SMS</span>
                </div>
                <Input.TextArea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Type your message..." 
                  rows={4}
                  className="resize-none rounded-lg" 
                />
              </div>

              <div className="rounded-xl bg-gray-50 p-3 text-xs space-y-1">
                <div className="flex justify-between"><span className="text-gray-500">Recipients</span><span className="font-medium">{selected.size}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">SMS per recipient</span><span className="font-medium">{smsCount}</span></div>
                <div className="flex justify-between border-t border-gray-200 pt-1"><span className="font-medium">Total credits</span><span className="font-bold text-blue-600">{totalCost}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button className="rounded-lg w-full" onClick={() => antMessage.success("Draft saved")}>
                  <SaveOutlined /> Save Draft
                </Button>
                <Button 
                  type="primary" 
                  className="rounded-lg w-full bg-blue-600" 
                  disabled={selected.size === 0 || !message || isSending} 
                  loading={isSending}
                  onClick={handleSendSMS}
                >
                  <SendOutlined /> Send SMS
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MessagePage;

// import { createFileRoute } from "@tanstack/react-router";
// import { useMemo, useState } from "react";
// import { 
//   AppstoreOutlined, 
//   SearchOutlined, 
//   TeamOutlined, 
//   UserOutlined, 
//   SaveOutlined, 
//   SendOutlined, 
//   LeftOutlined, 
//   RightOutlined 
// } from "@ant-design/icons";
// import { Card, Input, Button, Checkbox, Badge, Select, Table, message as antMessage } from "antd";
// // import { smsTemplates } from "@/lib/dummy-data";
// import { 
//   useGetStudentRecipientsQuery, 
//   useGetTeacherRecipientsQuery, 
//   useBroadcastToSelectedMutation 
// } from "@/redux/api/notificationApi.js";

// export const Route = createFileRoute("/send")({
//   head: () => ({
//     meta: [
//       { title: "Send SMS — EduConnect" },
//       { name: "description", content: "Compose and send bulk SMS to students, teachers, or guardians with smart filters." },
//     ],
//   }),
//   component: MessagePage,
// });

// type Audience = "Students" | "Teachers" | "Guardians";
// type Row = { id: string; name: string; class: string; phone: string; dueStatus: "Paid" | "Due" | "—" };

// const PAGE_SIZE = 8;

// export function MessagePage() {
//   const [audience, setAudience] = useState<Audience>("Students");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [selected, setSelected] = useState<Set<string>>(new Set());

//   const [senderId, setSenderId] = useState("EDUCON");
//   const [templateId, setTemplateId] = useState("");
//   const [message, setMessage] = useState("");

//   const { data: studentResponse, isLoading: isLoadingStudents } = useGetStudentRecipientsQuery(undefined, {
//     skip: audience !== "Students" && audience !== "Guardians",
//   });
  
//   const { data: teacherResponse, isLoading: isLoadingTeachers } = useGetTeacherRecipientsQuery(undefined, {
//     skip: audience !== "Teachers",
//   });

//   const [broadcastToSelected, { isLoading: isSending }] = useBroadcastToSelectedMutation();

//   const rows: Row[] = useMemo(() => {
//     let list: Row[] = [];
    
//     if (audience === "Teachers") {
//       const teachers = Array.isArray(teacherResponse) 
//         ? teacherResponse 
//         : (teacherResponse?.data || []);
      
//       list = teachers.map((t: any) => ({ 
//         id: t.id, 
//         name: t.name, 
//         class: t.designation || "—", 
//         phone: t.phone, 
//         dueStatus: "—" as const 
//       }));
//     } else {
//       const studentDataObj = studentResponse?.data || studentResponse || {};
//       const allStudents: any[] = [];

//       if (Array.isArray(studentDataObj)) {
//         studentDataObj.forEach((s: any) => {
//           allStudents.push({ ...s, className: s.class || "General" });
//         });
//       } else if (typeof studentDataObj === "object" && studentDataObj !== null) {
//         Object.entries(studentDataObj).forEach(([className, studentsArray]) => {
//           if (Array.isArray(studentsArray)) {
//             studentsArray.forEach((s: any) => {
//               allStudents.push({ ...s, className });
//             });
//           }
//         });
//       }

//       if (audience === "Students") {
//         list = allStudents.map((s) => ({ 
//           id: s.id, 
//           name: s.name, 
//           class: `Class: ${s.className} (Roll: ${s.roll || s.studentId || "—"})`, 
//           phone: s.phone, 
//           dueStatus: "—" as const 
//         }));
//       } else {
//         list = allStudents.map((s) => ({ 
//           id: s.id, 
//           name: `${s.guardianName || "Guardian"} (${s.name})`, 
//           class: `Class: ${s.className}`, 
//           phone: s.phone, 
//           dueStatus: "—" as const 
//         }));
//       }
//     }

//     return list.filter((r) => {
//       if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.phone.includes(search)) return false;
//       return true;
//     });
//   }, [audience, studentResponse, teacherResponse, search]);

//   const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
//   const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
//   const allChecked = pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));

//   const toggleAll = () => {
//     const next = new Set(selected);
//     if (allChecked) pageRows.forEach((r) => next.delete(r.id));
//     else pageRows.forEach((r) => next.add(r.id));
//     setSelected(next);
//   };

//   const toggleOne = (id: string) => {
//     const next = new Set(selected);
//     if (next.has(id)) next.delete(id);
//     else next.add(id);
//     setSelected(next);
//   };

//   const chars = message.length;
//   const smsCount = Math.max(1, Math.ceil(chars / 160));
//   const totalCost = smsCount * selected.size;

//   // const applyTemplate = (id: string) => {
//   //   setTemplateId(id);
//   //   const t = smsTemplates.find((x) => x.id === id);
//   //   if (t) setMessage(t.body);
//   // };

//   const handleSendSMS = async () => {
//     if (selected.size === 0 || !message) return;

//     try {
//       const payload = {
//         recipientIds: Array.from(selected),
//         audience: audience.toLowerCase(),
//         senderId,
//         message,
//       };

//       await broadcastToSelected(payload).unwrap();
//       antMessage.success(`SMS successfully queued for ${selected.size} recipients`);
//       setSelected(new Set());
//       setMessage("");
//     } catch (error: any) {
//       antMessage.error(error?.data?.message || "Failed to send SMS. Please try again.");
//     }
//   };

//   const teacherListSource = Array.isArray(teacherResponse) ? teacherResponse : (teacherResponse?.data || []);
//   const teacherCount = teacherListSource.length;

//   const studentDataContainer = studentResponse?.data || studentResponse || {};
//   const studentCount = Array.isArray(studentDataContainer) 
//     ? studentDataContainer.length 
//     : Object.values(studentDataContainer).reduce((acc: number, curr: any) => acc + (Array.isArray(curr) ? curr.length : 0), 0);

//   const audiences = [
//     { key: "Students" as Audience, icon: <UserOutlined />, count: studentCount },
//     { key: "Teachers" as Audience, icon: <TeamOutlined />, count: teacherCount },
//     { key: "Guardians" as Audience, icon: <AppstoreOutlined />, count: studentCount },
//   ];

//   const tableColumns = [
//     {
//       title: <Checkbox checked={allChecked} onChange={toggleAll} />,
//       dataIndex: "id",
//       key: "checkbox",
//       width: 40,
//       render: (id: string) => (
//         <Checkbox 
//           checked={selected.has(id)} 
//           onChange={() => toggleOne(id)} 
//           onClick={(e) => e.stopPropagation()} 
//         />
//       ),
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//       render: (text: string) => <span className="font-medium">{text}</span>,
//     },
//     {
//       title: audience === "Teachers" ? "Designation" : "Details",
//       dataIndex: "class",
//       key: "class",
//       render: (text: string) => <span className="text-gray-500">{text}</span>,
//     },
//     {
//       title: "Phone",
//       dataIndex: "phone",
//       key: "phone",
//       render: (text: string) => <span className="font-mono text-xs">{text}</span>,
//     },
//     {
//       title: "Due Status",
//       dataIndex: "dueStatus",
//       key: "dueStatus",
//       render: (status: string) => {
//         if (status === "—") return <span className="text-gray-400">—</span>;
//         return (
//           <span className={`px-2 py-0.5 text-xs rounded-full border ${
//             status === "Paid" 
//               ? "bg-green-50 text-green-600 border-green-200" 
//               : "bg-red-50 text-red-600 border-red-200"
//           }`}>
//             {status}
//           </span>
//         );
//       },
//     },
//   ];

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <h1 className="text-xl font-bold text-gray-900">Send SMS</h1>
//         <p className="text-sm text-gray-500">Reach the right audience with targeted communication</p>
//       </div>

//       <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
//         {/* LEFT: Filters */}
//         <div className="xl:sticky xl:top-24 xl:self-start">
//           <Card title={<span className="text-sm font-semibold">Audience</span>} className="rounded-2xl shadow-sm">
//             <div className="space-y-4">
//               <div className="grid grid-cols-3 gap-2 xl:grid-cols-1">
//                 {audiences.map(({ key, icon, count }) => {
//                   const active = audience === key;
//                   return (
//                     <button
//                       key={key}
//                       onClick={() => { setAudience(key); setPage(1); setSelected(new Set()); }}
//                       className={`flex items-center gap-3 w-full rounded-xl border p-3 text-left transition-all ${
//                         active ? "border-blue-500 bg-blue-50 text-blue-900 shadow-sm" : "border-gray-200 bg-white hover:bg-gray-50"
//                       }`}
//                     >
//                       <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
//                         {icon}
//                       </div>
//                       <div className="min-w-0">
//                         <div className="truncate text-sm font-medium">{key}</div>
//                         <div className="text-xs text-gray-500">{count} contacts</div>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>

//               <div className="space-y-3 border-t border-gray-100 pt-4">
//                 <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">Filters</div>
//                 <div>
//                   <label className="mb-1.5 block text-xs text-gray-600">Search</label>
//                   <Input 
//                     value={search} 
//                     onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
//                     placeholder="Name or phone" 
//                     prefix={<SearchOutlined className="text-gray-400" />}
//                     className="rounded-lg" 
//                   />
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* CENTER: Recipients Table */}
//         <Card 
//           title={
//             <div className="flex items-center justify-between">
//               <div>
//                 <span className="text-sm font-semibold">Recipients</span>
//                 <p className="text-xs font-normal text-gray-500">{rows.length} matching • {selected.size} selected</p>
//               </div>
//               <Badge status="processing" text={audience} />
//             </div>
//           } 
//           className="rounded-2xl shadow-sm"
//         >
//           <Table 
//             dataSource={pageRows} 
//             columns={tableColumns} 
//             rowKey="id" 
//             pagination={false}
//             loading={isLoadingStudents || isLoadingTeachers}
//             onRow={(record) => ({
//               onClick: () => toggleOne(record.id),
//               className: "cursor-pointer"
//             })}
//           />
//           <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 mt-4">
//             <div className="text-xs text-gray-500">Page {page} of {totalPages}</div>
//             <div className="flex gap-1">
//               <Button 
//                 icon={<LeftOutlined />} 
//                 size="small" 
//                 onClick={() => setPage((p) => Math.max(1, p - 1))} 
//                 disabled={page === 1} 
//               />
//               <Button 
//                 icon={<RightOutlined />} 
//                 size="small" 
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
//                 disabled={page === totalPages} 
//               />
//             </div>
//           </div>
//         </Card>

//         {/* RIGHT: Composer */}
//         <div className="xl:sticky xl:top-24 xl:self-start">
//           <Card 
//             title={
//               <div>
//                 <span className="text-sm font-semibold">SMS Composer</span>
//                 <p className="text-xs font-normal text-gray-500">Craft your message</p>
//               </div>
//             } 
//             className="rounded-2xl shadow-sm"
//           >
//             <div className="space-y-4">
//               <div>
//                 <label className="mb-1.5 block text-xs text-gray-600">Sender ID</label>
//                 <Input value={senderId} onChange={(e) => setSenderId(e.target.value)} className="rounded-lg" />
//               </div>
//               <div>
//                 <label className="mb-1.5 block text-xs text-gray-600">Template</label>
//                 <Select 
//                   value={templateId || undefined} 
//                   // onChange={applyTemplate} 
//                   placeholder="Choose a template..." 
//                   className="w-full"
//                   // options={smsTemplates.map((t) => ({ value: t.id, label: t.name }))}
//                 />
//               </div>
//               <div>
//                 <div className="mb-1.5 flex items-center justify-between">
//                   <label className="text-xs text-gray-600">Message</label>
//                   <span className="text-xs text-gray-400">{chars}/160 • {smsCount} SMS</span>
//                 </div>
//                 <Input.TextArea 
//                   value={message} 
//                   onChange={(e) => setMessage(e.target.value)} 
//                   placeholder="Type your message..." 
//                   rows={4}
//                   className="resize-none rounded-lg" 
//                 />
//               </div>

//               <div className="rounded-xl bg-gray-50 p-3 text-xs space-y-1">
//                 <div className="flex justify-between"><span className="text-gray-500">Recipients</span><span className="font-medium">{selected.size}</span></div>
//                 <div className="flex justify-between"><span className="text-gray-500">SMS per recipient</span><span className="font-medium">{smsCount}</span></div>
//                 <div className="flex justify-between border-t border-gray-200 pt-1"><span className="font-medium">Total credits</span><span className="font-bold text-blue-600">{totalCost}</span></div>
//               </div>

//               <div className="grid grid-cols-2 gap-2">
//                 <Button className="rounded-lg w-full" onClick={() => antMessage.success("Draft saved")}>
//                   <SaveOutlined /> Save Draft
//                 </Button>
//                 <Button 
//                   type="primary" 
//                   className="rounded-lg w-full bg-blue-600" 
//                   disabled={selected.size === 0 || !message || isSending} 
//                   loading={isSending}
//                   onClick={handleSendSMS}
//                 >
//                   <SendOutlined /> Send SMS
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MessagePage;