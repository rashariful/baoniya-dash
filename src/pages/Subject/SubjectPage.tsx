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

const SubjectPage = () => {
  const { data, isLoading, refetch } = useGetAllSubjectQuery();
  const { data: classData } = useGetAllClassesQuery();

  const [create] = useCreateSubjectMutation();
  const [update] = useUpdateSubjectMutation();
  const [remove] = useDeleteSubjectMutation();

  // 🔥 ONLY CLASS DYNAMIC OPTIONS
  const dynamicFormFields = useMemo(() => {
    const mapOptions = (arr: any[] = [], key: string) =>
      arr.map((item) => ({
        label: item[key],
        value: item._id,
      }));

    return subjectFormFields.map((field) => {
      if (!field.dynamicOptions) return field;

      if (field.name === "classId") {
        return {
          ...field,
          options: mapOptions(classData?.data, "name"),
        };
      }

      return field;
    });
  }, [classData]);

  // CREATE
  const handleAdd = async (d: any) => {
    await create(d);
    message.success("Subject Created");
    refetch();
  };

  // UPDATE
  const handleEdit = async (id: string, d: any) => {
    await update({ id, data: d });
    message.success("Updated");
  };

  // DELETE
  const handleDelete = async (id: string) => {
    await remove(id);
    message.success("Deleted");
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