import React, { useMemo, useState } from "react";
import { message } from "antd";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { parentColumns } from "@/utils/tableConfigs";
import { parentFormFields } from "@/utils/formSchemas";

import {
  useCreateParentsMutation,
  useGetAllParentsQuery,
  useUpdateParentsMutation,
  useDeleteParentsMutation,
} from "@/redux/api/parentsApi";

import { useGetAllStudentQuery } from "@/redux/api/studentApi";

const ParentPage = () => {
      const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch } = useGetAllParentsQuery(searchTerm
    ? [{ name: "searchTerm", value: searchTerm }]
    : undefined);
  const { data: studentData } = useGetAllStudentQuery();

  const [createParent] = useCreateParentsMutation();
  const [updateParent] = useUpdateParentsMutation();
  const [deleteParent] = useDeleteParentsMutation();

  // 🔥 helper
  const mapOptions = (data: any[] = [], labelKey: string) =>
    data.map((item) => ({
      label: item[labelKey],
      value: item._id,
    }));

  // 🔥 dynamic form fields
  const dynamicFormFields = useMemo(() => {
    const studentOptions = mapOptions(studentData?.data || [], "name");

    return parentFormFields.map((field) => {
      if (field.name === "studentId") {
        return {
          ...field,
          options: studentOptions,
        };
      }
      return field;
    });
  }, [studentData]);

  // ADD
  const handleAdd = async (formData: any) => {
    try {
      await createParent(formData).unwrap();
      message.success("Parent created successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to create parent");
    }
  };

  // EDIT
  const handleEdit = async (id: string, formData: any) => {
    try {
      await updateParent({ id, data: formData }).unwrap();
      message.success("Parent updated successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update parent");
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await deleteParent(id).unwrap();
      message.success("Parent deleted successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete parent");
    }
  };

  return (
    <CrudTemplate
      title="Parent Management"
      subtitle="Manage all parents of students"
      data={data?.data || []}
      columns={parentColumns}
      formFields={dynamicFormFields}   // 🔥 FIXED
      loading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
        enableSearch
        onSearch={setSearchTerm}
    />
  );
};

export default ParentPage;