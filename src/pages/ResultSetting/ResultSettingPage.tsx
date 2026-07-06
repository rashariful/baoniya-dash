import React, { useMemo } from "react";
import { message } from "antd";

import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { resultSettingColumns } from "@/utils/tableConfigs";
import { resultSettingFormFields } from "@/utils/formSchemas";

import {
  useCreateResultSettingMutation,
  useGetAllResultSettingQuery,
  useUpdateResultSettingMutation,
  useDeleteResultSettingMutation,
} from "@/redux/api/resultSettingApi";

import { useGetAllAcademicSessionQuery } from "@/redux/api/academicSessionApi";
import { useGetAllClassesQuery } from "@/redux/api/classesApi";
import { useGetAllExamQuery } from "@/redux/api/examApi";
import { useGetAllSubjectQuery } from "@/redux/api/subjectApi";

const ResultSettingPage = () => {
  const { data, isLoading, refetch } = useGetAllResultSettingQuery();

  const { data: sessionData } = useGetAllAcademicSessionQuery();
  const { data: classData } = useGetAllClassesQuery();
  const { data: examData } = useGetAllExamQuery();
  const { data: subjectData } = useGetAllSubjectQuery();

  const [create] = useCreateResultSettingMutation();
  const [update] = useUpdateResultSettingMutation();
  const [remove] = useDeleteResultSettingMutation();

  // dynamic options
  const dynamicFormFields = useMemo(() => {
    const mapOptions = (arr: any[] = [], key: string) =>
      arr.map((item) => ({
        label: item[key],
        value: item._id,
      }));

    return resultSettingFormFields.map((field) => {
      if (!field.dynamicOptions) return field;

      if (field.name === "sessionId") {
        return { ...field, options: mapOptions(sessionData?.data, "year") };
      }

      if (field.name === "classId") {
        return { ...field, options: mapOptions(classData?.data, "name") };
      }

      if (field.name === "examId") {
        return { ...field, options: mapOptions(examData?.data, "name") };
      }

      if (field.name === "subjectCombination") {
        return { ...field, options: mapOptions(subjectData?.data, "name") };
      }

      return field;
    });
  }, [sessionData, classData, examData, subjectData]);

  return (
    <CrudTemplate
      title="Result Setting"
      subtitle="Manage exam result rules"
      data={data?.data || []}
      columns={resultSettingColumns}
      formFields={dynamicFormFields}
      loading={isLoading}
      onAdd={async (d) => {
        await create(d);
        message.success("Created");
        refetch();
      }}
      onEdit={async (id, d) => update({ id, data: d })}
      onDelete={remove}
    />
  );
};

export default ResultSettingPage;