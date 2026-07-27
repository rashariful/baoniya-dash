import React, { useMemo, useState } from "react";
import { message } from "antd";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { libraryColumns } from "@/utils/tableConfigs";
import { libraryFormFields } from "@/utils/formSchemas";

import {
   useCreateLibraryMutation,
  useGetAllLibraryQuery,
  useUpdateLibraryMutation,
  useDeleteLibraryMutation,
} from "@/redux/api/libraryApi.js";

import { useGetAllStudentQuery } from "@/redux/api/studentApi";

const LibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch } = useGetAllLibraryQuery(
    searchTerm ? [{ name: "searchTerm", value: searchTerm }] : undefined
  );
  const { data: studentData } = useGetAllStudentQuery();

  const [createLibrary] = useCreateLibraryMutation();
  const [updateLibrary] = useUpdateLibraryMutation();
  const [deleteLibrary] = useDeleteLibraryMutation();

  // 🔥 Helper to map student options for the select field
  const mapOptions = (data: any[] = [], labelKey: string) =>
    data.map((item) => ({
      label: item[labelKey],
      value: item._id,
    }));

  // 🔥 Dynamic form fields to inject student options into the form
  const dynamicFormFields = useMemo(() => {
    const studentOptions = mapOptions(studentData?.data || [], "name");

    return libraryFormFields.map((field) => {
      if (field.name === "student") {
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
      await createLibrary(formData).unwrap();
      message.success("Library record created successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to create library record");
    }
  };

  // EDIT
  const handleEdit = async (id: string, formData: any) => {
    try {
      await updateLibrary({ id, data: formData }).unwrap();
      message.success("Library record updated successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update library record");
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await deleteLibrary(id).unwrap();
      message.success("Library record deleted successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete library record");
    }
  };

  return (
    <CrudTemplate
      title="Library Management"
      subtitle="Manage borrowed books and student records"
      data={data?.data || []}
      columns={libraryColumns}
      formFields={dynamicFormFields}
      loading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      enableSearch
      onSearch={setSearchTerm}
    />
  );
};

export default LibraryPage;