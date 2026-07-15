import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Segmented } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import schoolLogo from "@/assets/logo.jpeg";

interface IDCardModalProps {
  open: boolean;
  onClose: () => void;
  student: any;
  schoolInfo?: {
    logo?: string;
    nameBn: string;
    nameEn: string;
    address: string;
    phone: string;
    website?: string;
    email?: string;
    issueDate?: string;
    validity?: string;
  };
}

const defaultSchoolInfo = {
  logo: schoolLogo,
  nameBn: "বাউনিয়া আবদুল জলিল উচ্চ বিদ্যালয়",
  nameEn: "Baunia Abdul Jalil High School",
  address: "Baunia Main Road, Post: Badaldi\nTurag, Uttara, Dhaka-1230.",
  phone: "+880 1912749172",
  website: "www.bajhs.edu.bd",
  email: "baj2highschool@gmail.com",
  issueDate: "01/01/2026",
  validity: "31/12/2026",
};

// khali/null value hole N/A dekhabe
const val = (v: any) => {
  if (v === null || v === undefined || v === "") return "N/A";
  return v;
};

const IDCardModal: React.FC<IDCardModalProps> = ({ open, onClose, student, schoolInfo = defaultSchoolInfo }) => {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState<"front" | "back">("front");
  const [qrCode, setQrCode] = useState<string>("");

  const studentId = student?.studentId || "N/A";
  const name = val(student?.name);
  const fatherName = val(student?.fatherName);
  const roll = val(student?.roll);
  const section = val(student?.sectionId?.name);
  const className = val(student?.classId?.name);
  const session = val(student?.sessionId?.name || student?.sessionId?.year);
  const bloodGroup = val(student?.bloodGroup);
  const mobile = val(student?.guardianPhone || student?.userId?.phone);
  const photoUrl = student?.photo || student?.avatar || null;

  // QR code generate (studentId ba unique link diye)
  useEffect(() => {
    if (!student) return;
    const qrData = student?._id ? `STUDENT-ID:${studentId}` : "N/A";
    QRCode.toDataURL(qrData, { width: 120, margin: 1 })
      .then(setQrCode)
      .catch(() => setQrCode(""));
  }, [student, studentId]);

  if (!student) return null;

  const handleDownloadPDF = async () => {
    const captureSide = async (ref: React.RefObject<HTMLDivElement>) => {
      if (!ref.current) return null;
      const canvas = await html2canvas(ref.current, { scale: 3, useCORS: true, backgroundColor: "#ffffff" });
      return canvas.toDataURL("image/png");
    };

    const frontImg = await captureSide(frontRef);
    const wasBack = side === "back";
    if (!wasBack) setSide("back");
    // ekhtu wait so back side render hoye jay
    await new Promise((r) => setTimeout(r, 300));
    const backImg = await captureSide(backRef);
    if (!wasBack) setSide("front");

    // CR80 vertical card: 54mm x 86mm
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [58, 90] });
    if (frontImg) pdf.addImage(frontImg, "PNG", 2, 2, 54, 86);
    if (backImg) {
      pdf.addPage([58, 90], "portrait");
      pdf.addImage(backImg, "PNG", 2, 2, 54, 86);
    }
    pdf.save(`ID-${studentId}.pdf`);
  };

  const cardBase: React.CSSProperties = {
    width: 260,
    height: 410,
    borderRadius: 16,
    overflow: "hidden",
    background: "#ffffff",
    boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
    border: "1px solid #e5e7eb",
    fontFamily: "'Noto Sans Bengali', 'Hind Siliguri', sans-serif",
    position: "relative",
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={360}
      centered
      footer={[
        <Button key="close" onClick={onClose}>
          বন্ধ করুন
        </Button>,
        <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownloadPDF}>
          PDF ডাউনলোড
        </Button>,
      ]}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <Segmented
          options={[
            { label: "সামনে (Front)", value: "front" },
            { label: "পেছনে (Back)", value: "back" },
          ]}
          value={side}
          onChange={(v) => setSide(v as "front" | "back")}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
        {/* ================= FRONT ================= */}
        <div style={{ ...cardBase, display: side === "front" ? "block" : "none" }} ref={frontRef}>
          {/* Top header: blue -> green diagonal */}
          <div
            style={{
              background: "linear-gradient(120deg, #1e3a8a 55%, #16a34a 100%)",
              padding: "10px 12px 8px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>
              {schoolInfo.nameBn}
            </p>
            <p style={{ margin: "2px 0 0", color: "#fde047", fontSize: 11, fontWeight: 700 }}>{schoolInfo.nameEn}</p>
          </div>

          {/* Red band */}
          <div style={{ background: "#dc2626", textAlign: "center", padding: "3px 0" }}>
            <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>পরিচয় পত্র</span>
          </div>

          {/* Seal + Photo */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "10px 10px 4px" }}>
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: "50%",
                border: "2px solid #16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <img src={schoolInfo.logo} alt="seal" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>

            <div
              style={{
                width: 66,
                height: 78,
                border: "2px solid #1e3a8a",
                borderRadius: 4,
                overflow: "hidden",
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {photoUrl ? (
                <img src={photoUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 9, color: "#9ca3af", textAlign: "center" }}>Photo N/A</span>
              )}
            </div>
          </div>

          {/* Info section */}
          <div style={{ padding: "4px 12px 0" }}>
            <p style={{ margin: "2px 0", fontSize: 14, fontWeight: 700, color: "#1e3a8a", textAlign: "center" }}>
              {name}
            </p>

            <div style={{ fontSize: 10, color: "#111827", lineHeight: 1.7 }}>
              <div>
                <b>পিতাঃ</b> {fatherName}
              </div>
              <div>
                <b>রোলঃ</b> {roll} &nbsp; <b>শাখাঃ</b> {section} &nbsp; <b>শ্রেণিঃ</b> {className}
              </div>
              <div>
                <b>শিক্ষাবর্ষঃ</b> {session} &nbsp; <b style={{ color: "#dc2626" }}>Blood Group:</b> {bloodGroup}
              </div>
              <div style={{ fontWeight: 700, color: "#dc2626" }}>Mobile: {mobile}</div>
            </div>
          </div>

          {/* Footer: QR + signature */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              padding: "0 12px",
            }}
          >
            {qrCode ? (
              <img src={qrCode} alt="QR" style={{ width: 42, height: 42 }} />
            ) : (
              <div style={{ width: 42, height: 42, border: "1px dashed #d1d5db", fontSize: 7, textAlign: "center" }}>
                QR
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 70, borderTop: "1px solid #374151", marginBottom: 2 }} />
              <span style={{ fontSize: 8.5, fontWeight: 700, color: "#111827" }}>প্রধান শিক্ষক</span>
            </div>
          </div>

          {/* corner accents */}
          <div style={{ position: "absolute", top: 0, left: 0, width: 10, height: 60, background: "#16a34a" }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 40, height: 40, background: "#dc2626", borderRadius: "100% 0 0 0" }} />
        </div>

        {/* ================= BACK ================= */}
        <div style={{ ...cardBase, display: side === "back" ? "flex" : "none", flexDirection: "column", alignItems: "center", padding: "14px 16px" }} ref={backRef}>
          <div style={{ border: "1px solid #111827", padding: "6px 10px", fontSize: 10, width: "100%", marginBottom: 14 }}>
            <div>Date of Issue : {schoolInfo.issueDate}</div>
            <div>Validity of&nbsp;&nbsp;&nbsp; : {schoolInfo.validity}</div>
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, fontStyle: "italic", textDecoration: "underline", margin: "0 0 12px" }}>
            If found please return to:
          </p>

          <div style={{ width: 56, height: 56, marginBottom: 8 }}>
            <img src={schoolInfo.logo} alt="seal" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>

          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, textAlign: "center" }}>{schoolInfo.nameBn}</p>
          <p style={{ margin: "2px 0 10px", fontSize: 11, fontWeight: 700, textAlign: "center" }}>{schoolInfo.nameEn}</p>

          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, alignSelf: "flex-start", textDecoration: "underline" }}>
            Address:
          </p>
          <p style={{ margin: "2px 0 8px", fontSize: 9.5, textAlign: "left", alignSelf: "flex-start", whiteSpace: "pre-line", lineHeight: 1.4 }}>
            {schoolInfo.address}
            {"\n"}Mobile : {schoolInfo.phone}
          </p>

          <p style={{ margin: "6px 0 0", fontSize: 9.5, alignSelf: "flex-start" }}>Website: {schoolInfo.website}</p>
          <p style={{ margin: "2px 0 0", fontSize: 9.5, alignSelf: "flex-start" }}>E-mail: {schoolInfo.email}</p>
        </div>
      </div>
    </Modal>
  );
};

