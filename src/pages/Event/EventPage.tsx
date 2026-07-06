import React from "react";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { eventColumns } from "@/utils/tableConfigs";
import { eventFormFields } from "@/utils/formSchemas";

import {
  useCreateEventMutation,
  useGetAllEventQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from "@/redux/api/eventApi";

const EventPage = () => {
  const { data, isLoading, refetch } = useGetAllEventQuery();

  const [create] = useCreateEventMutation();
  const [update] = useUpdateEventMutation();
  const [remove] = useDeleteEventMutation();

  return (
    <CrudTemplate
      title="Event Management"
      subtitle="Manage events"
      data={data?.data || []}
      columns={eventColumns}
      formFields={eventFormFields}
      loading={isLoading}
      onAdd={(d) => create(d)}
      onEdit={(id, d) => update({ id, data: d })}
      onDelete={remove}
    />
  );
};

export default EventPage;