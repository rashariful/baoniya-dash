import React, { useMemo } from "react";
import { message } from "antd";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { examinationColumns } from "@/utils/tableConfigs";
import { examinationFormFields } from "@/utils/formSchemas";

import {
  useCreateExaminationMutation,
  useGetAllExaminationQuery,
  useUpdateExaminationMutation,
  useDeleteExaminationMutation,
} from "@/redux/api/examinationApi";

import {
useGetAllClassesQuery
} from "@/redux/api/classesApi";

const ExaminationPage = () => {
  const { data, isLoading, refetch } = useGetAllExaminationQuery();
 const { data: classData } = useGetAllClassesQuery();
  const [createExamination] = useCreateExaminationMutation();
  const [updateExamination] = useUpdateExaminationMutation();
  const [deleteExamination] = useDeleteExaminationMutation();

  // ADD
  const handleAdd = async (formData: any) => {
    try {
      await createExamination(formData).unwrap();
      message.success("Examination created successfully");
      refetch();
    } catch (error: any) {
      message.error(
        error?.data?.message || "Failed to create examination"
      );
    }
  };

  // EDIT
  const handleEdit = async (id: string, formData: any) => {
    try {
      await updateExamination({
        id,
        data: formData,
      }).unwrap();

      message.success("Examination updated successfully");
      refetch();
    } catch (error: any) {
      message.error(
        error?.data?.message || "Failed to update examination"
      );
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await deleteExamination(id).unwrap();
      message.success("Examination deleted successfully");
      refetch();
    } catch (error: any) {
      message.error(
        error?.data?.message || "Failed to delete examination"
      );
    }
  };
 

const dynamicFormFields = useMemo(() => {
  const classOptions =
    classData?.data?.map((item: any) => ({
      label: item.name,
      value: item._id,
    })) || [];

  return examinationFormFields.map((field) =>
    field.name === "classId"
      ? {
          ...field,
          options: classOptions,
        }
      : field
  );
}, [classData]);

  return (
    <CrudTemplate
      title="Examination Management"
      subtitle="Manage all examinations"
      data={data?.data || []}
      columns={examinationColumns}
      formFields={dynamicFormFields}
      loading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default ExaminationPage;