import React, { useMemo } from "react";
import { message } from "antd";

import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { sectionColumns } from "@/utils/tableConfigs";
import { sectionFormFields } from "@/utils/formSchemas";

import {
  useCreateSectionMutation,
  useGetAllSectionQuery,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} from "@/redux/api/sectionApi";

import { useGetAllClassesQuery } from "@/redux/api/classesApi";

const SectionPage = () => {
  const { data, isLoading, refetch } = useGetAllSectionQuery();
  const { data: classData } = useGetAllClassesQuery();

  const [create] = useCreateSectionMutation();
  const [update] = useUpdateSectionMutation();
  const [remove] = useDeleteSectionMutation();

  // 🔥 dynamic form fields
  const dynamicFormFields = useMemo(() => {
    const mapOptions = (arr: any[] = [], labelKey: string) =>
      arr.map((item) => ({
        label: item[labelKey],
        value: item._id,
      }));

    return sectionFormFields.map((field) => {
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
    message.success("Section Created");
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
      title="Section Management"
      subtitle="Manage class sections"
      data={data?.data || []}
      columns={sectionColumns}
      formFields={dynamicFormFields}
      loading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default SectionPage;