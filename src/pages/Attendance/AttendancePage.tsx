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
  DesktopOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useGetAllAttendanceQuery } from "@/redux/api/attendanceApi.js";

dayjs.extend(utc);
dayjs.extend(timezone);

// Backend device data comes as raw UTC ISO strings (sessions[].checkInTime),
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
  // "source" এখন শুধু device/manual/mobile বোঝায়
  const [sourceFilter, setSourceFilter] = useState("all");
  // "method" আলাদা করে face/card/fingerprint বোঝায় (sessions[].checkInMethod থেকে)
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [customRange, setCustomRange] = useState<[Dayjs, Dayjs] | null>(null);

  const attendanceData = data?.data?.data || [];

  // প্রতিটা record এর "primary method" বের করার helper
  // (সেই দিনের সর্বশেষ session এর checkInMethod, না থাকলে unknown)
  const getRecordMethod = (record: any) => {
    const sessions = record.sessions || [];
    const lastSession = sessions[sessions.length - 1];
    return lastSession?.checkInMethod || "unknown";
  };

  // Enhanced filtering and search functionality
  const filteredData = useMemo(() => {
    let filtered = attendanceData;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Source filter (device / manual / mobile)
    if (sourceFilter !== "all") {
      filtered = filtered.filter((item) => item.source === sourceFilter);
    }

    // Method filter (face / fingerprint / card)
    if (methodFilter !== "all") {
      filtered = filtered.filter(
        (item) => getRecordMethod(item) === methodFilter
      );
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
  }, [attendanceData, searchText, statusFilter, sourceFilter, methodFilter, dateFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = attendanceData.length;
    const present = attendanceData.filter((item) => item.status === "present").length;
    const absent = attendanceData.filter((item) => item.status === "absent").length;

    // method এখন item.methodCounts থেকে অথবা প্রতিটা record এর primary method থেকে গোনা হচ্ছে
    const faceMethod = attendanceData.filter(
      (item) => getRecordMethod(item) === "face"
    ).length;
    const fingerprintMethod = attendanceData.filter(
      (item) => getRecordMethod(item) === "fingerprint"
    ).length;
    const cardMethod = attendanceData.filter(
      (item) => getRecordMethod(item) === "card"
    ).length;

    const deviceSource = attendanceData.filter((item) => item.source === "device").length;
    const manualSource = attendanceData.filter((item) => item.source === "manual").length;
    const totalMinutes = attendanceData.reduce((sum, item) => sum + (item.totalWorkingMinutes || 0), 0);

    return {
      total,
      present,
      absent,
      faceMethod,
      fingerprintMethod,
      cardMethod,
      deviceSource,
      manualSource,
      totalMinutes,
      attendanceRate: total > 0 ? ((present / total) * 100).toFixed(1) : 0,
    };
  }, [attendanceData]);

  // Get method icon (face/fingerprint/card)
  const getMethodIcon = (method?: string) => {
    switch (method) {
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

  // Get method color
  const getMethodColor = (method?: string) => {
    switch (method) {
      case "face":
        return "green";
      case "fingerprint":
        return "purple";
      case "card":
        return "geekblue";
      case "manual":
        return "orange";
      default:
        return "default";
    }
  };

  // Get source icon (device/manual/mobile)
  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "device":
        return <DesktopOutlined />;
      case "manual":
        return <UserOutlined />;
      case "mobile":
        return <MobileOutlined />;
      default:
        return <MobileOutlined />;
    }
  };

  const getSourceColor = (source?: string) => {
    switch (source) {
      case "device":
        return "blue";
      case "manual":
        return "orange";
      case "mobile":
        return "cyan";
      default:
        return "default";
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
      "Method",
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
      getRecordMethod(item),
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
    const name = record?.userId?.name;
    const email = record?.userId?.userId?.email;
    const photoUrl = record?.userId?.thumbnail;

    return (
      <div className="flex items-center gap-3">
        {photoUrl ? (
          <Avatar size={40} src={photoUrl} />
        ) : (
          <Avatar
            size={40}
            style={{
              backgroundColor: getAvatarColor(name || email),
              fontWeight: 600,
            }}
          >
            {getInitials(name || email)}
          </Avatar>
        )}
        <div>
          <p className="font-semibold text-sm m-0">
            {name || email?.split("@")[0] || "N/A"}
          </p>
          {/* <p className="text-gray-500 text-xs m-0">{email || "N/A"}</p> */}
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
          status={status === "present" ? "success" : status === "late" ? "warning" : "error"}
          text={<span className="font-medium">{status?.toUpperCase()}</span>}
        />
      ),
    },
    {
      // এটা এখন শুধু device/manual/mobile দেখাবে
      title: "Source",
      dataIndex: "source",
      key: "source",
      width: 120,
      render: (source) => (
        <Tag color={getSourceColor(source)} className="px-3 py-1">
          {getSourceIcon(source)} {source?.toUpperCase()}
        </Tag>
      ),
    },
    {
      // নতুন column - face/fingerprint/card দেখাবে
      title: "Method",
      key: "method",
      width: 140,
      render: (_, record) => {
        const method = getRecordMethod(record);
        return (
          <Tag color={getMethodColor(method)} className="px-3 py-1">
            {getMethodIcon(method)} {method?.toUpperCase()}
          </Tag>
        );
      },
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
                  {s.checkInMethod ? ` [${s.checkInMethod}]` : ""}
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
    setMethodFilter("all");
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
              value={stats.faceMethod}
              prefix={<CameraOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Fingerprint"
              value={stats.fingerprintMethod}
              prefix={<FingerprintOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filter Section */}
      <Card className="mb-6 shadow-sm">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
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
              <Option value="late">Late</Option>
              <Option value="half-day">Half Day</Option>
              <Option value="absent">Absent</Option>
              <Option value="leave">Leave</Option>
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
              <Option value="device">🖥️ Device</Option>
              <Option value="manual">👤 Manual</Option>
              <Option value="mobile">📱 Mobile</Option>
            </Select>
          </Col>
          <Col xs={12} md={4}>
            <Select
              placeholder="Method"
              value={methodFilter}
              onChange={setMethodFilter}
              style={{ width: "100%" }}
              size="large"
            >
              <Option value="all">All Methods</Option>
              <Option value="face">📷 Face</Option>
              <Option value="fingerprint">🖐️ Fingerprint</Option>
              <Option value="card">💳 Card</Option>
              <Option value="manual">👤 Manual</Option>
            </Select>
          </Col>
          <Col xs={12} md={3}>
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
          <Col xs={12} md={3}>
            <Button onClick={resetFilters} style={{ width: "100%" }} size="large">
              Reset
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
              scroll={{ x: 1750 }}
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