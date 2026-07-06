// components/templates/CrudTemplate/CrudTemplate.tsx
import React, { useState } from "react";

// ✅ Importing each AntD component separately
import Card from "antd/es/card";
import Button from "antd/es/button";
import Modal from "antd/es/modal";
import message from "antd/es/message";
import Space from "antd/es/space";
import Form from "antd/es/form";
import Tag from "antd/es/tag";
import Divider from "antd/es/divider";
import {
  PlusOutlined,
  LoadingOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import AdvancedTable from "../../common/AdvancedTable/AdvancedTable";
import FormBuilder, { FormField } from "../../common/FormBuilder/FormBuilder";
import type { ColumnsType } from "antd/es/table";




// CrudTemplate.tsx - imports এ dayjs যোগ করুন
import dayjs from 'dayjs';



interface CrudTemplateProps<T> {
  title: string;
  subtitle?: string;
  data: T[];
  columns: ColumnsType<T>;
  formFields: FormField[];
  loading: boolean;
  onAdd: (data: any) => Promise<void>;
  onEdit: (id: string | number, data: any) => Promise<void>;
  onDelete: (id: string | number) => Promise<void>;
  onToggle?: (id: string | number, status: boolean) => Promise<void>;
  onView?: (record: T) => void;
  extraActions?: React.ReactNode;
  enableSearch?: boolean;
  enableFilters?: boolean;
  rowSelection?: any;
    onSearch?: (value: string) => void; // ← parent থেকে আসবে
  totalItems?: number;
}

const CrudTemplate = <T extends { _id: string | number; id: string | number }>({
  title,
  subtitle,
  data,
  columns,
  formFields,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
  onView,
  extraActions,
  enableSearch = true,
  enableFilters = true,
   onSearch, 
  rowSelection,
  totalItems,
}: CrudTemplateProps<T>) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<T | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  
// handleEdit function টা modify করুন:
const handleEdit = (record: T) => {
  setEditingRecord(record);
  setIsModalVisible(true);
  
  // Convert date fields to dayjs objects
  const formValues = { ...record };
  formFields.forEach(field => {
    if (field.type === 'date' && record[field.name]) {
      formValues[field.name] = dayjs(record[field.name]);
    }
  });
  
  form.setFieldsValue(formValues);
};

  // const handleEdit = (record: T) => {
  //   setEditingRecord(record);
  //   setIsModalVisible(true);
  //   form.setFieldsValue(record);
  // };

  const handleView = (record: T) => {
    onView?.(record);
  };

  const handleDelete = async (record: T) => {
    Modal.confirm({
      title: (
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-red-500 text-lg" />
          <span className="font-semibold">Confirm Deletion</span>
        </div>
      ),
      content: (
        <div className="mt-2">
          <p>Are you sure you want to delete this {title.toLowerCase()}?</p>
          <p className="text-sm text-gray-500 mt-1">
            This action cannot be undone.
          </p>
        </div>
      ),
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      className: "delete-confirm-modal",
      onOk: async () => {
        try {
          await onDelete(record._id);
          message.success(`${title} deleted successfully`);
        } catch {
          message.error("Delete failed. Please try again.");
        }
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      message.warning("Please select items to delete");
      return;
    }

    Modal.confirm({
      title: (
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-red-500 text-lg" />
          <span className="font-semibold">Confirm Bulk Deletion</span>
        </div>
      ),
      content: (
        <div className="mt-2">
          <p>
            Are you sure you want to delete {selectedRows.length} selected{" "}
            {title.toLowerCase()}?
          </p>
          <p className="text-sm text-gray-500 mt-1">
            This action cannot be undone.
          </p>
        </div>
      ),
      okText: `Delete ${selectedRows.length} Items`,
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          // Implement bulk deletion logic here
          await Promise.all(selectedRows.map((row) => onDelete(row._id)));
          message.success(`Successfully deleted ${selectedRows.length} items`);
          setSelectedRows([]);
        } catch {
          message.error("Bulk delete failed");
        }
      },
    });
  };

  const handleToggle = async (record: T, checked: boolean) => {
    // console.log(record._id, "from crud")
    try {
      await onToggle?.(record?._id, checked);
      message.success("Status updated successfully");
    } catch {
      message.error("Failed to update status");
    }
  };

  const handleFormSubmit = async (values: any) => {
    setSubmitLoading(true);
    try {
      if (editingRecord) {
        await onEdit(editingRecord._id, values);
        message.success(`${title} updated successfully`);
      } else {
        await onAdd(values);
        message.success(`${title} created successfully`);
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Operation failed. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  // ✅ Enhanced columns with Tailwind primary color classes
  const enhancedColumns: ColumnsType<T> = [...columns];

  // function onSearch(value: string): void {
  //   throw new Error("Function not implemented.");
  // }

  return (
    <div className="crud-template mt-6 ">
      <Card
        // className="rounded-2xl shadow-sm border-0 bg-white hover:shadow-md transition-shadow duration-300"
        styles={{
          body: { padding: "24px" },
        }}
        title={
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-primary mb-1">{title}</h2>
              {subtitle && (
                <p className="text-sm text-gray-500 font-normal mb-5">
                  {subtitle}
                </p>
              )}
              {totalItems !== undefined && (
                <div className="mt-2">
                  <Tag className="text-xs font-medium bg-primary/10 text-primary border-primary/20">
                    Total: {totalItems}
                  </Tag>
                </div>
              )}
            </div>

            <div className="mt-4 lg:mt-0">
              <Space wrap>
                {selectedRows.length > 0 && (
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleBulkDelete}
                    className="h-9 font-medium rounded-lg"
                  >
                    Delete Selected ({selectedRows.length})
                  </Button>
                )}

                {extraActions}

                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  size="middle"
                  className="h-10 px-6 font-semibold bg-primary hover:bg-primary/90 border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg text-white"
                >
                  Add New
                </Button>
              </Space>
            </div>
          </div>
        }
      >
        <div className="mb-6">
         <AdvancedTable<T>
  data={data}
  columns={enhancedColumns}
  loading={loading}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onToggle={onToggle ? handleToggle : undefined}
  onView={onView}
  rowSelection={
    rowSelection
      ? {
          ...rowSelection,
          onChange: (_: any, selectedRows: T[]) =>
            setSelectedRows(selectedRows),
        }
      : undefined
  }
  scroll={{ x: 1200 }}
  searchable={enableSearch}
  onSearch={onSearch} // ← parent function directly
/>

        </div>

        <Modal
          title={
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-primary" />
              <span className="text-xl font-bold text-primary">
                {editingRecord ? `Edit ${title}` : `Create New ${title}`}
              </span>
            </div>
          }
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={800}
          destroyOnClose
          centered
          className="crud-modal"
          styles={{
            body: { padding: "24px" },
          }}
        >
          <Divider className="my-4" />

          <FormBuilder
            fields={formFields}
            form={form}
            onSubmit={handleFormSubmit}
            onCancel={handleModalClose}
            submitText={
              submitLoading ? (
                <>
                  <LoadingOutlined className="mr-2" />
                  {editingRecord ? "Updating..." : "Creating..."}
                </>
              ) : editingRecord ? (
                "Update"
              ) : (
                "Create"
              )
            }
            submitDisabled={submitLoading}
            layout="vertical"
            submitButtonProps={{
              size: "large",
              className:
                "w-full h-12 font-semibold rounded-lg bg-primary hover:bg-primary/90 border-0 text-white transition-all duration-300",
            }}
            cancelButtonProps={{
              size: "large",
              className:
                "w-full h-12 font-semibold rounded-lg border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700 transition-all duration-300",
            }}
          />
        </Modal>
      </Card>

      <style jsx>{`
        .crud-template :global(.ant-card-head) {
          border-bottom: 1px solid #f0f0f0;
          padding: 20px 24px 0;
        }

        .crud-template :global(.ant-table-thead > tr > th) {
          background: #f8fafc;
          font-weight: 600;
          color: #374151;
        }

        .crud-template :global(.crud-modal .ant-modal-close) {
          top: 16px;
          right: 16px;
        }

        .crud-template :global(.crud-modal .ant-modal-close:hover) {
          background-color: rgba(var(--primary-color), 0.1);
          color: rgba(var(--primary-color), 1);
        }

        .crud-template :global(.advanced-table-modern) {
          border-radius: 12px;
          overflow: hidden;
        }

        .crud-template :global(.delete-confirm-modal .ant-modal-body) {
          padding: 24px;
        }

        .crud-template :global(.ant-btn-primary:hover) {
          transform: translateY(-1px);
        }

        /* Ensure primary color works with Ant Design components */
        .crud-template :global(.ant-table-thead > tr > th::before) {
          background-color: rgba(var(--primary-color), 1) !important;
        }

        .crud-template :global(.ant-pagination-item-active) {
          border-color: rgba(var(--primary-color), 1);
        }

        .crud-template :global(.ant-pagination-item-active a) {
          color: rgba(var(--primary-color), 1);
        }
      `}</style>
    </div>
  );
};

export default CrudTemplate;