export default IDCardModal;

// import React, { useRef } from "react";
// import { Modal, Button } from "antd";
// import { DownloadOutlined } from "@ant-design/icons";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import logo from "@/assets/logo.jpeg";

// interface IDCardModalProps {
//   open: boolean;
//   onClose: () => void;
//   student: any;
//   schoolInfo?: {
//     logo?: string;
//     name: string;
//     address: string;
//     phone: string;
//   };
// }

// const defaultSchoolInfo = {
//   logo: logo,
//   name: "Baoniya School",
//   address: "Dhaka, Bangladesh",
//   phone: "01980476011",
// };

// // name theke initials বানানো (photo na thakle avatar hisebe use hobe)
// const getInitials = (name?: string) => {
//   if (!name) return "??";
//   const parts = name.trim().split(" ").filter(Boolean);
//   if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
//   return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
// };

// const formatDate = (dateStr?: string) => {
//   if (!dateStr) return "-";
//   try {
//     return new Date(dateStr).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return "-";
//   }
// };

// const IDCardModal: React.FC<IDCardModalProps> = ({ open, onClose, student, schoolInfo = defaultSchoolInfo }) => {
//   const cardRef = useRef<HTMLDivElement>(null);

//   if (!student) return null;

//   // --- shob field null-safe extract kora hoise ---
//   const name = student?.name || "-";
//   const studentId = student?.studentId || "-";
//   const roll = student?.roll || "-";
//   const registrationNo = student?.registrationNo || "-";
//   const className = student?.classId?.name || "-";
//   const sectionName = student?.sectionId?.name || "-";
//   const sessionName = student?.sessionId?.name || student?.sessionId?.year || "-";
//   const guardianName = student?.guardianName || "-";
//   const guardianPhone = student?.guardianPhone || "-";
//   const fatherName = student?.fatherName || "-";
//   const motherName = student?.motherName || "-";
//   const address = student?.address || "-";
//   const phone = student?.userId?.phone || "-";

