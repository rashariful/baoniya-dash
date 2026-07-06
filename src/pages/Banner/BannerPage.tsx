
import React from 'react'

function BannerPage() {
  return (
    <div>BannerPage</div>
  )
}

export default BannerPage

// import React, { useState } from "react";
// import { message } from "antd";
// import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";
// // import { bannerColumns } from "@/utils/tableConfigs";
// // import { bannerFormFields } from "@/utils/formSchemas";
// import {
//   useCreateBannerMutation,
//   useGetAllBannerQuery,
//   useUpdateBannerMutation,
//   useDeleteBannerMutation,
// } from "@/redux/api/bannerApi";

// type BannerFormData = {
//   title: string;
//   thumbnail?: File;
//   isActive?: boolean;
// };

// const BannerPage: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   // Fetch banners with optional search term
//   const {
//     data: banners,
//     isLoading,
//     refetch,
//   } = useGetAllBannerQuery();

//   const [createBanner] = useCreateBannerMutation();
//   const [updateBanner] = useUpdateBannerMutation();
//   const [deleteBanner] = useDeleteBannerMutation();

// // Convert banner form data to FormData
// const convertToFormData = (data: Record<string, any>) => {
//   const formData = new FormData();

//   Object.entries(data).forEach(([key, value]) => {
//     if (!value && value !== 0) return; // skip null/undefined

//     // Handle Files
//     if (value.originFileObj instanceof File) {
//       formData.append(key, value.originFileObj);
//     } else if (value instanceof File) {
//       formData.append(key, value);
//     }
//     // Handle Date
//     else if (value instanceof Date) {
//       formData.append(key, value.toISOString());
//     }
//     // Handle Arrays
//     else if (Array.isArray(value)) {
//       if (value.every((v) => typeof v === "object" && v !== null && "keyword" in v)) {
//         // Append each keyword separately
//         value.forEach((v) => formData.append(key, v.keyword));
//       } else {
//         // Append primitives directly
//         value.forEach((v) => formData.append(key, String(v)));
//       }
//     }
//     // Handle Objects
//     else if (typeof value === "object" && value !== null) {
//       formData.append(key, JSON.stringify(value));
//     }
//     // Handle primitives
//     else {
//       formData.append(key, String(value));
//     }
//   });

//   return formData;
// };

//   // Handle add
//   const handleAdd = async (data: BannerFormData) => {
//     try {
//       const formData = convertToFormData(data);
//       await createBanner(formData)
//       message.success("Banner added successfully");
//       refetch();
//     } catch (error: any) {
//       message.error(error?.data?.message || "Failed to add banner");
//     }
//   };

//   // Handle edit
//   const handleEdit = async (id: string, data: BannerFormData) => {
//     try {
//       const formData = convertToFormData(data);
//       await updateBanner({ id, data: formData })
//       message.success("Banner updated successfully");
//       refetch();
//     } catch (error: any) {
//       message.error(error?.data?.message || "Failed to update banner");
//     }
//   };

//   // Handle delete
//   const handleDelete = async (id: string | number) => {
//     try {
//       await deleteBanner(id)
//       message.success("Banner deleted successfully");
//       refetch();
//     } catch (error: any) {
//       message.error(error?.data?.message || "Failed to delete banner");
//     }
//   };

//   // Handle toggle active/inactive
// const handleToggle = async (id: string, checked: boolean) => {
//   try {
//     // Follow same pattern as handleEdit
//     await updateBanner({ id, data: { isActive: checked } });

//     message.success(
//       `Banner ${checked ? "activated" : "deactivated"} successfully`
//     );
//     refetch();
//   } catch (error: any) {
//     message.error("Failed to update banner status");
//   }
// };


//   return (
//     <section>
//       <div>
//         {/* <CrudTemplate
//           title="Banner Management"
//           subtitle="Your all banner manage here "
//           data={Array.isArray(banners?.data) ? banners.data : []}
//           columns={bannerColumns}
//           formFields={bannerFormFields}
//           loading={isLoading}
//           onAdd={handleAdd}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           onToggle={handleToggle}

//         /> */}
//       </div>
//     </section>
//   );
// };

// export default BannerPage;
