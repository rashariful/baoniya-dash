import React from "react";
import { message } from "antd";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { noticeColumns } from "@/utils/tableConfigs";
import { noticeFormFields } from "@/utils/formSchemas";

import {
  useCreateNoticeMutation,
  useGetAllNoticeQuery,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} from "@/redux/api/noticeApi";

const NoticePage = () => {
  const { data, isLoading, refetch } = useGetAllNoticeQuery();

  const [create] = useCreateNoticeMutation();
  const [update] = useUpdateNoticeMutation();
  const [remove] = useDeleteNoticeMutation();

  return (
    <CrudTemplate
      title="Notice Board"
      subtitle="Manage notices"
      data={data?.data || []}
      columns={noticeColumns}
      formFields={noticeFormFields}
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

export default NoticePage;