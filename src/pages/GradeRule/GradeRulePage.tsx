import React, { useMemo } from "react";
import { message } from "antd";

import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { gradeRuleColumns } from "@/utils/tableConfigs";
import { gradeRuleFormFields } from "@/utils/formSchemas";

import {
  useCreateGradeRuleMutation,
  useGetAllGradeRuleQuery,
  useUpdateGradeRuleMutation,
  useDeleteGradeRuleMutation,
} from "@/redux/api/gradeRuleApi";

import { useGetAllAcademicSessionQuery } from "@/redux/api/academicSessionApi";
import { useGetAllClassesQuery } from "@/redux/api/classesApi";

const GradeRulePage = () => {
  const { data, isLoading, refetch } = useGetAllGradeRuleQuery();

  const { data: sessionsData } = useGetAllAcademicSessionQuery();
  const { data: classesData } = useGetAllClassesQuery();

  const [create] = useCreateGradeRuleMutation();
  const [update] = useUpdateGradeRuleMutation();
  const [remove] = useDeleteGradeRuleMutation();

  // 🔥 dynamic options
  const dynamicFormFields = useMemo(() => {
    const mapOptions = (arr: any[] = [], key: string) =>
      arr.map((item) => ({
        label: item[key],
        value: item._id,
      }));

    return gradeRuleFormFields.map((field) => {
      if (!field.dynamicOptions) return field;

      if (field.name === "sessionId") {
        return {
          ...field,
          options: mapOptions(sessionsData?.data, "year"),
        };
      }

      if (field.name === "applicableClasses") {
        return {
          ...field,
          options: mapOptions(classesData?.data, "name"),
        };
      }

      return field;
    });
  }, [sessionsData, classesData]);

  // 🔥 CREATE
  const handleAdd = async (d: any) => {
    await create(d);
    message.success("Grade Rule Created");
    refetch();
  };

  // 🔥 UPDATE
  const handleEdit = async (id: string, d: any) => {
    await update({ id, data: d });
    message.success("Updated");
    refetch();
  };

  // 🔥 DELETE
  const handleDelete = async (id: string) => {
    await remove(id);
    message.success("Deleted");
    refetch();
  };

  return (
    <CrudTemplate
      title="Grade Rule Management"
      subtitle="Manage grading system (GPA rules)"
      data={data?.data || []}
      columns={gradeRuleColumns}
      formFields={dynamicFormFields}
      loading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default GradeRulePage;