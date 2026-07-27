import React, { useMemo, useState } from "react";
import { message } from "antd";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { assetColumns } from "@/utils/tableConfigs";
import { assetFormFields } from "@/utils/formSchemas";

import {
 useCreateAssetMutation,
  useGetAllAssetQuery,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
} from "@/redux/api/assetApi.js";

const AssetPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch } = useGetAllAssetQuery(
    searchTerm ? [{ name: "searchTerm", value: searchTerm }] : undefined
  );

  const [createAsset] = useCreateAssetMutation();
  const [updateAsset] = useUpdateAssetMutation();
  const [deleteAsset] = useDeleteAssetMutation();

  // ADD
  const handleAdd = async (formData: any) => {
    try {
      await createAsset(formData).unwrap();
      message.success("Asset created successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to create asset");
    }
  };

  // EDIT
  const handleEdit = async (id: string, formData: any) => {
    try {
      await updateAsset({ id, data: formData }).unwrap();
      message.success("Asset updated successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update asset");
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await deleteAsset(id).unwrap();
      message.success("Asset deleted successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete asset");
    }
  };

  return (
    <CrudTemplate
      title="Asset Management"
      subtitle="Manage inventory, furniture, electronics, and assets"
      data={data?.data || []}
      columns={assetColumns}
      formFields={assetFormFields}
      loading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      enableSearch
      onSearch={setSearchTerm}
    />
  );
};

export default AssetPage;