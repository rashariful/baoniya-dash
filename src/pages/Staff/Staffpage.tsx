import React from "react";
import { message } from "antd";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { staffColumns } from "@/utils/tableConfigs";
import { staffFormFields } from "@/utils/formSchemas";

import {
  useCreateStaffMutation,
  useGetAllStaffQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "@/redux/api/staffApi";

const StaffPage = () => {
  const { data, isLoading, refetch } = useGetAllStaffQuery();

  const [createStaff] = useCreateStaffMutation();
  const [updateStaff] = useUpdateStaffMutation();
  const [deleteStaff] = useDeleteStaffMutation();

  const handleAdd = async (data: any) => {
    try {
      await createStaff(data);
      message.success("Staff created");
      refetch();
    } catch {
      message.error("Failed to create staff");
    }
  };

  const handleEdit = async (id: string, data: any) => {
    try {
      await updateStaff({ id, data });
      message.success("Staff updated");
      refetch();
    } catch {
      message.error("Failed to update staff");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStaff(id);
      message.success("Staff deleted");
      refetch();
    } catch {
      message.error("Failed to delete staff");
    }
  };

  return (
    <CrudTemplate
      title="Staff Management"
      subtitle="Manage all staff members"
      data={data?.data || []}
      columns={staffColumns}
      formFields={staffFormFields}
      loading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default StaffPage;