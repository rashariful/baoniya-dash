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

const TeacherPage = () => {
      const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch } = useGetAllTeacherQuery(searchTerm
    ? [{ name: "searchTerm", value: searchTerm }]
    : undefined);;

  const [createTeacher] = useCreateTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();
  const [deleteTeacher] = useDeleteTeacherMutation();

  const handleAdd = async (data: any) => {
    try {
      await createTeacher(data);
      message.success("Teacher created");
      refetch();
    } catch {
      message.error("Failed");
    }
  };

  const handleEdit = async (id: string, data: any) => {
    try {
      await updateTeacher({ id, data });
      message.success("Updated");
      refetch();
    } catch {
      message.error("Failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTeacher(id);
      message.success("Deleted");
      refetch();
    } catch {
      message.error("Failed");
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