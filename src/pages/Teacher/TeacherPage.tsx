import React, { useState } from "react";
import { message } from "antd";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { teacherColumns } from "@/utils/tableConfigs";
import { teacherFormFields } from "@/utils/formSchemas";

import {
  useCreateTeacherMutation,
  useGetAllTeacherQuery,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} from "@/redux/api/teacherApi";

type TeacherFormData = {
  name: string;
  phone: string;
  designation: string;
  thumbnail?: File;
};

const TeacherPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch } = useGetAllTeacherQuery(
    searchTerm ? [{ name: "searchTerm", value: searchTerm }] : undefined,
  );

  const [createTeacher] = useCreateTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();
  const [deleteTeacher] = useDeleteTeacherMutation();

// আপডেট করা অংশ
const convertToFormData = (data: Record<string, any>, formData = new FormData(), parentKey = "") => {
  Object.entries(data).forEach(([key, value]) => {
    const fieldName = parentKey ? `${parentKey}[${key}]` : key;

    if (value === undefined || value === null || value === "") return;

    // ফাইল হ্যান্ডলিং (আপনার thumbnail এর জন্য)
    if (value && value.fileList) { // Ant Design এর ক্ষেত্রে এটি চেক করুন
      formData.append(key, value.fileList[0].originFileObj);
    } 
    else if (value.originFileObj instanceof File) {
      formData.append(key, value.originFileObj);
    }
    // ডেট হ্যান্ডলিং
    else if (value && value.$isDayjsObject) {
      formData.append(fieldName, value.toDate().toISOString());
    }
    // অ্যারে (social, education, bankAccounts)
    else if (Array.isArray(value)) {
      formData.append(fieldName, JSON.stringify(value));
    }
    // অবজেক্ট
    else if (typeof value === "object" && value !== null) {
      convertToFormData(value, formData, fieldName);
    }
    // সাধারণ ডাটা
    else {
      formData.append(fieldName, String(value));
    }
  });
  return formData;
};

  const handleAdd = async (data: TeacherFormData) => {
    try {
      const formData = convertToFormData(data);

      await createTeacher(formData).unwrap();

      message.success("Teacher created successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to create teacher");
    }
  };

  const handleEdit = async (id: string, data: TeacherFormData) => {
    try {
      const formData = convertToFormData(data);

      await updateTeacher({
        id,
        data: formData,
      }).unwrap();

      message.success("Teacher updated successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update teacher");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTeacher(id).unwrap();

      message.success("Teacher deleted successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete teacher");
    }
  };

  return (
    <CrudTemplate
      title="Teacher Management"
      subtitle="Manage all teachers"
      data={data?.data || []}
      columns={teacherColumns}
      formFields={teacherFormFields}
      loading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      enableSearch
      onSearch={setSearchTerm}
    />
  );
};

export default TeacherPage;
