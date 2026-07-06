// components/common/AdvancedTable/AdvancedTable.tsx

import { Table, Button, Space, Tag, Switch, Tooltip, Input } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { ColumnsType, TableProps } from "antd/es/table";

interface AdvancedTableProps<T> {
  data: T[];
  columns: ColumnsType<T>;
  loading?: boolean;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  onView?: (record: T) => void;
  onToggle?: (record: T, checked: boolean) => void;
  rowSelection?: TableProps<T>["rowSelection"];
  pagination?: any;
  scroll?: { x?: number; y?: number };
  searchable?: boolean;
  onSearch?: (value: string) => void;
}

const AdvancedTable = <T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onToggle,
  rowSelection,
  pagination = { pageSize: 10 },
  scroll = { x: 1000 },
  searchable = true,
  onSearch,
}: AdvancedTableProps<T>) => {
  const actionColumn: ColumnsType<T>[0] = {
    title: "Actions",
    key: "actions",
    fixed: "right",
    width: 150,
    render: (_, record) => (
      <Space size="small">
        {onToggle && (
          <Tooltip title="Toggle Status">
            <Switch
              size="small"
              checked={record.isActive}
              onChange={(checked) => onToggle(record, checked)}
            />
          </Tooltip>
        )}
        {onView && (
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
        )}
        {onEdit && (
          <Tooltip title="Edit">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              className="text-primary hover:text-primary/80 hover:bg-primary/10 border border-primary/20 hover:scale-110 transition-all duration-200"
            />
          </Tooltip>
        )}

        {onDelete && (
          <Tooltip title="Delete">
            <Button
              type="text"
              size="small"
              danger
              icon={<RiDeleteBin6Line className="text-white" />}
              onClick={() => onDelete(record)}
              className="bg-white  hover:text-red-700 hover:bg-red-600 border border-red-200 hover:scale-110 transition-all duration-200"
            />
          </Tooltip>
        )}
      </Space>
    ),
  };

  const tableColumns = [...columns, actionColumn];

  return (
    <div className="advanced-table">
      {searchable && onSearch && (
        <div className="relative mb-5 w-full max-w-sm">
          <div
            className={`
      flex items-center rounded border-2 border-primary/30 
      bg-white overflow-hidden shadow-sm
      focus-within:border-primary focus-within:shadow-md
      focus-within:ring-2 focus-within:ring-primary/20
      transition-all duration-200
    `}
          >
            <Input
              placeholder="Search..."
              bordered={false}
              allowClear
              onChange={(e) => onSearch(e.target.value)}
              className="flex-1 h-8 px-5 text-base placeholder:text-gray-400"
            />
            <div className="">
              <div
                className={`
          h-8 w-14 rounded-r bg-primary flex items-center justify-center
          text-white cursor-pointer hover:bg-primary/90 transition-colors
        `}
              >
                <SearchOutlined size={14} />
              </div>
            </div>
          </div>
        </div>
      )}

      <Table<T>
        columns={tableColumns}
        dataSource={data}
        loading={loading}
        rowSelection={rowSelection}
        pagination={pagination}
        scroll={scroll}
        rowKey="_id"
        size="middle"
      />
    </div>
  );
};

export default AdvancedTable;
