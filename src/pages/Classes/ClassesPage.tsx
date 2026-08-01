import React, { useMemo } from "react";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { classesColumns } from "@/utils/tableConfigs";
import { classesFormFields } from "@/utils/formSchemas";

import {
  useCreateClassesMutation,
  useGetAllClassesQuery,
  useUpdateClassesMutation,
  useDeleteClassesMutation,
} from "@/redux/api/classesApi";

import { useGetAllClassGroupQuery } from "@/redux/api/classGroupApi"; // ← ClassGroup API import করতে হবে

const ClassPage = () => {
  const { data, isLoading, refetch } = useGetAllClassesQuery();

  const [create] = useCreateClassesMutation();
  const [update] = useUpdateClassesMutation();
  const [remove] = useDeleteClassesMutation();

  // Class Group ডেটা ফেচ করা
  const { data: classGroupData } = useGetAllClassGroupQuery();

  // 🔥 dynamic options injection for Class Group
  const dynamicFormFields = useMemo(() => {
    const mapOptions = (arr: any[] = [], labelKey: string) =>
      arr.map((item) => ({
        label: item[labelKey],
        value: item._id,
      }));

    return classesFormFields.map((field) => {
      if (!field.dynamicOptions) return field;

      if (field.name === "classGroupId" && classGroupData?.data) {
        return {
          ...field,
          options: mapOptions(classGroupData.data, "name"), // assuming 'name' is the field in ClassGroup schema
        };
      }

      return field;
    });
  }, [classGroupData]);

  // 🔥 CREATE
  const handleAdd = async (d: any) => {
    await create(d);
    refetch();
  };

  // 🔥 UPDATE
  const handleEdit = async (id: string, d: any) => {
    await update({ id, data: d });
    refetch();
  };

  // 🔥 DELETE
  const handleDelete = async (id: string) => {
    await remove(id);
    refetch();
  };

  return (
    <CrudTemplate
      title="Class Management"
      subtitle="Manage classes"
      data={data?.data || []}
      columns={classesColumns}
      formFields={dynamicFormFields}
      loading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default ClassPage;

// import React, { useMemo } from "react";
// import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

// import { classesColumns } from "@/utils/tableConfigs";
// import { classesFormFields } from "@/utils/formSchemas";

// import {
//   useCreateClassesMutation,
//   useGetAllClassesQuery,
//   useUpdateClassesMutation,
//   useDeleteClassesMutation,
// } from "@/redux/api/classesApi";

// import { useGetAllTeacherQuery } from "@/redux/api/teacherApi";

// const ClassPage = () => {
//   const { data, isLoading, refetch } = useGetAllClassesQuery();

//   const [create] = useCreateClassesMutation();
//   const [update] = useUpdateClassesMutation();
//   const [remove] = useDeleteClassesMutation();

//   const { data: teachersData } = useGetAllTeacherQuery();

//   // 🔥 dynamic options injection
//   const dynamicFormFields = useMemo(() => {
//     const mapOptions = (arr: any[] = [], labelKey: string) =>
//       arr.map((item) => ({
//         label: item[labelKey],
//         value: item._id,
//       }));

//     return classesFormFields.map((field) => {
//       if (!field.dynamicOptions) return field;

//       if (field.name === "teacherId" && teachersData?.data) {
//         return {
//           ...field,
//           options: mapOptions(teachersData.data, "name"),
//         };
//       }

//       return field;
//     });
//   }, [teachersData]);

//   // 🔥 CREATE
//   const handleAdd = async (d: any) => {
//     await create(d);
//     refetch();
//   };

//   // 🔥 UPDATE
//   const handleEdit = async (id: string, d: any) => {
//     await update({ id, data: d });
//   };

//   // 🔥 DELETE
//   const handleDelete = async (id: string) => {
//     await remove(id);
//   };

//   return (
//     <CrudTemplate
//       title="Class Management"
//       subtitle="Manage classes"
//       data={data?.data || []}
//       columns={classesColumns}
//       formFields={dynamicFormFields}
//       loading={isLoading}
//       onAdd={handleAdd}
//       onEdit={handleEdit}
//       onDelete={handleDelete}
//     />
//   );
// };

// export default ClassPage;