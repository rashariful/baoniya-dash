import React, { useState, useMemo } from "react";
import {
  Table,
  Tag,
  Card,
  Typography,
  Spin,
  Input,
  Select,
  Space,
  Button,
  Statistic,
  Row,
  Col,
  Badge,
  Divider,
  Tooltip,
  message,
  Avatar,
  Dropdown,
  DatePicker,
  Modal,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MobileOutlined,
  IdcardOutlined,
  CameraOutlined,
  IdcardOutlined as FingerprintOutlined,
  DownloadOutlined,
  DownOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useGetAllAttendanceQuery } from "@/redux/api/attendanceApi.js";

dayjs.extend(utc);
dayjs.extend(timezone);

// Backend device data omes as raw UTC ISO strings (sessions[].checkInTime),
// while the top-level checkInTime/checkOutTime are already pre-formatted
// in Bangladesh local time by the backend. To keep every displayed time
// consistent regardless of the viewer's browser timezone, we always
// explicitly convert to Asia/Dhaka (UTC+6) before rendering.
const APP_TIMEZONE = "Asia/Dhaka";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// ---- Helpers -------------------------------------------------------------

// Get initials (first 2 letters) from email/name for fallback avatar
const getInitials = (email?: string) => {
  if (!email) return "NA";
  const name = email.split("@")[0];
  return name.substring(0, 2).toUpperCase();
};