//   // ✅ Future fields — data e thakle dekhabe, na thakle "-" (kono error hobe na)
//   const bloodGroup = student?.bloodGroup || "-";
//   const dob = student?.dob ? formatDate(student.dob) : "-";
//   const gender = student?.gender || "-";
//   const photoUrl = student?.photo || student?.avatar || null;

//   const handleDownloadPDF = async () => {
//     if (!cardRef.current) return;
//     const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: "#ffffff" });
//     const imgData = canvas.toDataURL("image/png");

//     // CR80 standard card size: 85.6mm x 54mm
//     const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [90, 58] });
//     pdf.addImage(imgData, "PNG", 2, 2, 86, 54);
//     pdf.save(`ID-${studentId}.pdf`);
//   };

//   return (
//     <Modal
//       open={open}
//       onCancel={onClose}
//       width={420}
//       footer={[
//         <Button key="close" onClick={onClose}>
//           বন্ধ করুন
//         </Button>,
//         <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownloadPDF}>
//           PDF ডাউনলোড
//         </Button>,
//       ]}
//       centered
//     >
//       <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
//         {/* ===== ID CARD (CR80 ratio ~ 1.585 : 1) ===== */}
//         <div
//           ref={cardRef}
//           style={{
//             width: 340,
//             height: 214,
//             borderRadius: 14,
//             overflow: "hidden",
//             fontFamily: "'Noto Sans Bengali', 'Hind Siliguri', sans-serif",
//             background: "#ffffff",
//             boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
//             border: "1px solid #e5e7eb",
//             position: "relative",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           {/* Header strip */}
//           <div
//             style={{
//               background: "linear-gradient(135deg, #1677ff 0%, #0f4fb8 100%)",
//               padding: "10px 14px",
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//             }}
//           >
//             {schoolInfo.logo && (
//               <img
//                 src={schoolInfo.logo}
//                 alt="logo"
//                 style={{ width: 26, height: 26, borderRadius: 6, objectFit: "contain", background: "#fff", padding: 2 }}
//               />
//             )}
//             <div style={{ flex: 1 }}>
//               <p style={{ margin: 0, color: "#fff", fontSize: 12.5, fontWeight: 700, lineHeight: 1.2 }}>
//                 {schoolInfo.name}
//               </p>
//               <p style={{ margin: 0, color: "#dbeafe", fontSize: 8.5 }}>{schoolInfo.address}</p>
//             </div>
//             <div
//               style={{
//                 background: "rgba(255,255,255,0.2)",
//                 color: "#fff",
//                 fontSize: 8,
//                 fontWeight: 700,
//                 padding: "2px 8px",
//                 borderRadius: 10,
//                 letterSpacing: 0.5,
//               }}
//             >
//               STUDENT ID
//             </div>
//           </div>

