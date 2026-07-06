import React from "react";
import { message } from "antd";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { academicSessionColumns } from "@/utils/tableConfigs";
import { academicSessionFormFields } from "@/utils/formSchemas";

import {
  useCreateAcademicSessionMutation,
  useGetAllAcademicSessionQuery,
  useUpdateAcademicSessionMutation,
  useDeleteAcademicSessionMutation,
} from "@/redux/api/academicSessionApi";

const AcademicSessionPage = () => {
  const { data, isLoading, refetch } = useGetAllAcademicSessionQuery();

  const [create] = useCreateAcademicSessionMutation();
  const [update] = useUpdateAcademicSessionMutation();
  const [remove] = useDeleteAcademicSessionMutation();

  return (
    <CrudTemplate
      title="Academic Session"
      subtitle="Manage academic sessions"
      data={data?.data || []
      }
      columns={academicSessionColumns}
      formFields={academicSessionFormFields}
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

export default AcademicSessionPage;