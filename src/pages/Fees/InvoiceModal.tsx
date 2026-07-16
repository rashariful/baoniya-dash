import React, { useRef } from "react";
import { Modal, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "@/assets/logo.jpeg";

interface FeeItem {
  feeHead: string;
  amount: number;
  month?: string;
}

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  fee: any;
  schoolInfo?: {
    logo?: string;
    name: string;
    email?: string;
    website?: string;
    address: string;
    phone: string;
  };
}

const defaultSchoolInfo = {
  logo: logo,
  name: "Baoniya School",
  email: "Baoniya@gmail.com",
  website: "Bajhs.edu.com",
  address: "Dhaka, Bangladesh",
  phone: "01980476011",
};

// feeHead value -> Bangla label mapping (fallback e raw value dekhabe)
const feeHeadMap: Record<string, string> = {
  due: "বকেয়া",
  current_month: "চলতি মাস",
  advance_tuition: "অগ্রিম বেতন",
  session_fee: "সেশন ফি",
  admission_fee: "ভর্তি/পুনঃ ভর্তি/ছাড়পত্র/জরিমানা",
  receipt_book: "রশিদ বই",
  calendar_diary_id: "ক্যালেন্ডার, ডায়েরি ও পরিচিতি পত্র",
  syllabus: "সিলেবাস",
  maintenance_fee: "নির্মাণ/মেরামত ফি",
  laboratory_fee: "বিজ্ঞানাগার ফি",
  sports_fee: "ক্রীড়া/বার্ষিক পুরস্কার বিতরণী ফি",
  student_welfare: "ছাত্র কল্যাণ তহবিল",
  library_fee: "পাঠাগার ফি",
  milad_fee: "মিলাদ ফি",
  scout_guide_fee: "স্কাউট/গার্লস গাইড ফি",
  exam_printing_fee: "পরীক্ষা ও প্রিন্টিং ফি",
  magazine_fee: "ম্যাগাজিন ফি",
  result_sheet_fee: "ফলাফল বিবরণী ফি",
  computer_fee: "কম্পিউটার বিজ্ঞান ফি",
  staff_welfare: "শিক্ষক-কর্মচারী কল্যাণ তহবিল",
  utility_fee: "বিদ্যুৎ, ওয়াসা ও টেলিফোন ফি",
  board_registration_fee: "বোর্ড ফি/রেজিস্ট্রেশন ফি",
  hostel_charge: "হোস্টেল চার্জ",
  ict_service_fee: "শিক্ষা সার্ভিস/আইসিটি ফি",
  others: "বিবিধ",
};

// english month name (feeItems[].month) -> Bangla label
const monthNameMap: Record<string, string> = {
  january: "জানুয়ারি",
  february: "ফেব্রুয়ারি",
  march: "মার্চ",
  april: "এপ্রিল",
  may: "মে",
  june: "জুন",
  july: "জুলাই",
  august: "আগস্ট",
  september: "সেপ্টেম্বর",
  october: "অক্টোবর",
  november: "নভেম্বর",
  december: "ডিসেম্বর",
};

// month index (0-11) -> Bangla month name (fallback, jokhon feeItems e month thake na)
const banglaMonths = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

const statusMap: Record<string, string> = {
  paid: "পরিশোধিত",
  partial: "আংশিক পরিশোধিত",
  due: "বকেয়া",
  unpaid: "অপরিশোধিত",
};