// Deterministic color for avatar based on string, so the same person
// always gets the same color
const AVATAR_COLORS = [
  "#1890ff",
  "#52c41a",
  "#722ed1",
  "#fa8c16",
  "#eb2f96",
  "#13c2c2",
  "#faad14",
  "#2f54eb",
];
const getAvatarColor = (str?: string) => {
  if (!str) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// Convert a raw UTC ISO timestamp (from sessions[]) into a Bangladesh-time
// formatted string, so it always matches the pre-formatted top-level
// checkInTime/checkOutTime fields regardless of the browser's own timezone.
const formatSessionTime = (isoString?: string | null) => {
  if (!isoString) return null;
  return dayjs.utc(isoString).tz(APP_TIMEZONE).format("hh:mm:ss A");
};

const AttendancePage = () => {
  const { data, isLoading, refetch } = useGetAllAttendanceQuery();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [customRange, setCustomRange] = useState<[Dayjs, Dayjs] | null>(null);

  const attendanceData = data?.data?.data || [];

  // Enhanced filtering and search functionality
  const filteredData = useMemo(() => {
    let filtered = attendanceData;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter((item) => item.source === sourceFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];

      if (dateFilter === "today") {
        filtered = filtered.filter((item) => item.date === today);
      } else if (dateFilter === "yesterday") {
        filtered = filtered.filter((item) => item.date === yesterday);
      }
    }

    // Search by email, phone, device, or remarks
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item?.userId?.email?.toLowerCase().includes(searchLower) ||
          item?.userId?.phone?.toLowerCase().includes(searchLower) ||
          item?.deviceId?.toLowerCase().includes(searchLower) ||
          item?.remarks?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [attendanceData, searchText, statusFilter, sourceFilter, dateFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = attendanceData.length;
    const present = attendanceData.filter((item) => item.status === "present").length;
    const absent = attendanceData.filter((item) => item.status === "absent").length;
    const faceSource = attendanceData.filter((item) => item.source === "face").length;
    const fingerprintSource = attendanceData.filter((item) => item.source === "fingerprint").length;
    const cardSource = attendanceData.filter((item) => item.source === "card").length;
    const manualSource = attendanceData.filter((item) => item.source === "manual").length;
    const totalMinutes = attendanceData.reduce((sum, item) => sum + (item.totalWorkingMinutes || 0), 0);

    return {
      total,
      present,
      absent,
      faceSource,
      fingerprintSource,
      cardSource,
      manualSource,
      totalMinutes,
      attendanceRate: total > 0 ? ((present / total) * 100).toFixed(1) : 0,
    };
  }, [attendanceData]);

  // Get source icon
  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "face":
        return <CameraOutlined />;
      case "fingerprint":
        return <FingerprintOutlined />;
      case "card":
        return <IdcardOutlined />;
      case "manual":
        return <UserOutlined />;
      default:
        return <MobileOutlined />;
    }
  };

  // Get source color
  const getSourceColor = (source?: string) => {
    switch (source) {
      case "face":
        return "green";
      case "fingerprint":
        return "purple";
      case "card":
        return "geekblue";
      case "manual":
        return "orange";
      default:
        return "blue";
    }
  };

  // ---- Report / Export logic ---------------------------------------------

  const getDateRangeForPeriod = (period: string) => {
    const now = dayjs();
    let start: Dayjs;
    let end: Dayjs;

    switch (period) {
      case "today":
        start = now;
        end = now;
        break;
      case "yesterday":
        start = now.subtract(1, "day");
        end = now.subtract(1, "day");
        break;
      case "weekly":
        start = now.startOf("week");
        end = now;
        break;
      case "monthly":
        start = now.startOf("month");
        end = now;
        break;
      case "lastMonth":
        start = now.subtract(1, "month").startOf("month");
        end = now.subtract(1, "month").endOf("month");
        break;
      default:
        start = now;
        end = now;
    }

    return { start: start.format("YYYY-MM-DD"), end: end.format("YYYY-MM-DD") };
  };

  const downloadCSV = (rows: (string | number)[][], headers: string[], filename: string) => {
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateReport = (start: string, end: string, label: string) => {
    const reportData = attendanceData.filter(
      (item) => item.date >= start && item.date <= end
    );

    if (reportData.length === 0) {
      message.warning("Selected somoy-er jonno kono attendance record paoa jayni");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Date",
      "Status",
      "Source",
      "Check In",
      "Check Out",
      "Working Minutes",
      "Sessions",
      "Device",
      "Remarks",
    ];

    const rows = reportData.map((item) => [
      item?.userId?.email?.split("@")[0] || "N/A",
      item?.userId?.email || "N/A",
      item?.userId?.phone || "N/A",
      item.date,
      item.status,
      item.source,
      item.checkInTime || "-",
      item.checkOutTime || "-",
      item.totalWorkingMinutes || 0,
      item.sessions?.length || 0,
      item.deviceId || "-",
      item.remarks || "-",
    ]);

    downloadCSV(
      rows,
      headers,
      `attendance_report_${label}_${start}_to_${end}.csv`
    );
    message.success(`Report download shuru hoyeche (${start} theke ${end})`);
  };

  const reportMenuItems: MenuProps["items"] = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "weekly", label: "This Week" },
    { key: "monthly", label: "This Month" },
    { key: "lastMonth", label: "Last Month" },
    { type: "divider" },
    { key: "custom", label: "Custom Range...", icon: <HistoryOutlined /> },
  ];

  const handleReportMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "custom") {
      setReportModalVisible(true);
      return;
    }
    const { start, end } = getDateRangeForPeriod(key);
    generateReport(start, end, key);
  };

  const handleCustomReportGenerate = () => {
    if (!customRange || customRange.length !== 2) {
      message.warning("Onugroho kore ekta date range select korun");
      return;
    }
    const start = customRange[0].format("YYYY-MM-DD");
    const end = customRange[1].format("YYYY-MM-DD");
    generateReport(start, end, "custom");
    setReportModalVisible(false);
    setCustomRange(null);
  };

  // ---- Table columns -------------------------------------------------------

  const columns: ColumnsType<any> = [
    {
      title: "Teacher Information",
      key: "teacher",
      fixed: "left",
      width: 240,
      render: (_, record) => {
        const email = record?.userId?.email;
        const photoUrl = record?.userId?.photo || record?.userId?.avatar; // if a photo field ever exists
        return (
          <div className="flex items-center gap-3">
            {photoUrl ? (
              <Avatar size={40} src={photoUrl} />
            ) : (
              <Avatar
                size={40}
                style={{
                  backgroundColor: getAvatarColor(email),
                  fontWeight: 600,
                }}
              >
                {getInitials(email)}
              </Avatar>
            )}
            <div>
              <p className="font-semibold text-sm m-0">
                {email?.split("@")[0] || "N/A"}
              </p>
              <p className="text-gray-500 text-xs m-0">{email || "N/A"}</p>
              <p className="text-gray-400 text-xs m-0">
                📱 {record?.userId?.phone || "N/A"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Date & Time",
      key: "dateTime",
      width: 180,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.date}</div>
          <div className="text-xs text-gray-500">
            <ClockCircleOutlined className="mr-1" />
            {record.checkInTime?.split(",")[1]?.trim() || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Badge
          status={status === "present" ? "success" : "error"}
          text={<span className="font-medium">{status?.toUpperCase()}</span>}
        />
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      width: 130,
      render: (source) => (
        <Tag color={getSourceColor(source)} className="px-3 py-1">
          {getSourceIcon(source)} {source?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Check In",
      dataIndex: "checkInTime",
      key: "checkInTime",
      width: 160,
      render: (time) => (
        <div>
          <div className="text-sm">{time || "-"}</div>
          <div className="text-xs text-gray-400">🟢 In</div>
        </div>
      ),
    },
    {
      title: "Check Out",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      width: 160,
      render: (time, record) => {
        // checkOutTime is null while the teacher is still on an ongoing
        // session (i.e. the last item in sessions[] has no checkOutTime)
        const lastSession = record.sessions?.[record.sessions.length - 1];
        const isActive = !time && lastSession && !lastSession.checkOutTime;

        if (isActive) {
          return (
            <div>
              <Badge status="processing" text={<span className="text-sm font-medium text-green-600">Active Now</span>} />
              <div className="text-xs text-gray-400 mt-1">
                Since {formatSessionTime(lastSession.checkInTime) || "-"}
              </div>
            </div>
          );
        }

        return (
          <div>
            <div className="text-sm">{time || "-"}</div>
            <div className="text-xs text-gray-400">🔴 Out</div>
          </div>
        );
      },
    },
    {
      title: "Working Minutes",
      key: "workingMinutes",
      width: 130,
      render: (_, record) => (
        <div className="font-medium">{record.totalWorkingMinutes || 0} min</div>
      ),
    },
    {
      // Dedicated Sessions column, as requested
      title: "Sessions",
      key: "sessionsCount",
      width: 130,
      render: (_, record) => {
        const sessions = record.sessions || [];
        const count = sessions.length;
        const hasOngoing = count > 0 && !sessions[count - 1].checkOutTime;

        const tooltipContent =
          count === 0 ? (
            "No sessions recorded"
          ) : (
            <div>
              {sessions.map((s, i) => (
                <div key={i} style={{ whiteSpace: "nowrap" }}>
                  {i + 1}. {formatSessionTime(s.checkInTime)} –{" "}
                  {s.checkOutTime ? formatSessionTime(s.checkOutTime) : "ongoing"}
                  {s.duration ? ` (${s.duration}m)` : ""}
                </div>
              ))}
            </div>
          );

        return (
          <Tooltip title={tooltipContent}>
            <Tag color={hasOngoing ? "processing" : count > 0 ? "cyan" : "default"}>
              <HistoryOutlined /> {count} session{count === 1 ? "" : "s"}
              {hasOngoing ? " (live)" : ""}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "Device",
      dataIndex: "deviceId",
      key: "deviceId",
      width: 140,
      render: (device) => (
        <Tooltip title={`Device: ${device}`}>
          <Tag icon={<MobileOutlined />} color="blue">
            {device || "-"}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      width: 120,
      render: (text) => (
        <Text type="secondary" ellipsis={{ tooltip: text }}>
          {text || "-"}
        </Text>
      ),
    },
  ];

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await refetch();
      message.success("Attendance data refreshed successfully!");
    } catch (error) {
      message.error("Failed to refresh data. Please try again.");
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchText("");
    setStatusFilter("all");
    setSourceFilter("all");
    setDateFilter("all");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <Card className="mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <Title level={3} className="m-0">
              📊 Attendance Management
            </Title>
            <Text type="secondary">
              Teacher attendance from Hikvision device and manual entry
            </Text>
          </div>
          <Space className="mt-3 md:mt-0">
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={isLoading}
            >
              Refresh Data
            </Button>
            <Dropdown
              menu={{ items: reportMenuItems, onClick: handleReportMenuClick }}
              trigger={["click"]}
            >
              <Button icon={<DownloadOutlined />}>
                Download Report <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        </div>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Total Teachers"
              value={stats.total}
              prefix={<UserOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Present Today"
              value={stats.present}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              suffix={`/ ${stats.total}`}
            />
            <div className="mt-2">
              <Badge status="success" text={`${stats.attendanceRate}% Attendance`} />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Face Recognition"
              value={stats.faceSource}
              prefix={<CameraOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Fingerprint"
              value={stats.fingerprintSource}
              prefix={<FingerprintOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filter Section */}
      <Card className="mb-6 shadow-sm">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search by email, phone, device..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col xs={12} md={4}>
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              size="large"
            >
              <Option value="all">All Status</Option>
              <Option value="present">Present</Option>
              <Option value="absent">Absent</Option>
              <Option value="late">Late</Option>
            </Select>
          </Col>
          <Col xs={12} md={4}>
            <Select
              placeholder="Source"
              value={sourceFilter}
              onChange={setSourceFilter}
              style={{ width: "100%" }}
              size="large"
            >
              <Option value="all">All Sources</Option>
              <Option value="face">📷 Face</Option>
              <Option value="fingerprint">🖐️ Fingerprint</Option>
              <Option value="card">💳 Card</Option>
              <Option value="manual">👤 Manual</Option>
            </Select>
          </Col>
          <Col xs={12} md={4}>
            <Select
              placeholder="Date"
              value={dateFilter}
              onChange={setDateFilter}
              style={{ width: "100%" }}
              size="large"
            >
              <Option value="all">All Dates</Option>
              <Option value="today">Today</Option>
              <Option value="yesterday">Yesterday</Option>
            </Select>
          </Col>
          <Col xs={12} md={4}>
            <Button onClick={resetFilters} style={{ width: "100%" }} size="large">
              Reset Filters
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table Section */}
      <Card className="shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" tip="Loading attendance data..." />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <Text type="secondary">
                Showing {filteredData.length} of {attendanceData.length} records
              </Text>
              <div className="flex items-center gap-2">
                <Badge status="success" text="Present" />
                <Badge status="error" text="Absent" />
              </div>
            </div>
            <Table
              rowKey="_id"
              columns={columns}
              dataSource={filteredData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} items`,
              }}
              bordered
              scroll={{ x: 1600 }}
              className="attendance-table"
            />
          </>
        )}
      </Card>

      {/* Custom Range Report Modal */}
      <Modal
        title="Custom Report Range"
        open={reportModalVisible}
        onCancel={() => {
          setReportModalVisible(false);
          setCustomRange(null);
        }}
        onOk={handleCustomReportGenerate}
        okText="Download"
      >
        <Text type="secondary">Report-er jonno start ar end date select korun:</Text>
        <div className="mt-3">
          <RangePicker
            style={{ width: "100%" }}
            value={customRange}
            onChange={(values) => setCustomRange(values as [Dayjs, Dayjs])}
          />
        </div>
      </Modal>

      <style jsx>{`
        .attendance-table :global(.ant-table) {
          border-radius: 8px;
        }
        .attendance-table :global(.ant-table-thead > tr > th) {
          background: #fafafa;
          font-weight: 600;
        }
        .attendance-table :global(.ant-table-tbody > tr:hover) {
          background: #f5f5f5;
        }
      `}</style>
    </div>
  );
};

export default AttendancePage;

// import React, { useState, useMemo } from "react";
// import {
//   Table,
//   Tag,
//   Card,
//   Typography,
//   Spin,
//   Input,
//   Select,
//   Space,
//   Button,
//   Statistic,
//   Row,
//   Col,
//   Badge,
//   Divider,
//   Tooltip,
//   message,
//   Avatar,
//   Dropdown,
//   DatePicker,
//   Modal,
// } from "antd";
// import {
//   ReloadOutlined,
//   SearchOutlined,
//   UserOutlined,
//   ClockCircleOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   MobileOutlined,
//   IdcardOutlined,
//   CameraOutlined,
//   IdcardOutlined as FingerprintOutlined,
//   DownloadOutlined,
//   DownOutlined,
//   HistoryOutlined,
// } from "@ant-design/icons";
// import type { ColumnsType } from "antd/es/table";
// import type { MenuProps } from "antd";
// import dayjs, { Dayjs } from "dayjs";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone";
// import { useGetAllAttendanceQuery } from "@/redux/api/attendanceApi.js";

// dayjs.extend(utc);
// dayjs.extend(timezone);

// // Backend device data omes as raw UTC ISO strings (sessions[].checkInTime),
// // while the top-level checkInTime/checkOutTime are already pre-formatted
// // in Bangladesh local time by the backend. To keep every displayed time
// // consistent regardless of the viewer's browser timezone, we always
// // explicitly convert to Asia/Dhaka (UTC+6) before rendering.
// const APP_TIMEZONE = "Asia/Dhaka";

// const { Title, Text } = Typography;
// const { Option } = Select;
// const { RangePicker } = DatePicker;

// // ---- Helpers -------------------------------------------------------------

// // Get initials (first 2 letters) from email/name for fallback avatar
// const getInitials = (email?: string) => {
//   if (!email) return "NA";
//   const name = email.split("@")[0];
//   return name.substring(0, 2).toUpperCase();
// };

// // Deterministic color for avatar based on string, so the same person
// // always gets the same color
// const AVATAR_COLORS = [
//   "#1890ff",
//   "#52c41a",
//   "#722ed1",
//   "#fa8c16",
//   "#eb2f96",
//   "#13c2c2",
//   "#faad14",
//   "#2f54eb",
// ];
// const getAvatarColor = (str?: string) => {
//   if (!str) return AVATAR_COLORS[0];
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     hash = str.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
// };

// // Convert a raw UTC ISO timestamp (from sessions[]) into a Bangladesh-time
// // formatted string, so it always matches the pre-formatted top-level
// // checkInTime/checkOutTime fields regardless of the browser's own timezone.
// const formatSessionTime = (isoString?: string | null) => {
//   if (!isoString) return null;
//   return dayjs.utc(isoString).tz(APP_TIMEZONE).format("hh:mm:ss A");
// };

// const AttendancePage = () => {
//   const { data, isLoading, refetch } = useGetAllAttendanceQuery();
//   const [searchText, setSearchText] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [sourceFilter, setSourceFilter] = useState("all");
//   const [dateFilter, setDateFilter] = useState("all");
//   const [reportModalVisible, setReportModalVisible] = useState(false);
//   const [customRange, setCustomRange] = useState<[Dayjs, Dayjs] | null>(null);

//   const attendanceData = data?.data?.data || [];

//   // Enhanced filtering and search functionality
//   const filteredData = useMemo(() => {
//     let filtered = attendanceData;

//     // Status filter
//     if (statusFilter !== "all") {
//       filtered = filtered.filter((item) => item.status === statusFilter);
//     }

//     // Source filter
//     if (sourceFilter !== "all") {
//       filtered = filtered.filter((item) => item.source === sourceFilter);
//     }

//     // Date filter
//     if (dateFilter !== "all") {
//       const today = new Date().toISOString().split("T")[0];
//       const yesterday = new Date(Date.now() - 86400000)
//         .toISOString()
//         .split("T")[0];

//       if (dateFilter === "today") {
//         filtered = filtered.filter((item) => item.date === today);
//       } else if (dateFilter === "yesterday") {
//         filtered = filtered.filter((item) => item.date === yesterday);
//       }
//     }

//     // Search by email, phone, device, or remarks
//     if (searchText) {
//       const searchLower = searchText.toLowerCase();
//       filtered = filtered.filter(
//         (item) =>
//           item?.userId?.email?.toLowerCase().includes(searchLower) ||
//           item?.userId?.phone?.toLowerCase().includes(searchLower) ||
//           item?.deviceId?.toLowerCase().includes(searchLower) ||
//           item?.remarks?.toLowerCase().includes(searchLower)
//       );
//     }

//     return filtered;
//   }, [attendanceData, searchText, statusFilter, sourceFilter, dateFilter]);

//   // Statistics calculation
//   const stats = useMemo(() => {
//     const total = attendanceData.length;
//     const present = attendanceData.filter((item) => item.status === "present").length;
//     const absent = attendanceData.filter((item) => item.status === "absent").length;
//     const faceSource = attendanceData.filter((item) => item.source === "face").length;
//     const fingerprintSource = attendanceData.filter((item) => item.source === "fingerprint").length;
//     const cardSource = attendanceData.filter((item) => item.source === "card").length;
//     const manualSource = attendanceData.filter((item) => item.source === "manual").length;
//     const totalMinutes = attendanceData.reduce((sum, item) => sum + (item.totalWorkingMinutes || 0), 0);

//     return {
//       total,
//       present,
//       absent,
//       faceSource,
//       fingerprintSource,
//       cardSource,
//       manualSource,
//       totalMinutes,
//       attendanceRate: total > 0 ? ((present / total) * 100).toFixed(1) : 0,
//     };
//   }, [attendanceData]);

//   // Get source icon
//   const getSourceIcon = (source?: string) => {
//     switch (source) {
//       case "face":
//         return <CameraOutlined />;
//       case "fingerprint":
//         return <FingerprintOutlined />;
//       case "card":
//         return <IdcardOutlined />;
//       case "manual":
//         return <UserOutlined />;
//       default:
//         return <MobileOutlined />;
//     }
//   };

//   // Get source color
//   const getSourceColor = (source?: string) => {
//     switch (source) {
//       case "face":
//         return "green";
//       case "fingerprint":
//         return "purple";
//       case "card":
//         return "geekblue";
//       case "manual":
//         return "orange";
//       default:
//         return "blue";
//     }
//   };

//   // ---- Report / Export logic ---------------------------------------------

//   const getDateRangeForPeriod = (period: string) => {
//     const now = dayjs();
//     let start: Dayjs;
//     let end: Dayjs;

//     switch (period) {
//       case "today":
//         start = now;
//         end = now;
//         break;
//       case "yesterday":
//         start = now.subtract(1, "day");
//         end = now.subtract(1, "day");
//         break;
//       case "weekly":
//         start = now.startOf("week");
//         end = now;
//         break;
//       case "monthly":
//         start = now.startOf("month");
//         end = now;
//         break;
//       case "lastMonth":
//         start = now.subtract(1, "month").startOf("month");
//         end = now.subtract(1, "month").endOf("month");
//         break;
//       default:
//         start = now;
//         end = now;
//     }

//     return { start: start.format("YYYY-MM-DD"), end: end.format("YYYY-MM-DD") };
//   };

//   const downloadCSV = (rows: (string | number)[][], headers: string[], filename: string) => {
//     const csvContent = [headers, ...rows]
//       .map((row) =>
//         row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
//       )
//       .join("\n");

//     const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   const generateReport = (start: string, end: string, label: string) => {
//     const reportData = attendanceData.filter(
//       (item) => item.date >= start && item.date <= end
//     );

//     if (reportData.length === 0) {
//       message.warning("Selected somoy-er jonno kono attendance record paoa jayni");
//       return;
//     }

//     const headers = [
//       "Name",
//       "Email",
//       "Phone",
//       "Date",
//       "Status",
//       "Source",
//       "Check In",
//       "Check Out",
//       "Working Minutes",
//       "Sessions",
//       "Device",
//       "Remarks",
//     ];

//     const rows = reportData.map((item) => [
//       item?.userId?.email?.split("@")[0] || "N/A",
//       item?.userId?.email || "N/A",
//       item?.userId?.phone || "N/A",
//       item.date,
//       item.status,
//       item.source,
//       item.checkInTime || "-",
//       item.checkOutTime || "-",
//       item.totalWorkingMinutes || 0,
//       item.sessions?.length || 0,
//       item.deviceId || "-",
//       item.remarks || "-",
//     ]);

//     downloadCSV(
//       rows,
//       headers,
//       `attendance_report_${label}_${start}_to_${end}.csv`
//     );
//     message.success(`Report download shuru hoyeche (${start} theke ${end})`);
//   };

//   const reportMenuItems: MenuProps["items"] = [
//     { key: "today", label: "Today" },
//     { key: "yesterday", label: "Yesterday" },
//     { key: "weekly", label: "This Week" },
//     { key: "monthly", label: "This Month" },
//     { key: "lastMonth", label: "Last Month" },
//     { type: "divider" },
//     { key: "custom", label: "Custom Range...", icon: <HistoryOutlined /> },
//   ];

//   const handleReportMenuClick: MenuProps["onClick"] = ({ key }) => {
//     if (key === "custom") {
//       setReportModalVisible(true);
//       return;
//     }
//     const { start, end } = getDateRangeForPeriod(key);
//     generateReport(start, end, key);
//   };

//   const handleCustomReportGenerate = () => {
//     if (!customRange || customRange.length !== 2) {
//       message.warning("Onugroho kore ekta date range select korun");
//       return;
//     }
//     const start = customRange[0].format("YYYY-MM-DD");
//     const end = customRange[1].format("YYYY-MM-DD");
//     generateReport(start, end, "custom");
//     setReportModalVisible(false);
//     setCustomRange(null);
//   };

//   // ---- Table columns -------------------------------------------------------

//   const columns: ColumnsType<any> = [
//     {
//       title: "Teacher Information",
//       key: "teacher",
//       fixed: "left",
//       width: 240,
//       render: (_, record) => {
//         const email = record?.userId?.email;
//         const photoUrl = record?.userId?.photo || record?.userId?.avatar; // if a photo field ever exists
//         return (
//           <div className="flex items-center gap-3">
//             {photoUrl ? (
//               <Avatar size={40} src={photoUrl} />
//             ) : (
//               <Avatar
//                 size={40}
//                 style={{
//                   backgroundColor: getAvatarColor(email),
//                   fontWeight: 600,
//                 }}
//               >
//                 {getInitials(email)}
//               </Avatar>
//             )}
//             <div>
//               <p className="font-semibold text-sm m-0">
//                 {email?.split("@")[0] || "N/A"}
//               </p>
//               <p className="text-gray-500 text-xs m-0">{email || "N/A"}</p>
//               <p className="text-gray-400 text-xs m-0">
//                 📱 {record?.userId?.phone || "N/A"}
//               </p>
//             </div>
//           </div>
//         );
//       },
//     },
//     {
//       title: "Date & Time",
//       key: "dateTime",
//       width: 180,
//       render: (_, record) => (
//         <div>
//           <div className="font-medium">{record.date}</div>
//           <div className="text-xs text-gray-500">
//             <ClockCircleOutlined className="mr-1" />
//             {record.checkInTime?.split(",")[1]?.trim() || "N/A"}
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       width: 120,
//       render: (status) => (
//         <Badge
//           status={status === "present" ? "success" : "error"}
//           text={<span className="font-medium">{status?.toUpperCase()}</span>}
//         />
//       ),
//     },
//     {
//       title: "Source",
//       dataIndex: "source",
//       key: "source",
//       width: 130,
//       render: (source) => (
//         <Tag color={getSourceColor(source)} className="px-3 py-1">
//           {getSourceIcon(source)} {source?.toUpperCase()}
//         </Tag>
//       ),
//     },
//     {
//       title: "Check In",
//       dataIndex: "checkInTime",
//       key: "checkInTime",
//       width: 160,
//       render: (time) => (
//         <div>
//           <div className="text-sm">{time || "-"}</div>
//           <div className="text-xs text-gray-400">🟢 In</div>
//         </div>
//       ),
//     },
//     {
//       title: "Check Out",
//       dataIndex: "checkOutTime",
//       key: "checkOutTime",
//       width: 160,
//       render: (time, record) => {
//         // checkOutTime is null while the teacher is still on an ongoing
//         // session (i.e. the last item in sessions[] has no checkOutTime)
//         const lastSession = record.sessions?.[record.sessions.length - 1];
//         const isActive = !time && lastSession && !lastSession.checkOutTime;

//         if (isActive) {
//           return (
//             <div>
//               <Badge status="processing" text={<span className="text-sm font-medium text-green-600">Active Now</span>} />
//               <div className="text-xs text-gray-400 mt-1">
//                 Since {formatSessionTime(lastSession.checkInTime) || "-"}
//               </div>
//             </div>
//           );
//         }

//         return (
//           <div>
//             <div className="text-sm">{time || "-"}</div>
//             <div className="text-xs text-gray-400">🔴 Out</div>
//           </div>
//         );
//       },
//     },
//     {
//       title: "Working Minutes",
//       key: "workingMinutes",
//       width: 130,
//       render: (_, record) => (
//         <div className="font-medium">{record.totalWorkingMinutes || 0} min</div>
//       ),
//     },
//     {
//       // Dedicated Sessions column, as requested
//       title: "Sessions",
//       key: "sessionsCount",
//       width: 130,
//       render: (_, record) => {
//         const sessions = record.sessions || [];
//         const count = sessions.length;
//         const hasOngoing = count > 0 && !sessions[count - 1].checkOutTime;

//         const tooltipContent =
//           count === 0 ? (
//             "No sessions recorded"
//           ) : (
//             <div>
//               {sessions.map((s, i) => (
//                 <div key={i} style={{ whiteSpace: "nowrap" }}>
//                   {i + 1}. {formatSessionTime(s.checkInTime)} –{" "}
//                   {s.checkOutTime ? formatSessionTime(s.checkOutTime) : "ongoing"}
//                   {s.duration ? ` (${s.duration}m)` : ""}
//                 </div>
//               ))}
//             </div>
//           );

//         return (
//           <Tooltip title={tooltipContent}>
//             <Tag color={hasOngoing ? "processing" : count > 0 ? "cyan" : "default"}>
//               <HistoryOutlined /> {count} session{count === 1 ? "" : "s"}
//               {hasOngoing ? " (live)" : ""}
//             </Tag>
//           </Tooltip>
//         );
//       },
//     },
//     {
//       title: "Device",
//       dataIndex: "deviceId",
//       key: "deviceId",
//       width: 140,
//       render: (device) => (
//         <Tooltip title={`Device: ${device}`}>
//           <Tag icon={<MobileOutlined />} color="blue">
//             {device || "-"}
//           </Tag>
//         </Tooltip>
//       ),
//     },
//     {
//       title: "Remarks",
//       dataIndex: "remarks",
//       key: "remarks",
//       width: 120,
//       render: (text) => (
//         <Text type="secondary" ellipsis={{ tooltip: text }}>
//           {text || "-"}
//         </Text>
//       ),
//     },
//   ];

//   // Handle refresh
//   const handleRefresh = async () => {
//     try {
//       await refetch();
//       message.success("Attendance data refreshed successfully!");
//     } catch (error) {
//       message.error("Failed to refresh data. Please try again.");
//     }
//   };

//   // Reset all filters
//   const resetFilters = () => {
//     setSearchText("");
//     setStatusFilter("all");
//     setSourceFilter("all");
//     setDateFilter("all");
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header Section */}
//       <Card className="mb-6 shadow-sm">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//           <div>
//             <Title level={3} className="m-0">
//               📊 Attendance Management
//             </Title>
//             <Text type="secondary">
//               Teacher attendance from Hikvision device and manual entry
//             </Text>
//           </div>
//           <Space className="mt-3 md:mt-0">
//             <Button
//               type="primary"
//               icon={<ReloadOutlined />}
//               onClick={handleRefresh}
//               loading={isLoading}
//             >
//               Refresh Data
//             </Button>
//             <Dropdown
//               menu={{ items: reportMenuItems, onClick: handleReportMenuClick }}
//               trigger={["click"]}
//             >
//               <Button icon={<DownloadOutlined />}>
//                 Download Report <DownOutlined />
//               </Button>
//             </Dropdown>
//           </Space>
//         </div>
//       </Card>

//       {/* Statistics Cards */}
//       <Row gutter={[16, 16]} className="mb-6">
//         <Col xs={24} sm={12} md={6}>
//           <Card className="shadow-sm">
//             <Statistic
//               title="Total Teachers"
//               value={stats.total}
//               prefix={<UserOutlined className="text-blue-500" />}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={6}>
//           <Card className="shadow-sm">
//             <Statistic
//               title="Present Today"
//               value={stats.present}
//               prefix={<CheckCircleOutlined className="text-green-500" />}
//               suffix={`/ ${stats.total}`}
//             />
//             <div className="mt-2">
//               <Badge status="success" text={`${stats.attendanceRate}% Attendance`} />
//             </div>
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={6}>
//           <Card className="shadow-sm">
//             <Statistic
//               title="Face Recognition"
//               value={stats.faceSource}
//               prefix={<CameraOutlined className="text-green-500" />}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={6}>
//           <Card className="shadow-sm">
//             <Statistic
//               title="Fingerprint"
//               value={stats.fingerprintSource}
//               prefix={<FingerprintOutlined className="text-purple-500" />}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* Filter Section */}
//       <Card className="mb-6 shadow-sm">
//         <Row gutter={[16, 16]} align="middle">
//           <Col xs={24} md={8}>
//             <Input
//               placeholder="Search by email, phone, device..."
//               prefix={<SearchOutlined />}
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               allowClear
//               size="large"
//             />
//           </Col>
//           <Col xs={12} md={4}>
//             <Select
//               placeholder="Status"
//               value={statusFilter}
//               onChange={setStatusFilter}
//               style={{ width: "100%" }}
//               size="large"
//             >
//               <Option value="all">All Status</Option>
//               <Option value="present">Present</Option>
//               <Option value="absent">Absent</Option>
//               <Option value="late">Late</Option>
//             </Select>
//           </Col>
//           <Col xs={12} md={4}>
//             <Select
//               placeholder="Source"
//               value={sourceFilter}
//               onChange={setSourceFilter}
//               style={{ width: "100%" }}
//               size="large"
//             >
//               <Option value="all">All Sources</Option>
//               <Option value="face">📷 Face</Option>
//               <Option value="fingerprint">🖐️ Fingerprint</Option>
//               <Option value="card">💳 Card</Option>
//               <Option value="manual">👤 Manual</Option>
//             </Select>
//           </Col>
//           <Col xs={12} md={4}>
//             <Select
//               placeholder="Date"
//               value={dateFilter}
//               onChange={setDateFilter}
//               style={{ width: "100%" }}
//               size="large"
//             >
//               <Option value="all">All Dates</Option>
//               <Option value="today">Today</Option>
//               <Option value="yesterday">Yesterday</Option>
//             </Select>
//           </Col>
//           <Col xs={12} md={4}>
//             <Button onClick={resetFilters} style={{ width: "100%" }} size="large">
//               Reset Filters
//             </Button>
//           </Col>
//         </Row>
//       </Card>

//       {/* Table Section */}
//       <Card className="shadow-sm">
//         {isLoading ? (
//           <div className="flex justify-center py-20">
//             <Spin size="large" tip="Loading attendance data..." />
//           </div>
//         ) : (
//           <>
//             <div className="flex justify-between items-center mb-4">
//               <Text type="secondary">
//                 Showing {filteredData.length} of {attendanceData.length} records
//               </Text>
//               <div className="flex items-center gap-2">
//                 <Badge status="success" text="Present" />
//                 <Badge status="error" text="Absent" />
//               </div>
//             </div>
//             <Table
//               rowKey="_id"
//               columns={columns}
//               dataSource={filteredData}
//               pagination={{
//                 pageSize: 10,
//                 showSizeChanger: true,
//                 showQuickJumper: true,
//                 showTotal: (total) => `Total ${total} items`,
//               }}
//               bordered
//               scroll={{ x: 1600 }}
//               className="attendance-table"
//             />
//           </>
//         )}
//       </Card>

//       {/* Custom Range Report Modal */}
//       <Modal
//         title="Custom Report Range"
//         open={reportModalVisible}
//         onCancel={() => {
//           setReportModalVisible(false);
//           setCustomRange(null);
//         }}
//         onOk={handleCustomReportGenerate}
//         okText="Download"
//       >
//         <Text type="secondary">Report-er jonno start ar end date select korun:</Text>
//         <div className="mt-3">
//           <RangePicker
//             style={{ width: "100%" }}
//             value={customRange}
//             onChange={(values) => setCustomRange(values as [Dayjs, Dayjs])}
//           />
//         </div>
//       </Modal>

//       <style jsx>{`
//         .attendance-table :global(.ant-table) {
//           border-radius: 8px;
//         }
//         .attendance-table :global(.ant-table-thead > tr > th) {
//           background: #fafafa;
//           font-weight: 600;
//         }
//         .attendance-table :global(.ant-table-tbody > tr:hover) {
//           background: #f5f5f5;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AttendancePage;


// // import React, { useState, useMemo } from "react";
// // import {
// //   Table,
// //   Tag,
// //   Card,
// //   Typography,
// //   Spin,
// //   Input,
// //   Select,
// //   Space,
// //   Button,
// //   Statistic,
// //   Row,
// //   Col,
// //   Badge,
// //   Divider,
// //   Tooltip,
// //   message,
// //   Avatar,
// //   Timeline,
// //   Modal,
// //   Descriptions,
// //   Empty,
// //   Progress,
// // } from "antd";



// // import {
// //     EyeOutlined,
// //   CalendarOutlined,
// //   DashboardOutlined,
// //   ExportOutlined,
// //   FilterOutlined,
// //   HistoryOutlined,
// //   LockOutlined,
// //   ReloadOutlined,
// //   SearchOutlined,
// //   UserOutlined,
// //   ClockCircleOutlined,
// //   CheckCircleOutlined,
// //   CloseCircleOutlined,
// //   MobileOutlined,
// //   IdcardOutlined,
// //   CameraOutlined,
// //   IdcardOutlined as FingerprintOutlined,
// // } from "@ant-design/icons";

// // import type { ColumnsType } from "antd/es/table";
// // import { useGetAllAttendanceQuery } from "@/redux/api/attendanceApi.js";

// // const { Title, Text, Paragraph } = Typography;
// // const { Option } = Select;

// // // Primary color configuration
// // const PRIMARY_COLOR = "#1890ff";
// // const PRIMARY_LIGHT = "#e6f7ff";
// // const PRIMARY_DARK = "#096dd9";

// // const AttendancePage = () => {
// //   const { data, isLoading, refetch } = useGetAllAttendanceQuery();
// //   const [searchText, setSearchText] = useState("");
// //   const [statusFilter, setStatusFilter] = useState("all");
// //   const [sourceFilter, setSourceFilter] = useState("all");
// //   const [dateFilter, setDateFilter] = useState("all");
// //   const [selectedRecord, setSelectedRecord] = useState(null);
// //   const [detailModalVisible, setDetailModalVisible] = useState(false);

// //   const attendanceData = data?.data?.data || [];

// //   // Enhanced filtering and search functionality
// //   const filteredData = useMemo(() => {
// //     let filtered = attendanceData;

// //     if (statusFilter !== "all") {
// //       filtered = filtered.filter((item) => item.status === statusFilter);
// //     }

// //     if (sourceFilter !== "all") {
// //       filtered = filtered.filter((item) => item.source === sourceFilter);
// //     }

// //     if (dateFilter !== "all") {
// //       const today = new Date().toISOString().split("T")[0];
// //       const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      
// //       if (dateFilter === "today") {
// //         filtered = filtered.filter((item) => item.date === today);
// //       } else if (dateFilter === "yesterday") {
// //         filtered = filtered.filter((item) => item.date === yesterday);
// //       }
// //     }

// //     if (searchText) {
// //       const searchLower = searchText.toLowerCase();
// //       filtered = filtered.filter(
// //         (item) =>
// //           item?.userId?.email?.toLowerCase().includes(searchLower) ||
// //           item?.userId?.phone?.toLowerCase().includes(searchLower) ||
// //           item?.deviceId?.toLowerCase().includes(searchLower) ||
// //           item?.remarks?.toLowerCase().includes(searchLower)
// //       );
// //     }

// //     return filtered;
// //   }, [attendanceData, searchText, statusFilter, sourceFilter, dateFilter]);

// //   // Statistics calculation with percentage
// //   const stats = useMemo(() => {
// //     const total = attendanceData.length;
// //     const present = attendanceData.filter((item) => item.status === "present").length;
// //     const absent = attendanceData.filter((item) => item.status === "absent").length;
// //     const late = attendanceData.filter((item) => item.status === "late").length;
// //     const faceSource = attendanceData.filter((item) => item.source === "face").length;
// //     const fingerprintSource = attendanceData.filter((item) => item.source === "fingerprint").length;
// //     const manualSource = attendanceData.filter((item) => item.source === "manual").length;
// //     const totalMinutes = attendanceData.reduce((sum, item) => sum + (item.totalWorkingMinutes || 0), 0);
// //     const avgMinutes = total > 0 ? (totalMinutes / total).toFixed(1) : 0;

// //     return {
// //       total,
// //       present,
// //       absent,
// //       late,
// //       faceSource,
// //       fingerprintSource,
// //       manualSource,
// //       totalMinutes,
// //       avgMinutes,
// //       attendanceRate: total > 0 ? ((present / total) * 100).toFixed(1) : 0,
// //       presentPercentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0,
// //     };
// //   }, [attendanceData]);

// //   // Get source icon
// //   const getSourceIcon = (source) => {
// //     switch (source) {
// //       case "face":
// //         return <CameraOutlined />;
// //       case "fingerprint":
// //         return <FingerprintOutlined />;
// //       case "manual":
// //         return <UserOutlined />;
// //       default:
// //         return <MobileOutlined />;
// //     }
// //   };

// //   // Get source color
// //   const getSourceColor = (source) => {
// //     switch (source) {
// //       case "face":
// //         return "#52c41a";
// //       case "fingerprint":
// //         return "#722ed1";
// //       case "manual":
// //         return "#fa8c16";
// //       default:
// //         return "#1890ff";
// //     }
// //   };

// //   // Get status badge
// //   const getStatusBadge = (status) => {
// //     const statusMap = {
// //       present: { color: "success", icon: <CheckCircleOutlined />, text: "Present" },
// //       absent: { color: "error", icon: <CloseCircleOutlined />, text: "Absent" },
// //       late: { color: "warning", icon: <ClockCircleOutlined />, text: "Late" },
// //     };
// //     return statusMap[status] || statusMap.present;
// //   };

// //   // View details handler
// //   const viewDetails = (record) => {
// //     setSelectedRecord(record);
// //     setDetailModalVisible(true);
// //   };

// //   // Columns configuration with enhanced display
// //   const columns: ColumnsType<any> = [
// //     {
// //       title: "Teacher",
// //       key: "teacher",
// //       fixed: "left",
// //       width: 250,
// //       render: (_, record) => (
// //         <div className="flex items-center gap-4">
// //           <Avatar 
// //             size={48} 
// //             style={{ backgroundColor: PRIMARY_COLOR }}
// //             icon={<UserOutlined />}
// //           />
// //           <div>
// //             <Text strong className="text-base">
// //               {record?.userId?.email?.split("@")[0] || "N/A"}
// //             </Text>
// //             <div className="text-xs text-gray-500">
// //               <Text type="secondary">{record?.userId?.email}</Text>
// //             </div>
// //             <div className="text-xs text-gray-400">
// //               📱 {record?.userId?.phone || "N/A"}
// //             </div>
// //           </div>
// //         </div>
// //       ),
// //     },
// //     {
// //       title: "Date & Time",
// //       key: "dateTime",
// //       width: 200,
// //       render: (_, record) => (
// //         <div>
// //           <div className="font-medium flex items-center gap-1">
// //             <CalendarOutlined style={{ color: PRIMARY_COLOR }} />
// //             {record.date}
// //           </div>
// //           <div className="text-xs text-gray-500 mt-1">
// //             <ClockCircleOutlined className="mr-1" style={{ color: PRIMARY_COLOR }} />
// //             {record.checkInTime?.split(",")[1]?.trim() || "N/A"}
// //           </div>
// //         </div>
// //       ),
// //     },
// //     {
// //       title: "Status",
// //       dataIndex: "status",
// //       key: "status",
// //       width: 120,
// //       render: (status) => {
// //         const statusInfo = getStatusBadge(status);
// //         return (
// //           <Badge
// //             status={statusInfo.color}
// //             text={
// //               <span className="font-medium flex items-center gap-1">
// //                 {statusInfo.icon}
// //                 {statusInfo.text}
// //               </span>
// //             }
// //           />
// //         );
// //       },
// //     },
// //     {
// //       title: "Source",
// //       dataIndex: "source",
// //       key: "source",
// //       width: 150,
// //       render: (source) => (
// //         <Tag 
// //           style={{ 
// //             backgroundColor: getSourceColor(source) + "15",
// //             color: getSourceColor(source),
// //             borderColor: getSourceColor(source) + "30",
// //             padding: "4px 12px",
// //             borderRadius: "20px",
// //           }}
// //         >
// //           {getSourceIcon(source)} {source?.toUpperCase()}
// //         </Tag>
// //       ),
// //     },
// //     {
// //       title: "Check In/Out",
// //       key: "checkTimes",
// //       width: 200,
// //       render: (_, record) => (
// //         <div>
// //           <div className="flex items-center gap-2 text-sm">
// //             <Badge status="processing" />
// //             <span>{record.checkInTime || "-"}</span>
// //           </div>
// //           <div className="flex items-center gap-2 text-sm mt-1">
// //             <Badge status="default" />
// //             <span>{record.checkOutTime || "Not Checked Out"}</span>
// //           </div>
// //         </div>
// //       ),
// //     },
// //     {
// //       title: "Work Duration",
// //       key: "workDuration",
// //       width: 150,
// //       render: (_, record) => {
// //         const minutes = record.totalWorkingMinutes || 0;
// //         const hours = Math.floor(minutes / 60);
// //         const remainingMinutes = minutes % 60;
        
// //         return (
// //           <div>
// //             <div className="font-medium">
// //               {hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`}
// //             </div>
// //             <div className="text-xs text-gray-400">
// //               {record.sessions?.length || 0} sessions
// //             </div>
// //           </div>
// //         );
// //       },
// //     },
// //     {
// //       title: "Device",
// //       dataIndex: "deviceId",
// //       key: "deviceId",
// //       width: 150,
// //       render: (device) => (
// //         <Tooltip title={`Device: ${device}`}>
// //           <Tag icon={<MobileOutlined />} style={{ backgroundColor: PRIMARY_LIGHT, color: PRIMARY_COLOR }}>
// //             {device || "N/A"}
// //           </Tag>
// //         </Tooltip>
// //       ),
// //     },
// //     {
// //       title: "Actions",
// //       key: "actions",
// //       width: 100,
// //       fixed: "right",
// //       render: (_, record) => (
// //         <Button
// //           type="link"
// //           icon={<EyeOutlined />}
// //           onClick={() => viewDetails(record)}
// //           style={{ color: PRIMARY_COLOR }}
// //         >
// //           View
// //         </Button>
// //       ),
// //     },
// //   ];

// //   const handleRefresh = async () => {
// //     try {
// //       await refetch();
// //       message.success({
// //         content: "Attendance data refreshed successfully!",
// //         icon: <CheckCircleOutlined style={{ color: PRIMARY_COLOR }} />,
// //       });
// //     } catch (error) {
// //       message.error("Failed to refresh data. Please try again.");
// //     }
// //   };

// //   const resetFilters = () => {
// //     setSearchText("");
// //     setStatusFilter("all");
// //     setSourceFilter("all");
// //     setDateFilter("all");
// //   };

// //   // Export function
// //   const handleExport = () => {
// //     message.success("Exporting attendance data...");
// //     // Add your export logic here
// //   };

// //   return (
// //     <div className="p-6 bg-gray-50 min-h-screen">
// //       {/* Header Section with Gradient */}
// //       <Card 
// //         className="mb-6 shadow-sm"
// //         style={{ 
// //           background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY_COLOR} 100%)`,
// //           border: 'none'
// //         }}
// //       >
// //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-white">
// //           <div>
// //             <Title level={2} className="text-white m-0">
// //               <DashboardOutlined className="mr-2" />
// //               Attendance Dashboard
// //             </Title>
// //             <Text className="text-white opacity-80">
// //               Manage and monitor teacher attendance records
// //             </Text>
// //           </div>
// //           <Space className="mt-3 md:mt-0">
// //             <Button
// //               type="default"
// //               icon={<ReloadOutlined />}
// //               onClick={handleRefresh}
// //               loading={isLoading}
// //               style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}
// //             >
// //               Refresh
// //             </Button>
// //             <Button
// //               type="default"
// //               icon={<ExportOutlined />}
// //               onClick={handleExport}
// //               style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}
// //             >
// //               Export
// //             </Button>
// //           </Space>
// //         </div>
// //       </Card>

// //       {/* Statistics Cards */}
// //       <Row gutter={[16, 16]} className="mb-6">
// //         <Col xs={24} sm={12} lg={6}>
// //           <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
// //             <div className="flex justify-between items-start">
// //               <div>
// //                 <Text type="secondary" className="text-xs uppercase">Total Teachers</Text>
// //                 <div className="text-2xl font-bold mt-1">{stats.total}</div>
// //                 <div className="text-xs text-gray-400 mt-1">Overall attendance</div>
// //               </div>
// //               <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
// //                 <UserOutlined className="text-2xl" style={{ color: PRIMARY_COLOR }} />
// //               </div>
// //             </div>
// //           </Card>
// //         </Col>
// //         <Col xs={24} sm={12} lg={6}>
// //           <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
// //             <div className="flex justify-between items-start">
// //               <div>
// //                 <Text type="secondary" className="text-xs uppercase">Attendance Rate</Text>
// //                 <div className="text-2xl font-bold mt-1">{stats.attendanceRate}%</div>
// //                 <div className="text-xs text-gray-400 mt-1">
// //                   {stats.present} present out of {stats.total}
// //                 </div>
// //               </div>
// //               <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
// //                 <CheckCircleOutlined className="text-2xl text-green-500" />
// //               </div>
// //             </div>
// //             <Progress 
// //               percent={stats.attendanceRate} 
// //               strokeColor={PRIMARY_COLOR}
// //               showInfo={false}
// //               className="mt-2"
// //             />
// //           </Card>
// //         </Col>
// //         <Col xs={24} sm={12} lg={6}>
// //           <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
// //             <div className="flex justify-between items-start">
// //               <div>
// //                 <Text type="secondary" className="text-xs uppercase">Face Recognition</Text>
// //                 <div className="text-2xl font-bold mt-1">{stats.faceSource}</div>
// //                 <div className="text-xs text-gray-400 mt-1">
// //                   {((stats.faceSource / stats.total) * 100 || 0).toFixed(1)}% of total
// //                 </div>
// //               </div>
// //               <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
// //                 <CameraOutlined className="text-2xl text-green-500" />
// //               </div>
// //             </div>
// //           </Card>
// //         </Col>
// //         <Col xs={24} sm={12} lg={6}>
// //           <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
// //             <div className="flex justify-between items-start">
// //               <div>
// //                 <Text type="secondary" className="text-xs uppercase">Fingerprint</Text>
// //                 <div className="text-2xl font-bold mt-1">{stats.fingerprintSource}</div>
// //                 <div className="text-xs text-gray-400 mt-1">
// //                   {((stats.fingerprintSource / stats.total) * 100 || 0).toFixed(1)}% of total
// //                 </div>
// //               </div>
// //               <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
// //                 <FingerprintOutlined className="text-2xl text-purple-500" />
// //               </div>
// //             </div>
// //           </Card>
// //         </Col>
// //       </Row>

// //       {/* Filter Section */}
// //       <Card className="mb-6 shadow-sm">
// //         <div className="flex flex-wrap items-center gap-4">
// //           <div className="flex items-center gap-2">
// //             <FilterOutlined style={{ color: PRIMARY_COLOR }} />
// //             <Text strong className="mr-2">Filters:</Text>
// //           </div>
// //           <Input
// //             placeholder="Search by email, phone, device..."
// //             prefix={<SearchOutlined style={{ color: PRIMARY_COLOR }} />}
// //             value={searchText}
// //             onChange={(e) => setSearchText(e.target.value)}
// //             allowClear
// //             style={{ width: 250 }}
// //           />
// //           <Select
// //             placeholder="Status"
// //             value={statusFilter}
// //             onChange={setStatusFilter}
// //             style={{ width: 150 }}
// //           >
// //             <Option value="all">All Status</Option>
// //             <Option value="present">✅ Present</Option>
// //             <Option value="absent">❌ Absent</Option>
// //             <Option value="late">⚠️ Late</Option>
// //           </Select>
// //           <Select
// //             placeholder="Source"
// //             value={sourceFilter}
// //             onChange={setSourceFilter}
// //             style={{ width: 160 }}
// //           >
// //             <Option value="all">All Sources</Option>
// //             <Option value="face">📷 Face</Option>
// //             <Option value="fingerprint">🖐️ Fingerprint</Option>
// //             <Option value="manual">👤 Manual</Option>
// //           </Select>
// //           <Select
// //             placeholder="Date"
// //             value={dateFilter}
// //             onChange={setDateFilter}
// //             style={{ width: 130 }}
// //           >
// //             <Option value="all">📅 All Dates</Option>
// //             <Option value="today">Today</Option>
// //             <Option value="yesterday">Yesterday</Option>
// //           </Select>
// //           <Button onClick={resetFilters} type="link">
// //             Reset
// //           </Button>
// //           <div className="ml-auto flex items-center gap-2">
// //             <Badge status="success" text="Present" />
// //             <Badge status="error" text="Absent" />
// //             <Badge status="warning" text="Late" />
// //           </div>
// //         </div>
// //       </Card>

// //       {/* Table Section */}
// //       <Card className="shadow-sm">
// //         {isLoading ? (
// //           <div className="flex flex-col items-center justify-center py-20">
// //             <Spin size="large" />
// //             <Text type="secondary" className="mt-4">Loading attendance data...</Text>
// //           </div>
// //         ) : (
// //           <>
// //             <div className="flex justify-between items-center mb-4">
// //               <div className="flex items-center gap-2">
// //                 <Text type="secondary">
// //                   Showing <Text strong>{filteredData.length}</Text> of {attendanceData.length} records
// //                 </Text>
// //                 <Divider type="vertical" />
// //                 <Text type="secondary">
// //                   <ClockCircleOutlined className="mr-1" />
// //                   Last updated: {new Date().toLocaleTimeString()}
// //                 </Text>
// //               </div>
// //             </div>
// //             <Table
// //               rowKey="_id"
// //               columns={columns}
// //               dataSource={filteredData}
// //               pagination={{
// //                 pageSize: 10,
// //                 showSizeChanger: true,
// //                 showQuickJumper: true,
// //                 showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
// //               }}
// //               bordered
// //               scroll={{ x: 1400 }}
// //               className="attendance-table"
// //               rowClassName={(record) => 
// //                 record.status === 'present' ? 'table-row-present' : 
// //                 record.status === 'absent' ? 'table-row-absent' : 'table-row-late'
// //               }
// //               locale={{
// //                 emptyText: <Empty description="No attendance records found" />,
// //               }}
// //             />
// //           </>
// //         )}
// //       </Card>

// //       {/* Detail Modal */}
// //       <Modal
// //         title={
// //           <div className="flex items-center gap-2">
// //             <UserOutlined style={{ color: PRIMARY_COLOR }} />
// //             <Text strong>Attendance Details</Text>
// //           </div>
// //         }
// //         open={detailModalVisible}
// //         onCancel={() => setDetailModalVisible(false)}
// //         footer={[
// //           <Button key="close" onClick={() => setDetailModalVisible(false)}>
// //             Close
// //           </Button>,
// //         ]}
// //         width={700}
// //       >
// //         {selectedRecord && (
// //           <div>
// //             <div className="flex items-center gap-4 mb-6">
// //               <Avatar 
// //                 size={64} 
// //                 style={{ backgroundColor: PRIMARY_COLOR }}
// //                 icon={<UserOutlined />}
// //               />
// //               <div>
// //                 <Title level={4} className="m-0">{selectedRecord?.userId?.email?.split("@")[0]}</Title>
// //                 <Text type="secondary">{selectedRecord?.userId?.email}</Text>
// //                 <div className="text-sm">
// //                   📱 {selectedRecord?.userId?.phone}
// //                 </div>
// //               </div>
// //             </div>

// //             <Descriptions bordered column={2}>
// //               <Descriptions.Item label="Date">
// //                 <CalendarOutlined className="mr-1" style={{ color: PRIMARY_COLOR }} />
// //                 {selectedRecord.date}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Status">
// //                 <Badge
// //                   status={getStatusBadge(selectedRecord.status).color}
// //                   text={getStatusBadge(selectedRecord.status).text}
// //                 />
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Source">
// //                 <Tag color={getSourceColor(selectedRecord.source)}>
// //                   {getSourceIcon(selectedRecord.source)} {selectedRecord.source?.toUpperCase()}
// //                 </Tag>
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Device">
// //                 <Tag icon={<MobileOutlined />} style={{ backgroundColor: PRIMARY_LIGHT, color: PRIMARY_COLOR }}>
// //                   {selectedRecord.deviceId || "N/A"}
// //                 </Tag>
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Check In Time">
// //                 {selectedRecord.checkInTime || "-"}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Check Out Time">
// //                 {selectedRecord.checkOutTime || "Not Checked Out"}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Total Working Time">
// //                 <Text strong>
// //                   {selectedRecord.totalWorkingMinutes || 0} minutes
// //                 </Text>
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Total Sessions">
// //                 {selectedRecord.sessions?.length || 0}
// //               </Descriptions.Item>
// //             </Descriptions>

// //             {selectedRecord.sessions && selectedRecord.sessions.length > 0 && (
// //               <div className="mt-4">
// //                 <Text strong>Session History:</Text>
// //                 <Timeline className="mt-2">
// //                   {selectedRecord.sessions.map((session, index) => (
// //                     <Timeline.Item key={index}>
// //                       <div className="flex justify-between items-center">
// //                         <div>
// //                           <Text type="secondary">Session {index + 1}</Text>
// //                           <div className="text-sm">
// //                             In: {new Date(session.checkInTime).toLocaleTimeString()}
// //                           </div>
// //                           <div className="text-sm">
// //                             Out: {session.checkOutTime ? new Date(session.checkOutTime).toLocaleTimeString() : "Active"}
// //                           </div>
// //                         </div>
// //                         <Tag color={session.duration > 0 ? "green" : "orange"}>
// //                           {session.duration || 0} min
// //                         </Tag>
// //                       </div>
// //                     </Timeline.Item>
// //                   ))}
// //                 </Timeline>
// //               </div>
// //             )}

// //             {selectedRecord.remarks && (
// //               <div className="mt-4">
// //                 <Text strong>Remarks:</Text>
// //                 <Paragraph className="mt-1">{selectedRecord.remarks}</Paragraph>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </Modal>

// //       <style jsx>{`
// //         .attendance-table :global(.ant-table) {
// //           border-radius: 8px;
// //         }
// //         .attendance-table :global(.ant-table-thead > tr > th) {
// //           background: #fafafa;
// //           font-weight: 600;
// //           color: #333;
// //         }
// //         .attendance-table :global(.ant-table-tbody > tr:hover) {
// //           background: #f5f5f5;
// //         }
// //         .table-row-present :global(td) {
// //           border-left: 3px solid #52c41a;
// //         }
// //         .table-row-absent :global(td) {
// //           border-left: 3px solid #ff4d4f;
// //         }
// //         .table-row-late :global(td) {
// //           border-left: 3px solid #faad14;
// //         }
// //         .attendance-table :global(.ant-table-row) {
// //           transition: all 0.3s;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default AttendancePage;


// import React, { useState, useMemo } from "react";
// import {
//   Table,
//   Tag,
//   Card,
//   Typography,
//   Spin,
//   Input,
//   Select,
//   Space,
//   Button,
//   Statistic,
//   Row,
//   Col,
//   Badge,
//   Divider,
//   Tooltip,
//   message,
// } from "antd";
// import {
//   ReloadOutlined,
//   SearchOutlined,
//   UserOutlined,
//   ClockCircleOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   MobileOutlined,
//   IdcardOutlined,
//   CameraOutlined,
//   IdcardOutlined as FingerprintOutlined,
// } from "@ant-design/icons";
// import type { ColumnsType } from "antd/es/table";

// const { Title, Text } = Typography;
// const { Option } = Select;
// import { useGetAllAttendanceQuery } from "@/redux/api/attendanceApi.js";

// const AttendancePage = () => {
//   const { data, isLoading, refetch } = useGetAllAttendanceQuery();
//   const [searchText, setSearchText] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [sourceFilter, setSourceFilter] = useState("all");
//   const [dateFilter, setDateFilter] = useState("all");

//   const attendanceData = data?.data?.data || [];

//   // Enhanced filtering and search functionality
//   const filteredData = useMemo(() => {
//     let filtered = attendanceData;

//     // Status filter
//     if (statusFilter !== "all") {
//       filtered = filtered.filter((item) => item.status === statusFilter);
//     }

//     // Source filter
//     if (sourceFilter !== "all") {
//       filtered = filtered.filter((item) => item.source === sourceFilter);
//     }

//     // Date filter
//     if (dateFilter !== "all") {
//       const today = new Date().toISOString().split("T")[0];
//       const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      
//       if (dateFilter === "today") {
//         filtered = filtered.filter((item) => item.date === today);
//       } else if (dateFilter === "yesterday") {
//         filtered = filtered.filter((item) => item.date === yesterday);
//       }
//     }

//     // Search by email, phone, device, or remarks
//     if (searchText) {
//       const searchLower = searchText.toLowerCase();
//       filtered = filtered.filter(
//         (item) =>
//           item?.userId?.email?.toLowerCase().includes(searchLower) ||
//           item?.userId?.phone?.toLowerCase().includes(searchLower) ||
//           item?.deviceId?.toLowerCase().includes(searchLower) ||
//           item?.remarks?.toLowerCase().includes(searchLower)
//       );
//     }

//     return filtered;
//   }, [attendanceData, searchText, statusFilter, sourceFilter, dateFilter]);

//   // Statistics calculation
//   const stats = useMemo(() => {
//     const total = attendanceData.length;
//     const present = attendanceData.filter((item) => item.status === "present").length;
//     const absent = attendanceData.filter((item) => item.status === "absent").length;
//     const faceSource = attendanceData.filter((item) => item.source === "face").length;
//     const fingerprintSource = attendanceData.filter((item) => item.source === "fingerprint").length;
//     const manualSource = attendanceData.filter((item) => item.source === "manual").length;
//     const totalMinutes = attendanceData.reduce((sum, item) => sum + (item.totalWorkingMinutes || 0), 0);

//     return {
//       total,
//       present,
//       absent,
//       faceSource,
//       fingerprintSource,
//       manualSource,
//       totalMinutes,
//       attendanceRate: total > 0 ? ((present / total) * 100).toFixed(1) : 0,
//     };
//   }, [attendanceData]);

//   // Get source icon
//   const getSourceIcon = (source) => {
//     switch (source) {
//       case "face":
//         return <CameraOutlined />;
//       case "fingerprint":
//         return <FingerprintOutlined />;
//       case "manual":
//         return <UserOutlined />;
//       default:
//         return <MobileOutlined />;
//     }
//   };

//   // Get source color
//   const getSourceColor = (source) => {
//     switch (source) {
//       case "face":
//         return "green";
//       case "fingerprint":
//         return "purple";
//       case "manual":
//         return "orange";
//       default:
//         return "blue";
//     }
//   };

//   // Columns configuration with enhanced display
//   const columns: ColumnsType<any> = [
//     {
//       title: "Teacher Information",
//       key: "teacher",
//       fixed: "left",
//       width: 220,
//       render: (_, record) => (
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
//             <UserOutlined className="text-blue-600 text-lg" />
//           </div>
//           <div>
//             <p className="font-semibold text-sm m-0">
//               {record?.userId?.email?.split("@")[0] || "N/A"}
//             </p>
//             <p className="text-gray-500 text-xs m-0">
//               {record?.userId?.email || "N/A"}
//             </p>
//             <p className="text-gray-400 text-xs m-0">
//               📱 {record?.userId?.phone || "N/A"}
//             </p>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Date & Time",
//       key: "dateTime",
//       width: 180,
//       render: (_, record) => (
//         <div>
//           <div className="font-medium">{record.date}</div>
//           <div className="text-xs text-gray-500">
//             <ClockCircleOutlined className="mr-1" />
//             {record.checkInTime?.split(",")[1]?.trim() || "N/A"}
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       width: 120,
//       render: (status) => (
//         <Badge
//           status={status === "present" ? "success" : "error"}
//           text={
//             <span className="font-medium">
//               {status?.toUpperCase()}
//             </span>
//           }
//         />
//       ),
//     },
//     {
//       title: "Source",
//       dataIndex: "source",
//       key: "source",
//       width: 130,
//       render: (source) => (
//         <Tag color={getSourceColor(source)} className="px-3 py-1">
//           {getSourceIcon(source)} {source?.toUpperCase()}
//         </Tag>
//       ),
//     },
//     {
//       title: "Check In",
//       dataIndex: "checkInTime",
//       key: "checkInTime",
//       width: 160,
//       render: (time) => (
//         <div>
//           <div className="text-sm">{time || "-"}</div>
//           <div className="text-xs text-gray-400">🟢 In</div>
//         </div>
//       ),
//     },
//     {
//       title: "Check Out",
//       dataIndex: "checkOutTime",
//       key: "checkOutTime",
//       width: 160,
//       render: (time) => (
//         <div>
//           <div className="text-sm">{time || "-"}</div>
//           <div className="text-xs text-gray-400">🔴 Out</div>
//         </div>
//       ),
//     },
//     {
//       title: "Working Minutes",
//       key: "workingMinutes",
//       width: 130,
//       render: (_, record) => (
//         <div>
//           <div className="font-medium">{record.totalWorkingMinutes || 0} min</div>
//           <div className="text-xs text-gray-400">
//             {record.sessions?.length || 0} sessions
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Device",
//       dataIndex: "deviceId",
//       key: "deviceId",
//       width: 140,
//       render: (device) => (
//         <Tooltip title={`Device: ${device}`}>
//           <Tag icon={<MobileOutlined />} color="blue">
//             {device || "-"}
//           </Tag>
//         </Tooltip>
//       ),
//     },
//     {
//       title: "Remarks",
//       dataIndex: "remarks",
//       key: "remarks",
//       width: 120,
//       render: (text) => (
//         <Text type="secondary" ellipsis={{ tooltip: text }}>
//           {text || "-"}
//         </Text>
//       ),
//     },
//   ];

//   // Handle refresh
//   const handleRefresh = async () => {
//     try {
//       await refetch();
//       message.success("Attendance data refreshed successfully!");
//     } catch (error) {
//       message.error("Failed to refresh data. Please try again.");
//     }
//   };

//   // Reset all filters
//   const resetFilters = () => {
//     setSearchText("");
//     setStatusFilter("all");
//     setSourceFilter("all");
//     setDateFilter("all");
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header Section */}
//       <Card className="mb-6 shadow-sm">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//           <div>
//             <Title level={3} className="m-0">
//               📊 Attendance Management
//             </Title>
//             <Text type="secondary">
//               Teacher attendance from Hikvision device and manual entry
//             </Text>
//           </div>
//           <Space className="mt-3 md:mt-0">
//             <Button
//               type="primary"
//               icon={<ReloadOutlined />}
//               onClick={handleRefresh}
//               loading={isLoading}
//             >
//               Refresh Data
//             </Button>
//           </Space>
//         </div>
//       </Card>

//       {/* Statistics Cards */}
//       <Row gutter={[16, 16]} className="mb-6">
//         <Col xs={24} sm={12} md={6}>
//           <Card className="shadow-sm">
//             <Statistic
//               title="Total Teachers"
//               value={stats.total}
//               prefix={<UserOutlined className="text-blue-500" />}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={6}>
//           <Card className="shadow-sm">
//             <Statistic
//               title="Present Today"
//               value={stats.present}
//               prefix={<CheckCircleOutlined className="text-green-500" />}
//               suffix={`/ ${stats.total}`}
//             />
//             <div className="mt-2">
//               <Badge status="success" text={`${stats.attendanceRate}% Attendance`} />
//             </div>
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={6}>
//           <Card className="shadow-sm">
//             <Statistic
//               title="Face Recognition"
//               value={stats.faceSource}
//               prefix={<CameraOutlined className="text-green-500" />}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={6}>
//           <Card className="shadow-sm">
//             <Statistic
//               title="Fingerprint"
//               value={stats.fingerprintSource}
//               prefix={<FingerprintOutlined className="text-purple-500" />}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* Filter Section */}
//       <Card className="mb-6 shadow-sm">
//         <Row gutter={[16, 16]} align="middle">
//           <Col xs={24} md={8}>
//             <Input
//               placeholder="Search by email, phone, device..."
//               prefix={<SearchOutlined />}
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               allowClear
//               size="large"
//             />
//           </Col>
//           <Col xs={12} md={4}>
//             <Select
//               placeholder="Status"
//               value={statusFilter}
//               onChange={setStatusFilter}
//               style={{ width: "100%" }}
//               size="large"
//             >
//               <Option value="all">All Status</Option>
//               <Option value="present">Present</Option>
//               <Option value="absent">Absent</Option>
//               <Option value="late">Late</Option>
//             </Select>
//           </Col>
//           <Col xs={12} md={4}>
//             <Select
//               placeholder="Source"
//               value={sourceFilter}
//               onChange={setSourceFilter}
//               style={{ width: "100%" }}
//               size="large"
//             >
//               <Option value="all">All Sources</Option>
//               <Option value="face">📷 Face</Option>
//               <Option value="fingerprint">🖐️ Fingerprint</Option>
//               <Option value="manual">👤 Manual</Option>
//             </Select>
//           </Col>
//           <Col xs={12} md={4}>
//             <Select
//               placeholder="Date"
//               value={dateFilter}
//               onChange={setDateFilter}
//               style={{ width: "100%" }}
//               size="large"
//             >
//               <Option value="all">All Dates</Option>
//               <Option value="today">Today</Option>
//               <Option value="yesterday">Yesterday</Option>
//             </Select>
//           </Col>
//           <Col xs={12} md={4}>
//             <Button
//               onClick={resetFilters}
//               style={{ width: "100%" }}
//               size="large"
//             >
//               Reset Filters
//             </Button>
//           </Col>
//         </Row>
//       </Card>

//       {/* Table Section */}
//       <Card className="shadow-sm">
//         {isLoading ? (
//           <div className="flex justify-center py-20">
//             <Spin size="large" tip="Loading attendance data..." />
//           </div>
//         ) : (
//           <>
//             <div className="flex justify-between items-center mb-4">
//               <Text type="secondary">
//                 Showing {filteredData.length} of {attendanceData.length} records
//               </Text>
//               <div className="flex items-center gap-2">
//                 <Badge status="success" text="Present" />
//                 <Badge status="error" text="Absent" />
//               </div>
//             </div>
//             <Table
//               rowKey="_id"
//               columns={columns}
//               dataSource={filteredData}
//               pagination={{
//                 pageSize: 10,
//                 showSizeChanger: true,
//                 showQuickJumper: true,
//                 showTotal: (total) => `Total ${total} items`,
//               }}
//               bordered
//               scroll={{ x: 1400 }}
//               className="attendance-table"
//             />
//           </>
//         )}
//       </Card>

//       <style jsx>{`
//         .attendance-table :global(.ant-table) {
//           border-radius: 8px;
//         }
//         .attendance-table :global(.ant-table-thead > tr > th) {
//           background: #fafafa;
//           font-weight: 600;
//         }
//         .attendance-table :global(.ant-table-tbody > tr:hover) {
//           background: #f5f5f5;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AttendancePage;