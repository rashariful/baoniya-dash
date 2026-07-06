import React from "react";
import { message } from "antd";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { attendanceColumns } from "@/utils/tableConfigs";
import { attendanceFormFields } from "@/utils/formSchemas";

import {
  useCreateAttendanceMutation,
  useGetAllAttendanceQuery,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
} from "@/redux/api/attendanceApi";

const AttendancePage = () => {
  const { data, isLoading, refetch } = useGetAllAttendanceQuery();

  const [create] = useCreateAttendanceMutation();
  const [update] = useUpdateAttendanceMutation();
  const [remove] = useDeleteAttendanceMutation();

  const handleAdd = async (data: any) => {
    try {
      await create(data);
      message.success("Attendance added");
      refetch();
    } catch {
      message.error("Failed");
    }
  };

  const handleEdit = async (id: string, data: any) => {
    try {
      await update({ id, data });
      message.success("Updated");
      refetch();
    } catch {
      message.error("Failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      message.success("Deleted");
      refetch();
    } catch {
      message.error("Failed");
    }
  };

  return (
    <CrudTemplate
      title="Attendance"
      subtitle="Manage student attendance"
      data={data?.data || []}
      columns={attendanceColumns}
      formFields={attendanceFormFields}
      loading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default AttendancePage;