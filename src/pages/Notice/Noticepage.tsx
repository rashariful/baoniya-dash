import React, { useState } from "react";
import { message } from "antd";

import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { noticeColumns } from "@/utils/tableConfigs";
import { noticeFormFields } from "@/utils/formSchemas";

import {
  useCreateNoticeMutation,
  useGetAllNoticeQuery,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} from "@/redux/api/noticeApi";

type NoticeFormData = {
  title: string;
  message?: string;
  thumbnail?: File;
  audience?: string;
  priority?: string;
  startDate?: Date;
  endDate?: Date;
};

const NoticePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch } = useGetAllNoticeQuery(
    searchTerm ? [{ name: "searchTerm", value: searchTerm }] : undefined
  );

  const [createNotice] = useCreateNoticeMutation();
  const [updateNotice] = useUpdateNoticeMutation();
  const [deleteNotice] = useDeleteNoticeMutation();

// Convert Object to FormData
const convertToFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    // Day.js object (Ant Design DatePicker uses Day.js by default)
    if (value && typeof value === "object" && typeof value.toDate === "function") {
      formData.append(key, value.toDate().toISOString());
    } 
    // Upload File
    else if (value?.originFileObj instanceof File) {
      formData.append(key, value.originFileObj);
    } else if (value instanceof File) {
      formData.append(key, value);
    } 
    // Date
    else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } 
    // Object
    else if (typeof value === "object" && value !== null) {
      formData.append(key, JSON.stringify(value));
    } 
    // Primitive
    else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

  const handleAdd = async (data: NoticeFormData) => {
    try {
      const formData = convertToFormData(data);

      await createNotice(formData).unwrap();

      message.success("Notice created successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to create notice");
    }
  };

  const handleEdit = async (id: string, data: NoticeFormData) => {
    try {
      const formData = convertToFormData(data);

      await updateNotice({
        id,
        data: formData,
      }).unwrap();

      message.success("Notice updated successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update notice");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotice(id).unwrap();

      message.success("Notice deleted successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete notice");
    }
  };

  return (
    <CrudTemplate
      title="Notice Board"
      subtitle="Manage notices"
      data={data?.data || []}
      columns={noticeColumns}
      formFields={noticeFormFields}
      loading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      enableSearch
      onSearch={setSearchTerm}
    />
  );
};

export default NoticePage;