// status onujayi color
const statusColorMap: Record<string, { bg: string; text: string; border: string }> = {
  paid: { bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
  partial: { bg: "#fffbeb", text: "#b45309", border: "#fcd34d" },
  due: { bg: "#fef2f2", text: "#b91c1c", border: "#fca5a5" },
  unpaid: { bg: "#fef2f2", text: "#b91c1c", border: "#fca5a5" },
};

const InvoiceModal: React.FC<InvoiceModalProps> = ({ open, onClose, fee, schoolInfo = defaultSchoolInfo }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!fee) return null;

  const student = fee?.studentId || {};

  const invoiceNo = `INV-${fee?._id?.slice(-6)?.toUpperCase() || Date.now()}`;
  const invoiceDate = fee?.createdAt
    ? new Date(fee.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const amount = fee?.amount ?? 0;
  const paid = fee?.paidAmount ?? 0;
  const due = fee?.dueAmount ?? amount - paid;

  const feeItems: FeeItem[] = Array.isArray(fee?.feeItems) ? fee.feeItems : [];

  const feeDate = fee?.createdAt ? new Date(fee.createdAt) : new Date();
  const getItemMonthLabel = (m?: string) => (m ? monthNameMap[m.toLowerCase()] || m : null);

  const itemMonths = feeItems.map((item) => item.month).filter(Boolean) as string[];
  const uniqueMonths = Array.from(new Set(itemMonths.map((m) => m.toLowerCase())));

  const monthLabel =
    uniqueMonths.length === 1
      ? getItemMonthLabel(uniqueMonths[0])
      : uniqueMonths.length > 1
      ? "একাধিক মাস"
      : banglaMonths[feeDate.getMonth()];

  const statusKey = fee?.status?.toLowerCase() || "unpaid";
  const statusLabel = statusMap[statusKey] || fee?.status || "-";
  const statusColor = statusColorMap[statusKey] || statusColorMap.unpaid;

  const getFeeHeadLabel = (head: string) => feeHeadMap[head] || head;

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${invoiceNo}.pdf`);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={680}
      footer={[
        <Button key="close" onClick={onClose}>
          বন্ধ করুন
        </Button>,
        <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownloadPDF}>
          PDF ডাউনলোড
        </Button>,
      ]}
    >
      <div
        ref={invoiceRef}
        style={{
          fontFamily: "'Noto Sans Bengali', 'Hind Siliguri', sans-serif",
          background: "#ffffff",
          color: "#1f2937",
          padding: "32px 36px",
          position: "relative",
        }}
      >
        {/* ===== HEADER ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingBottom: 20,
            borderBottom: "2px solid #1677ff",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {schoolInfo.logo && (
              <img
                src={schoolInfo.logo}
                alt="Logo"
                style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 8 }}
              />
            )}
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>{schoolInfo.name}</h1>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>{schoolInfo.address}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
                {schoolInfo.phone}
                {schoolInfo.email && ` · ${schoolInfo.email}`}
              </p>
              {schoolInfo.website && (
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>{schoolInfo.website}</p>
              )}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                display: "inline-block",
                background: "#1677ff",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1.5,
                padding: "6px 16px",
                borderRadius: 6,
              }}
            >
              INVOICE
            </div>
            <p style={{ margin: "10px 0 0", fontSize: 12, color: "#6b7280" }}>
              নং: <b style={{ color: "#111827" }}>{invoiceNo}</b>
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
              তারিখ: <b style={{ color: "#111827" }}>{invoiceDate}</b>
            </p>
          </div>
        </div>

        {/* ===== STUDENT INFO + STATUS ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              flex: 1,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "14px 18px",
            }}
          >
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5 }}>
              শিক্ষার্থীর তথ্য
            </p>
            <p style={{ margin: "8px 0 0", fontSize: 14, fontWeight: 600, color: "#111827" }}>
              {student?.name || "-"}
            </p>
            <div style={{ marginTop: 8, fontSize: 12, color: "#4b5563", lineHeight: 1.8 }}>
              <div>স্টুডেন্ট আইডি: <b>{student?.studentId || "-"}</b></div>
              <div>রোল: <b>{student?.roll || "-"}</b></div>
              <div>রেজিস্ট্রেশন নং: <b>{student?.registrationNo || "-"}</b></div>
              <div>অভিভাবকের ফোন: <b>{student?.guardianPhone || "-"}</b></div>
              <div>ঠিকানা: <b>{student?.address || "-"}</b></div>
            </div>
          </div>

          <div
            style={{
              width: 180,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "14px 18px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5 }}>
              বিলিং মাস
            </p>
            <p style={{ margin: "8px 0 14px", fontSize: 16, fontWeight: 700, color: "#111827" }}>{monthLabel}</p>

            <div
              style={{
                display: "inline-block",
                background: statusColor.bg,
                color: statusColor.text,
                border: `1px solid ${statusColor.border}`,
                borderRadius: 20,
                padding: "4px 14px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {statusLabel}
            </div>
          </div>
        </div>

        {/* ===== TABLE ===== */}
  <table style={{ 
  width: "100%", 
  borderCollapse: "collapse", 
  fontSize: 13, 
  marginBottom: 20,
  border: "1px solid #000000" // পুরো টেবিলের বাইরের বর্ডার কালো
}}>
  <thead>
    <tr style={{ background: "#000000", color: "#ffffff" }}>
      <th style={{ textAlign: "left", padding: "12px", border: "1px solid #000000" }}>বিবরণ</th>
      <th style={{ textAlign: "left", padding: "12px", border: "1px solid #000000" }}>মাস</th>
      <th style={{ textAlign: "right", padding: "12px", border: "1px solid #000000" }}>পরিমাণ (৳)</th>
    </tr>
  </thead>
  <tbody>
    {feeItems.length > 0 ? (
      feeItems.map((item, idx) => (
        <tr key={`${item.feeHead}-${idx}`}>
          <td style={{ padding: "10px 12px", border: "1px solid #000000" }}>{getFeeHeadLabel(item.feeHead)}</td>
          <td style={{ padding: "10px 12px", border: "1px solid #000000" }}>{getItemMonthLabel(item.month) || "-"}</td>
          <td style={{ padding: "10px 12px", border: "1px solid #000000", textAlign: "right", fontWeight: 600 }}>
            {(item.amount ?? 0).toLocaleString("en-BD")}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={3} style={{ padding: "12px", border: "1px solid #000000", textAlign: "center" }}>কোনো ডাটা পাওয়া যায়নি</td>
      </tr>
    )}

    {/* Summary Section */}
    <tr>
      <td style={{ padding: "10px 12px", border: "1px solid #000000", fontWeight: 700 }} colSpan={2}>সর্বমোট</td>
      <td style={{ padding: "10px 12px", border: "1px solid #000000", textAlign: "right", fontWeight: 700 }}>
        {amount.toLocaleString("en-BD")}
      </td>
    </tr>
    <tr>
      <td style={{ padding: "10px 12px", border: "1px solid #000000", fontWeight: 600, color: "#15803d" }} colSpan={2}>পরিশোধিত</td>
      <td style={{ padding: "10px 12px", border: "1px solid #000000", textAlign: "right", fontWeight: 600, color: "#15803d" }}>
        {paid.toLocaleString("en-BD")}
      </td>
    </tr>
    <tr style={{ background: "#f5f5f5" }}>
      <td style={{ padding: "12px", border: "1px solid #000000", fontWeight: 800, fontSize: 14 }} colSpan={2}>বকেয়া (Due)</td>
      <td style={{ padding: "12px", border: "1px solid #000000", textAlign: "right", fontWeight: 800, fontSize: 14, color: "#000000" }}>
        ৳{due.toLocaleString("en-BD")}
      </td>
    </tr>
  </tbody>
</table>

        {/* ===== FOOTER ===== */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, maxWidth: 280 }}>
            এই ইনভয়েসটি কম্পিউটার জেনারেটেড। যেকোনো তথ্যের জন্য অফিসে যোগাযোগ করুন।
          </p>
          <div style={{ textAlign: "center" }}>
            <div style={{ borderTop: "1px solid #9ca3af", width: 160, marginBottom: 4 }} />
            <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>কর্তৃপক্ষের স্বাক্ষর</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceModal;


// import React, { useRef } from "react";
// import { Modal, Button } from "antd";
// import { DownloadOutlined } from "@ant-design/icons";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import logo from "@/assets/logo.jpeg";

// interface InvoiceModalProps {
//   open: boolean;
//   onClose: () => void;
//   fee: any;
//   schoolInfo?: {
//     logo?: string;
//     name: string;
//     email?: string;
//     website?: string;
//     address: string;
//     phone: string;
//   };
// }

// const defaultSchoolInfo = {
//   logo: logo,
//   name: "Baoniya School",
//   email: "Baoniya@gmail.com",
//   website: "Bajhs.edu.com",
//   address: "Dhaka, Bangladesh",
//   phone: "01980476011",
// };

// // month name -> Bangla mapping (fallback e original value dekhabe)
// const monthMap: Record<string, string> = {
//   january: "জানুয়ারি",
//   february: "ফেব্রুয়ারি",
//   march: "মার্চ",
//   april: "এপ্রিল",
//   may: "মে",
//   june: "জুন",
//   july: "জুলাই",
//   august: "আগস্ট",
//   september: "সেপ্টেম্বর",
//   october: "অক্টোবর",
//   november: "নভেম্বর",
//   december: "ডিসেম্বর",
// };

// const statusMap: Record<string, string> = {
//   paid: "পরিশোধিত",
//   partial: "আংশিক পরিশোধিত",
//   due: "বকেয়া",
//   unpaid: "অপরিশোধিত",
// };

// // status onujayi color
// const statusColorMap: Record<string, { bg: string; text: string; border: string }> = {
//   paid: { bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
//   partial: { bg: "#fffbeb", text: "#b45309", border: "#fcd34d" },
//   due: { bg: "#fef2f2", text: "#b91c1c", border: "#fca5a5" },
//   unpaid: { bg: "#fef2f2", text: "#b91c1c", border: "#fca5a5" },
// };

// const InvoiceModal: React.FC<InvoiceModalProps> = ({ open, onClose, fee, schoolInfo = defaultSchoolInfo }) => {
//   const invoiceRef = useRef<HTMLDivElement>(null);

//   if (!fee) return null;

//   const student = fee?.studentId || {};

//   const invoiceNo = `INV-${fee?._id?.slice(-6)?.toUpperCase() || Date.now()}`;
//   const invoiceDate = fee?.createdAt
//     ? new Date(fee.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
//     : new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

//   const amount = fee?.amount ?? 0;
//   const paid = fee?.paidAmount ?? 0;
//   const due = fee?.dueAmount ?? amount - paid;

//   const statusKey = fee?.status?.toLowerCase() || "unpaid";
//   const monthLabel = fee?.month ? monthMap[fee.month.toLowerCase()] || fee.month : "-";
//   const statusLabel = statusMap[statusKey] || fee?.status || "-";
//   const statusColor = statusColorMap[statusKey] || statusColorMap.unpaid;

//   const handleDownloadPDF = async () => {
//     if (!invoiceRef.current) return;
//     const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`${invoiceNo}.pdf`);
//   };

//   return (
//     <Modal
//       open={open}
//       onCancel={onClose}
//       width={680}
//       footer={[
//         <Button key="close" onClick={onClose}>
//           বন্ধ করুন
//         </Button>,
//         <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownloadPDF}>
//           PDF ডাউনলোড
//         </Button>,
//       ]}
//     >
//       <div
//         ref={invoiceRef}
//         style={{
//           fontFamily: "'Noto Sans Bengali', 'Hind Siliguri', sans-serif",
//           background: "#ffffff",
//           color: "#1f2937",
//           padding: "32px 36px",
//           position: "relative",
//         }}
//       >
//         {/* ===== HEADER ===== */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//             paddingBottom: 20,
//             borderBottom: "2px solid #1677ff",
//             marginBottom: 24,
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//             {schoolInfo.logo && (
//               <img
//                 src={schoolInfo.logo}
//                 alt="Logo"
//                 style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 8 }}
//               />
//             )}
//             <div>
//               <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>{schoolInfo.name}</h1>
//               <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>{schoolInfo.address}</p>
//               <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
//                 {schoolInfo.phone}
//                 {schoolInfo.email && ` · ${schoolInfo.email}`}
//               </p>
//               {schoolInfo.website && (
//                 <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>{schoolInfo.website}</p>
//               )}
//             </div>
//           </div>

//           <div style={{ textAlign: "right" }}>
//             <div
//               style={{
//                 display: "inline-block",
//                 background: "#1677ff",
//                 color: "#fff",
//                 fontSize: 13,
//                 fontWeight: 700,
//                 letterSpacing: 1.5,
//                 padding: "6px 16px",
//                 borderRadius: 6,
//               }}
//             >
//               INVOICE
//             </div>
//             <p style={{ margin: "10px 0 0", fontSize: 12, color: "#6b7280" }}>
//               নং: <b style={{ color: "#111827" }}>{invoiceNo}</b>
//             </p>
//             <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
//               তারিখ: <b style={{ color: "#111827" }}>{invoiceDate}</b>
//             </p>
//           </div>
//         </div>

//         {/* ===== STUDENT INFO + STATUS ===== */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             gap: 20,
//             marginBottom: 24,
//           }}
//         >
//           <div
//             style={{
//               flex: 1,
//               background: "#f9fafb",
//               border: "1px solid #e5e7eb",
//               borderRadius: 8,
//               padding: "14px 18px",
//             }}
//           >
//             <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5 }}>
//               শিক্ষার্থীর তথ্য
//             </p>
//             <p style={{ margin: "8px 0 0", fontSize: 14, fontWeight: 600, color: "#111827" }}>
//               {student?.name || "-"}
//             </p>
//             <div style={{ marginTop: 8, fontSize: 12, color: "#4b5563", lineHeight: 1.8 }}>
//               <div>স্টুডেন্ট আইডি: <b>{student?.studentId || "-"}</b></div>
//               <div>রেজিস্ট্রেশন নং: <b>{student?.registrationNo || "-"}</b></div>
//               <div>অভিভাবকের ফোন: <b>{student?.guardianPhone || "-"}</b></div>
//               <div>ঠিকানা: <b>{student?.address || "-"}</b></div>
//             </div>
//           </div>

//           <div
//             style={{
//               width: 180,
//               background: "#f9fafb",
//               border: "1px solid #e5e7eb",
//               borderRadius: 8,
//               padding: "14px 18px",
//               textAlign: "center",
//             }}
//           >
//             <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5 }}>
//               বিলিং মাস
//             </p>
//             <p style={{ margin: "8px 0 14px", fontSize: 16, fontWeight: 700, color: "#111827" }}>{monthLabel}</p>

//             <div
//               style={{
//                 display: "inline-block",
//                 background: statusColor.bg,
//                 color: statusColor.text,
//                 border: `1px solid ${statusColor.border}`,
//                 borderRadius: 20,
//                 padding: "4px 14px",
//                 fontSize: 12,
//                 fontWeight: 700,
//               }}
//             >
//               {statusLabel}
//             </div>
//           </div>
//         </div>

//         {/* ===== TABLE ===== */}
//         <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 8 }}>
//           <thead>
//             <tr>
//               <th
//                 style={{
//                   textAlign: "left",
//                   padding: "10px 12px",
//                   background: "#111827",
//                   color: "#fff",
//                   borderRadius: "6px 0 0 6px",
//                   fontSize: 12,
//                   letterSpacing: 0.5,
//                 }}
//               >
//                 বিবরণ
//               </th>
//               <th
//                 style={{
//                   textAlign: "right",
//                   padding: "10px 12px",
//                   background: "#111827",
//                   color: "#fff",
//                   borderRadius: "0 6px 6px 0",
//                   fontSize: 12,
//                   letterSpacing: 0.5,
//                 }}
//               >
//                 পরিমাণ (৳)
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>মোট ফি ({monthLabel})</td>
//               <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb", textAlign: "right", fontWeight: 600 }}>
//                 {amount.toLocaleString("en-BD")}
//               </td>
//             </tr>
//             <tr>
//               <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb", color: "#15803d" }}>পরিশোধিত</td>
//               <td
//                 style={{
//                   padding: "12px",
//                   borderBottom: "1px solid #e5e7eb",
//                   textAlign: "right",
//                   fontWeight: 600,
//                   color: "#15803d",
//                 }}
//               >
//                 {paid.toLocaleString("en-BD")}
//               </td>
//             </tr>
//             <tr>
//               <td
//                 style={{
//                   padding: "14px 12px",
//                   fontWeight: 700,
//                   fontSize: 14,
//                   background: due > 0 ? "#fef2f2" : "#f0fdf4",
//                   borderRadius: "0 0 0 6px",
//                 }}
//               >
//                 বকেয়া (Due)
//               </td>
//               <td
//                 style={{
//                   padding: "14px 12px",
//                   textAlign: "right",
//                   fontWeight: 700,
//                   fontSize: 14,
//                   color: due > 0 ? "#b91c1c" : "#15803d",
//                   background: due > 0 ? "#fef2f2" : "#f0fdf4",
//                   borderRadius: "0 0 6px 0",
//                 }}
//               >
//                 ৳{due.toLocaleString("en-BD")}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {/* ===== FOOTER ===== */}
//         <div
//           style={{
//             marginTop: 40,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-end",
//           }}
//         >
//           <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, maxWidth: 280 }}>
//             এই ইনভয়েসটি কম্পিউটার জেনারেটেড। যেকোনো তথ্যের জন্য অফিসে যোগাযোগ করুন।
//           </p>
//           <div style={{ textAlign: "center" }}>
//             <div style={{ borderTop: "1px solid #9ca3af", width: 160, marginBottom: 4 }} />
//             <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>কর্তৃপক্ষের স্বাক্ষর</p>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default InvoiceModal;