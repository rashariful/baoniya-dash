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

const IDCardModal: React.FC<IDCardModalProps> = ({
  open,
  onClose,
  student,
  schoolInfo = defaultSchoolInfo,
}) => {
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
      const canvas = await html2canvas(ref.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
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
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [58, 90],
    });
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
        <Button
          key="download"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownloadPDF}
        >
          PDF ডাউনলোড
        </Button>,
      ]}
    >
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}
      >
        <Segmented
          options={[
            { label: "সামনে (Front)", value: "front" },
            { label: "পেছনে (Back)", value: "back" },
          ]}
          value={side}
          onChange={(v) => setSide(v as "front" | "back")}
        />
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}
      >
        {/* ================= FRONT ================= */}
        <div
          style={{ ...cardBase, display: side === "front" ? "block" : "none" }}
          ref={frontRef}
        >
          {/* Top header: blue -> green diagonal */}
          <div
            style={{
              background: "#1e3a8a",
              padding: "10px 12px 8px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {schoolInfo.nameBn}
            </p>
            <p
              style={{
                margin: "2px 0 0",
                color: "#fde047",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {schoolInfo.nameEn}
            </p>
          </div>

          {/* Red band */}
        <div
  className="w-28 mx-auto mt-1 rounded-md"
  style={{
    backgroundColor: "#B91C1C", // Professional dark red
    textAlign: "center",
    padding: "4px 0",
  }}
>
  <span
    style={{
      color: "#FFFFFF",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.5px",
    }}
  >
    পরিচয় পত্র
  </span>
</div>

          {/* Seal + Photo */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "10px 10px 4px",
            }}
          >
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
              <img
                src={schoolInfo.logo}
                alt="seal"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
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
                <img
                  src={photoUrl}
                  alt={name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  style={{ fontSize: 9, color: "#9ca3af", textAlign: "center" }}
                >
                  Photo N/A
                </span>
              )}
            </div>
          </div>

          {/* Info section */}
          <div style={{ padding: "4px 12px 0" }}>
            <p
              style={{
                margin: "2px 0",
                fontSize: 14,
                fontWeight: 700,
                color: "#1e3a8a",
                textAlign: "center",
              }}
            >
              {name}
            </p>

            <div style={{ fontSize: 10, color: "#111827", lineHeight: 1.7 }}>
              <div>
                <b>পিতাঃ</b> {fatherName}
              </div>
              <div>
                <b>রোলঃ</b> {roll} &nbsp; <b>শাখাঃ</b> {section} &nbsp;{" "}
                <b>শ্রেণিঃ</b> {className}
              </div>
              <div>
                <b>শিক্ষাবর্ষঃ</b> {session} &nbsp;{" "}
                <b style={{ color: "#dc2626" }}>Blood Group:</b> {bloodGroup}
              </div>
              <div style={{ fontWeight: 700, color: "#dc2626" }}>
                Mobile: {mobile}
              </div>
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
              <div
                style={{
                  width: 42,
                  height: 42,
                  border: "1px dashed #d1d5db",
                  fontSize: 7,
                  textAlign: "center",
                }}
              >
                QR
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 70,
                  borderTop: "1px solid #374151",
                  marginBottom: 2,
                }}
              />
              <span
                style={{ fontSize: 8.5, fontWeight: 700, color: "#111827" }}
              >
                প্রধান শিক্ষক
              </span>
            </div>
          </div>

          {/* corner accents */}
        <div
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: 15,
    height: 100,
    background: "#16a34a",
    borderBottomRightRadius: "9999px",
  }}
/>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 40,
              height: 40,
              background: "#dc2626",
              borderRadius: "100% 0 0 0",
            }}
          />
        </div>

        {/* ================= BACK ================= */}
        <div
          style={{
            ...cardBase,
            display: side === "back" ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
            padding: "14px 16px",
          }}
          ref={backRef}
        >
          <div
            style={{
              border: "1px solid #111827",
              padding: "6px 10px",
              fontSize: 10,
              width: "100%",
              marginBottom: 14,
            }}
          >
            <div>Date of Issue : {schoolInfo.issueDate}</div>
            <div>Validity of&nbsp;&nbsp;&nbsp; : {schoolInfo.validity}</div>
          </div>

          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              fontStyle: "italic",
              textDecoration: "underline",
              margin: "0 0 12px",
            }}
          >
            If found please return to:
          </p>

          <div style={{ width: 56, height: 56, marginBottom: 8 }}>
            <img
              src={schoolInfo.logo}
              alt="seal"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {schoolInfo.nameBn}
          </p>
          <p
            style={{
              margin: "2px 0 10px",
              fontSize: 11,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {schoolInfo.nameEn}
          </p>

          <p
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 700,
              alignSelf: "flex-start",
              textDecoration: "underline",
            }}
          >
            Address:
          </p>
          <p
            style={{
              margin: "2px 0 8px",
              fontSize: 9.5,
              textAlign: "left",
              alignSelf: "flex-start",
              whiteSpace: "pre-line",
              lineHeight: 1.4,
            }}
          >
            {schoolInfo.address}
            {"\n"}Mobile : {schoolInfo.phone}
          </p>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: 9.5,
              alignSelf: "flex-start",
            }}
          >
            Website: {schoolInfo.website}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 9.5,
              alignSelf: "flex-start",
            }}
          >
            E-mail: {schoolInfo.email}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default IDCardModal;
