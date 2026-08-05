import React, { useMemo } from "react";
import { message } from "antd";

import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { subjectColumns } from "@/utils/tableConfigs";
import { subjectFormFields } from "@/utils/formSchemas";

import {
  useCreateSubjectMutation,
  useGetAllSubjectQuery,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} from "@/redux/api/subjectApi";

import { useGetAllClassesQuery } from "@/redux/api/classesApi";
import { useGetAllGradingScaleQuery } from "@/redux/api/gradingScaleApi";

const SubjectPage = () => {
  // ===========================
  // Queries
  // ===========================
  const { data, isLoading, refetch } = useGetAllSubjectQuery();

  const { data: classData } = useGetAllClassesQuery();

  const { data: gradingScaleData } = useGetAllGradingScaleQuery();

  // ===========================
  // Mutations
  // ===========================
  const [create] = useCreateSubjectMutation();
  const [update] = useUpdateSubjectMutation();
  const [remove] = useDeleteSubjectMutation();

  // ===========================
  // Dynamic Select Options
  // ===========================
  const dynamicFormFields = useMemo(() => {
    const mapOptions = (arr: any[] = [], key: string) =>
      arr.map((item) => ({
        label: item[key],
        value: item._id,
      }));

    return subjectFormFields.map((field) => {
      if (!field.dynamicOptions) return field;

      switch (field.name) {
        case "classId":
          return {
            ...field,
            options: mapOptions(classData?.data, "name"),
          };

        case "gradingScaleId":
          return {
            ...field,
            options: mapOptions(gradingScaleData?.data, "name"),
          };

        default:
          return field;
      }
    });
  }, [classData, gradingScaleData]);

  // ===========================
  // Create
  // ===========================
  const handleAdd = async (formData: any) => {
    try {
      await create(formData).unwrap();

      message.success("Subject created successfully.");

      refetch();
    } catch (error: any) {
      message.error(
        error?.data?.message || "Failed to create subject."
      );
    }
  };

  // ===========================
  // Update
  // ===========================
  const handleEdit = async (id: string, formData: any) => {
    try {
      await update({
        id,
        data: formData,
      }).unwrap();

      message.success("Subject updated successfully.");

      refetch();
    } catch (error: any) {
      message.error(
        error?.data?.message || "Failed to update subject."
      );
    }
  };

  // ===========================
  // Delete
  // ===========================
  const handleDelete = async (id: string) => {
    try {
      await remove(id).unwrap();

      message.success("Subject deleted successfully.");

      refetch();
    } catch (error: any) {
      message.error(
        error?.data?.message || "Failed to delete subject."
      );
    }
  };

  return (
    <CrudTemplate
      title="Subject Management"
      subtitle="Manage subjects by class"
      data={data?.data || []}
      columns={subjectColumns}
      formFields={dynamicFormFields}
      loading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default SubjectPage;