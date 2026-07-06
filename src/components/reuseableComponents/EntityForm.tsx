import React from "react";
import { Form, Input, Button, Switch, DatePicker, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";
import type { UploadProps } from "antd";

interface Field {
  name: string;
  label: string;
  type: "input" | "textarea" | "switch" | "date" | "upload";
  rules?: any[];
}

interface EntityFormProps {
  fields: Field[];
  initialValues?: any;
  onSubmit: (values: any) => void;
  submitText?: string;
}

const EntityForm: React.FC<EntityFormProps> = ({
  fields,
  initialValues,
  onSubmit,
  submitText = "Submit",
}) => {
  const [form] = Form.useForm();

  const uploadProps: UploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
  };

  const handleFinish = async (values: any) => {
    try {
      // Handle upload field if exists
      const uploadField = fields.find(f => f.type === "upload")?.name;
      if (uploadField && values[uploadField] && values[uploadField].length > 0) {
        const file: RcFile = values[uploadField][0].originFileObj;
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:5000/api/v1/team", { method: "POST", body: formData });
        const data = await res.json();
        values[uploadField] = data.url; // replace file list with uploaded URL
      }

      onSubmit(values);
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Failed to submit form!");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={initialValues}>
      {fields.map(field => {
        switch (field.type) {
          case "input":
            return (
              <Form.Item key={field.name} label={field.label} name={field.name} rules={field.rules}>
                <Input />
              </Form.Item>
            );
          case "textarea":
            return (
              <Form.Item key={field.name} label={field.label} name={field.name} rules={field.rules}>
                <Input.TextArea rows={4} />
              </Form.Item>
            );
          case "switch":
            return (
              <Form.Item
                key={field.name}
                label={field.label}
                name={field.name}
                valuePropName="checked"
                initialValue={initialValues?.[field.name] ?? true}
              >
                <Switch />
              </Form.Item>
            );
          case "date":
            return (
              <Form.Item key={field.name} label={field.label} name={field.name}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            );
          case "upload":
            return (
              <Form.Item
                key={field.name}
                label={field.label}
                name={field.name}
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList;
                }}
              >
                <Upload {...uploadProps} listType="picture">
                  <Button icon={<UploadOutlined />}>Upload {field.label}</Button>
                </Upload>
              </Form.Item>
            );
          default:
            return null;
        }
      })}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EntityForm;
