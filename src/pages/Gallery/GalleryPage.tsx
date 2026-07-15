import React, { useState } from "react";
import { message } from "antd";

import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { galleryColumns } from "@/utils/tableConfigs";
import { galleryFormFields } from "@/utils/formSchemas";

import {
  useCreateGalleryMutation,
  useGetAllGalleryQuery,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
} from "@/redux/api/galleryApi";

type GalleryFormData = {
  title: string;
  description?: string;
  thumbnail?: File;
};

const GalleryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch } = useGetAllGalleryQuery(
    searchTerm ? [{ name: "searchTerm", value: searchTerm }] : undefined
  );

  const [createGallery] = useCreateGalleryMutation();
  const [updateGallery] = useUpdateGalleryMutation();
  const [deleteGallery] = useDeleteGalleryMutation();

  // Convert Object to FormData
  const convertToFormData = (data: Record<string, any>) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (!value && value !== 0) return;

      // Upload File
      if (value?.originFileObj instanceof File) {
        formData.append(key, value.originFileObj);
      } else if (value instanceof File) {
        formData.append(key, value);
      }

      // Date
      else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      }

      // Object
      else if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
      }

      // Primitive
      else {
        formData.append(key, String(value));
      }
    });

    return formData;
  };

  const handleAdd = async (data: GalleryFormData) => {
    try {
      const formData = convertToFormData(data);

      await createGallery(formData).unwrap();

      message.success("Gallery created successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to create gallery");
    }
  };

  const handleEdit = async (id: string, data: GalleryFormData) => {
    try {
      const formData = convertToFormData(data);

      await updateGallery({
        id,
        data: formData,
      }).unwrap();

      message.success("Gallery updated successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update gallery");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGallery(id).unwrap();

      message.success("Gallery deleted successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete gallery");
    }
  };

  return (
    <CrudTemplate
      title="Gallery Management"
      subtitle="Manage all gallery items"
      data={data?.data || []}
      columns={galleryColumns}
      formFields={galleryFormFields}
      loading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      enableSearch
      onSearch={setSearchTerm}
    />
  );
};

export default GalleryPage;