//           {/* Body */}
//           <div style={{ flex: 1, display: "flex", padding: "10px 14px", gap: 12 }}>
//             {/* Photo / Avatar */}
//             <div
//               style={{
//                 width: 62,
//                 height: 74,
//                 borderRadius: 8,
//                 border: "2px solid #1677ff",
//                 overflow: "hidden",
//                 flexShrink: 0,
//                 background: "#eff6ff",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               {photoUrl ? (
//                 <img src={photoUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//               ) : (
//                 <span style={{ fontSize: 20, fontWeight: 700, color: "#1677ff" }}>{getInitials(name)}</span>
//               )}
//             </div>

//             {/* Info */}
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <p
//                 style={{
//                   margin: 0,
//                   fontSize: 13.5,
//                   fontWeight: 700,
//                   color: "#111827",
//                   whiteSpace: "nowrap",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                 }}
//               >
//                 {name}
//               </p>
//               <p style={{ margin: "1px 0 6px", fontSize: 9.5, color: "#6b7280" }}>
//                 শ্রেণিঃ {className} | শাখাঃ {sectionName} | রোলঃ {roll}
//               </p>

//               <div style={{ fontSize: 9, color: "#374151", lineHeight: 1.65 }}>
//                 <div>
//                   <b>আইডিঃ</b> {studentId}
//                 </div>
//                 <div>
//                   <b>সেশনঃ</b> {sessionName}
//                 </div>
//                 <div>
//                   <b>জন্ম তারিখঃ</b> {dob} &nbsp;|&nbsp; <b>রক্তের গ্রুপঃ</b> {bloodGroup}
//                 </div>
//                 <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                   <b>অভিভাবকঃ</b> {guardianName} ({guardianPhone})
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer strip */}
//           <div
//             style={{
//               borderTop: "1px dashed #d1d5db",
//               padding: "5px 14px",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <p style={{ margin: 0, fontSize: 8, color: "#9ca3af" }}>এই কার্ডটি হারিয়ে গেলে অফিসে যোগাযোগ করুন</p>
//             <p style={{ margin: 0, fontSize: 8, fontWeight: 700, color: "#1677ff" }}>{schoolInfo.phone}</p>
//           </div>
//         </div>
//       </div>

//       {/* Extra details not shown on card, shown below for admin reference */}
//       <div style={{ marginTop: 12, fontSize: 12, color: "#4b5563", padding: "0 4px" }}>
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
//           <span>রেজিস্ট্রেশন নংঃ {registrationNo}</span>
//           <span>লিঙ্গঃ {gender}</span>
//           <span>বাবার নামঃ {fatherName}</span>
//           <span>মায়ের নামঃ {motherName}</span>
//           <span>ফোনঃ {phone}</span>
//           <span style={{ gridColumn: "span 2" }}>ঠিকানাঃ {address}</span>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default IDCardModal;