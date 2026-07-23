
import React, { useState, useEffect } from "react";
import { useMyInfoQuery } from "../../redux/api/userApi";
import { useUpdateTeacherMutation } from "../../redux/api/teacherApi";
import {
  Form, Input, Button, Upload, message, Tabs, Select, DatePicker,
  InputNumber, Card, Tag, Divider, Modal, Popconfirm, Space,
  Descriptions, Avatar, Skeleton
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  HeartOutlined,
  CalendarOutlined,
  BookOutlined,
  BankOutlined,
  GlobalOutlined,
  IdcardOutlined,
  TrophyOutlined,
  TeamOutlined,
  DollarOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

// ── Improved FormData Converter ─────────────────────────────────────────────
// const convertToFormData = (data) => {
//   const formData = new FormData();

//   const appendValue = (key, value) => {
//     if (value === undefined || value === null || value === "") return;

//     // File
//     if (value instanceof File) {
//       formData.append(key, value);
//       return;
//     }

//     // AntD Upload fileList
//     if (Array.isArray(value) && value[0]?.originFileObj instanceof File) {
//       formData.append(key, value[0].originFileObj);
//       return;
//     }

//     // dayjs / Date
//     if (value?.$isDayjsObject || typeof value?.toDate === "function") {
//       formData.append(key, value.toDate().toISOString());
//       return;
//     }
//     if (value instanceof Date) {
//       formData.append(key, value.toISOString());
//       return;
//     }

//     // Nested Objects → Flatten (salary, emergencyContact)
//     if (typeof value === "object" && !Array.isArray(value)) {
//       Object.entries(value).forEach(([subKey, subValue]) => {
//         if (subValue !== undefined && subValue !== null && subValue !== "") {
//           formData.append(`${key}.${subKey}`, subValue);
//         }
//       });
//       return;
//     }

//     // Arrays
//     if (Array.isArray(value)) {
//       formData.append(key, JSON.stringify(value));
//       return;
//     }

//     // Plain value
//     formData.append(key, String(value));
//   };

//   Object.entries(data).forEach(([key, value]) => appendValue(key, value));
//   return formData;
// };
  // const convertToFormData = (data: Record<string, any>) => {
  //   const formData = new FormData();

  //   Object.entries(data).forEach(([key, value]) => {
  //     if (!value && value !== 0) return;

  //     // Upload File
  //     if (value?.originFileObj instanceof File) {
  //       formData.append(key, value.originFileObj);
  //     } else if (value instanceof File) {
  //       formData.append(key, value);
  //     }

  //     // Date
  //     else if (value instanceof Date) {
  //       formData.append(key, value.toISOString());
  //     }

  //     // Object
  //     else if (typeof value === "object" && value !== null) {
  //       formData.append(key, JSON.stringify(value));
  //     }

  //     // Primitive
  //     else {
  //       formData.append(key, String(value));
  //     }
  //   });

  //   return formData;
  // };
  const convertToFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (typeof value !== "number" && !value) return; // 0 allow korar jonno

    // AntD Upload fileList
    if (Array.isArray(value) && value[0]?.originFileObj instanceof File) {
      formData.append(key, value[0].originFileObj);
      return;
    }

    // Direct File
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    // dayjs / Date
    if (value?.$isDayjsObject || typeof value?.toDate === "function") {
      formData.append(key, value.toDate().toISOString());
      return;
    }
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
      return;
    }

    // Object (salary, emergencyContact) or Array (social, education, bankAccounts)
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    // Primitive
    formData.append(key, String(value));
  });

  return formData;
};
// Color mapping for education
const colorMap = {
  blue: { border: "border-blue-500", dotColor: "bg-blue-500" },
  indigo: { border: "border-indigo-500", dotColor: "bg-indigo-500" },
  purple: { border: "border-purple-500", dotColor: "bg-purple-500" },
  pink: { border: "border-pink-500", dotColor: "bg-pink-500" },
  green: { border: "border-green-500", dotColor: "bg-green-500" },
  orange: { border: "border-orange-500", dotColor: "bg-orange-500" },
  teal: { border: "border-teal-500", dotColor: "bg-teal-500" },
};
const colorCycle = ["blue", "indigo", "purple", "pink", "green", "orange", "teal"];

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const TeacherProfile = () => {
  const { data, isLoading, isError, refetch } = useMyInfoQuery();
  const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [educationList, setEducationList] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [socialList, setSocialList] = useState([]);

  const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [educationForm] = Form.useForm();

  const [isBankModalVisible, setIsBankModalVisible] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [bankForm] = Form.useForm();

  const [isSocialModalVisible, setIsSocialModalVisible] = useState(false);
  const [editingSocial, setEditingSocial] = useState(null);
  const [socialForm] = Form.useForm();

  const buildFormValues = (teacher) => ({
    name: teacher.name,
    designation: teacher.designation,
    qualification: teacher.qualification,
    phone: teacher.phone,
    alternativePhone: teacher.alternativePhone || "",
    presentAddress: teacher.presentAddress || "",
    permanentAddress: teacher.permanentAddress || "",
    bloodGroup: teacher.bloodGroup || undefined,
    gender: teacher.gender || undefined,
    religion: teacher.religion || "",
    maritalStatus: teacher.maritalStatus || undefined,
    dateOfBirth: teacher.dateOfBirth ? dayjs(teacher.dateOfBirth) : null,
    joinDate: teacher.joinDate ? dayjs(teacher.joinDate) : null,
    schoolJoinDate: teacher.schoolJoinDate ? dayjs(teacher.schoolJoinDate) : null,
    teachingExperience: teacher.teachingExperience || 0,
    department: teacher.department || "",
    subject: teacher.subject || "",
    bio: teacher.bio || "",
    teacherId: teacher.teacherId,
    nid: teacher.nid || "",
    birthCertificateNo: teacher.birthCertificateNo || "",
    indexNumber: teacher.indexNumber || "",
    governmentSalary: teacher.salary?.governmentSalary || 0,
    schoolSalary: teacher.salary?.schoolSalary || 0,
    emergencyContactName: teacher.emergencyContact?.name || "",
    emergencyContactRelation: teacher.emergencyContact?.relation || "",
    emergencyContactPhone: teacher.emergencyContact?.phone || "",
  });

  useEffect(() => {
    if (!data?.data?.profile) return;
    const teacher = data.data.profile;

    form.setFieldsValue(buildFormValues(teacher));
    setThumbnailPreview(teacher.thumbnail || null);
    setThumbnailFile(null);

    setEducationList((teacher.education || []).map((edu, idx) => ({
      ...edu,
      id: idx.toString(),
      color: colorCycle[idx % colorCycle.length],
    })));
    setBankList((teacher.bankAccounts || []).map((bank, idx) => ({ ...bank, id: idx.toString() })));
    setSocialList((teacher.social || []).map((social, idx) => ({ ...social, id: idx.toString() })));
  }, [data, form]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <Card className="rounded-2xl">
          <Skeleton active avatar paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }

  if (isError || !data?.data?.profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-500 text-lg">Profile load করতে সমস্যা হয়েছে।</p>
        </div>
      </div>
    );
  }

  const teacher = data.data.profile;

  const handleEditToggle = () => {
    if (isEditing) {
      form.submit();
    } else {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.setFieldsValue(buildFormValues(teacher));
    setThumbnailFile(null);
    setThumbnailPreview(teacher.thumbnail || null);
  };

  const handleThumbnailSelect = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Only image file upload করতে পারবেন।");
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image size 5MB এর নিচে হতে হবে।");
      return Upload.LIST_IGNORE;
    }
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    return false;
  };

  const handleFormSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        designation: values.designation,
        qualification: values.qualification,
        phone: values.phone,
        alternativePhone: values.alternativePhone,
        presentAddress: values.presentAddress,
        permanentAddress: values.permanentAddress,
        bloodGroup: values.bloodGroup,
        gender: values.gender,
        religion: values.religion,
        maritalStatus: values.maritalStatus,
        teachingExperience: values.teachingExperience,
        department: values.department,
        subject: values.subject,
        bio: values.bio,
        nid: values.nid,
        birthCertificateNo: values.birthCertificateNo,
        indexNumber: values.indexNumber,
        dateOfBirth: values.dateOfBirth,
        joinDate: values.joinDate,
        schoolJoinDate: values.schoolJoinDate,

        salary: {
          governmentSalary: Number(values.governmentSalary) || 0,
          schoolSalary: Number(values.schoolSalary) || 0,
        },
        emergencyContact: {
          name: values.emergencyContactName || "",
          relation: values.emergencyContactRelation || "",
          phone: values.emergencyContactPhone || "",
        },

        education: educationList.map(({ id, color, ...rest }) => rest),
        bankAccounts: bankList.map(({ id, ...rest }) => rest),
        social: socialList.map(({ id, ...rest }) => rest),
      };

      if (thumbnailFile) {
        payload.thumbnail = thumbnailFile;
      }

      const formData = convertToFormData(payload);

      await updateTeacher({ id: teacher._id, data: formData }).unwrap();

      message.success("Profile updated successfully!");
      setIsEditing(false);
      setThumbnailFile(null);
      refetch();
    } catch (error) {
      message.error(error?.data?.message || "Failed to update profile");
    }
  };

  // Education CRUD
  const handleAddEducation = () => {
    setEditingEducation(null);
    educationForm.resetFields();
    setIsEducationModalVisible(true);
  };
  const handleEditEducation = (edu) => {
    setEditingEducation(edu);
    educationForm.setFieldsValue(edu);
    setIsEducationModalVisible(true);
  };
  const handleDeleteEducation = (id) => {
    setEducationList(educationList.filter((edu) => edu.id !== id));
    message.success("Education removed");
  };
  const handleEducationSubmit = (values) => {
    const newEdu = {
      ...values,
      id: editingEducation?.id || Date.now().toString(),
      color: editingEducation?.color || colorCycle[educationList.length % colorCycle.length],
    };
    if (editingEducation) {
      setEducationList(educationList.map((edu) => (edu.id === editingEducation.id ? newEdu : edu)));
      message.success("Education updated");
    } else {
      setEducationList([...educationList, newEdu]);
      message.success("Education added");
    }
    setIsEducationModalVisible(false);
    educationForm.resetFields();
  };

  // Bank CRUD
  const handleAddBank = () => {
    setEditingBank(null);
    bankForm.resetFields();
    setIsBankModalVisible(true);
  };
  const handleEditBank = (bank) => {
    setEditingBank(bank);
    bankForm.setFieldsValue(bank);
    setIsBankModalVisible(true);
  };
  const handleDeleteBank = (id) => {
    setBankList(bankList.filter((bank) => bank.id !== id));
    message.success("Bank account removed");
  };
  const handleBankSubmit = (values) => {
    const newBank = { ...values, id: editingBank?.id || Date.now().toString() };
    if (editingBank) {
      setBankList(bankList.map((bank) => (bank.id === editingBank.id ? newBank : bank)));
      message.success("Bank account updated");
    } else {
      setBankList([...bankList, newBank]);
      message.success("Bank account added");
    }
    setIsBankModalVisible(false);
    bankForm.resetFields();
  };

  // Social CRUD
  const handleAddSocial = () => {
    setEditingSocial(null);
    socialForm.resetFields();
    setIsSocialModalVisible(true);
  };
  const handleEditSocial = (social) => {
    setEditingSocial(social);
    socialForm.setFieldsValue(social);
    setIsSocialModalVisible(true);
  };
  const handleDeleteSocial = (id) => {
    setSocialList(socialList.filter((social) => social.id !== id));
    message.success("Social link removed");
  };
  const handleSocialSubmit = (values) => {
    const newSocial = { ...values, id: editingSocial?.id || Date.now().toString() };
    if (editingSocial) {
      setSocialList(socialList.map((social) => (social.id === editingSocial.id ? newSocial : social)));
      message.success("Social link updated");
    } else {
      setSocialList([...socialList, newSocial]);
      message.success("Social link added");
    }
    setIsSocialModalVisible(false);
    socialForm.resetFields();
  };

  const renderEducationTimeline = () => {
    if (educationList.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <BookOutlined className="text-4xl mb-2" />
          <p>No education added yet</p>
        </div>
      );
    }
    return (
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
        {educationList.map((edu, index) => {
          const c = colorMap[edu.color] || colorMap.blue;
          return (
            <div key={edu.id} className="relative pl-10 pb-8 last:pb-0 group">
              <div className={`absolute left-1 top-1.5 w-6 h-6 rounded-full ${c.dotColor} border-2 border-white shadow-md flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              <div className={`bg-white rounded-xl p-4 border-l-4 ${c.border} shadow-sm hover:shadow-md transition-all`}>
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-800">{edu.label}</h3>
                      <Tag color={edu.color}>{edu.year}</Tag>
                    </div>
                    <p className="text-gray-600">{edu.institute}</p>
                    {edu.grade && (
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Grade:</span> {edu.grade}
                      </p>
                    )}
                  </div>
                  {isEditing && (
                    <div className="flex gap-1">
                      <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditEducation(edu)} className="text-blue-500" />
                      <Popconfirm title="Delete education?" onConfirm={() => handleDeleteEducation(edu.id)} okText="Yes" cancelText="No">
                        <Button type="text" size="small" icon={<DeleteOutlined />} className="text-red-500" />
                      </Popconfirm>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const InfoCard = ({ icon, label, value, color = "blue" }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`text-${color}-500 text-xl mt-0.5`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-gray-800 font-medium truncate">{value || "N/A"}</p>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <InfoCard icon={<IdcardOutlined />} label="Teacher ID" value={teacher.teacherId} color="blue" />
      <InfoCard icon={<UserOutlined />} label="Designation" value={teacher.designation} color="purple" />
      <InfoCard icon={<TrophyOutlined />} label="Qualification" value={teacher.qualification} color="green" />
      <InfoCard icon={<HeartOutlined />} label="Blood Group" value={teacher.bloodGroup} color="red" />
      <InfoCard icon={<CalendarOutlined />} label="Date of Birth" value={formatDate(teacher.dateOfBirth)} color="orange" />
      <InfoCard icon={<TeamOutlined />} label="Experience" value={`${teacher.teachingExperience || 0} Years`} color="indigo" />
      <InfoCard icon={<CalendarOutlined />} label="Join Date" value={formatDate(teacher.joinDate)} color="teal" />
      <InfoCard icon={<DollarOutlined />} label="Total Salary" value={`${(teacher.salary?.governmentSalary || 0) + (teacher.salary?.schoolSalary || 0)} BDT`} color="green" />
      <InfoCard icon={<HomeOutlined />} label="Present Address" value={teacher.presentAddress} color="gray" />
    </div>
  );

  const PersonalInfoView = () => (
    <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
      <Descriptions.Item label="Teacher ID">{teacher.teacherId || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Full Name">{teacher.name || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Designation">{teacher.designation || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Qualification">{teacher.qualification || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Department">{teacher.department || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Subject">{teacher.subject || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Gender">{teacher.gender || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Religion">{teacher.religion || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Marital Status">{teacher.maritalStatus || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Date of Birth">{formatDate(teacher.dateOfBirth)}</Descriptions.Item>
      <Descriptions.Item label="Blood Group">{teacher.bloodGroup || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="NID Number">{teacher.nid || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Birth Certificate No">{teacher.birthCertificateNo || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Index Number">{teacher.indexNumber || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Bio" span={2}>{teacher.bio || "N/A"}</Descriptions.Item>
    </Descriptions>
  );

  const PersonalInfoForm = () => (
    <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Form.Item name="teacherId" label="Teacher ID">
          <Input prefix={<IdcardOutlined />} disabled />
        </Form.Item>
        <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
          <Input prefix={<TrophyOutlined />} />
        </Form.Item>
        <Form.Item name="qualification" label="Qualification">
          <Input />
        </Form.Item>
        <Form.Item name="department" label="Department">
          <Input />
        </Form.Item>
        <Form.Item name="subject" label="Subject">
          <Input />
        </Form.Item>
        <Form.Item name="gender" label="Gender">
          <Select allowClear>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item name="religion" label="Religion">
          <Input />
        </Form.Item>
        <Form.Item name="maritalStatus" label="Marital Status">
          <Select allowClear>
            <Option value="Single">Single</Option>
            <Option value="Married">Married</Option>
            <Option value="Divorced">Divorced</Option>
            <Option value="Widowed">Widowed</Option>
          </Select>
        </Form.Item>
        <Form.Item name="dateOfBirth" label="Date of Birth">
          <DatePicker className="w-full" format="DD-MM-YYYY" />
        </Form.Item>
        <Form.Item name="bloodGroup" label="Blood Group">
          <Select allowClear>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <Option key={bg} value={bg}>{bg}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="nid" label="NID Number">
          <Input />
        </Form.Item>
        <Form.Item name="birthCertificateNo" label="Birth Certificate No">
          <Input />
        </Form.Item>
        <Form.Item name="indexNumber" label="Index Number">
          <Input />
        </Form.Item>
      </div>
      <Form.Item name="bio" label="Bio">
        <TextArea rows={3} />
      </Form.Item>
    </Form>
  );

  const ContactView = () => (
    <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
      <Descriptions.Item label="Phone">{teacher.phone || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Alternative Phone">{teacher.alternativePhone || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Present Address" span={2}>{teacher.presentAddress || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Permanent Address" span={2}>{teacher.permanentAddress || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Emergency Contact Name">{teacher.emergencyContact?.name || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Relation">{teacher.emergencyContact?.relation || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Emergency Contact Phone">{teacher.emergencyContact?.phone || "N/A"}</Descriptions.Item>
    </Descriptions>
  );

  const ContactForm = () => (
    <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
          <Input prefix={<PhoneOutlined />} />
        </Form.Item>
        <Form.Item name="alternativePhone" label="Alternative Phone">
          <Input prefix={<PhoneOutlined />} />
        </Form.Item>
      </div>
      <Form.Item name="presentAddress" label="Present Address">
        <TextArea rows={2} />
      </Form.Item>
      <Form.Item name="permanentAddress" label="Permanent Address">
        <TextArea rows={2} />
      </Form.Item>
      <Divider>Emergency Contact</Divider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Form.Item name="emergencyContactName" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="emergencyContactRelation" label="Relation">
          <Input />
        </Form.Item>
        <Form.Item name="emergencyContactPhone" label="Phone">
          <Input />
        </Form.Item>
      </div>
    </Form>
  );

  const ProfessionalView = () => (
    <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
      <Descriptions.Item label="Join Date">{formatDate(teacher.joinDate)}</Descriptions.Item>
      <Descriptions.Item label="School Join Date">{formatDate(teacher.schoolJoinDate)}</Descriptions.Item>
      <Descriptions.Item label="Teaching Experience">{teacher.teachingExperience || 0} Years</Descriptions.Item>
      <Descriptions.Item label="Employment Type">{teacher.employmentType || "N/A"}</Descriptions.Item>
      <Descriptions.Item label="Government Salary">৳{teacher.salary?.governmentSalary || 0}</Descriptions.Item>
      <Descriptions.Item label="School Salary">৳{teacher.salary?.schoolSalary || 0}</Descriptions.Item>
    </Descriptions>
  );

  const ProfessionalForm = () => (
    <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item name="joinDate" label="Join Date">
          <DatePicker className="w-full" format="DD-MM-YYYY" />
        </Form.Item>
        <Form.Item name="schoolJoinDate" label="School Join Date">
          <DatePicker className="w-full" format="DD-MM-YYYY" />
        </Form.Item>
        <Form.Item name="teachingExperience" label="Teaching Experience (Years)">
          <InputNumber className="w-full" min={0} />
        </Form.Item>
      </div>
      <Divider>Salary Information</Divider>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item name="governmentSalary" label="Government Salary (BDT)">
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item name="schoolSalary" label="School Salary (BDT)">
          <InputNumber className="w-full" min={0} />
        </Form.Item>
      </div>
    </Form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <UserOutlined className="text-blue-600" />
              Teacher Profile
            </h1>
            <p className="text-gray-500">Manage your professional information</p>
          </div>
          <Space>
            {isEditing && (
              <Button icon={<CloseOutlined />} onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
            <Button
              type={isEditing ? "primary" : "default"}
              icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
              onClick={handleEditToggle}
              loading={isUpdating}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </Space>
        </div>

        {/* Main Profile Card */}
        <Card className="shadow-xl rounded-2xl overflow-hidden border-0">
          <div className="bg-gradient-to-r from-primary to-primary/90 -mx-6 -mt-6 px-6 py-8 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar
                  size={110}
                  src={thumbnailPreview || undefined}
                  icon={<UserOutlined />}
                  className="border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={handleThumbnailSelect}
                    maxCount={1}
                  >
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                      title="Change Photo"
                    >
                      <CameraOutlined className="text-indigo-700" />
                    </button>
                  </Upload>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h2 className="text-2xl md:text-3xl font-bold text-white capitalize">{teacher.name}</h2>
                  <Tag color="green">{teacher.status || "Active"}</Tag>
                  <Tag color="blue">{teacher.employmentType || "Permanent"}</Tag>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-blue-100">
                  <span><span className="font-medium">Teacher ID:</span> {teacher.teacherId}</span>
                  <span><span className="font-medium">Designation:</span> {teacher.designation}</span>
                  {teacher.department && (
                    <span><span className="font-medium">Department:</span> {teacher.department}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.TabPane tab={<span><UserOutlined /> Personal Info</span>} key="1">
              {isEditing ? <PersonalInfoForm /> : <PersonalInfoView />}
            </Tabs.TabPane>

            <Tabs.TabPane tab={<span><PhoneOutlined /> Contact</span>} key="2">
              {isEditing ? <ContactForm /> : <ContactView />}
            </Tabs.TabPane>

            <Tabs.TabPane tab={<span><BookOutlined /> Professional</span>} key="3">
              {isEditing ? <ProfessionalForm /> : <ProfessionalView />}
            </Tabs.TabPane>

            <Tabs.TabPane tab={<span><BookOutlined /> Education</span>} key="4">
              <div className="mb-4 flex justify-between items-center">
                <span className="text-gray-500 text-sm">{educationList.length} education records</span>
                {isEditing && (
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEducation}>
                    Add Education
                  </Button>
                )}
              </div>
              {renderEducationTimeline()}
            </Tabs.TabPane>

            <Tabs.TabPane tab={<span><BankOutlined /> Banking & Social</span>} key="5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <BankOutlined className="text-blue-500" /> Bank Accounts
                  </h3>
                  {bankList.length > 0 ? (
                    bankList.map((bank) => (
                      <div key={bank.id} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{bank.bankName}</p>
                            <p className="text-sm text-gray-600">A/C: {bank.accountNumber}</p>
                            <p className="text-sm text-gray-600">Name: {bank.accountName}</p>
                            {bank.branchName && <p className="text-sm text-gray-600">Branch: {bank.branchName}</p>}
                            {bank.routingNumber && <p className="text-sm text-gray-600">Routing: {bank.routingNumber}</p>}
                          </div>
                          {isEditing && (
                            <div className="flex gap-1">
                              <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditBank(bank)} className="text-blue-500" />
                              <Popconfirm title="Delete bank account?" onConfirm={() => handleDeleteBank(bank.id)} okText="Yes" cancelText="No">
                                <Button type="text" size="small" icon={<DeleteOutlined />} className="text-red-500" />
                              </Popconfirm>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No bank accounts added</p>
                  )}
                  {isEditing && (
                    <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddBank}>
                      Add Bank Account
                    </Button>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <GlobalOutlined className="text-indigo-500" /> Social Links
                  </h3>
                  {socialList.length > 0 ? (
                    socialList.map((social) => (
                      <div key={social.id} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{social.platform}</p>
                            <a href={social.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline truncate block">
                              {social.link}
                            </a>
                          </div>
                          {isEditing && (
                            <div className="flex gap-1">
                              <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditSocial(social)} className="text-blue-500" />
                              <Popconfirm title="Delete social link?" onConfirm={() => handleDeleteSocial(social.id)} okText="Yes" cancelText="No">
                                <Button type="text" size="small" icon={<DeleteOutlined />} className="text-red-500" />
                              </Popconfirm>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No social links added</p>
                  )}
                  {isEditing && (
                    <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddSocial}>
                      Add Social Link
                    </Button>
                  )}
                </div>
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab={<span><HeartOutlined /> Overview</span>} key="6">
              {renderOverview()}
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>

      {/* Education Modal */}
      <Modal
        title={editingEducation ? "Edit Education" : "Add Education"}
        open={isEducationModalVisible}
        onCancel={() => { setIsEducationModalVisible(false); educationForm.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={educationForm} layout="vertical" onFinish={handleEducationSubmit}>
          <Form.Item name="label" label="Degree/Level" rules={[{ required: true }]}>
            <Input placeholder="e.g., SSC, HSC, B.Sc" />
          </Form.Item>
          <Form.Item name="institute" label="Institute" rules={[{ required: true }]}>
            <Input placeholder="Institute name" />
          </Form.Item>
          <Form.Item name="year" label="Year" rules={[{ required: true }]}>
            <InputNumber className="w-full" placeholder="e.g., 2020" min={1900} max={2100} />
          </Form.Item>
          <Form.Item name="grade" label="Grade/GPA">
            <Input placeholder="e.g., 5.00, A+" />
          </Form.Item>
          <Form.Item className="flex justify-end gap-2 mb-0">
            <Button onClick={() => { setIsEducationModalVisible(false); educationForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit">{editingEducation ? "Update" : "Add"} Education</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bank Modal */}
      <Modal
        title={editingBank ? "Edit Bank Account" : "Add Bank Account"}
        open={isBankModalVisible}
        onCancel={() => { setIsBankModalVisible(false); bankForm.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={bankForm} layout="vertical" onFinish={handleBankSubmit}>
          <Form.Item name="bankName" label="Bank Name" rules={[{ required: true }]}>
            <Input placeholder="e.g., Sonali Bank" />
          </Form.Item>
          <Form.Item name="accountName" label="Account Name" rules={[{ required: true }]}>
            <Input placeholder="Account holder name" />
          </Form.Item>
          <Form.Item name="accountNumber" label="Account Number" rules={[{ required: true }]}>
            <Input placeholder="Account number" />
          </Form.Item>
          <Form.Item name="branchName" label="Branch Name">
            <Input placeholder="Branch name" />
          </Form.Item>
          <Form.Item name="routingNumber" label="Routing Number">
            <Input placeholder="Routing number" />
          </Form.Item>
          <Form.Item className="flex justify-end gap-2 mb-0">
            <Button onClick={() => { setIsBankModalVisible(false); bankForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit">{editingBank ? "Update" : "Add"} Bank Account</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Social Modal */}
      <Modal
        title={editingSocial ? "Edit Social Link" : "Add Social Link"}
        open={isSocialModalVisible}
        onCancel={() => { setIsSocialModalVisible(false); socialForm.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={socialForm} layout="vertical" onFinish={handleSocialSubmit}>
          <Form.Item name="platform" label="Platform" rules={[{ required: true }]}>
            <Input placeholder="e.g., Facebook, LinkedIn" />
          </Form.Item>
          <Form.Item name="link" label="Profile URL" rules={[{ required: true }]}>
            <Input placeholder="https://facebook.com/username" />
          </Form.Item>
          <Form.Item className="flex justify-end gap-2 mb-0">
            <Button onClick={() => { setIsSocialModalVisible(false); socialForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit">{editingSocial ? "Update" : "Add"} Social Link</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherProfile;
// import React, { useState, useEffect } from "react";
// import { useMyInfoQuery } from "../../redux/api/userApi";
// import { useUpdateTeacherMutation } from "../../redux/api/teacherApi";
// import {
//   Form, Input, Button, Upload, message, Tabs, Select, DatePicker,
//   InputNumber, Card, Tag, Divider, Modal, Popconfirm, Space,
//   Descriptions, Avatar, Skeleton
// } from "antd";
// import {
//   EditOutlined,
//   SaveOutlined,
//   CloseOutlined,
//   PlusOutlined,
//   DeleteOutlined,
//   UserOutlined,
//   PhoneOutlined,
//   HomeOutlined,
//   HeartOutlined,
//   CalendarOutlined,
//   BookOutlined,
//   BankOutlined,
//   GlobalOutlined,
//   IdcardOutlined,
//   TrophyOutlined,
//   TeamOutlined,
//   DollarOutlined,
//   CameraOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";

// const { Option } = Select;
// const { TextArea } = Input;

// // ── Fixed FormData converter ─────────────────────────────────────────────
// // Age-r bug: Ant Design Upload `beforeUpload` theke `fileList` shadharonoto
// // ekta ARRAY dey ([{ originFileObj: File, uid, name... }]). Age-r code
// // shudhu top-level `value.originFileObj` check korto, tai array eshe
// // "object" branch e giye JSON.stringify(fileList) hoye jaito — i.e. file-er
// // metadata (uid/name) string hishebe pathaye ditchilo, real image na.
// // Ei jonno thumbnail kokhono update hocchilo na. Niche shei array-case
// // shobar age check kora hocche.
// const convertToFormData = (data) => {
//   const formData = new FormData();

//   Object.entries(data).forEach(([key, value]) => {
//     if (value === undefined || value === null || value === "") return;

//     // Ant Design Upload fileList: [{ originFileObj: File, ... }]
//     if (Array.isArray(value) && value[0]?.originFileObj instanceof File) {
//       formData.append(key, value[0].originFileObj);
//       return;
//     }

//     // Direct { originFileObj: File } wrapper
//     if (value?.originFileObj instanceof File) {
//       formData.append(key, value.originFileObj);
//       return;
//     }

//     // Raw File
//     if (value instanceof File) {
//       formData.append(key, value);
//       return;
//     }

//     // dayjs object (AntD DatePicker)
//     if (value?.$isDayjsObject || typeof value?.toDate === "function") {
//       formData.append(key, value.toDate().toISOString());
//       return;
//     }

//     // Native Date
//     if (value instanceof Date) {
//       formData.append(key, value.toISOString());
//       return;
//     }

//     // Arrays (education, social, bankAccounts) -> JSON string
//     if (Array.isArray(value)) {
//       formData.append(key, JSON.stringify(value));
//       return;
//     }

//     // Nested object (emergencyContact, salary) -> JSON string
//     if (typeof value === "object") {
//       formData.append(key, JSON.stringify(value));
//       return;
//     }

//     // Plain value
//     formData.append(key, String(value));
//   });

//   return formData;
// };

// // Color mapping for education badges
// const colorMap = {
//   blue: { border: "border-blue-500", dotColor: "bg-blue-500" },
//   indigo: { border: "border-indigo-500", dotColor: "bg-indigo-500" },
//   purple: { border: "border-purple-500", dotColor: "bg-purple-500" },
//   pink: { border: "border-pink-500", dotColor: "bg-pink-500" },
//   green: { border: "border-green-500", dotColor: "bg-green-500" },
//   orange: { border: "border-orange-500", dotColor: "bg-orange-500" },
//   teal: { border: "border-teal-500", dotColor: "bg-teal-500" },
// };
// const colorCycle = ["blue", "indigo", "purple", "pink", "green", "orange", "teal"];

// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   return new Date(dateStr).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });
// };

// const TeacherProfile = () => {
//   const { data, isLoading, isError, refetch } = useMyInfoQuery();
//   const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();

//   const [isEditing, setIsEditing] = useState(false);
//   const [form] = Form.useForm();
//   const [activeTab, setActiveTab] = useState("1");

//   // Thumbnail (photo) — edit mode e select kora hoile ekhane thake,
//   // submit-er shomoy convertToFormData eta File hishebe pathay
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);

//   // Dynamic lists
//   const [educationList, setEducationList] = useState([]);
//   const [bankList, setBankList] = useState([]);
//   const [socialList, setSocialList] = useState([]);

//   // Modal states
//   const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);
//   const [editingEducation, setEditingEducation] = useState(null);
//   const [educationForm] = Form.useForm();

//   const [isBankModalVisible, setIsBankModalVisible] = useState(false);
//   const [editingBank, setEditingBank] = useState(null);
//   const [bankForm] = Form.useForm();

//   const [isSocialModalVisible, setIsSocialModalVisible] = useState(false);
//   const [editingSocial, setEditingSocial] = useState(null);
//   const [socialForm] = Form.useForm();

//   const buildFormValues = (teacher) => ({
//     name: teacher.name,
//     designation: teacher.designation,
//     qualification: teacher.qualification,
//     phone: teacher.phone,
//     alternativePhone: teacher.alternativePhone || "",
//     presentAddress: teacher.presentAddress || "",
//     permanentAddress: teacher.permanentAddress || "",
//     bloodGroup: teacher.bloodGroup || undefined,
//     gender: teacher.gender || undefined,
//     religion: teacher.religion || "",
//     maritalStatus: teacher.maritalStatus || undefined,
//     dateOfBirth: teacher.dateOfBirth ? dayjs(teacher.dateOfBirth) : null,
//     joinDate: teacher.joinDate ? dayjs(teacher.joinDate) : null,
//     schoolJoinDate: teacher.schoolJoinDate ? dayjs(teacher.schoolJoinDate) : null,
//     teachingExperience: teacher.teachingExperience || 0,
//     department: teacher.department || "",
//     subject: teacher.subject || "",
//     bio: teacher.bio || "",
//     teacherId: teacher.teacherId,
//     nid: teacher.nid || "",
//     birthCertificateNo: teacher.birthCertificateNo || "",
//     indexNumber: teacher.indexNumber || "",
//     governmentSalary: teacher.salary?.governmentSalary || 0,
//     schoolSalary: teacher.salary?.schoolSalary || 0,
//     emergencyContactName: teacher.emergencyContact?.name || "",
//     emergencyContactRelation: teacher.emergencyContact?.relation || "",
//     emergencyContactPhone: teacher.emergencyContact?.phone || "",
//   });

//   // Data load howar shathe shathei form + lists + thumbnail preview populate
//   useEffect(() => {
//     if (!data?.data?.profile) return;
//     const teacher = data.data.profile;

//     form.setFieldsValue(buildFormValues(teacher));
//     setThumbnailPreview(teacher.thumbnail || null);
//     setThumbnailFile(null);

//     setEducationList((teacher.education || []).map((edu, idx) => ({
//       ...edu,
//       id: idx.toString(),
//       color: colorCycle[idx % colorCycle.length],
//     })));
//     setBankList((teacher.bankAccounts || []).map((bank, idx) => ({ ...bank, id: idx.toString() })));
//     setSocialList((teacher.social || []).map((social, idx) => ({ ...social, id: idx.toString() })));
//   }, [data, form]);

//   if (isLoading) {
//     return (
//       <div className="max-w-5xl mx-auto p-8">
//         <Card className="rounded-2xl">
//           <Skeleton active avatar paragraph={{ rows: 6 }} />
//         </Card>
//       </div>
//     );
//   }

//   if (isError || !data?.data?.profile) {
//     return (
//       <div className="flex items-center justify-center min-h-[50vh]">
//         <div className="text-center">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <p className="text-red-500 text-lg">Profile load korte problem hocche.</p>
//         </div>
//       </div>
//     );
//   }

//   const teacher = data.data.profile;

//   const handleEditToggle = () => {
//     if (isEditing) {
//       form.submit();
//     } else {
//       setIsEditing(true);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     form.setFieldsValue(buildFormValues(teacher));
//     setThumbnailFile(null);
//     setThumbnailPreview(teacher.thumbnail || null);
//   };

//   // Thumbnail select — file ta shudhu state e rakha hocche, submit hobe
//   // Save Changes chapleiy (alada kono upload call na)
//   const handleThumbnailSelect = (file) => {
//     const isImage = file.type.startsWith("image/");
//     if (!isImage) {
//       message.error("Only image file upload korte parben.");
//       return Upload.LIST_IGNORE;
//     }
//     const isLt5M = file.size / 1024 / 1024 < 5;
//     if (!isLt5M) {
//       message.error("Image size 5MB er niche hote hobe.");
//       return Upload.LIST_IGNORE;
//     }
//     setThumbnailFile(file);
//     setThumbnailPreview(URL.createObjectURL(file));
//     return false; // auto-upload off
//   };

//   const handleFormSubmit = async (values) => {
//     try {
//       const payload = {
//         name: values.name,
//         designation: values.designation,
//         qualification: values.qualification,
//         phone: values.phone,
//         alternativePhone: values.alternativePhone,
//         presentAddress: values.presentAddress,
//         permanentAddress: values.permanentAddress,
//         bloodGroup: values.bloodGroup,
//         gender: values.gender,
//         religion: values.religion,
//         maritalStatus: values.maritalStatus,
//         teachingExperience: values.teachingExperience,
//         department: values.department,
//         subject: values.subject,
//         bio: values.bio,
//         nid: values.nid,
//         birthCertificateNo: values.birthCertificateNo,
//         indexNumber: values.indexNumber,
//         dateOfBirth: values.dateOfBirth,
//         joinDate: values.joinDate,
//         schoolJoinDate: values.schoolJoinDate,
//         salary: {
//           governmentSalary: values.governmentSalary || 0,
//           schoolSalary: values.schoolSalary || 0,
//         },
//         emergencyContact: {
//           name: values.emergencyContactName || "",
//           relation: values.emergencyContactRelation || "",
//           phone: values.emergencyContactPhone || "",
//         },
//         education: educationList.map(({ id, color, ...rest }) => rest),
//         bankAccounts: bankList.map(({ id, ...rest }) => rest),
//         social: socialList.map(({ id, ...rest }) => rest),
//       };

//       // Notun photo select kore thakle-i shudhu thumbnail pathabe
//       if (thumbnailFile) {
//         payload.thumbnail = thumbnailFile;
//       }

//       const formData = convertToFormData(payload);

//       await updateTeacher({ id: teacher._id, data: formData }).unwrap();

//       message.success("Profile updated successfully!");
//       setIsEditing(false);
//       setThumbnailFile(null);
//       refetch();
//     } catch (error) {
//       message.error(error?.data?.message || "Failed to update profile");
//     }
//   };

//   // Education CRUD
//   const handleAddEducation = () => {
//     setEditingEducation(null);
//     educationForm.resetFields();
//     setIsEducationModalVisible(true);
//   };
//   const handleEditEducation = (edu) => {
//     setEditingEducation(edu);
//     educationForm.setFieldsValue(edu);
//     setIsEducationModalVisible(true);
//   };
//   const handleDeleteEducation = (id) => {
//     setEducationList(educationList.filter((edu) => edu.id !== id));
//     message.success("Education removed");
//   };
//   const handleEducationSubmit = (values) => {
//     const newEdu = {
//       ...values,
//       id: editingEducation?.id || Date.now().toString(),
//       color: editingEducation?.color || colorCycle[educationList.length % colorCycle.length],
//     };
//     if (editingEducation) {
//       setEducationList(educationList.map((edu) => (edu.id === editingEducation.id ? newEdu : edu)));
//       message.success("Education updated");
//     } else {
//       setEducationList([...educationList, newEdu]);
//       message.success("Education added");
//     }
//     setIsEducationModalVisible(false);
//     educationForm.resetFields();
//   };

//   // Bank CRUD
//   const handleAddBank = () => {
//     setEditingBank(null);
//     bankForm.resetFields();
//     setIsBankModalVisible(true);
//   };
//   const handleEditBank = (bank) => {
//     setEditingBank(bank);
//     bankForm.setFieldsValue(bank);
//     setIsBankModalVisible(true);
//   };
//   const handleDeleteBank = (id) => {
//     setBankList(bankList.filter((bank) => bank.id !== id));
//     message.success("Bank account removed");
//   };
//   const handleBankSubmit = (values) => {
//     const newBank = { ...values, id: editingBank?.id || Date.now().toString() };
//     if (editingBank) {
//       setBankList(bankList.map((bank) => (bank.id === editingBank.id ? newBank : bank)));
//       message.success("Bank account updated");
//     } else {
//       setBankList([...bankList, newBank]);
//       message.success("Bank account added");
//     }
//     setIsBankModalVisible(false);
//     bankForm.resetFields();
//   };

//   // Social CRUD
//   const handleAddSocial = () => {
//     setEditingSocial(null);
//     socialForm.resetFields();
//     setIsSocialModalVisible(true);
//   };
//   const handleEditSocial = (social) => {
//     setEditingSocial(social);
//     socialForm.setFieldsValue(social);
//     setIsSocialModalVisible(true);
//   };
//   const handleDeleteSocial = (id) => {
//     setSocialList(socialList.filter((social) => social.id !== id));
//     message.success("Social link removed");
//   };
//   const handleSocialSubmit = (values) => {
//     const newSocial = { ...values, id: editingSocial?.id || Date.now().toString() };
//     if (editingSocial) {
//       setSocialList(socialList.map((social) => (social.id === editingSocial.id ? newSocial : social)));
//       message.success("Social link updated");
//     } else {
//       setSocialList([...socialList, newSocial]);
//       message.success("Social link added");
//     }
//     setIsSocialModalVisible(false);
//     socialForm.resetFields();
//   };

//   const renderEducationTimeline = () => {
//     if (educationList.length === 0) {
//       return (
//         <div className="text-center py-8 text-gray-400">
//           <BookOutlined className="text-4xl mb-2" />
//           <p>No education added yet</p>
//         </div>
//       );
//     }
//     return (
//       <div className="relative">
//         <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
//         {educationList.map((edu, index) => {
//           const c = colorMap[edu.color] || colorMap.blue;
//           return (
//             <div key={edu.id} className="relative pl-10 pb-8 last:pb-0 group">
//               <div className={`absolute left-1 top-1.5 w-6 h-6 rounded-full ${c.dotColor} border-2 border-white shadow-md flex items-center justify-center`}>
//                 <span className="text-white text-xs font-bold">{index + 1}</span>
//               </div>
//               <div className={`bg-white rounded-xl p-4 border-l-4 ${c.border} shadow-sm hover:shadow-md transition-all`}>
//                 <div className="flex flex-wrap justify-between items-start gap-2">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                       <h3 className="text-lg font-semibold text-gray-800">{edu.label}</h3>
//                       <Tag color={edu.color}>{edu.year}</Tag>
//                     </div>
//                     <p className="text-gray-600">{edu.institute}</p>
//                     {edu.grade && (
//                       <p className="text-sm text-gray-500 mt-1">
//                         <span className="font-medium">Grade:</span> {edu.grade}
//                       </p>
//                     )}
//                   </div>
//                   {isEditing && (
//                     <div className="flex gap-1">
//                       <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditEducation(edu)} className="text-blue-500" />
//                       <Popconfirm title="Delete education?" onConfirm={() => handleDeleteEducation(edu.id)} okText="Yes" cancelText="No">
//                         <Button type="text" size="small" icon={<DeleteOutlined />} className="text-red-500" />
//                       </Popconfirm>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   const InfoCard = ({ icon, label, value, color = "blue" }) => (
//     <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
//       <div className="flex items-start gap-3">
//         <div className={`text-${color}-500 text-xl mt-0.5`}>{icon}</div>
//         <div className="flex-1 min-w-0">
//           <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
//           <p className="text-gray-800 font-medium truncate">{value || "N/A"}</p>
//         </div>
//       </div>
//     </div>
//   );

//   const renderOverview = () => (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//       <InfoCard icon={<IdcardOutlined />} label="Teacher ID" value={teacher.teacherId} color="blue" />
//       <InfoCard icon={<UserOutlined />} label="Designation" value={teacher.designation} color="purple" />
//       <InfoCard icon={<TrophyOutlined />} label="Qualification" value={teacher.qualification} color="green" />
//       <InfoCard icon={<HeartOutlined />} label="Blood Group" value={teacher.bloodGroup} color="red" />
//       <InfoCard icon={<CalendarOutlined />} label="Date of Birth" value={formatDate(teacher.dateOfBirth)} color="orange" />
//       <InfoCard icon={<TeamOutlined />} label="Experience" value={`${teacher.teachingExperience || 0} Years`} color="indigo" />
//       <InfoCard icon={<CalendarOutlined />} label="Join Date" value={formatDate(teacher.joinDate)} color="teal" />
//       <InfoCard icon={<DollarOutlined />} label="Total Salary" value={`${(teacher.salary?.governmentSalary || 0) + (teacher.salary?.schoolSalary || 0)} BDT`} color="green" />
//       <InfoCard icon={<HomeOutlined />} label="Present Address" value={teacher.presentAddress} color="gray" />
//     </div>
//   );

//   const PersonalInfoView = () => (
//     <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
//       <Descriptions.Item label="Teacher ID">{teacher.teacherId || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Full Name">{teacher.name || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Designation">{teacher.designation || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Qualification">{teacher.qualification || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Department">{teacher.department || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Subject">{teacher.subject || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Gender">{teacher.gender || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Religion">{teacher.religion || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Marital Status">{teacher.maritalStatus || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Date of Birth">{formatDate(teacher.dateOfBirth)}</Descriptions.Item>
//       <Descriptions.Item label="Blood Group">{teacher.bloodGroup || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="NID Number">{teacher.nid || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Birth Certificate No">{teacher.birthCertificateNo || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Index Number">{teacher.indexNumber || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Bio" span={2}>{teacher.bio || "N/A"}</Descriptions.Item>
//     </Descriptions>
//   );

//   const PersonalInfoForm = () => (
//     <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <Form.Item name="teacherId" label="Teacher ID">
//           <Input prefix={<IdcardOutlined />} disabled />
//         </Form.Item>
//         <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
//           <Input prefix={<UserOutlined />} />
//         </Form.Item>
//         <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
//           <Input prefix={<TrophyOutlined />} />
//         </Form.Item>
//         <Form.Item name="qualification" label="Qualification">
//           <Input />
//         </Form.Item>
//         <Form.Item name="department" label="Department">
//           <Input />
//         </Form.Item>
//         <Form.Item name="subject" label="Subject">
//           <Input />
//         </Form.Item>
//         <Form.Item name="gender" label="Gender">
//           <Select allowClear>
//             <Option value="Male">Male</Option>
//             <Option value="Female">Female</Option>
//             <Option value="Other">Other</Option>
//           </Select>
//         </Form.Item>
//         <Form.Item name="religion" label="Religion">
//           <Input />
//         </Form.Item>
//         <Form.Item name="maritalStatus" label="Marital Status">
//           <Select allowClear>
//             <Option value="Single">Single</Option>
//             <Option value="Married">Married</Option>
//             <Option value="Divorced">Divorced</Option>
//             <Option value="Widowed">Widowed</Option>
//           </Select>
//         </Form.Item>
//         <Form.Item name="dateOfBirth" label="Date of Birth">
//           <DatePicker className="w-full" format="DD-MM-YYYY" />
//         </Form.Item>
//         <Form.Item name="bloodGroup" label="Blood Group">
//           <Select allowClear>
//             {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
//               <Option key={bg} value={bg}>{bg}</Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.Item name="nid" label="NID Number">
//           <Input />
//         </Form.Item>
//         <Form.Item name="birthCertificateNo" label="Birth Certificate No">
//           <Input />
//         </Form.Item>
//         <Form.Item name="indexNumber" label="Index Number">
//           <Input />
//         </Form.Item>
//       </div>
//       <Form.Item name="bio" label="Bio">
//         <TextArea rows={3} />
//       </Form.Item>
//     </Form>
//   );

//   const ContactView = () => (
//     <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
//       <Descriptions.Item label="Phone">{teacher.phone || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Alternative Phone">{teacher.alternativePhone || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Present Address" span={2}>{teacher.presentAddress || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Permanent Address" span={2}>{teacher.permanentAddress || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Emergency Contact Name">{teacher.emergencyContact?.name || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Relation">{teacher.emergencyContact?.relation || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Emergency Contact Phone">{teacher.emergencyContact?.phone || "N/A"}</Descriptions.Item>
//     </Descriptions>
//   );

//   const ContactForm = () => (
//     <Form form={form} layout="vertical">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
//           <Input prefix={<PhoneOutlined />} />
//         </Form.Item>
//         <Form.Item name="alternativePhone" label="Alternative Phone">
//           <Input prefix={<PhoneOutlined />} />
//         </Form.Item>
//       </div>
//       <Form.Item name="presentAddress" label="Present Address">
//         <TextArea rows={2} />
//       </Form.Item>
//       <Form.Item name="permanentAddress" label="Permanent Address">
//         <TextArea rows={2} />
//       </Form.Item>
//       <Divider>Emergency Contact</Divider>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Form.Item name="emergencyContactName" label="Name">
//           <Input />
//         </Form.Item>
//         <Form.Item name="emergencyContactRelation" label="Relation">
//           <Input />
//         </Form.Item>
//         <Form.Item name="emergencyContactPhone" label="Phone">
//           <Input />
//         </Form.Item>
//       </div>
//     </Form>
//   );

//   const ProfessionalView = () => (
//     <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
//       <Descriptions.Item label="Join Date">{formatDate(teacher.joinDate)}</Descriptions.Item>
//       <Descriptions.Item label="School Join Date">{formatDate(teacher.schoolJoinDate)}</Descriptions.Item>
//       <Descriptions.Item label="Teaching Experience">{teacher.teachingExperience || 0} Years</Descriptions.Item>
//       <Descriptions.Item label="Employment Type">{teacher.employmentType || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Government Salary">৳{teacher.salary?.governmentSalary || 0}</Descriptions.Item>
//       <Descriptions.Item label="School Salary">৳{teacher.salary?.schoolSalary || 0}</Descriptions.Item>
//     </Descriptions>
//   );

//   const ProfessionalForm = () => (
//     <Form form={form} layout="vertical">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Form.Item name="joinDate" label="Join Date">
//           <DatePicker className="w-full" format="DD-MM-YYYY" />
//         </Form.Item>
//         <Form.Item name="schoolJoinDate" label="School Join Date">
//           <DatePicker className="w-full" format="DD-MM-YYYY" />
//         </Form.Item>
//         <Form.Item name="teachingExperience" label="Teaching Experience (Years)">
//           <InputNumber className="w-full" min={0} />
//         </Form.Item>
//       </div>
//       <Divider>Salary Information</Divider>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Form.Item name="governmentSalary" label="Government Salary (BDT)">
//           <InputNumber className="w-full" min={0} />
//         </Form.Item>
//         <Form.Item name="schoolSalary" label="School Salary (BDT)">
//           <InputNumber className="w-full" min={0} />
//         </Form.Item>
//       </div>
//     </Form>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//               <UserOutlined className="text-blue-600" />
//               Teacher Profile
//             </h1>
//             <p className="text-gray-500">Manage your professional information</p>
//           </div>
//           <Space>
//             {isEditing && (
//               <Button icon={<CloseOutlined />} onClick={handleCancelEdit}>
//                 Cancel
//               </Button>
//             )}
//             <Button
//               type={isEditing ? "primary" : "default"}
//               icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
//               onClick={handleEditToggle}
//               loading={isUpdating}
//               className={isEditing ? "bg-blue-600" : ""}
//             >
//               {isEditing ? "Save Changes" : "Edit Profile"}
//             </Button>
//           </Space>
//         </div>

//         {/* Main Profile Card */}
//         <Card className="shadow-xl rounded-2xl overflow-hidden border-0">
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-700 -mx-6 -mt-6 px-6 py-8 mb-6">
//             <div className="flex flex-col md:flex-row items-center gap-6">
//               <div className="relative">
//                 <Avatar
//                   size={110}
//                   src={thumbnailPreview || undefined}
//                   icon={<UserOutlined />}
//                   className="border-4 border-white shadow-lg"
//                 />
//                 {isEditing && (
//                   <Upload
//                     accept="image/*"
//                     showUploadList={false}
//                     beforeUpload={handleThumbnailSelect}
//                     maxCount={1}
//                   >
//                     <button
//                       type="button"
//                       className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
//                       title="Change Photo"
//                     >
//                       <CameraOutlined className="text-indigo-700" />
//                     </button>
//                   </Upload>
//                 )}
//               </div>
//               <div className="flex-1 text-center md:text-left">
//                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
//                   <h2 className="text-2xl md:text-3xl font-bold text-white">{teacher.name}</h2>
//                   <Tag color="green">{teacher.status || "Active"}</Tag>
//                   <Tag color="blue">{teacher.employmentType || "Permanent"}</Tag>
//                 </div>
//                 <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-blue-100">
//                   <span><span className="font-medium">Teacher ID:</span> {teacher.teacherId}</span>
//                   <span><span className="font-medium">Designation:</span> {teacher.designation}</span>
//                   {teacher.department && (
//                     <span><span className="font-medium">Department:</span> {teacher.department}</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Tabs activeKey={activeTab} onChange={setActiveTab}>
//             <Tabs.TabPane tab={<span><UserOutlined /> Personal Info</span>} key="1">
//               {isEditing ? <PersonalInfoForm /> : <PersonalInfoView />}
//             </Tabs.TabPane>

//             <Tabs.TabPane tab={<span><PhoneOutlined /> Contact</span>} key="2">
//               {isEditing ? <ContactForm /> : <ContactView />}
//             </Tabs.TabPane>

//             <Tabs.TabPane tab={<span><BookOutlined /> Professional</span>} key="3">
//               {isEditing ? <ProfessionalForm /> : <ProfessionalView />}
//             </Tabs.TabPane>

//             <Tabs.TabPane tab={<span><BookOutlined /> Education</span>} key="4">
//               <div className="mb-4 flex justify-between items-center">
//                 <span className="text-gray-500 text-sm">{educationList.length} education records</span>
//                 {isEditing && (
//                   <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEducation}>
//                     Add Education
//                   </Button>
//                 )}
//               </div>
//               {renderEducationTimeline()}
//             </Tabs.TabPane>

//             <Tabs.TabPane tab={<span><BankOutlined /> Banking & Social</span>} key="5">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                     <BankOutlined className="text-blue-500" /> Bank Accounts
//                   </h3>
//                   {bankList.length > 0 ? (
//                     bankList.map((bank) => (
//                       <div key={bank.id} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <p className="font-medium text-gray-800">{bank.bankName}</p>
//                             <p className="text-sm text-gray-600">A/C: {bank.accountNumber}</p>
//                             <p className="text-sm text-gray-600">Name: {bank.accountName}</p>
//                             {bank.branchName && <p className="text-sm text-gray-600">Branch: {bank.branchName}</p>}
//                             {bank.routingNumber && <p className="text-sm text-gray-600">Routing: {bank.routingNumber}</p>}
//                           </div>
//                           {isEditing && (
//                             <div className="flex gap-1">
//                               <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditBank(bank)} className="text-blue-500" />
//                               <Popconfirm title="Delete bank account?" onConfirm={() => handleDeleteBank(bank.id)} okText="Yes" cancelText="No">
//                                 <Button type="text" size="small" icon={<DeleteOutlined />} className="text-red-500" />
//                               </Popconfirm>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-400">No bank accounts added</p>
//                   )}
//                   {isEditing && (
//                     <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddBank}>
//                       Add Bank Account
//                     </Button>
//                   )}
//                 </div>

//                 <div>
//                   <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                     <GlobalOutlined className="text-indigo-500" /> Social Links
//                   </h3>
//                   {socialList.length > 0 ? (
//                     socialList.map((social) => (
//                       <div key={social.id} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <p className="font-medium text-gray-800">{social.platform}</p>
//                             <a href={social.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline truncate block">
//                               {social.link}
//                             </a>
//                           </div>
//                           {isEditing && (
//                             <div className="flex gap-1">
//                               <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditSocial(social)} className="text-blue-500" />
//                               <Popconfirm title="Delete social link?" onConfirm={() => handleDeleteSocial(social.id)} okText="Yes" cancelText="No">
//                                 <Button type="text" size="small" icon={<DeleteOutlined />} className="text-red-500" />
//                               </Popconfirm>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-400">No social links added</p>
//                   )}
//                   {isEditing && (
//                     <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddSocial}>
//                       Add Social Link
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </Tabs.TabPane>

//             <Tabs.TabPane tab={<span><HeartOutlined /> Overview</span>} key="6">
//               {renderOverview()}
//             </Tabs.TabPane>
//           </Tabs>
//         </Card>
//       </div>

//       {/* Education Modal */}
//       <Modal
//         title={editingEducation ? "Edit Education" : "Add Education"}
//         open={isEducationModalVisible}
//         onCancel={() => { setIsEducationModalVisible(false); educationForm.resetFields(); }}
//         footer={null}
//         width={500}
//       >
//         <Form form={educationForm} layout="vertical" onFinish={handleEducationSubmit}>
//           <Form.Item name="label" label="Degree/Level" rules={[{ required: true }]}>
//             <Input placeholder="e.g., SSC, HSC, B.Sc" />
//           </Form.Item>
//           <Form.Item name="institute" label="Institute" rules={[{ required: true }]}>
//             <Input placeholder="Institute name" />
//           </Form.Item>
//           <Form.Item name="year" label="Year" rules={[{ required: true }]}>
//             <InputNumber className="w-full" placeholder="e.g., 2020" min={1900} max={2100} />
//           </Form.Item>
//           <Form.Item name="grade" label="Grade/GPA">
//             <Input placeholder="e.g., 5.00, A+" />
//           </Form.Item>
//           <Form.Item className="flex justify-end gap-2 mb-0">
//             <Button onClick={() => { setIsEducationModalVisible(false); educationForm.resetFields(); }}>Cancel</Button>
//             <Button type="primary" htmlType="submit">{editingEducation ? "Update" : "Add"} Education</Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Bank Modal */}
//       <Modal
//         title={editingBank ? "Edit Bank Account" : "Add Bank Account"}
//         open={isBankModalVisible}
//         onCancel={() => { setIsBankModalVisible(false); bankForm.resetFields(); }}
//         footer={null}
//         width={500}
//       >
//         <Form form={bankForm} layout="vertical" onFinish={handleBankSubmit}>
//           <Form.Item name="bankName" label="Bank Name" rules={[{ required: true }]}>
//             <Input placeholder="e.g., Sonali Bank" />
//           </Form.Item>
//           <Form.Item name="accountName" label="Account Name" rules={[{ required: true }]}>
//             <Input placeholder="Account holder name" />
//           </Form.Item>
//           <Form.Item name="accountNumber" label="Account Number" rules={[{ required: true }]}>
//             <Input placeholder="Account number" />
//           </Form.Item>
//           <Form.Item name="branchName" label="Branch Name">
//             <Input placeholder="Branch name" />
//           </Form.Item>
//           <Form.Item name="routingNumber" label="Routing Number">
//             <Input placeholder="Routing number" />
//           </Form.Item>
//           <Form.Item className="flex justify-end gap-2 mb-0">
//             <Button onClick={() => { setIsBankModalVisible(false); bankForm.resetFields(); }}>Cancel</Button>
//             <Button type="primary" htmlType="submit">{editingBank ? "Update" : "Add"} Bank Account</Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Social Modal */}
//       <Modal
//         title={editingSocial ? "Edit Social Link" : "Add Social Link"}
//         open={isSocialModalVisible}
//         onCancel={() => { setIsSocialModalVisible(false); socialForm.resetFields(); }}
//         footer={null}
//         width={500}
//       >
//         <Form form={socialForm} layout="vertical" onFinish={handleSocialSubmit}>
//           <Form.Item name="platform" label="Platform" rules={[{ required: true }]}>
//             <Input placeholder="e.g., Facebook, LinkedIn" />
//           </Form.Item>
//           <Form.Item name="link" label="Profile URL" rules={[{ required: true }]}>
//             <Input placeholder="https://facebook.com/username" />
//           </Form.Item>
//           <Form.Item className="flex justify-end gap-2 mb-0">
//             <Button onClick={() => { setIsSocialModalVisible(false); socialForm.resetFields(); }}>Cancel</Button>
//             <Button type="primary" htmlType="submit">{editingSocial ? "Update" : "Add"} Social Link</Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default TeacherProfile;

// import React, { useState, useEffect } from "react";
// import { useMyInfoQuery } from "../../redux/api/userApi";
// import { useUpdateTeacherMutation } from "../../redux/api/teacherApi";
// import {
//   Form, Input, Button, message, Tabs, Select, DatePicker,
//   InputNumber, Card, Tag, Divider, Modal, Popconfirm, Space,
//   Descriptions, Avatar, Skeleton
// } from "antd";
// import {
//   EditOutlined,
//   SaveOutlined,
//   CloseOutlined,
//   PlusOutlined,
//   DeleteOutlined,
//   UserOutlined,
//   PhoneOutlined,
//   HomeOutlined,
//   HeartOutlined,
//   CalendarOutlined,
//   BookOutlined,
//   BankOutlined,
//   GlobalOutlined,
//   IdcardOutlined,
//   TrophyOutlined,
//   TeamOutlined,
//   DollarOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";

// const { Option } = Select;
// const { TextArea } = Input;

// // Color mapping for education badges
// const colorMap = {
//   blue: { border: "border-blue-500", dotColor: "bg-blue-500" },
//   indigo: { border: "border-indigo-500", dotColor: "bg-indigo-500" },
//   purple: { border: "border-purple-500", dotColor: "bg-purple-500" },
//   pink: { border: "border-pink-500", dotColor: "bg-pink-500" },
//   green: { border: "border-green-500", dotColor: "bg-green-500" },
//   orange: { border: "border-orange-500", dotColor: "bg-orange-500" },
//   teal: { border: "border-teal-500", dotColor: "bg-teal-500" },
// };
// const colorCycle = ["blue", "indigo", "purple", "pink", "green", "orange", "teal"];

// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   return new Date(dateStr).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });
// };

// const TeacherProfile = () => {
//   const { data, isLoading, isError, refetch } = useMyInfoQuery();
//   const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();

//   const [isEditing, setIsEditing] = useState(false);
//   const [form] = Form.useForm();
//   const [activeTab, setActiveTab] = useState("1");

//   // State for dynamic lists
//   const [educationList, setEducationList] = useState([]);
//   const [bankList, setBankList] = useState([]);
//   const [socialList, setSocialList] = useState([]);

//   // Modal states
//   const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);
//   const [editingEducation, setEditingEducation] = useState(null);
//   const [educationForm] = Form.useForm();

//   const [isBankModalVisible, setIsBankModalVisible] = useState(false);
//   const [editingBank, setEditingBank] = useState(null);
//   const [bankForm] = Form.useForm();

//   const [isSocialModalVisible, setIsSocialModalVisible] = useState(false);
//   const [editingSocial, setEditingSocial] = useState(null);
//   const [socialForm] = Form.useForm();

//   // ── FIX: form ke data load howar shathe shathei populate kora hocche,
//   // shudhu "Edit" button chaplei na — tai view mode e-o field gulo blank thake na
//   useEffect(() => {
//     if (!data?.data?.profile) return;
//     const teacher = data.data.profile;

//     form.setFieldsValue({
//       name: teacher.name,
//       designation: teacher.designation,
//       qualification: teacher.qualification,
//       phone: teacher.phone,
//       alternativePhone: teacher.alternativePhone || "",
//       presentAddress: teacher.presentAddress || "",
//       permanentAddress: teacher.permanentAddress || "",
//       bloodGroup: teacher.bloodGroup || undefined,
//       gender: teacher.gender || undefined,
//       religion: teacher.religion || "",
//       maritalStatus: teacher.maritalStatus || undefined,
//       dateOfBirth: teacher.dateOfBirth ? dayjs(teacher.dateOfBirth) : null,
//       joinDate: teacher.joinDate ? dayjs(teacher.joinDate) : null,
//       schoolJoinDate: teacher.schoolJoinDate ? dayjs(teacher.schoolJoinDate) : null,
//       teachingExperience: teacher.teachingExperience || 0,
//       department: teacher.department || "",
//       subject: teacher.subject || "",
//       bio: teacher.bio || "",
//       teacherId: teacher.teacherId,
//       nid: teacher.nid || "",
//       birthCertificateNo: teacher.birthCertificateNo || "",
//       indexNumber: teacher.indexNumber || "",
//       governmentSalary: teacher.salary?.governmentSalary || 0,
//       schoolSalary: teacher.salary?.schoolSalary || 0,
//       emergencyContactName: teacher.emergencyContact?.name || "",
//       emergencyContactRelation: teacher.emergencyContact?.relation || "",
//       emergencyContactPhone: teacher.emergencyContact?.phone || "",
//     });

//     setEducationList((teacher.education || []).map((edu, idx) => ({
//       ...edu,
//       id: idx.toString(),
//       color: colorCycle[idx % colorCycle.length],
//     })));
//     setBankList((teacher.bankAccounts || []).map((bank, idx) => ({ ...bank, id: idx.toString() })));
//     setSocialList((teacher.social || []).map((social, idx) => ({ ...social, id: idx.toString() })));
//   }, [data, form]);

//   if (isLoading) {
//     return (
//       <div className="max-w-5xl mx-auto p-8">
//         <Card className="rounded-2xl">
//           <Skeleton active avatar paragraph={{ rows: 6 }} />
//         </Card>
//       </div>
//     );
//   }

//   if (isError || !data?.data?.profile) {
//     return (
//       <div className="flex items-center justify-center min-h-[50vh]">
//         <div className="text-center">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <p className="text-red-500 text-lg">Profile load korte problem hocche.</p>
//         </div>
//       </div>
//     );
//   }

//   const teacher = data.data.profile;

//   const handleEditToggle = () => {
//     if (isEditing) {
//       form.submit();
//     } else {
//       setIsEditing(true);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     // form ke original data diye abar populate kore dilam, jate unsaved changes thakle mishe na jay
//     form.setFieldsValue({
//       name: teacher.name,
//       designation: teacher.designation,
//       qualification: teacher.qualification,
//       phone: teacher.phone,
//       alternativePhone: teacher.alternativePhone || "",
//       presentAddress: teacher.presentAddress || "",
//       permanentAddress: teacher.permanentAddress || "",
//       bloodGroup: teacher.bloodGroup || undefined,
//       gender: teacher.gender || undefined,
//       religion: teacher.religion || "",
//       maritalStatus: teacher.maritalStatus || undefined,
//       dateOfBirth: teacher.dateOfBirth ? dayjs(teacher.dateOfBirth) : null,
//       joinDate: teacher.joinDate ? dayjs(teacher.joinDate) : null,
//       schoolJoinDate: teacher.schoolJoinDate ? dayjs(teacher.schoolJoinDate) : null,
//       teachingExperience: teacher.teachingExperience || 0,
//       department: teacher.department || "",
//       subject: teacher.subject || "",
//       bio: teacher.bio || "",
//       nid: teacher.nid || "",
//       birthCertificateNo: teacher.birthCertificateNo || "",
//       indexNumber: teacher.indexNumber || "",
//       governmentSalary: teacher.salary?.governmentSalary || 0,
//       schoolSalary: teacher.salary?.schoolSalary || 0,
//       emergencyContactName: teacher.emergencyContact?.name || "",
//       emergencyContactRelation: teacher.emergencyContact?.relation || "",
//       emergencyContactPhone: teacher.emergencyContact?.phone || "",
//     });
//   };

//   const handleFormSubmit = async (values) => {
//     try {
//       const formData = new FormData();

//       const fieldsToSend = {
//         name: values.name,
//         designation: values.designation,
//         qualification: values.qualification,
//         phone: values.phone,
//         alternativePhone: values.alternativePhone,
//         presentAddress: values.presentAddress,
//         permanentAddress: values.permanentAddress,
//         bloodGroup: values.bloodGroup,
//         gender: values.gender,
//         religion: values.religion,
//         maritalStatus: values.maritalStatus,
//         teachingExperience: values.teachingExperience,
//         department: values.department,
//         subject: values.subject,
//         bio: values.bio,
//         nid: values.nid,
//         birthCertificateNo: values.birthCertificateNo,
//         indexNumber: values.indexNumber,
//       };

//       Object.keys(fieldsToSend).forEach((key) => {
//         if (fieldsToSend[key] !== undefined && fieldsToSend[key] !== null && fieldsToSend[key] !== "") {
//           formData.append(key, String(fieldsToSend[key]));
//         }
//       });

//       if (values.dateOfBirth) formData.append("dateOfBirth", values.dateOfBirth.toISOString());
//       if (values.joinDate) formData.append("joinDate", values.joinDate.toISOString());
//       if (values.schoolJoinDate) formData.append("schoolJoinDate", values.schoolJoinDate.toISOString());

//       formData.append("salary[governmentSalary]", values.governmentSalary || 0);
//       formData.append("salary[schoolSalary]", values.schoolSalary || 0);

//       formData.append("emergencyContact", JSON.stringify({
//         name: values.emergencyContactName || "",
//         relation: values.emergencyContactRelation || "",
//         phone: values.emergencyContactPhone || "",
//       }));

//       formData.append("education", JSON.stringify(educationList.map(({ id, color, ...rest }) => rest)));
//       formData.append("bankAccounts", JSON.stringify(bankList.map(({ id, ...rest }) => rest)));
//       formData.append("social", JSON.stringify(socialList.map(({ id, ...rest }) => rest)));

//       await updateTeacher({ id: teacher._id, data: formData }).unwrap();

//       message.success("Profile updated successfully!");
//       setIsEditing(false);
//       refetch();
//     } catch (error) {
//       message.error(error?.data?.message || "Failed to update profile");
//     }
//   };

//   // Education CRUD
//   const handleAddEducation = () => {
//     setEditingEducation(null);
//     educationForm.resetFields();
//     setIsEducationModalVisible(true);
//   };
//   const handleEditEducation = (edu) => {
//     setEditingEducation(edu);
//     educationForm.setFieldsValue(edu);
//     setIsEducationModalVisible(true);
//   };
//   const handleDeleteEducation = (id) => {
//     setEducationList(educationList.filter((edu) => edu.id !== id));
//     message.success("Education removed");
//   };
//   const handleEducationSubmit = (values) => {
//     const newEdu = {
//       ...values,
//       id: editingEducation?.id || Date.now().toString(),
//       color: editingEducation?.color || colorCycle[educationList.length % colorCycle.length],
//     };
//     if (editingEducation) {
//       setEducationList(educationList.map((edu) => (edu.id === editingEducation.id ? newEdu : edu)));
//       message.success("Education updated");
//     } else {
//       setEducationList([...educationList, newEdu]);
//       message.success("Education added");
//     }
//     setIsEducationModalVisible(false);
//     educationForm.resetFields();
//   };

//   // Bank CRUD
//   const handleAddBank = () => {
//     setEditingBank(null);
//     bankForm.resetFields();
//     setIsBankModalVisible(true);
//   };
//   const handleEditBank = (bank) => {
//     setEditingBank(bank);
//     bankForm.setFieldsValue(bank);
//     setIsBankModalVisible(true);
//   };
//   const handleDeleteBank = (id) => {
//     setBankList(bankList.filter((bank) => bank.id !== id));
//     message.success("Bank account removed");
//   };
//   const handleBankSubmit = (values) => {
//     const newBank = { ...values, id: editingBank?.id || Date.now().toString() };
//     if (editingBank) {
//       setBankList(bankList.map((bank) => (bank.id === editingBank.id ? newBank : bank)));
//       message.success("Bank account updated");
//     } else {
//       setBankList([...bankList, newBank]);
//       message.success("Bank account added");
//     }
//     setIsBankModalVisible(false);
//     bankForm.resetFields();
//   };

//   // Social CRUD
//   const handleAddSocial = () => {
//     setEditingSocial(null);
//     socialForm.resetFields();
//     setIsSocialModalVisible(true);
//   };
//   const handleEditSocial = (social) => {
//     setEditingSocial(social);
//     socialForm.setFieldsValue(social);
//     setIsSocialModalVisible(true);
//   };
//   const handleDeleteSocial = (id) => {
//     setSocialList(socialList.filter((social) => social.id !== id));
//     message.success("Social link removed");
//   };
//   const handleSocialSubmit = (values) => {
//     const newSocial = { ...values, id: editingSocial?.id || Date.now().toString() };
//     if (editingSocial) {
//       setSocialList(socialList.map((social) => (social.id === editingSocial.id ? newSocial : social)));
//       message.success("Social link updated");
//     } else {
//       setSocialList([...socialList, newSocial]);
//       message.success("Social link added");
//     }
//     setIsSocialModalVisible(false);
//     socialForm.resetFields();
//   };

//   const renderEducationTimeline = () => {
//     if (educationList.length === 0) {
//       return (
//         <div className="text-center py-8 text-gray-400">
//           <BookOutlined className="text-4xl mb-2" />
//           <p>No education added yet</p>
//         </div>
//       );
//     }
//     return (
//       <div className="relative">
//         <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
//         {educationList.map((edu, index) => {
//           const c = colorMap[edu.color] || colorMap.blue;
//           return (
//             <div key={edu.id} className="relative pl-10 pb-8 last:pb-0 group">
//               <div className={`absolute left-1 top-1.5 w-6 h-6 rounded-full ${c.dotColor} border-2 border-white shadow-md flex items-center justify-center`}>
//                 <span className="text-white text-xs font-bold">{index + 1}</span>
//               </div>
//               <div className={`bg-white rounded-xl p-4 border-l-4 ${c.border} shadow-sm hover:shadow-md transition-all`}>
//                 <div className="flex flex-wrap justify-between items-start gap-2">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                       <h3 className="text-lg font-semibold text-gray-800">{edu.label}</h3>
//                       <Tag color={edu.color}>{edu.year}</Tag>
//                     </div>
//                     <p className="text-gray-600">{edu.institute}</p>
//                     {edu.grade && (
//                       <p className="text-sm text-gray-500 mt-1">
//                         <span className="font-medium">Grade:</span> {edu.grade}
//                       </p>
//                     )}
//                   </div>
//                   {isEditing && (
//                     <div className="flex gap-1">
//                       <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditEducation(edu)} className="text-blue-500" />
//                       <Popconfirm title="Delete education?" onConfirm={() => handleDeleteEducation(edu.id)} okText="Yes" cancelText="No">
//                         <Button type="text" size="small" icon={<DeleteOutlined />} className="text-red-500" />
//                       </Popconfirm>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   const InfoCard = ({ icon, label, value, color = "blue" }) => (
//     <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
//       <div className="flex items-start gap-3">
//         <div className={`text-${color}-500 text-xl mt-0.5`}>{icon}</div>
//         <div className="flex-1 min-w-0">
//           <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
//           <p className="text-gray-800 font-medium truncate">{value || "N/A"}</p>
//         </div>
//       </div>
//     </div>
//   );

//   const renderOverview = () => (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//       <InfoCard icon={<IdcardOutlined />} label="Teacher ID" value={teacher.teacherId} color="blue" />
//       <InfoCard icon={<UserOutlined />} label="Designation" value={teacher.designation} color="purple" />
//       <InfoCard icon={<TrophyOutlined />} label="Qualification" value={teacher.qualification} color="green" />
//       <InfoCard icon={<HeartOutlined />} label="Blood Group" value={teacher.bloodGroup} color="red" />
//       <InfoCard icon={<CalendarOutlined />} label="Date of Birth" value={formatDate(teacher.dateOfBirth)} color="orange" />
//       <InfoCard icon={<TeamOutlined />} label="Experience" value={`${teacher.teachingExperience || 0} Years`} color="indigo" />
//       <InfoCard icon={<CalendarOutlined />} label="Join Date" value={formatDate(teacher.joinDate)} color="teal" />
//       <InfoCard icon={<DollarOutlined />} label="Total Salary" value={`${(teacher.salary?.governmentSalary || 0) + (teacher.salary?.schoolSalary || 0)} BDT`} color="green" />
//       <InfoCard icon={<HomeOutlined />} label="Present Address" value={teacher.presentAddress} color="gray" />
//     </div>
//   );

//   // ── View-mode e clean Descriptions dekhabe; Edit-mode e Form dekhabe.
//   // Age eirokom disabled Form dia dekhano hoto bole data thakleo "normal" dekhachhilo na.
//   const PersonalInfoView = () => (
//     <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
//       <Descriptions.Item label="Teacher ID">{teacher.teacherId || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Full Name">{teacher.name || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Designation">{teacher.designation || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Qualification">{teacher.qualification || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Department">{teacher.department || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Subject">{teacher.subject || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Gender">{teacher.gender || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Religion">{teacher.religion || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Marital Status">{teacher.maritalStatus || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Date of Birth">{formatDate(teacher.dateOfBirth)}</Descriptions.Item>
//       <Descriptions.Item label="Blood Group">{teacher.bloodGroup || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="NID Number">{teacher.nid || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Birth Certificate No">{teacher.birthCertificateNo || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Index Number">{teacher.indexNumber || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Bio" span={2}>{teacher.bio || "N/A"}</Descriptions.Item>
//     </Descriptions>
//   );

//   const PersonalInfoForm = () => (
//     <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <Form.Item name="teacherId" label="Teacher ID">
//           <Input prefix={<IdcardOutlined />} disabled />
//         </Form.Item>
//         <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
//           <Input prefix={<UserOutlined />} />
//         </Form.Item>
//         <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
//           <Input prefix={<TrophyOutlined />} />
//         </Form.Item>
//         <Form.Item name="qualification" label="Qualification">
//           <Input />
//         </Form.Item>
//         <Form.Item name="department" label="Department">
//           <Input />
//         </Form.Item>
//         <Form.Item name="subject" label="Subject">
//           <Input />
//         </Form.Item>
//         <Form.Item name="gender" label="Gender">
//           <Select allowClear>
//             <Option value="Male">Male</Option>
//             <Option value="Female">Female</Option>
//             <Option value="Other">Other</Option>
//           </Select>
//         </Form.Item>
//         <Form.Item name="religion" label="Religion">
//           <Input />
//         </Form.Item>
//         <Form.Item name="maritalStatus" label="Marital Status">
//           <Select allowClear>
//             <Option value="Single">Single</Option>
//             <Option value="Married">Married</Option>
//             <Option value="Divorced">Divorced</Option>
//             <Option value="Widowed">Widowed</Option>
//           </Select>
//         </Form.Item>
//         <Form.Item name="dateOfBirth" label="Date of Birth">
//           <DatePicker className="w-full" format="DD-MM-YYYY" />
//         </Form.Item>
//         <Form.Item name="bloodGroup" label="Blood Group">
//           <Select allowClear>
//             {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
//               <Option key={bg} value={bg}>{bg}</Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.Item name="nid" label="NID Number">
//           <Input />
//         </Form.Item>
//         <Form.Item name="birthCertificateNo" label="Birth Certificate No">
//           <Input />
//         </Form.Item>
//         <Form.Item name="indexNumber" label="Index Number">
//           <Input />
//         </Form.Item>
//       </div>
//       <Form.Item name="bio" label="Bio">
//         <TextArea rows={3} />
//       </Form.Item>
//     </Form>
//   );

//   const ContactView = () => (
//     <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
//       <Descriptions.Item label="Phone">{teacher.phone || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Alternative Phone">{teacher.alternativePhone || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Present Address" span={2}>{teacher.presentAddress || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Permanent Address" span={2}>{teacher.permanentAddress || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Emergency Contact Name">{teacher.emergencyContact?.name || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Relation">{teacher.emergencyContact?.relation || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Emergency Contact Phone">{teacher.emergencyContact?.phone || "N/A"}</Descriptions.Item>
//     </Descriptions>
//   );

//   const ContactForm = () => (
//     <Form form={form} layout="vertical">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
//           <Input prefix={<PhoneOutlined />} />
//         </Form.Item>
//         <Form.Item name="alternativePhone" label="Alternative Phone">
//           <Input prefix={<PhoneOutlined />} />
//         </Form.Item>
//       </div>
//       <Form.Item name="presentAddress" label="Present Address">
//         <TextArea rows={2} />
//       </Form.Item>
//       <Form.Item name="permanentAddress" label="Permanent Address">
//         <TextArea rows={2} />
//       </Form.Item>
//       <Divider>Emergency Contact</Divider>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Form.Item name="emergencyContactName" label="Name">
//           <Input />
//         </Form.Item>
//         <Form.Item name="emergencyContactRelation" label="Relation">
//           <Input />
//         </Form.Item>
//         <Form.Item name="emergencyContactPhone" label="Phone">
//           <Input />
//         </Form.Item>
//       </div>
//     </Form>
//   );

//   const ProfessionalView = () => (
//     <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
//       <Descriptions.Item label="Join Date">{formatDate(teacher.joinDate)}</Descriptions.Item>
//       <Descriptions.Item label="School Join Date">{formatDate(teacher.schoolJoinDate)}</Descriptions.Item>
//       <Descriptions.Item label="Teaching Experience">{teacher.teachingExperience || 0} Years</Descriptions.Item>
//       <Descriptions.Item label="Employment Type">{teacher.employmentType || "N/A"}</Descriptions.Item>
//       <Descriptions.Item label="Government Salary">৳{teacher.salary?.governmentSalary || 0}</Descriptions.Item>
//       <Descriptions.Item label="School Salary">৳{teacher.salary?.schoolSalary || 0}</Descriptions.Item>
//     </Descriptions>
//   );

//   const ProfessionalForm = () => (
//     <Form form={form} layout="vertical">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Form.Item name="joinDate" label="Join Date">
//           <DatePicker className="w-full" format="DD-MM-YYYY" />
//         </Form.Item>
//         <Form.Item name="schoolJoinDate" label="School Join Date">
//           <DatePicker className="w-full" format="DD-MM-YYYY" />
//         </Form.Item>
//         <Form.Item name="teachingExperience" label="Teaching Experience (Years)">
//           <InputNumber className="w-full" min={0} />
//         </Form.Item>
//       </div>
//       <Divider>Salary Information</Divider>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Form.Item name="governmentSalary" label="Government Salary (BDT)">
//           <InputNumber className="w-full" min={0} />
//         </Form.Item>
//         <Form.Item name="schoolSalary" label="School Salary (BDT)">
//           <InputNumber className="w-full" min={0} />
//         </Form.Item>
//       </div>
//     </Form>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//               <UserOutlined className="text-blue-600" />
//               Teacher Profile
//             </h1>
//             <p className="text-gray-500">Manage your professional information</p>
//           </div>
//           <Space>
//             {isEditing && (
//               <Button icon={<CloseOutlined />} onClick={handleCancelEdit}>
//                 Cancel
//               </Button>
//             )}
//             <Button
//               type={isEditing ? "primary" : "default"}
//               icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
//               onClick={handleEditToggle}
//               loading={isUpdating}
//               className={isEditing ? "bg-blue-600" : ""}
//             >
//               {isEditing ? "Save Changes" : "Edit Profile"}
//             </Button>
//           </Space>
//         </div>

//         {/* Main Profile Card */}
//         <Card className="shadow-xl rounded-2xl overflow-hidden border-0">
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-700 -mx-6 -mt-6 px-6 py-8 mb-6">
//             <div className="flex flex-col md:flex-row items-center gap-6">
//               <Avatar
//                 size={110}
//                 src={teacher.thumbnail || undefined}
//                 icon={<UserOutlined />}
//                 className="border-4 border-white shadow-lg"
//               />
//               <div className="flex-1 text-center md:text-left">
//                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
//                   <h2 className="text-2xl md:text-3xl font-bold text-white">{teacher.name}</h2>
//                   <Tag color="green">{teacher.status || "Active"}</Tag>
//                   <Tag color="blue">{teacher.employmentType || "Permanent"}</Tag>
//                 </div>
//                 <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-blue-100">
//                   <span><span className="font-medium">Teacher ID:</span> {teacher.teacherId}</span>
//                   <span><span className="font-medium">Designation:</span> {teacher.designation}</span>
//                   {teacher.department && (
//                     <span><span className="font-medium">Department:</span> {teacher.department}</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Tabs activeKey={activeTab} onChange={setActiveTab}>
//             <Tabs.TabPane tab={<span><UserOutlined /> Personal Info</span>} key="1">
//               {isEditing ? <PersonalInfoForm /> : <PersonalInfoView />}
//             </Tabs.TabPane>

//             <Tabs.TabPane tab={<span><PhoneOutlined /> Contact</span>} key="2">
//               {isEditing ? <ContactForm /> : <ContactView />}
//             </Tabs.TabPane>

//             <Tabs.TabPane tab={<span><BookOutlined /> Professional</span>} key="3">
//               {isEditing ? <ProfessionalForm /> : <ProfessionalView />}
//             </Tabs.TabPane>

//             <Tabs.TabPane tab={<span><BookOutlined /> Education</span>} key="4">
//               <div className="mb-4 flex justify-between items-center">
//                 <span className="text-gray-500 text-sm">{educationList.length} education records</span>
//                 {isEditing && (
//                   <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEducation}>
//                     Add Education
//                   </Button>
//                 )}
//               </div>
//               {renderEducationTimeline()}
//             </Tabs.TabPane>

//             <Tabs.TabPane tab={<span><BankOutlined /> Banking & Social</span>} key="5">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                     <BankOutlined className="text-blue-500" /> Bank Accounts
//                   </h3>
//                   {bankList.length > 0 ? (
//                     bankList.map((bank) => (
//                       <div key={bank.id} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <p className="font-medium text-gray-800">{bank.bankName}</p>
//                             <p className="text-sm text-gray-600">A/C: {bank.accountNumber}</p>
//                             <p className="text-sm text-gray-600">Name: {bank.accountName}</p>
//                             {bank.branchName && <p className="text-sm text-gray-600">Branch: {bank.branchName}</p>}
//                             {bank.routingNumber && <p className="text-sm text-gray-600">Routing: {bank.routingNumber}</p>}
//                           </div>
//                           {isEditing && (
//                             <div className="flex gap-1">
//                               <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditBank(bank)} className="text-blue-500" />
//                               <Popconfirm title="Delete bank account?" onConfirm={() => handleDeleteBank(bank.id)} okText="Yes" cancelText="No">
//                                 <Button type="text" size="small" icon={<DeleteOutlined />} className="text-red-500" />
//                               </Popconfirm>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-400">No bank accounts added</p>
//                   )}
//                   {isEditing && (
//                     <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddBank}>
//                       Add Bank Account
//                     </Button>
//                   )}
//                 </div>

//                 <div>
//                   <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                     <GlobalOutlined className="text-indigo-500" /> Social Links
//                   </h3>
//                   {socialList.length > 0 ? (
//                     socialList.map((social) => (
//                       <div key={social.id} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <p className="font-medium text-gray-800">{social.platform}</p>
//                             <a href={social.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline truncate block">
//                               {social.link}
//                             </a>
//                           </div>
//                           {isEditing && (
//                             <div className="flex gap-1">
//                               <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditSocial(social)} className="text-blue-500" />
//                               <Popconfirm title="Delete social link?" onConfirm={() => handleDeleteSocial(social.id)} okText="Yes" cancelText="No">
//                                 <Button type="text" size="small" icon={<DeleteOutlined />} className="text-red-500" />
//                               </Popconfirm>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-400">No social links added</p>
//                   )}
//                   {isEditing && (
//                     <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddSocial}>
//                       Add Social Link
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </Tabs.TabPane>

//             <Tabs.TabPane tab={<span><HeartOutlined /> Overview</span>} key="6">
//               {renderOverview()}
//             </Tabs.TabPane>
//           </Tabs>
//         </Card>
//       </div>

//       {/* Education Modal */}
//       <Modal
//         title={editingEducation ? "Edit Education" : "Add Education"}
//         open={isEducationModalVisible}
//         onCancel={() => { setIsEducationModalVisible(false); educationForm.resetFields(); }}
//         footer={null}
//         width={500}
//       >
//         <Form form={educationForm} layout="vertical" onFinish={handleEducationSubmit}>
//           <Form.Item name="label" label="Degree/Level" rules={[{ required: true }]}>
//             <Input placeholder="e.g., SSC, HSC, B.Sc" />
//           </Form.Item>
//           <Form.Item name="institute" label="Institute" rules={[{ required: true }]}>
//             <Input placeholder="Institute name" />
//           </Form.Item>
//           <Form.Item name="year" label="Year" rules={[{ required: true }]}>
//             <InputNumber className="w-full" placeholder="e.g., 2020" min={1900} max={2100} />
//           </Form.Item>
//           <Form.Item name="grade" label="Grade/GPA">
//             <Input placeholder="e.g., 5.00, A+" />
//           </Form.Item>
//           <Form.Item className="flex justify-end gap-2 mb-0">
//             <Button onClick={() => { setIsEducationModalVisible(false); educationForm.resetFields(); }}>Cancel</Button>
//             <Button type="primary" htmlType="submit">{editingEducation ? "Update" : "Add"} Education</Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Bank Modal */}
//       <Modal
//         title={editingBank ? "Edit Bank Account" : "Add Bank Account"}
//         open={isBankModalVisible}
//         onCancel={() => { setIsBankModalVisible(false); bankForm.resetFields(); }}
//         footer={null}
//         width={500}
//       >
//         <Form form={bankForm} layout="vertical" onFinish={handleBankSubmit}>
//           <Form.Item name="bankName" label="Bank Name" rules={[{ required: true }]}>
//             <Input placeholder="e.g., Sonali Bank" />
//           </Form.Item>
//           <Form.Item name="accountName" label="Account Name" rules={[{ required: true }]}>
//             <Input placeholder="Account holder name" />
//           </Form.Item>
//           <Form.Item name="accountNumber" label="Account Number" rules={[{ required: true }]}>
//             <Input placeholder="Account number" />
//           </Form.Item>
//           <Form.Item name="branchName" label="Branch Name">
//             <Input placeholder="Branch name" />
//           </Form.Item>
//           <Form.Item name="routingNumber" label="Routing Number">
//             <Input placeholder="Routing number" />
//           </Form.Item>
//           <Form.Item className="flex justify-end gap-2 mb-0">
//             <Button onClick={() => { setIsBankModalVisible(false); bankForm.resetFields(); }}>Cancel</Button>
//             <Button type="primary" htmlType="submit">{editingBank ? "Update" : "Add"} Bank Account</Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Social Modal */}
//       <Modal
//         title={editingSocial ? "Edit Social Link" : "Add Social Link"}
//         open={isSocialModalVisible}
//         onCancel={() => { setIsSocialModalVisible(false); socialForm.resetFields(); }}
//         footer={null}
//         width={500}
//       >
//         <Form form={socialForm} layout="vertical" onFinish={handleSocialSubmit}>
//           <Form.Item name="platform" label="Platform" rules={[{ required: true }]}>
//             <Input placeholder="e.g., Facebook, LinkedIn" />
//           </Form.Item>
//           <Form.Item name="link" label="Profile URL" rules={[{ required: true }]}>
//             <Input placeholder="https://facebook.com/username" />
//           </Form.Item>
//           <Form.Item className="flex justify-end gap-2 mb-0">
//             <Button onClick={() => { setIsSocialModalVisible(false); socialForm.resetFields(); }}>Cancel</Button>
//             <Button type="primary" htmlType="submit">{editingSocial ? "Update" : "Add"} Social Link</Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default TeacherProfile;

// import React, { useState, useEffect } from "react";
// import { useMyInfoQuery } from "../../redux/api/userApi";
// import { useUpdateTeacherMutation } from "../../redux/api/teacherApi";
// import { 
//   Form, Input, Button, Upload, message, Tabs, Select, DatePicker, 
//   InputNumber, Card, Tag, Divider, Modal, Popconfirm, Row, Col, Space, Badge
// } from "antd";
// import { 
//   UploadOutlined, 
//   EditOutlined, 
//   SaveOutlined, 
//   PlusOutlined, 
//   DeleteOutlined,
//   UserOutlined,
//   PhoneOutlined,
//   MailOutlined,
//   HomeOutlined,
//   HeartOutlined,
//   CalendarOutlined,
//   BookOutlined,
//   BankOutlined,
//   GlobalOutlined,
//   IdcardOutlined,
//   TrophyOutlined,
//   TeamOutlined,
//   DollarOutlined,
//   CloseOutlined,
//   CheckOutlined
// } from "@ant-design/icons";
// import dayjs from "dayjs";

// const { Option } = Select;
// const { TextArea } = Input;

// // Color mapping for education badges
// const colorMap = {
//   blue: { border: "border-blue-500", badgeBg: "bg-blue-100", badgeText: "text-blue-800", dotColor: "bg-blue-500" },
//   indigo: { border: "border-indigo-500", badgeBg: "bg-indigo-100", badgeText: "text-indigo-800", dotColor: "bg-indigo-500" },
//   purple: { border: "border-purple-500", badgeBg: "bg-purple-100", badgeText: "text-purple-800", dotColor: "bg-purple-500" },
//   pink: { border: "border-pink-500", badgeBg: "bg-pink-100", badgeText: "text-pink-800", dotColor: "bg-pink-500" },
//   green: { border: "border-green-500", badgeBg: "bg-green-100", badgeText: "text-green-800", dotColor: "bg-green-500" },
//   orange: { border: "border-orange-500", badgeBg: "bg-orange-100", badgeText: "text-orange-800", dotColor: "bg-orange-500" },
//   teal: { border: "border-teal-500", badgeBg: "bg-teal-100", badgeText: "text-teal-800", dotColor: "bg-teal-500" },
// };

// const colorCycle = ["blue", "indigo", "purple", "pink", "green", "orange", "teal"];

// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   return new Date(dateStr).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });
// };

// // Utility function for form data conversion
// const convertToFormData = (data, formData = new FormData(), parentKey = "") => {
//   Object.entries(data).forEach(([key, value]) => {
//     const fieldName = parentKey ? `${parentKey}[${key}]` : key;

//     if (value === undefined || value === null || value === "") return;

//     if (value && value.fileList) {
//       formData.append(key, value.fileList[0].originFileObj);
//     } else if (value?.originFileObj instanceof File) {
//       formData.append(key, value.originFileObj);
//     } else if (value && value.$isDayjsObject) {
//       formData.append(fieldName, value.toDate().toISOString());
//     } else if (Array.isArray(value)) {
//       formData.append(fieldName, JSON.stringify(value));
//     } else if (typeof value === "object" && value !== null) {
//       convertToFormData(value, formData, fieldName);
//     } else {
//       formData.append(fieldName, String(value));
//     }
//   });
//   return formData;
// };

// const TeacherProfile = () => {
//   const { data, isLoading, isError, refetch } = useMyInfoQuery();
//   const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();

//   const [isEditing, setIsEditing] = useState(false);
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("1");

//   // State for dynamic lists
//   const [educationList, setEducationList] = useState([]);
//   const [bankList, setBankList] = useState([]);
//   const [socialList, setSocialList] = useState([]);

//   // Modal states
//   const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);
//   const [editingEducation, setEditingEducation] = useState(null);
//   const [educationForm] = Form.useForm();

//   const [isBankModalVisible, setIsBankModalVisible] = useState(false);
//   const [editingBank, setEditingBank] = useState(null);
//   const [bankForm] = Form.useForm();

//   const [isSocialModalVisible, setIsSocialModalVisible] = useState(false);
//   const [editingSocial, setEditingSocial] = useState(null);
//   const [socialForm] = Form.useForm();

//   // Initialize data when API data loads
//   useEffect(() => {
//     if (data?.data?.profile) {
//       const teacher = data.data.profile;
      
//       // Initialize education with colors
//       const eduList = (teacher.education || []).map((edu, idx) => ({
//         ...edu,
//         id: idx.toString(),
//         color: colorCycle[idx % colorCycle.length],
//       }));
//       setEducationList(eduList);

//       // Initialize bank accounts
//       const bankList = (teacher.bankAccounts || []).map((bank, idx) => ({
//         ...bank,
//         id: idx.toString(),
//       }));
//       setBankList(bankList);

//       // Initialize social links
//       const socialList = (teacher.social || []).map((social, idx) => ({
//         ...social,
//         id: idx.toString(),
//       }));
//       setSocialList(socialList);
//     }
//   }, [data]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-500">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isError || !data?.data?.profile) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <p className="text-red-500 text-lg">Profile load korte problem hocche.</p>
//         </div>
//       </div>
//     );
//   }

//   const user = data.data;
//   const teacher = data.data.profile;

//   // Handle edit toggle
//   const handleEditToggle = () => {
//     if (isEditing) {
//       form.submit();
//     } else {
//       setIsEditing(true);
      
//       // Set form values
//       const formValues = {
//         name: teacher.name,
//         designation: teacher.designation,
//         qualification: teacher.qualification,
//         phone: teacher.phone,
//         alternativePhone: teacher.alternativePhone || '',
//         presentAddress: teacher.presentAddress || '',
//         permanentAddress: teacher.permanentAddress || '',
//         bloodGroup: teacher.bloodGroup || '',
//         gender: teacher.gender || '',
//         religion: teacher.religion || '',
//         maritalStatus: teacher.maritalStatus || '',
//         dateOfBirth: teacher.dateOfBirth ? dayjs(teacher.dateOfBirth) : null,
//         joinDate: teacher.joinDate ? dayjs(teacher.joinDate) : null,
//         schoolJoinDate: teacher.schoolJoinDate ? dayjs(teacher.schoolJoinDate) : null,
//         teachingExperience: teacher.teachingExperience || 0,
//         department: teacher.department || '',
//         subject: teacher.subject || '',
//         bio: teacher.bio || '',
//         teacherId: teacher.teacherId,
//         nid: teacher.nid || '',
//         birthCertificateNo: teacher.birthCertificateNo || '',
//         indexNumber: teacher.indexNumber || '',
//         governmentSalary: teacher.salary?.governmentSalary || 0,
//         schoolSalary: teacher.salary?.schoolSalary || 0,
//         emergencyContactName: teacher.emergencyContact?.name || '',
//         emergencyContactRelation: teacher.emergencyContact?.relation || '',
//         emergencyContactPhone: teacher.emergencyContact?.phone || '',
//       };
//       form.setFieldsValue(formValues);
//     }
//   };

//   // Handle form submit
//   const handleFormSubmit = async (values) => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
      
//       // Add all text fields
//       const fieldsToSend = {
//         name: values.name,
//         designation: values.designation,
//         qualification: values.qualification,
//         phone: values.phone,
//         alternativePhone: values.alternativePhone,
//         presentAddress: values.presentAddress,
//         permanentAddress: values.permanentAddress,
//         bloodGroup: values.bloodGroup,
//         gender: values.gender,
//         religion: values.religion,
//         maritalStatus: values.maritalStatus,
//         teachingExperience: values.teachingExperience,
//         department: values.department,
//         subject: values.subject,
//         bio: values.bio,
//         nid: values.nid,
//         birthCertificateNo: values.birthCertificateNo,
//         indexNumber: values.indexNumber,
//       };

//       Object.keys(fieldsToSend).forEach(key => {
//         if (fieldsToSend[key] !== undefined && fieldsToSend[key] !== null && fieldsToSend[key] !== '') {
//           formData.append(key, String(fieldsToSend[key]));
//         }
//       });

//       // Handle dates
//       if (values.dateOfBirth) formData.append('dateOfBirth', values.dateOfBirth.toISOString());
//       if (values.joinDate) formData.append('joinDate', values.joinDate.toISOString());
//       if (values.schoolJoinDate) formData.append('schoolJoinDate', values.schoolJoinDate.toISOString());

//       // Handle salary
//       formData.append('salary[governmentSalary]', values.governmentSalary || 0);
//       formData.append('salary[schoolSalary]', values.schoolSalary || 0);

//       // Handle emergency contact
//       const emergencyContact = {
//         name: values.emergencyContactName || '',
//         relation: values.emergencyContactRelation || '',
//         phone: values.emergencyContactPhone || '',
//       };
//       formData.append('emergencyContact', JSON.stringify(emergencyContact));

//       // Handle education
//       const eduData = educationList.map(({ id, color, ...rest }) => rest);
//       formData.append('education', JSON.stringify(eduData));

//       // Handle bank accounts
//       const bankData = bankList.map(({ id, ...rest }) => rest);
//       formData.append('bankAccounts', JSON.stringify(bankData));

//       // Handle social
//       const socialData = socialList.map(({ id, ...rest }) => rest);
//       formData.append('social', JSON.stringify(socialData));

//       await updateTeacher({
//         id: teacher._id,
//         data: formData,
//       }).unwrap();

//       message.success("Profile updated successfully!");
//       setIsEditing(false);
//       refetch();
//     } catch (error) {
//       message.error(error?.data?.message || "Failed to update profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Education CRUD operations
//   const handleAddEducation = () => {
//     setEditingEducation(null);
//     educationForm.resetFields();
//     setIsEducationModalVisible(true);
//   };

//   const handleEditEducation = (edu) => {
//     setEditingEducation(edu);
//     educationForm.setFieldsValue(edu);
//     setIsEducationModalVisible(true);
//   };

//   const handleDeleteEducation = (id) => {
//     setEducationList(educationList.filter(edu => edu.id !== id));
//     message.success("Education removed");
//   };

//   const handleEducationSubmit = (values) => {
//     const newEdu = {
//       ...values,
//       id: editingEducation?.id || Date.now().toString(),
//       color: colorCycle[educationList.length % colorCycle.length],
//     };

//     if (editingEducation) {
//       setEducationList(educationList.map(edu => 
//         edu.id === editingEducation.id ? newEdu : edu
//       ));
//       message.success("Education updated");
//     } else {
//       setEducationList([...educationList, newEdu]);
//       message.success("Education added");
//     }

//     setIsEducationModalVisible(false);
//     educationForm.resetFields();
//   };

//   // Bank CRUD operations
//   const handleAddBank = () => {
//     setEditingBank(null);
//     bankForm.resetFields();
//     setIsBankModalVisible(true);
//   };

//   const handleEditBank = (bank) => {
//     setEditingBank(bank);
//     bankForm.setFieldsValue(bank);
//     setIsBankModalVisible(true);
//   };

//   const handleDeleteBank = (id) => {
//     setBankList(bankList.filter(bank => bank.id !== id));
//     message.success("Bank account removed");
//   };

//   const handleBankSubmit = (values) => {
//     const newBank = {
//       ...values,
//       id: editingBank?.id || Date.now().toString(),
//     };

//     if (editingBank) {
//       setBankList(bankList.map(bank => 
//         bank.id === editingBank.id ? newBank : bank
//       ));
//       message.success("Bank account updated");
//     } else {
//       setBankList([...bankList, newBank]);
//       message.success("Bank account added");
//     }

//     setIsBankModalVisible(false);
//     bankForm.resetFields();
//   };

//   // Social CRUD operations
//   const handleAddSocial = () => {
//     setEditingSocial(null);
//     socialForm.resetFields();
//     setIsSocialModalVisible(true);
//   };

//   const handleEditSocial = (social) => {
//     setEditingSocial(social);
//     socialForm.setFieldsValue(social);
//     setIsSocialModalVisible(true);
//   };

//   const handleDeleteSocial = (id) => {
//     setSocialList(socialList.filter(social => social.id !== id));
//     message.success("Social link removed");
//   };

//   const handleSocialSubmit = (values) => {
//     const newSocial = {
//       ...values,
//       id: editingSocial?.id || Date.now().toString(),
//     };

//     if (editingSocial) {
//       setSocialList(socialList.map(social => 
//         social.id === editingSocial.id ? newSocial : social
//       ));
//       message.success("Social link updated");
//     } else {
//       setSocialList([...socialList, newSocial]);
//       message.success("Social link added");
//     }

//     setIsSocialModalVisible(false);
//     socialForm.resetFields();
//   };

//   // Render education timeline
//   const renderEducationTimeline = () => {
//     if (educationList.length === 0) {
//       return (
//         <div className="text-center py-8 text-gray-400">
//           <BookOutlined className="text-4xl mb-2" />
//           <p>No education added yet</p>
//         </div>
//       );
//     }

//     return (
//       <div className="relative">
//         <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
//         {educationList.map((edu, index) => {
//           const c = colorMap[edu.color] || colorMap.blue;
//           return (
//             <div key={edu.id} className="relative pl-10 pb-8 last:pb-0 group">
//               <div className={`absolute left-1 top-1.5 w-6 h-6 rounded-full ${c.dotColor} border-2 border-white shadow-md flex items-center justify-center`}>
//                 <span className="text-white text-xs font-bold">{index + 1}</span>
//               </div>
              
//               <div className={`bg-white rounded-xl p-4 border-l-4 ${c.border} shadow-sm hover:shadow-md transition-all`}>
//                 <div className="flex flex-wrap justify-between items-start gap-2">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                       <h3 className="text-lg font-semibold text-gray-800">{edu.label}</h3>
//                       <Tag color={edu.color}>{edu.year}</Tag>
//                     </div>
//                     <p className="text-gray-600">{edu.institute}</p>
//                     {edu.grade && (
//                       <p className="text-sm text-gray-500 mt-1">
//                         <span className="font-medium">Grade:</span> {edu.grade}
//                       </p>
//                     )}
//                   </div>
                  
//                   {isEditing && (
//                     <div className="flex gap-1">
//                       <Button 
//                         type="text" 
//                         size="small" 
//                         icon={<EditOutlined />}
//                         onClick={() => handleEditEducation(edu)}
//                         className="text-blue-500"
//                       />
//                       <Popconfirm
//                         title="Delete education?"
//                         onConfirm={() => handleDeleteEducation(edu.id)}
//                         okText="Yes"
//                         cancelText="No"
//                       >
//                         <Button 
//                           type="text" 
//                           size="small" 
//                           icon={<DeleteOutlined />}
//                           className="text-red-500"
//                         />
//                       </Popconfirm>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   // Info card component
//   const InfoCard = ({ icon, label, value, color = "blue" }) => (
//     <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
//       <div className="flex items-start gap-3">
//         <div className={`text-${color}-500 text-xl mt-0.5`}>{icon}</div>
//         <div className="flex-1 min-w-0">
//           <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
//           <p className="text-gray-800 font-medium truncate">{value || "N/A"}</p>
//         </div>
//       </div>
//     </div>
//   );

//   // Render overview
//   const renderOverview = () => {
//     return (
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           <InfoCard icon={<IdcardOutlined />} label="Teacher ID" value={teacher.teacherId} color="blue" />
//           <InfoCard icon={<UserOutlined />} label="Designation" value={teacher.designation} color="purple" />
//           <InfoCard icon={<TrophyOutlined />} label="Qualification" value={teacher.qualification} color="green" />
//           <InfoCard icon={<HeartOutlined />} label="Blood Group" value={teacher.bloodGroup} color="red" />
//           <InfoCard icon={<CalendarOutlined />} label="Date of Birth" value={formatDate(teacher.dateOfBirth)} color="orange" />
//           <InfoCard icon={<TeamOutlined />} label="Experience" value={`${teacher.teachingExperience || 0} Years`} color="indigo" />
//           <InfoCard icon={<CalendarOutlined />} label="Join Date" value={formatDate(teacher.joinDate)} color="teal" />
//           <InfoCard icon={<DollarOutlined />} label="Total Salary" value={`${(teacher.salary?.governmentSalary || 0) + (teacher.salary?.schoolSalary || 0)} BDT`} color="green" />
//           <InfoCard icon={<HomeOutlined />} label="Present Address" value={teacher.presentAddress} color="gray" />
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//               <UserOutlined className="text-blue-600" />
//               Teacher Profile
//             </h1>
//             <p className="text-gray-500">Manage your professional information</p>
//           </div>
//           <Button
//             type={isEditing ? "primary" : "default"}
//             icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
//             onClick={handleEditToggle}
//             loading={loading || isUpdating}
//             className={isEditing ? "bg-blue-600" : ""}
//           >
//             {isEditing ? "Save Changes" : "Edit Profile"}
//           </Button>
//         </div>

//         {/* Main Profile Card */}
//         <Card className="shadow-xl rounded-2xl overflow-hidden border-0">
//           <div className="p-6">
//             {/* Profile Header */}
//             <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b border-gray-200">
//               <div className="relative">
//                 <img
//                   src={teacher.thumbnail || "https://i.pravatar.cc/150?img=12"}
//                   alt={teacher.name}
//                   className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-500 shadow-lg object-cover"
//                 />
//               </div>
//               <div className="flex-1">
//                 <div className="flex flex-wrap items-center gap-3">
//                   <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
//                     {teacher.name}
//                   </h2>
//                   <Tag color="green" className="px-3 py-1">
//                     {teacher.status || 'Active'}
//                   </Tag>
//                   <Tag color="blue">{teacher.employmentType || 'Permanent'}</Tag>
//                 </div>
//                 <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
//                   <span><span className="font-medium">Teacher ID:</span> {teacher.teacherId}</span>
//                   <span><span className="font-medium">Designation:</span> {teacher.designation}</span>
//                   {teacher.department && (
//                     <span><span className="font-medium">Department:</span> {teacher.department}</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Profile Content with Tabs */}
//             <Tabs 
//               activeKey={activeTab} 
//               onChange={setActiveTab}
//               className="mt-6"
//               tabBarStyle={{ borderBottom: '2px solid #e5e7eb' }}
//             >
//               {/* Tab 1: Personal Information */}
//               <Tabs.TabPane tab={<span><UserOutlined /> Personal Info</span>} key="1">
//                 <Form form={form} layout="vertical" onFinish={handleFormSubmit} disabled={!isEditing}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     <Form.Item name="teacherId" label="Teacher ID">
//                       <Input prefix={<IdcardOutlined />} disabled />
//                     </Form.Item>
//                     <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
//                       <Input prefix={<UserOutlined />} />
//                     </Form.Item>
//                     <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
//                       <Input prefix={<TrophyOutlined />} />
//                     </Form.Item>
//                     <Form.Item name="qualification" label="Qualification">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="department" label="Department">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="subject" label="Subject">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="gender" label="Gender">
//                       <Select>
//                         <Option value="Male">Male</Option>
//                         <Option value="Female">Female</Option>
//                         <Option value="Other">Other</Option>
//                       </Select>
//                     </Form.Item>
//                     <Form.Item name="religion" label="Religion">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="maritalStatus" label="Marital Status">
//                       <Select>
//                         <Option value="Single">Single</Option>
//                         <Option value="Married">Married</Option>
//                         <Option value="Divorced">Divorced</Option>
//                         <Option value="Widowed">Widowed</Option>
//                       </Select>
//                     </Form.Item>
//                     <Form.Item name="dateOfBirth" label="Date of Birth">
//                       <DatePicker className="w-full" />
//                     </Form.Item>
//                     <Form.Item name="bloodGroup" label="Blood Group">
//                       <Select>
//                         <Option value="A+">A+</Option>
//                         <Option value="A-">A-</Option>
//                         <Option value="B+">B+</Option>
//                         <Option value="B-">B-</Option>
//                         <Option value="AB+">AB+</Option>
//                         <Option value="AB-">AB-</Option>
//                         <Option value="O+">O+</Option>
//                         <Option value="O-">O-</Option>
//                       </Select>
//                     </Form.Item>
//                     <Form.Item name="nid" label="NID Number">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="birthCertificateNo" label="Birth Certificate No">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="indexNumber" label="Index Number">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="bio" label="Bio" span={24}>
//                       <TextArea rows={3} />
//                     </Form.Item>
//                   </div>
//                 </Form>
//               </Tabs.TabPane>

//               {/* Tab 2: Contact */}
//               <Tabs.TabPane tab={<span><PhoneOutlined /> Contact</span>} key="2">
//                 <Form form={form} layout="vertical" disabled={!isEditing}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
//                       <Input prefix={<PhoneOutlined />} />
//                     </Form.Item>
//                     <Form.Item name="alternativePhone" label="Alternative Phone">
//                       <Input prefix={<PhoneOutlined />} />
//                     </Form.Item>
//                     <Form.Item name="presentAddress" label="Present Address" span={24}>
//                       <TextArea rows={2} />
//                     </Form.Item>
//                     <Form.Item name="permanentAddress" label="Permanent Address" span={24}>
//                       <TextArea rows={2} />
//                     </Form.Item>
//                     <Divider>Emergency Contact</Divider>
//                     <Form.Item name="emergencyContactName" label="Name">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="emergencyContactRelation" label="Relation">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="emergencyContactPhone" label="Phone">
//                       <Input />
//                     </Form.Item>
//                   </div>
//                 </Form>
//               </Tabs.TabPane>

//               {/* Tab 3: Professional */}
//               <Tabs.TabPane tab={<span><BookOutlined /> Professional</span>} key="3">
//                 <Form form={form} layout="vertical" disabled={!isEditing}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Form.Item name="joinDate" label="Join Date">
//                       <DatePicker className="w-full" />
//                     </Form.Item>
//                     <Form.Item name="schoolJoinDate" label="School Join Date">
//                       <DatePicker className="w-full" />
//                     </Form.Item>
//                     <Form.Item name="teachingExperience" label="Teaching Experience (Years)">
//                       <InputNumber className="w-full" min={0} />
//                     </Form.Item>
//                   </div>
                  
//                   <Divider>Salary Information</Divider>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Form.Item name="governmentSalary" label="Government Salary (BDT)">
//                       <InputNumber className="w-full" min={0} prefix="৳" />
//                     </Form.Item>
//                     <Form.Item name="schoolSalary" label="School Salary (BDT)">
//                       <InputNumber className="w-full" min={0} prefix="৳" />
//                     </Form.Item>
//                   </div>
//                 </Form>
//               </Tabs.TabPane>

//               {/* Tab 4: Education */}
//               <Tabs.TabPane tab={<span><BookOutlined /> Education</span>} key="4">
//                 <div className="mb-4 flex justify-between items-center">
//                   <span className="text-gray-500 text-sm">
//                     {educationList.length} education records
//                   </span>
//                   {isEditing && (
//                     <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEducation}>
//                       Add Education
//                     </Button>
//                   )}
//                 </div>
//                 {renderEducationTimeline()}
//               </Tabs.TabPane>

//               {/* Tab 5: Banking & Social */}
//               <Tabs.TabPane tab={<span><BankOutlined /> Banking & Social</span>} key="5">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Bank Accounts */}
//                   <div>
//                     <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                       <BankOutlined className="text-blue-500" />
//                       Bank Accounts
//                     </h3>
//                     {bankList.length > 0 ? (
//                       bankList.map((bank) => (
//                         <div key={bank.id} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <p className="font-medium text-gray-800">{bank.bankName}</p>
//                               <p className="text-sm text-gray-600">A/C: {bank.accountNumber}</p>
//                               <p className="text-sm text-gray-600">Name: {bank.accountName}</p>
//                               {bank.branchName && (
//                                 <p className="text-sm text-gray-600">Branch: {bank.branchName}</p>
//                               )}
//                               {bank.routingNumber && (
//                                 <p className="text-sm text-gray-600">Routing: {bank.routingNumber}</p>
//                               )}
//                             </div>
//                             {isEditing && (
//                               <div className="flex gap-1">
//                                 <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditBank(bank)} className="text-blue-500" />
//                                 <Popconfirm title="Delete bank account?" onConfirm={() => handleDeleteBank(bank.id)} okText="Yes" cancelText="No">
//                                   <Button type="text" size="small" icon={<DeleteOutlined />} className="text-red-500" />
//                                 </Popconfirm>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-gray-400">No bank accounts added</p>
//                     )}
//                     {isEditing && (
//                       <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddBank}>
//                         Add Bank Account
//                       </Button>
//                     )}
//                   </div>

//                   {/* Social Links */}
//                   <div>
//                     <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                       <GlobalOutlined className="text-indigo-500" />
//                       Social Links
//                     </h3>
//                     {socialList.length > 0 ? (
//                       socialList.map((social) => (
//                         <div key={social.id} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <p className="font-medium text-gray-800">{social.platform}</p>
//                               <a href={social.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline truncate block">
//                                 {social.link}
//                               </a>
//                             </div>
//                             {isEditing && (
//                               <div className="flex gap-1">
//                                 <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditSocial(social)} className="text-blue-500" />
//                                 <Popconfirm title="Delete social link?" onConfirm={() => handleDeleteSocial(social.id)} okText="Yes" cancelText="No">
//                                   <Button type="text" size="small" icon={<DeleteOutlined />} className="text-red-500" />
//                                 </Popconfirm>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-gray-400">No social links added</p>
//                     )}
//                     {isEditing && (
//                       <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddSocial}>
//                         Add Social Link
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </Tabs.TabPane>

//               {/* Tab 6: Overview */}
//               <Tabs.TabPane tab={<span><HeartOutlined /> Overview</span>} key="6">
//                 {renderOverview()}
//               </Tabs.TabPane>
//             </Tabs>
//           </div>
//         </Card>
//       </div>

//       {/* Education Modal */}
//       <Modal
//         title={editingEducation ? "Edit Education" : "Add Education"}
//         open={isEducationModalVisible}
//         onCancel={() => {
//           setIsEducationModalVisible(false);
//           educationForm.resetFields();
//         }}
//         footer={null}
//         width={500}
//       >
//         <Form form={educationForm} layout="vertical" onFinish={handleEducationSubmit}>
//           <Form.Item name="label" label="Degree/Level" rules={[{ required: true }]}>
//             <Input placeholder="e.g., SSC, HSC, B.Sc" />
//           </Form.Item>
//           <Form.Item name="institute" label="Institute" rules={[{ required: true }]}>
//             <Input placeholder="Institute name" />
//           </Form.Item>
//           <Form.Item name="year" label="Year" rules={[{ required: true }]}>
//             <InputNumber className="w-full" placeholder="e.g., 2020" min={1900} max={2100} />
//           </Form.Item>
//           <Form.Item name="grade" label="Grade/GPA">
//             <Input placeholder="e.g., 5.00, A+" />
//           </Form.Item>
//           <Form.Item className="flex justify-end gap-2 mb-0">
//             <Button onClick={() => { setIsEducationModalVisible(false); educationForm.resetFields(); }}>
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               {editingEducation ? "Update" : "Add"} Education
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Bank Modal */}
//       <Modal
//         title={editingBank ? "Edit Bank Account" : "Add Bank Account"}
//         open={isBankModalVisible}
//         onCancel={() => { setIsBankModalVisible(false); bankForm.resetFields(); }}
//         footer={null}
//         width={500}
//       >
//         <Form form={bankForm} layout="vertical" onFinish={handleBankSubmit}>
//           <Form.Item name="bankName" label="Bank Name" rules={[{ required: true }]}>
//             <Input placeholder="e.g., Sonali Bank" />
//           </Form.Item>
//           <Form.Item name="accountName" label="Account Name" rules={[{ required: true }]}>
//             <Input placeholder="Account holder name" />
//           </Form.Item>
//           <Form.Item name="accountNumber" label="Account Number" rules={[{ required: true }]}>
//             <Input placeholder="Account number" />
//           </Form.Item>
//           <Form.Item name="branchName" label="Branch Name">
//             <Input placeholder="Branch name" />
//           </Form.Item>
//           <Form.Item name="routingNumber" label="Routing Number">
//             <Input placeholder="Routing number" />
//           </Form.Item>
//           <Form.Item className="flex justify-end gap-2 mb-0">
//             <Button onClick={() => { setIsBankModalVisible(false); bankForm.resetFields(); }}>Cancel</Button>
//             <Button type="primary" htmlType="submit">{editingBank ? "Update" : "Add"} Bank Account</Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Social Modal */}
//       <Modal
//         title={editingSocial ? "Edit Social Link" : "Add Social Link"}
//         open={isSocialModalVisible}
//         onCancel={() => { setIsSocialModalVisible(false); socialForm.resetFields(); }}
//         footer={null}
//         width={500}
//       >
//         <Form form={socialForm} layout="vertical" onFinish={handleSocialSubmit}>
//           <Form.Item name="platform" label="Platform" rules={[{ required: true }]}>
//             <Input placeholder="e.g., Facebook, LinkedIn" />
//           </Form.Item>
//           <Form.Item name="link" label="Profile URL" rules={[{ required: true }]}>
//             <Input placeholder="https://facebook.com/username" />
//           </Form.Item>
//           <Form.Item className="flex justify-end gap-2 mb-0">
//             <Button onClick={() => { setIsSocialModalVisible(false); socialForm.resetFields(); }}>Cancel</Button>
//             <Button type="primary" htmlType="submit">{editingSocial ? "Update" : "Add"} Social Link</Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default TeacherProfile;

// import React, { useState } from "react";
// import { useMyInfoQuery } from "../../redux/api/userApi";
// import { useUpdateTeacherMutation } from "../../redux/api/teacherApi";
// import { 
//   Form, Input, Button, Upload, message, Tabs, Select, DatePicker, 
//   InputNumber, Card, Tag, Divider, Modal, Popconfirm, Row, Col, Space 
// } from "antd";
// import { 
//   UploadOutlined, 
//   EditOutlined, 
//   SaveOutlined, 
//   PlusOutlined, 
//   DeleteOutlined,
//   UserOutlined,
//   PhoneOutlined,
//   MailOutlined,
//   HomeOutlined,
//   HeartOutlined,
//   CalendarOutlined,
//   BookOutlined,
//   BankOutlined,
//   GlobalOutlined,
//   IdcardOutlined,
//   TrophyOutlined,
//   TeamOutlined,
//   DollarOutlined
// } from "@ant-design/icons";
// import dayjs from "dayjs";

// const { Option } = Select;
// const { TextArea } = Input;

// // Color mapping for education badges
// const colorMap = {
//   blue: { border: "border-blue-500", badgeBg: "bg-blue-100", badgeText: "text-blue-800", dotColor: "bg-blue-500" },
//   indigo: { border: "border-indigo-500", badgeBg: "bg-indigo-100", badgeText: "text-indigo-800", dotColor: "bg-indigo-500" },
//   purple: { border: "border-purple-500", badgeBg: "bg-purple-100", badgeText: "text-purple-800", dotColor: "bg-purple-500" },
//   pink: { border: "border-pink-500", badgeBg: "bg-pink-100", badgeText: "text-pink-800", dotColor: "bg-pink-500" },
//   green: { border: "border-green-500", badgeBg: "bg-green-100", badgeText: "text-green-800", dotColor: "bg-green-500" },
//   orange: { border: "border-orange-500", badgeBg: "bg-orange-100", badgeText: "text-orange-800", dotColor: "bg-orange-500" },
//   teal: { border: "border-teal-500", badgeBg: "bg-teal-100", badgeText: "text-teal-800", dotColor: "bg-teal-500" },
// };

// const colorCycle = ["blue", "indigo", "purple", "pink", "green", "orange", "teal"];

// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   return new Date(dateStr).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });
// };

// // Utility function for form data conversion
// const convertToFormData = (data, formData = new FormData(), parentKey = "") => {
//   Object.entries(data).forEach(([key, value]) => {
//     const fieldName = parentKey ? `${parentKey}[${key}]` : key;

//     if (value === undefined || value === null || value === "") return;

//     if (value && value.fileList) {
//       formData.append(key, value.fileList[0].originFileObj);
//     } else if (value?.originFileObj instanceof File) {
//       formData.append(key, value.originFileObj);
//     } else if (value && value.$isDayjsObject) {
//       formData.append(fieldName, value.toDate().toISOString());
//     } else if (Array.isArray(value)) {
//       formData.append(fieldName, JSON.stringify(value));
//     } else if (typeof value === "object" && value !== null) {
//       convertToFormData(value, formData, fieldName);
//     } else {
//       formData.append(fieldName, String(value));
//     }
//   });
//   return formData;
// };

// const TeacherProfile = () => {
//   const { data, isLoading, isError, refetch } = useMyInfoQuery();
//   const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();

//   console.log(data, "teacher info")

//   const [isEditing, setIsEditing] = useState(false);
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("1");

//   // Education state for dynamic adding
//   const [educationList, setEducationList] = useState([]);
//   const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);
//   const [editingEducation, setEditingEducation] = useState(null);
//   const [educationForm] = Form.useForm();

//   // Bank state for dynamic adding
//   const [bankList, setBankList] = useState([]);
//   const [isBankModalVisible, setIsBankModalVisible] = useState(false);
//   const [editingBank, setEditingBank] = useState(null);
//   const [bankForm] = Form.useForm();

//   // Social state for dynamic adding
//   const [socialList, setSocialList] = useState([]);
//   const [isSocialModalVisible, setIsSocialModalVisible] = useState(false);
//   const [editingSocial, setEditingSocial] = useState(null);
//   const [socialForm] = Form.useForm();

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-500">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isError || !data?.data?.profile) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <p className="text-red-500 text-lg">Profile load korte problem hocche.</p>
//         </div>
//       </div>
//     );
//   }

//   const user = data.data;
//   const teacher = data.data.profile;

//   // Initialize lists from API data
//   const initialEducation = (teacher.education || []).map((edu, idx) => ({
//     ...edu,
//     id: idx.toString(),
//     color: colorCycle[idx % colorCycle.length],
//   }));

//   const initialBanks = (teacher.bankAccounts || []).map((bank, idx) => ({
//     ...bank,
//     id: idx.toString(),
//   }));

//   const initialSocial = (teacher.social || []).map((social, idx) => ({
//     ...social,
//     id: idx.toString(),
//   }));

//   // Handle edit toggle
//   const handleEditToggle = () => {
//     if (isEditing) {
//       form.submit();
//     } else {
//       setIsEditing(true);
//       setEducationList(initialEducation);
//       setBankList(initialBanks);
//       setSocialList(initialSocial);
      
//       const formValues = {
//         name: teacher.name,
//         designation: teacher.designation,
//         qualification: teacher.qualification,
//         phone: teacher.phone,
//         alternativePhone: teacher.alternativePhone,
//         presentAddress: teacher.presentAddress,
//         permanentAddress: teacher.permanentAddress,
//         bloodGroup: teacher.bloodGroup,
//         gender: teacher.gender,
//         religion: teacher.religion,
//         maritalStatus: teacher.maritalStatus,
//         dateOfBirth: teacher.dateOfBirth ? dayjs(teacher.dateOfBirth) : null,
//         joinDate: teacher.joinDate ? dayjs(teacher.joinDate) : null,
//         schoolJoinDate: teacher.schoolJoinDate ? dayjs(teacher.schoolJoinDate) : null,
//         teachingExperience: teacher.teachingExperience,
//         department: teacher.department,
//         subject: teacher.subject,
//         bio: teacher.bio,
//         teacherId: teacher.teacherId,
//         nid: teacher.nid,
//         birthCertificateNo: teacher.birthCertificateNo,
//         indexNumber: teacher.indexNumber,
//         governmentSalary: teacher.salary?.governmentSalary || 0,
//         schoolSalary: teacher.salary?.schoolSalary || 0,
//       };
//       form.setFieldsValue(formValues);
//     }
//   };

//   // Handle form submit
//   const handleFormSubmit = async (values) => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
      
//       // Add all text fields
//       Object.keys(values).forEach(key => {
//         if (key === 'dateOfBirth' && values[key]) {
//           formData.append(key, values[key].toISOString());
//         } else if (key === 'joinDate' && values[key]) {
//           formData.append(key, values[key].toISOString());
//         } else if (key === 'schoolJoinDate' && values[key]) {
//           formData.append(key, values[key].toISOString());
//         } else if (key === 'governmentSalary') {
//           formData.append('salary[governmentSalary]', values[key]);
//         } else if (key === 'schoolSalary') {
//           formData.append('salary[schoolSalary]', values[key]);
//         } else if (values[key] !== undefined && values[key] !== null && values[key] !== '') {
//           formData.append(key, values[key]);
//         }
//       });

//       // Add education
//       formData.append('education', JSON.stringify(educationList.map(({ id, color, ...rest }) => rest)));

//       // Add bank accounts
//       formData.append('bankAccounts', JSON.stringify(bankList.map(({ id, ...rest }) => rest)));

//       // Add social
//       formData.append('social', JSON.stringify(socialList.map(({ id, ...rest }) => rest)));

//       await updateTeacher({
//         id: teacher._id,
//         data: formData,
//       }).unwrap();

//       message.success("Profile updated successfully!");
//       setIsEditing(false);
//       refetch();
//     } catch (error) {
//       message.error(error?.data?.message || "Failed to update profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Education CRUD operations
//   const handleAddEducation = () => {
//     setEditingEducation(null);
//     educationForm.resetFields();
//     setIsEducationModalVisible(true);
//   };

//   const handleEditEducation = (edu) => {
//     setEditingEducation(edu);
//     educationForm.setFieldsValue(edu);
//     setIsEducationModalVisible(true);
//   };

//   const handleDeleteEducation = (id) => {
//     setEducationList(educationList.filter(edu => edu.id !== id));
//     message.success("Education removed");
//   };

//   const handleEducationSubmit = (values) => {
//     const newEdu = {
//       ...values,
//       id: editingEducation?.id || Date.now().toString(),
//       color: colorCycle[educationList.length % colorCycle.length],
//     };

//     if (editingEducation) {
//       setEducationList(educationList.map(edu => 
//         edu.id === editingEducation.id ? newEdu : edu
//       ));
//       message.success("Education updated");
//     } else {
//       setEducationList([...educationList, newEdu]);
//       message.success("Education added");
//     }

//     setIsEducationModalVisible(false);
//     educationForm.resetFields();
//   };

//   // Bank CRUD operations
//   const handleAddBank = () => {
//     setEditingBank(null);
//     bankForm.resetFields();
//     setIsBankModalVisible(true);
//   };

//   const handleEditBank = (bank) => {
//     setEditingBank(bank);
//     bankForm.setFieldsValue(bank);
//     setIsBankModalVisible(true);
//   };

//   const handleDeleteBank = (id) => {
//     setBankList(bankList.filter(bank => bank.id !== id));
//     message.success("Bank account removed");
//   };

//   const handleBankSubmit = (values) => {
//     const newBank = {
//       ...values,
//       id: editingBank?.id || Date.now().toString(),
//     };

//     if (editingBank) {
//       setBankList(bankList.map(bank => 
//         bank.id === editingBank.id ? newBank : bank
//       ));
//       message.success("Bank account updated");
//     } else {
//       setBankList([...bankList, newBank]);
//       message.success("Bank account added");
//     }

//     setIsBankModalVisible(false);
//     bankForm.resetFields();
//   };

//   // Social CRUD operations
//   const handleAddSocial = () => {
//     setEditingSocial(null);
//     socialForm.resetFields();
//     setIsSocialModalVisible(true);
//   };

//   const handleEditSocial = (social) => {
//     setEditingSocial(social);
//     socialForm.setFieldsValue(social);
//     setIsSocialModalVisible(true);
//   };

//   const handleDeleteSocial = (id) => {
//     setSocialList(socialList.filter(social => social.id !== id));
//     message.success("Social link removed");
//   };

//   const handleSocialSubmit = (values) => {
//     const newSocial = {
//       ...values,
//       id: editingSocial?.id || Date.now().toString(),
//     };

//     if (editingSocial) {
//       setSocialList(socialList.map(social => 
//         social.id === editingSocial.id ? newSocial : social
//       ));
//       message.success("Social link updated");
//     } else {
//       setSocialList([...socialList, newSocial]);
//       message.success("Social link added");
//     }

//     setIsSocialModalVisible(false);
//     socialForm.resetFields();
//   };

//   // Render education timeline
//   const renderEducationTimeline = () => {
//     const eduList = isEditing ? educationList : initialEducation;
    
//     if (eduList.length === 0) {
//       return (
//         <div className="text-center py-8 text-gray-400">
//           <BookOutlined className="text-4xl mb-2" />
//           <p>No education added yet</p>
//         </div>
//       );
//     }

//     return (
//       <div className="relative">
//         <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
//         {eduList.map((edu, index) => {
//           const c = colorMap[edu.color] || colorMap.blue;
//           return (
//             <div key={edu.id} className="relative pl-10 pb-8 last:pb-0 group">
//               <div className={`absolute left-1 top-1.5 w-6 h-6 rounded-full ${c.dotColor} border-2 border-white shadow-md flex items-center justify-center`}>
//                 <span className="text-white text-xs font-bold">{index + 1}</span>
//               </div>
              
//               <div className={`bg-white rounded-xl p-4 border-l-4 ${c.border} shadow-sm hover:shadow-md transition-all`}>
//                 <div className="flex flex-wrap justify-between items-start gap-2">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                       <h3 className="text-lg font-semibold text-gray-800">{edu.label}</h3>
//                       <Tag color={edu.color}>{edu.year}</Tag>
//                     </div>
//                     <p className="text-gray-600">{edu.institute}</p>
//                     {edu.grade && (
//                       <p className="text-sm text-gray-500 mt-1">
//                         <span className="font-medium">Grade:</span> {edu.grade}
//                       </p>
//                     )}
//                   </div>
                  
//                   {isEditing && (
//                     <div className="flex gap-1">
//                       <Button 
//                         type="text" 
//                         size="small" 
//                         icon={<EditOutlined />}
//                         onClick={() => handleEditEducation(edu)}
//                         className="text-blue-500"
//                       />
//                       <Popconfirm
//                         title="Delete education?"
//                         onConfirm={() => handleDeleteEducation(edu.id)}
//                         okText="Yes"
//                         cancelText="No"
//                       >
//                         <Button 
//                           type="text" 
//                           size="small" 
//                           icon={<DeleteOutlined />}
//                           className="text-red-500"
//                         />
//                       </Popconfirm>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   // Info card component
//   const InfoCard = ({ icon, label, value, color = "blue" }) => (
//     <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
//       <div className="flex items-start gap-3">
//         <div className={`text-${color}-500 text-xl mt-0.5`}>{icon}</div>
//         <div className="flex-1 min-w-0">
//           <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
//           <p className="text-gray-800 font-medium truncate">{value || "N/A"}</p>
//         </div>
//       </div>
//     </div>
//   );

//   // Render teacher info for overview
//   const renderOverview = () => {
//     return (
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           <InfoCard 
//             icon={<IdcardOutlined />} 
//             label="Teacher ID" 
//             value={teacher.teacherId} 
//             color="blue"
//           />
//           <InfoCard 
//             icon={<UserOutlined />} 
//             label="Designation" 
//             value={teacher.designation} 
//             color="purple"
//           />
//           <InfoCard 
//             icon={<TrophyOutlined />} 
//             label="Qualification" 
//             value={teacher.qualification} 
//             color="green"
//           />
//           <InfoCard 
//             icon={<HeartOutlined />} 
//             label="Blood Group" 
//             value={teacher.bloodGroup} 
//             color="red"
//           />
//           <InfoCard 
//             icon={<CalendarOutlined />} 
//             label="Date of Birth" 
//             value={formatDate(teacher.dateOfBirth)} 
//             color="orange"
//           />
//           <InfoCard 
//             icon={<TeamOutlined />} 
//             label="Experience" 
//             value={`${teacher.teachingExperience || 0} Years`} 
//             color="indigo"
//           />
//           <InfoCard 
//             icon={<CalendarOutlined />} 
//             label="Join Date" 
//             value={formatDate(teacher.joinDate)} 
//             color="teal"
//           />
//           <InfoCard 
//             icon={<DollarOutlined />} 
//             label="Total Salary" 
//             value={`${(teacher.salary?.governmentSalary || 0) + (teacher.salary?.schoolSalary || 0)} BDT`} 
//             color="green"
//           />
//           <InfoCard 
//             icon={<HomeOutlined />} 
//             label="Present Address" 
//             value={teacher.presentAddress} 
//             color="gray"
//           />
//         </div>
        
//         <Divider />
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <h4 className="font-semibold text-gray-700 mb-3">Education Summary</h4>
//             {(initialEducation.length > 0) ? (
//               <div className="space-y-2">
//                 {initialEducation.map((edu, idx) => (
//                   <div key={idx} className="bg-gray-50 rounded-lg p-3">
//                     <p className="font-medium text-gray-800">{edu.label} - {edu.institute}</p>
//                     <p className="text-sm text-gray-500">Year: {edu.year} | Grade: {edu.grade || 'N/A'}</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-400">No education records</p>
//             )}
//           </div>
//           <div>
//             <h4 className="font-semibold text-gray-700 mb-3">Bank Accounts</h4>
//             {(initialBanks.length > 0) ? (
//               <div className="space-y-2">
//                 {initialBanks.map((bank, idx) => (
//                   <div key={idx} className="bg-gray-50 rounded-lg p-3">
//                     <p className="font-medium text-gray-800">{bank.bankName}</p>
//                     <p className="text-sm text-gray-500">A/C: {bank.accountNumber}</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-400">No bank accounts</p>
//             )}
//           </div>
//         </div>
        
//         <Divider />
//         <div className="text-center text-gray-400 text-sm">
//           Last Updated: {formatDate(teacher.updatedAt)}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//               <UserOutlined className="text-blue-600" />
//               Teacher Profile
//             </h1>
//             <p className="text-gray-500">Manage your professional information</p>
//           </div>
//           <Button
//             type={isEditing ? "primary" : "default"}
//             icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
//             onClick={handleEditToggle}
//             loading={loading || isUpdating}
//             className={isEditing ? "bg-blue-600" : ""}
//           >
//             {isEditing ? "Save Changes" : "Edit Profile"}
//           </Button>
//         </div>

//         {/* Main Profile Card */}
//         <Card className="shadow-xl rounded-2xl overflow-hidden border-0">
//           <div className="p-6">
//             {/* Profile Header */}
//             <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b border-gray-200">
//               <div className="relative">
//                 <img
//                   src={teacher.thumbnail || "https://i.pravatar.cc/150?img=12"}
//                   alt={teacher.name}
//                   className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-500 shadow-lg object-cover"
//                 />
//                 {isEditing && (
//                   <Button
//                     type="text"
//                     size="small"
//                     className="absolute -bottom-1 -right-1 bg-white rounded-full shadow-md hover:shadow-lg"
//                     icon={<UploadOutlined />}
//                   />
//                 )}
//               </div>
//               <div className="flex-1">
//                 <div className="flex flex-wrap items-center gap-3">
//                   <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
//                     {teacher.name}
//                   </h2>
//                   <Tag color="green" className="px-3 py-1">
//                     {teacher.status || 'Active'}
//                   </Tag>
//                   <Tag color="blue">{teacher.employmentType || 'Permanent'}</Tag>
//                 </div>
//                 <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
//                   <span><span className="font-medium">Teacher ID:</span> {teacher.teacherId}</span>
//                   <span><span className="font-medium">Designation:</span> {teacher.designation}</span>
//                   {teacher.department && (
//                     <span><span className="font-medium">Department:</span> {teacher.department}</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Profile Content with Tabs */}
//             <Tabs 
//               activeKey={activeTab} 
//               onChange={setActiveTab}
//               className="mt-6"
//               tabBarStyle={{ borderBottom: '2px solid #e5e7eb' }}
//             >
//               {/* Tab 1: Personal Information */}
//               <Tabs.TabPane 
//                 tab={<span><UserOutlined /> Personal Info</span>} 
//                 key="1"
//               >
//                 <Form
//                   form={form}
//                   layout="vertical"
//                   onFinish={handleFormSubmit}
//                   disabled={!isEditing}
//                 >
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     <Form.Item name="teacherId" label="Teacher ID">
//                       <Input prefix={<IdcardOutlined />} disabled />
//                     </Form.Item>
//                     <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
//                       <Input prefix={<UserOutlined />} />
//                     </Form.Item>
//                     <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
//                       <Input prefix={<TrophyOutlined />} />
//                     </Form.Item>
//                     <Form.Item name="qualification" label="Qualification">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="department" label="Department">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="subject" label="Subject">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="gender" label="Gender">
//                       <Select>
//                         <Option value="Male">Male</Option>
//                         <Option value="Female">Female</Option>
//                         <Option value="Other">Other</Option>
//                       </Select>
//                     </Form.Item>
//                     <Form.Item name="religion" label="Religion">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="maritalStatus" label="Marital Status">
//                       <Select>
//                         <Option value="Single">Single</Option>
//                         <Option value="Married">Married</Option>
//                         <Option value="Divorced">Divorced</Option>
//                         <Option value="Widowed">Widowed</Option>
//                       </Select>
//                     </Form.Item>
//                     <Form.Item name="dateOfBirth" label="Date of Birth">
//                       <DatePicker className="w-full" />
//                     </Form.Item>
//                     <Form.Item name="bloodGroup" label="Blood Group">
//                       <Select>
//                         <Option value="A+">A+</Option>
//                         <Option value="A-">A-</Option>
//                         <Option value="B+">B+</Option>
//                         <Option value="B-">B-</Option>
//                         <Option value="AB+">AB+</Option>
//                         <Option value="AB-">AB-</Option>
//                         <Option value="O+">O+</Option>
//                         <Option value="O-">O-</Option>
//                       </Select>
//                     </Form.Item>
//                     <Form.Item name="nid" label="NID Number">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="birthCertificateNo" label="Birth Certificate No">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="indexNumber" label="Index Number">
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="bio" label="Bio" span={24}>
//                       <TextArea rows={3} />
//                     </Form.Item>
//                   </div>
//                 </Form>
//               </Tabs.TabPane>

//               {/* Tab 2: Contact */}
//               <Tabs.TabPane 
//                 tab={<span><PhoneOutlined /> Contact</span>} 
//                 key="2"
//               >
//                 <Form form={form} layout="vertical" disabled={!isEditing}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
//                       <Input prefix={<PhoneOutlined />} />
//                     </Form.Item>
//                     <Form.Item name="alternativePhone" label="Alternative Phone">
//                       <Input prefix={<PhoneOutlined />} />
//                     </Form.Item>
//                     <Form.Item name="presentAddress" label="Present Address" span={24}>
//                       <TextArea rows={2} />
//                     </Form.Item>
//                     <Form.Item name="permanentAddress" label="Permanent Address" span={24}>
//                       <TextArea rows={2} />
//                     </Form.Item>
//                   </div>
//                 </Form>
//               </Tabs.TabPane>

//               {/* Tab 3: Professional */}
//               <Tabs.TabPane 
//                 tab={<span><BookOutlined /> Professional</span>} 
//                 key="3"
//               >
//                 <Form form={form} layout="vertical" disabled={!isEditing}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Form.Item name="joinDate" label="Join Date">
//                       <DatePicker className="w-full" />
//                     </Form.Item>
//                     <Form.Item name="schoolJoinDate" label="School Join Date">
//                       <DatePicker className="w-full" />
//                     </Form.Item>
//                     <Form.Item name="teachingExperience" label="Teaching Experience (Years)">
//                       <InputNumber className="w-full" min={0} />
//                     </Form.Item>
//                   </div>
                  
//                   <Divider>Salary Information</Divider>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Form.Item name="governmentSalary" label="Government Salary (BDT)">
//                       <InputNumber className="w-full" min={0} prefix="৳" />
//                     </Form.Item>
//                     <Form.Item name="schoolSalary" label="School Salary (BDT)">
//                       <InputNumber className="w-full" min={0} prefix="৳" />
//                     </Form.Item>
//                   </div>
//                 </Form>
//               </Tabs.TabPane>

//               {/* Tab 4: Education */}
//               <Tabs.TabPane 
//                 tab={<span><BookOutlined /> Education</span>} 
//                 key="4"
//               >
//                 <div className="mb-4 flex justify-between items-center">
//                   <span className="text-gray-500 text-sm">
//                     {(isEditing ? educationList : initialEducation).length} education records
//                   </span>
//                   {isEditing && (
//                     <Button 
//                       type="primary" 
//                       icon={<PlusOutlined />}
//                       onClick={handleAddEducation}
//                     >
//                       Add Education
//                     </Button>
//                   )}
//                 </div>
//                 {renderEducationTimeline()}
//               </Tabs.TabPane>

//               {/* Tab 5: Banking & Social */}
//               <Tabs.TabPane 
//                 tab={<span><BankOutlined /> Banking & Social</span>} 
//                 key="5"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Bank Accounts */}
//                   <div>
//                     <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                       <BankOutlined className="text-blue-500" />
//                       Bank Accounts
//                     </h3>
//                     {(isEditing ? bankList : initialBanks).length > 0 ? (
//                       (isEditing ? bankList : initialBanks).map((bank) => (
//                         <div key={bank.id} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <p className="font-medium text-gray-800">{bank.bankName}</p>
//                               <p className="text-sm text-gray-600">A/C: {bank.accountNumber}</p>
//                               <p className="text-sm text-gray-600">Name: {bank.accountName}</p>
//                               {bank.branchName && (
//                                 <p className="text-sm text-gray-600">Branch: {bank.branchName}</p>
//                               )}
//                               {bank.routingNumber && (
//                                 <p className="text-sm text-gray-600">Routing: {bank.routingNumber}</p>
//                               )}
//                             </div>
//                             {isEditing && (
//                               <div className="flex gap-1">
//                                 <Button 
//                                   type="text" 
//                                   size="small" 
//                                   icon={<EditOutlined />}
//                                   onClick={() => handleEditBank(bank)}
//                                   className="text-blue-500"
//                                 />
//                                 <Popconfirm
//                                   title="Delete bank account?"
//                                   onConfirm={() => handleDeleteBank(bank.id)}
//                                   okText="Yes"
//                                   cancelText="No"
//                                 >
//                                   <Button 
//                                     type="text" 
//                                     size="small" 
//                                     icon={<DeleteOutlined />}
//                                     className="text-red-500"
//                                   />
//                                 </Popconfirm>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-gray-400">No bank accounts added</p>
//                     )}
//                     {isEditing && (
//                       <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddBank}>
//                         Add Bank Account
//                       </Button>
//                     )}
//                   </div>

//                   {/* Social Links */}
//                   <div>
//                     <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                       <GlobalOutlined className="text-indigo-500" />
//                       Social Links
//                     </h3>
//                     {(isEditing ? socialList : initialSocial).length > 0 ? (
//                       (isEditing ? socialList : initialSocial).map((social) => (
//                         <div key={social.id} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <p className="font-medium text-gray-800">{social.platform}</p>
//                               <a href={social.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline truncate block">
//                                 {social.link}
//                               </a>
//                             </div>
//                             {isEditing && (
//                               <div className="flex gap-1">
//                                 <Button 
//                                   type="text" 
//                                   size="small" 
//                                   icon={<EditOutlined />}
//                                   onClick={() => handleEditSocial(social)}
//                                   className="text-blue-500"
//                                 />
//                                 <Popconfirm
//                                   title="Delete social link?"
//                                   onConfirm={() => handleDeleteSocial(social.id)}
//                                   okText="Yes"
//                                   cancelText="No"
//                                 >
//                                   <Button 
//                                     type="text" 
//                                     size="small" 
//                                     icon={<DeleteOutlined />}
//                                     className="text-red-500"
//                                   />
//                                 </Popconfirm>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-gray-400">No social links added</p>
//                     )}
//                     {isEditing && (
//                       <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddSocial}>
//                         Add Social Link
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </Tabs.TabPane>

//               {/* Tab 6: Overview */}
//               <Tabs.TabPane 
//                 tab={<span><HeartOutlined /> Overview</span>} 
//                 key="6"
//               >
//                 {renderOverview()}
//               </Tabs.TabPane>
//             </Tabs>
//           </div>
//         </Card>
//       </div>

//       {/* Education Modal */}
//       <Modal
//         title={editingEducation ? "Edit Education" : "Add Education"}
//         open={isEducationModalVisible}
//         onCancel={() => {
//           setIsEducationModalVisible(false);
//           educationForm.resetFields();
//         }}
//         footer={null}
//         width={500}
//       >
//         <Form form={educationForm} layout="vertical" onFinish={handleEducationSubmit}>
//           <Form.Item name="label" label="Degree/Level" rules={[{ required: true }]}>
//             <Input placeholder="e.g., SSC, HSC, B.Sc" />
//           </Form.Item>
//           <Form.Item name="institute" label="Institute" rules={[{ required: true }]}>
//             <Input placeholder="Institute name" />
//           </Form.Item>
//           <Form.Item name="year" label="Year" rules={[{ required: true }]}>
//             <InputNumber className="w-full" placeholder="e.g., 2020" min={1900} max={2100} />
//           </Form.Item>
//           <Form.Item name="grade" label="Grade/GPA">
//             <Input placeholder="e.g., 5.00, A+" />
//           </Form.Item>
//           <Form.Item className="flex justify-end gap-2 mb-0">
//             <Button onClick={() => {
//               setIsEducationModalVisible(false);
//               educationForm.resetFields();
//             }}>
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               {editingEducation ? "Update" : "Add"} Education
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Bank Modal */}
//       <Modal
//         title={editingBank ? "Edit Bank Account" : "Add Bank Account"}
//         open={isBankModalVisible}
//         onCancel={() => {
//           setIsBankModalVisible(false);
//           bankForm.resetFields();
//         }}
//         footer={null}
//         width={500}
//       >
//         <Form form={bankForm} layout="vertical" onFinish={handleBankSubmit}>
//           <Form.Item name="bankName" label="Bank Name" rules={[{ required: true }]}>
//             <Input placeholder="e.g., Sonali Bank" />
//           </Form.Item>
//           <Form.Item name="accountName" label="Account Name" rules={[{ required: true }]}>
//             <Input placeholder="Account holder name" />
//           </Form.Item>
//           <Form.Item name="accountNumber" label="Account Number" rules={[{ required: true }]}>
//             <Input placeholder="Account number" />
//           </Form.Item>
//           <Form.Item name="branchName" label="Branch Name">
//             <Input placeholder="Branch name" />
//           </Form.Item>
//           <Form.Item name="routingNumber" label="Routing Number">
//             <Input placeholder="Routing number" />
//           </Form.Item>
//           <Form.Item className="flex justify-end gap-2 mb-0">
//             <Button onClick={() => {
//               setIsBankModalVisible(false);
//               bankForm.resetFields();
//             }}>
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               {editingBank ? "Update" : "Add"} Bank Account
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Social Modal */}
//       <Modal
//         title={editingSocial ? "Edit Social Link" : "Add Social Link"}
//         open={isSocialModalVisible}
//         onCancel={() => {
//           setIsSocialModalVisible(false);
//           socialForm.resetFields();
//         }}
//         footer={null}
//         width={500}
//       >
//         <Form form={socialForm} layout="vertical" onFinish={handleSocialSubmit}>
//           <Form.Item name="platform" label="Platform" rules={[{ required: true }]}>
//             <Input placeholder="e.g., Facebook, LinkedIn" />
//           </Form.Item>
//           <Form.Item name="link" label="Profile URL" rules={[{ required: true }]}>
//             <Input placeholder="https://facebook.com/username" />
//           </Form.Item>
//           <Form.Item className="flex justify-end gap-2 mb-0">
//             <Button onClick={() => {
//               setIsSocialModalVisible(false);
//               socialForm.resetFields();
//             }}>
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               {editingSocial ? "Update" : "Add"} Social Link
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default TeacherProfile;

