// components/common/FormBuilder/FormBuilder.tsx
import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Upload,
  Button,
  Space,
  DatePicker,
  InputNumber,
  Rate,
  Checkbox,
  Radio,
  message,
} from "antd";
import { SaveOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd/es/form";

const { TextArea } = Input;
const { Option } = Select;

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "switch"
    | "upload"
    | "date"
    | "rate"
    | "checkbox"
    | "radio"
    | "tags"
    | "dynamicList"
    | "richtext"; // ✅ add this
  options?: { label: string; value: any }[];
  dynamicOptions?: boolean; // for dynamic select
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  rules?: any[];
  initialValue?: any;
  span?: number;
  multiple?: boolean;
  fields?: FormField[];
}

interface FormBuilderProps {
  fields: FormField[];
  form: FormInstance;
  loading?: boolean;
  onSubmit: (values: any) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  layout?: "horizontal" | "vertical" | "inline";
}
import RichTextEditor from "@/components/common/RichTextEditor/RichTextEditor";
const PRIMARY_COLOR = "#F97316";

const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  form,
  loading = false,
  onSubmit,
  onCancel,
  submitText = "Submit",
  cancelText = "Cancel",
  layout = "vertical",
}) => {
  const [fileStorage, setFileStorage] = useState<Record<string, File | File[]>>(
    {},
  );

  // ----- File upload handling -----
  const handleFileSelect = (file: File, field: FormField) => {
    if (!file.type.startsWith("image/")) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 > 2) {
      message.error("Image must be smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }

    setFileStorage((prev) => {
      if (field.multiple) {
        const existingFiles = prev[field.name];
        const filesArray = Array.isArray(existingFiles)
          ? existingFiles
          : existingFiles
            ? [existingFiles]
            : [];
        return { ...prev, [field.name]: [...filesArray, file] };
      } else {
        return { ...prev, [field.name]: file };
      }
    });

    return false; // prevent auto upload
  };

  // ----- Render single field -----
  const renderFormField = (field: FormField) => {
    const commonProps = {
      placeholder: field.placeholder,
      disabled: field.disabled,
      style: { borderColor: PRIMARY_COLOR },
    };

    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return <Input type={field.type} {...commonProps} />;

      case "textarea":
        return <TextArea rows={4} {...commonProps} />;

      case "number":
        return (
          <InputNumber
            style={{ width: "100%", borderColor: PRIMARY_COLOR }}
            {...commonProps}
          />
        );

      case "select": {
        const selectOptions = field.dynamicOptions
          ? field.options || []
          : field.options || [];
        return (
          <Select
            {...commonProps}
            mode={field.multiple ? "multiple" : undefined}
            allowClear
          >
            {selectOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      }

      case "tags":
        return (
          <Select
            {...commonProps}
            mode="tags"
            placeholder={field.placeholder}
            style={{ width: "100%" }}
          >
            {field.options?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case "switch":
        return <Switch />;
      case "richtext":
        return (
          <RichTextEditor
            value={form.getFieldValue(field.name)}
            onChange={(val: string) =>
              form.setFieldsValue({ [field.name]: val })
            }
            label={field.label}
            placeholder={field.placeholder}
          />
        );

      case "date":
        return <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />;

      case "rate":
        return <Rate />;

      case "checkbox":
        return (
          <Checkbox.Group>
            {field.options?.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );

      case "radio":
        return (
          <Radio.Group>
            {field.options?.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        );

      case "upload": {
        const rawFiles = fileStorage[field.name];
        const currentFiles: File[] = rawFiles
          ? Array.isArray(rawFiles)
            ? rawFiles.flat()
            : rawFiles instanceof File
              ? [rawFiles]
              : []
          : [];

        return (
          <Upload
            multiple={field.multiple}
            name={field.name}
            listType="picture-card"
            showUploadList={false}
            beforeUpload={(file) => handleFileSelect(file, field)}
            accept="image/*"
          >
            {currentFiles.length > 0 ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {currentFiles.map((file, idx) => {
                  const imageUrl = URL.createObjectURL(file);
                  return (
                    <img
                      key={idx}
                      src={imageUrl}
                      alt="preview"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                      onLoad={() => URL.revokeObjectURL(imageUrl)}
                    />
                  );
                })}
              </div>
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        );
      }

      case "dynamicList":
        if (!field.fields) return null;
        return (
          <Form.List name={field.name}>
            {(fieldsList, { add, remove }) => (
              <>
                {fieldsList.map((f) => (
                  <div
                    key={f.key}
                    style={{
                      border: "1px solid #ddd",
                      padding: 16,
                      marginBottom: 16,
                      borderRadius: 8,
                    }}
                  >
                    {field.fields!.map((subField) => (
                      <Form.Item
                        key={subField.name}
                        label={subField.label}
                        name={[f.name, subField.name]}
                        rules={
                          subField.required
                            ? [
                                {
                                  required: true,
                                  message: `${subField.label} is required`,
                                },
                              ]
                            : []
                        }
                      >
                        {(() => {
                          switch (subField.type) {
                            case "textarea":
                              return (
                                <TextArea
                                  placeholder={subField.placeholder}
                                  rows={3}
                                  style={{ borderColor: PRIMARY_COLOR }}
                                />
                              );
 
                            case "number":
                              return (
                                <InputNumber
                                  style={{ width: "100%" }}
                                  placeholder={subField.placeholder}
                                />
                              );

                            case "select":
                              return (
                                <Select
                                  placeholder={subField.placeholder}
                                  allowClear
                                >
                                  {subField.options?.map((opt) => (
                                    <Option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </Option>
                                  ))}
                                </Select>
                              );

                            case "date":
                              return (
                                <DatePicker
                                  style={{ width: "100%" }}
                                  format="YYYY-MM-DD"
                                />
                              );

                            default:
                              return (
                                <Input
                                  placeholder={subField.placeholder}
                                  style={{ borderColor: PRIMARY_COLOR }}
                                />
                              );
                          }
                        })()}
                      </Form.Item>
                    ))}
                    <Button
                      type="dashed"
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => remove(f.name)}
                      style={{ marginTop: 8 }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  block
                  style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                >
                  Add {field.label}
                </Button>
              </>
            )}
          </Form.List>
        );

      default:
        return <Input {...commonProps} />;
    }
  };

  // ----- Handle submit -----
  const handleFormSubmit = (values: any) => {
    const finalValues = { ...values };

    // attach files
    fields
      .filter((f) => f.type === "upload")
      .forEach((field) => {
        if (fileStorage[field.name]) {
          finalValues[field.name] = fileStorage[field.name];
        }
      });

    // Ensure dynamicList fields are arrays
    fields
      .filter((f) => f.type === "dynamicList")
      .forEach((field) => {
        if (
          finalValues[field.name] &&
          typeof finalValues[field.name] === "string"
        ) {
          try {
            finalValues[field.name] = JSON.parse(finalValues[field.name]);
          } catch {
            finalValues[field.name] = [];
          }
        }
      });

    onSubmit(finalValues);
  };

  return (
    <Form
      form={form}
      layout={layout}
      onFinish={handleFormSubmit}
      autoComplete="off"
      size="large"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(24, 1fr)",
          gap: 16,
        }}
      >
        {fields.map((field) => (
          <div
            key={field.name}
            style={{
              gridColumn: `span ${field.span || 24}`,
              ...(field.type === "upload"
                ? {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }
                : {}),
            }}
          >
            <Form.Item
              label={field.label}
              name={field.name}
              rules={
                field.rules ||
                (field.required
                  ? [{ required: true, message: `${field.label} is required` }]
                  : [])
              }
              initialValue={field.initialValue}
              valuePropName={field.type === "switch" ? "checked" : "value"}
              style={{ width: field.type === "upload" ? "100%" : "auto" }}
            >
              {renderFormField(field)}
            </Form.Item>

            {field.type === "upload" &&
              (() => {
                const rawFiles = fileStorage[field.name];
                const currentFiles: File[] = rawFiles
                  ? Array.isArray(rawFiles)
                    ? rawFiles.flat()
                    : rawFiles instanceof File
                      ? [rawFiles]
                      : []
                  : [];
                if (currentFiles.length === 0) return null;

                return (
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: "#666",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    Selected: {currentFiles.map((f: File) => f.name).join(", ")}
                  </div>
                );
              })()}
          </div>
        ))}
      </div>

      <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            size="large"
            style={{
              backgroundColor: PRIMARY_COLOR,
              borderColor: PRIMARY_COLOR,
            }}
          >
            {submitText}
          </Button>
          {onCancel && (
            <Button
              onClick={onCancel}
              icon={<CloseOutlined />}
              size="large"
              style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
            >
              {cancelText}
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default FormBuilder;


// import React, { useState, useEffect } from "react";
// import {
//   Form,
//   Input,
//   Select,
//   Switch,
//   Upload,
//   Button,
//   Space,
//   DatePicker,
//   InputNumber,
//   Rate,
//   Checkbox,
//   Radio,
//   message,
// } from "antd";
// import { SaveOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
// import type { FormInstance } from "antd/es/form";
// import RichTextEditor from "@/components/common/RichTextEditor/RichTextEditor";
// import dayjs, { Dayjs } from "dayjs";
// import utc from "dayjs/plugin/utc";
// import customParseFormat from "dayjs/plugin/customParseFormat";

// // Extend dayjs with plugins
// dayjs.extend(customParseFormat);
// dayjs.extend(utc);

// const { TextArea } = Input;
// const { Option } = Select;

// export interface FormField {
//   name: string;
//   label: string;
//   type:
//     | "text"
//     | "email"
//     | "password"
//     | "number"
//     | "textarea"
//     | "select"
//     | "switch"
//     | "upload"
//     | "date"
//     | "rate"
//     | "checkbox"
//     | "radio"
//     | "tags"
//     | "dynamicList"
//     | "richtext";

//   accept?: string;
//   options?: { label: string; value: any }[];
//   dynamicOptions?: boolean;
//   required?: boolean;
//   placeholder?: string;
//   disabled?: boolean;
//   rules?: any[];
//   initialValue?: any;
//   span?: number;
//   multiple?: boolean;
//   fields?: FormField[];
// }

// interface FormBuilderProps {
//   fields: FormField[];
//   form: FormInstance;
//   loading?: boolean;
//   onSubmit: (values: any) => void;
//   onCancel?: () => void;
//   submitText?: string;
//   cancelText?: string;
//   layout?: "horizontal" | "vertical" | "inline";
//   submitDisabled?: boolean;
//   submitButtonProps?: any;
//   cancelButtonProps?: any;
// }

// const PRIMARY_COLOR = "#FE5F15";

// const FormBuilder: React.FC<FormBuilderProps> = ({
//   fields,
//   form,
//   loading = false,
//   onSubmit,
//   onCancel,
//   submitText = "Submit",
//   cancelText = "Cancel",
//   layout = "vertical",
//   submitDisabled = false,
//   submitButtonProps = {},
//   cancelButtonProps = {},
// }) => {
//   const [fileStorage, setFileStorage] = useState<Record<string, File | File[]>>(
//     {}
//   );

//   // Convert initial date values to dayjs objects
//   useEffect(() => {
//     fields.forEach((field) => {
//       if (field.type === "date") {
//         const value = form.getFieldValue(field.name);
//         if (value && typeof value === "string") {
//           form.setFieldsValue({
//             [field.name]: dayjs(value),
//           });
//         }
//       }
//     });
//   }, [fields, form]);

//   // ---------- File Upload Handler ----------
//   const handleFileSelect = (file: File, field: FormField) => {
//     if (field.accept?.includes("image")) {
//       if (!file.type.startsWith("image/")) {
//         message.error("Only image files allowed!");
//         return Upload.LIST_IGNORE;
//       }

//       if (file.size / 1024 / 1024 > 2) {
//         message.error("Image must be smaller than 2MB!");
//         return Upload.LIST_IGNORE;
//       }
//     }

//     if (field.accept?.includes("pdf")) {
//       if (file.type !== "application/pdf") {
//         message.error("Only PDF files allowed!");
//         return Upload.LIST_IGNORE;
//       }

//       if (file.size / 1024 / 1024 > 20) {
//         message.error("PDF must be smaller than 20MB!");
//         return Upload.LIST_IGNORE;
//       }
//     }

//     setFileStorage((prev) => {
//       if (field.multiple) {
//         const existingFiles = prev[field.name];
//         const filesArray = Array.isArray(existingFiles)
//           ? existingFiles
//           : existingFiles
//           ? [existingFiles]
//           : [];

//         return { ...prev, [field.name]: [...filesArray, file] };
//       }

//       return { ...prev, [field.name]: file };
//     });

//     return false;
//   };

//   // Helper function to get date value
//   const getDateValue = (field: FormField) => {
//     const value = form.getFieldValue(field.name);
//     if (value && typeof value === "string") {
//       return dayjs(value);
//     }
//     return value;
//   };

//   // ---------- Render Field ----------
//   const renderFormField = (field: FormField) => {
//     const commonProps = {
//       placeholder: field.placeholder,
//       disabled: field.disabled,
//       style: { borderColor: PRIMARY_COLOR },
//     };

//     switch (field.type) {
//       case "text":
//       case "email":
//       case "password":
//         return <Input type={field.type} {...commonProps} />;

//       case "textarea":
//         return <TextArea rows={4} {...commonProps} />;

//       case "number":
//         return (
//           <InputNumber
//             style={{ width: "100%" }}
//             placeholder={field.placeholder}
//           />
//         );

//       case "select":
//         return (
//           <Select
//             {...commonProps}
//             mode={field.multiple ? "multiple" : undefined}
//             allowClear
//           >
//             {field.options?.map((option) => (
//               <Option key={option.value} value={option.value}>
//                 {option.label}
//               </Option>
//             ))}
//           </Select>
//         );

//       case "tags":
//         return (
//           <Select {...commonProps} mode="tags">
//             {field.options?.map((option) => (
//               <Option key={option.value}>{option.label}</Option>
//             ))}
//           </Select>
//         );

//       case "switch":
//         return <Switch />;

//       case "richtext":
//         return (
//           <RichTextEditor
//             value={form.getFieldValue(field.name) || ""}
//             onChange={(val: string) =>
//               form.setFieldsValue({ [field.name]: val })
//             }
//           />
//         );

//       case "date":
//         return (
//           <DatePicker
//             style={{ width: "100%" }}
//             format="YYYY-MM-DD HH:mm:ss"
//             showTime={{ format: "HH:mm:ss" }}
//             value={getDateValue(field)}
//             onChange={(date) => {
//               form.setFieldsValue({ [field.name]: date });
//             }}
//           />
//         );

//       case "rate":
//         return <Rate />;

//       case "checkbox":
//         return (
//           <Checkbox.Group>
//             {field.options?.map((option) => (
//               <Checkbox key={option.value} value={option.value}>
//                 {option.label}
//               </Checkbox>
//             ))}
//           </Checkbox.Group>
//         );

//       case "radio":
//         return (
//           <Radio.Group>
//             {field.options?.map((option) => (
//               <Radio key={option.value} value={option.value}>
//                 {option.label}
//               </Radio>
//             ))}
//           </Radio.Group>
//         );

//       case "upload": {
//         const rawFiles = fileStorage[field.name];

//         const currentFiles: File[] = rawFiles
//           ? Array.isArray(rawFiles)
//             ? rawFiles
//             : [rawFiles]
//           : [];

//         return (
//           <Upload
//             multiple={field.multiple}
//             name={field.name}
//             listType="picture-card"
//             showUploadList={false}
//             beforeUpload={(file) => handleFileSelect(file, field)}
//             accept={field.accept}
//           >
//             {currentFiles.length > 0 ? (
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//                 {currentFiles.map((file, idx) => {
//                   if (file.type === "application/pdf") {
//                     return (
//                       <div
//                         key={idx}
//                         style={{
//                           width: 80,
//                           height: 80,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           border: "1px solid #ddd",
//                           borderRadius: 8,
//                           fontSize: 12,
//                         }}
//                       >
//                         📄 PDF
//                       </div>
//                     );
//                   }

//                   const imageUrl = URL.createObjectURL(file);

//                   return (
//                     <img
//                       key={idx}
//                       src={imageUrl}
//                       alt="preview"
//                       style={{
//                         width: 80,
//                         height: 80,
//                         objectFit: "cover",
//                         borderRadius: 8,
//                       }}
//                       onLoad={() => URL.revokeObjectURL(imageUrl)}
//                     />
//                   );
//                 })}
//               </div>
//             ) : (
//               <div>
//                 <PlusOutlined />
//                 <div style={{ marginTop: 8 }}>Upload</div>
//               </div>
//             )}
//           </Upload>
//         );
//       }

//       default:
//         return <Input {...commonProps} />;
//     }
//   };

//   // ---------- Submit ----------
//   const handleFormSubmit = (values: any) => {
//     const finalValues = { ...values };

//     // Convert date fields to ISO string
//     fields
//       .filter((f) => f.type === "date")
//       .forEach((field) => {
//         if (values[field.name]) {
//           const dateValue = values[field.name];
//           if (dayjs.isDayjs(dateValue)) {
//             finalValues[field.name] = dateValue.toISOString();
//           } else if (dateValue instanceof Date) {
//             finalValues[field.name] = dateValue.toISOString();
//           } else if (typeof dateValue === "string") {
//             // Keep as is if already string
//             finalValues[field.name] = dateValue;
//           }
//         }
//       });

//     // Upload fields handle
//     fields
//       .filter((f) => f.type === "upload")
//       .forEach((field) => {
//         if (fileStorage[field.name]) {
//           finalValues[field.name] = fileStorage[field.name];
//         }
//       });

//     onSubmit(finalValues);
//   };

//   return (
//     <Form
//       form={form}
//       layout={layout}
//       onFinish={handleFormSubmit}
//       autoComplete="off"
//       size="large"
//     >
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(24,1fr)",
//           gap: 16,
//         }}
//       >
//         {fields.map((field) => (
//           <div
//             key={field.name}
//             style={{
//               gridColumn: `span ${field.span || 24}`,
//             }}
//           >
//             <Form.Item
//               label={field.label}
//               name={field.name}
//               rules={
//                 field.rules ||
//                 (field.required
//                   ? [{ required: true, message: `${field.label} is required` }]
//                   : [])
//               }
//               valuePropName={field.type === "switch" ? "checked" : "value"}
//             >
//               {renderFormField(field)}
//             </Form.Item>

//             {field.type === "upload" &&
//               fileStorage[field.name] &&
//               (() => {
//                 const files = Array.isArray(fileStorage[field.name])
//                   ? fileStorage[field.name]
//                   : [fileStorage[field.name]];

//                 return (
//                   <div style={{ fontSize: 12, color: "#666" }}>
//                     Selected: {files?.map((f) => f.name).join(", ")}
//                   </div>
//                 );
//               })()}
//           </div>
//         ))}
//       </div>

//       <Form.Item style={{ marginTop: 24 }}>
//         <Space>
//           <Button
//             type="primary"
//             htmlType="submit"
//             loading={loading}
//             disabled={submitDisabled}
//             icon={<SaveOutlined />}
//             style={{
//               backgroundColor: PRIMARY_COLOR,
//               borderColor: PRIMARY_COLOR,
//             }}
//             {...submitButtonProps}
//           >
//             {submitText}
//           </Button>

//           {onCancel && (
//             <Button
//               onClick={onCancel}
//               icon={<CloseOutlined />}
//               style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
//               {...cancelButtonProps}
//             >
//               {cancelText}
//             </Button>
//           )}
//         </Space>
//       </Form.Item>
//     </Form>
//   );
// };

// export default FormBuilder;

// import React, { useState } from "react";
// import {
//   Form,
//   Input,
//   Select,
//   Switch,
//   Upload,
//   Button,
//   Space,
//   DatePicker,
//   InputNumber,
//   Rate,
//   Checkbox,
//   Radio,
//   message,
// } from "antd";
// import { SaveOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
// import type { FormInstance } from "antd/es/form";
// import RichTextEditor from "@/components/common/RichTextEditor/RichTextEditor";
// import dayjs from "dayjs";

// const { TextArea } = Input;
// const { Option } = Select;

// export interface FormField {
//   name: string;
//   label: string;
//   type:
//     | "text"
//     | "email"
//     | "password"
//     | "number"
//     | "textarea"
//     | "select"
//     | "switch"
//     | "upload"
//     | "date"
//     | "rate"
//     | "checkbox"
//     | "radio"
//     | "tags"
//     | "dynamicList"
//     | "richtext";

//   accept?: string; // ✅ image/pdf support
//   options?: { label: string; value: any }[];
//   dynamicOptions?: boolean;
//   required?: boolean;
//   placeholder?: string;
//   disabled?: boolean;
//   rules?: any[];
//   initialValue?: any;
//   span?: number;
//   multiple?: boolean;
//   fields?: FormField[];
// }

// interface FormBuilderProps {
//   fields: FormField[];
//   form: FormInstance;
//   loading?: boolean;
//   onSubmit: (values: any) => void;
//   onCancel?: () => void;
//   submitText?: string;
//   cancelText?: string;
//   layout?: "horizontal" | "vertical" | "inline";
// }

// const PRIMARY_COLOR = "#FE5F15";

// const FormBuilder: React.FC<FormBuilderProps> = ({
//   fields,
//   form,
//   loading = false,
//   onSubmit,
//   onCancel,
//   submitText = "Submit",
//   cancelText = "Cancel",
//   layout = "vertical",
// }) => {
//   const [fileStorage, setFileStorage] = useState<Record<string, File | File[]>>(
//     {}
//   );

//   // ---------- File Upload Handler ----------
//   const handleFileSelect = (file: File, field: FormField) => {
//     if (field.accept?.includes("image")) {
//       if (!file.type.startsWith("image/")) {
//         message.error("Only image files allowed!");
//         return Upload.LIST_IGNORE;
//       }

//       if (file.size / 1024 / 1024 > 2) {
//         message.error("Image must be smaller than 2MB!");
//         return Upload.LIST_IGNORE;
//       }
//     }

//     if (field.accept?.includes("pdf")) {
//       if (file.type !== "application/pdf") {
//         message.error("Only PDF files allowed!");
//         return Upload.LIST_IGNORE;
//       }

//       if (file.size / 1024 / 1024 > 20) {
//         message.error("PDF must be smaller than 20MB!");
//         return Upload.LIST_IGNORE;
//       }
//     }

//     setFileStorage((prev) => {
//       if (field.multiple) {
//         const existingFiles = prev[field.name];
//         const filesArray = Array.isArray(existingFiles)
//           ? existingFiles
//           : existingFiles
//           ? [existingFiles]
//           : [];

//         return { ...prev, [field.name]: [...filesArray, file] };
//       }

//       return { ...prev, [field.name]: file };
//     });

//     return false;
//   };



  









//   // ---------- Render Field ----------
//   const renderFormField = (field: FormField) => {
//     const commonProps = {
//       placeholder: field.placeholder,
//       disabled: field.disabled,
//       style: { borderColor: PRIMARY_COLOR },
//     };

//     switch (field.type) {
//       case "text":
//       case "email":
//       case "password":
//         return <Input type={field.type} {...commonProps} />;

//       case "textarea":
//         return <TextArea rows={4} {...commonProps} />;

//       case "number":
//         return (
//           <InputNumber
//             style={{ width: "100%" }}
//             placeholder={field.placeholder}
//           />
//         );

//       case "select":
//         return (
//           <Select
//             {...commonProps}
//             mode={field.multiple ? "multiple" : undefined}
//             allowClear
//           >
//             {field.options?.map((option) => (
//               <Option key={option.value} value={option.value}>
//                 {option.label}
//               </Option>
//             ))}
//           </Select>
//         );

//       case "tags":
//         return (
//           <Select {...commonProps} mode="tags">
//             {field.options?.map((option) => (
//               <Option key={option.value}>{option.label}</Option>
//             ))}
//           </Select>
//         );

//       case "switch":
//         return <Switch />;

//       case "richtext":
//         return (
//           <RichTextEditor
//             value={form.getFieldValue(field.name) || ""}
//             onChange={(val: string) =>
//               form.setFieldsValue({ [field.name]: val })
//             }
//           />
//         );

//       case "date":
//         return <DatePicker style={{ width: "100%" }} />;

//       case "rate":
//         return <Rate />;

//       case "checkbox":
//         return (
//           <Checkbox.Group>
//             {field.options?.map((option) => (
//               <Checkbox key={option.value} value={option.value}>
//                 {option.label}
//               </Checkbox>
//             ))}
//           </Checkbox.Group>
//         );

//       case "radio":
//         return (
//           <Radio.Group>
//             {field.options?.map((option) => (
//               <Radio key={option.value} value={option.value}>
//                 {option.label}
//               </Radio>
//             ))}
//           </Radio.Group>
//         );

//       case "upload": {
//         const rawFiles = fileStorage[field.name];

//         const currentFiles: File[] = rawFiles
//           ? Array.isArray(rawFiles)
//             ? rawFiles
//             : [rawFiles]
//           : [];

//         return (
//           <Upload
//             multiple={field.multiple}
//             name={field.name}
//             listType="picture-card"
//             showUploadList={false}
//             beforeUpload={(file) => handleFileSelect(file, field)}
//             accept={field.accept}
//           >
//             {currentFiles.length > 0 ? (
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//                 {currentFiles.map((file, idx) => {
//                   if (file.type === "application/pdf") {
//                     return (
//                       <div
//                         key={idx}
//                         style={{
//                           width: 80,
//                           height: 80,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           border: "1px solid #ddd",
//                           borderRadius: 8,
//                           fontSize: 12,
//                         }}
//                       >
//                         📄 PDF
//                       </div>
//                     );
//                   }

//                   const imageUrl = URL.createObjectURL(file);

//                   return (
//                     <img
//                       key={idx}
//                       src={imageUrl}
//                       alt="preview"
//                       style={{
//                         width: 80,
//                         height: 80,
//                         objectFit: "cover",
//                         borderRadius: 8,
//                       }}
//                       onLoad={() => URL.revokeObjectURL(imageUrl)}
//                     />
//                   );
//                 })}
//               </div>
//             ) : (
//               <div>
//                 <PlusOutlined />
//                 <div style={{ marginTop: 8 }}>Upload</div>
//               </div>
//             )}
//           </Upload>
//         );
//       }

//       default:
//         return <Input {...commonProps} />;
//     }
//   };

//   // ---------- Submit ----------
//   const handleFormSubmit = (values: any) => {
//     const finalValues = { ...values };

//     fields
//       .filter((f) => f.type === "upload")
//       .forEach((field) => {
//         if (fileStorage[field.name]) {
//           finalValues[field.name] = fileStorage[field.name];
//         }
//       });

//     onSubmit(finalValues);
//   };

//   return (
//     <Form
//       form={form}
//       layout={layout}
//       onFinish={handleFormSubmit}
//       autoComplete="off"
//       size="large"
//     >
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(24,1fr)",
//           gap: 16,
//         }}
//       >
//         {fields.map((field) => (
//           <div
//             key={field.name}
//             style={{
//               gridColumn: `span ${field.span || 24}`,
//             }}
//           >
//             <Form.Item
//               label={field.label}
//               name={field.name}
//               rules={
//                 field.rules ||
//                 (field.required
//                   ? [{ required: true, message: `${field.label} is required` }]
//                   : [])
//               }
//               valuePropName={field.type === "switch" ? "checked" : "value"}
//             >
//               {renderFormField(field)}
//             </Form.Item>

//             {field.type === "upload" &&
//               fileStorage[field.name] &&
//               (() => {
//                 const files = Array.isArray(fileStorage[field.name])
//                   ? fileStorage[field.name]
//                   : [fileStorage[field.name]];

//                 return (
//                   <div style={{ fontSize: 12, color: "#666" }}>
//                     Selected: {files.map((f) => f.name).join(", ")}
//                   </div>
//                 );
//               })()}
//           </div>
//         ))}
//       </div>

//       <Form.Item style={{ marginTop: 24 }}>
//         <Space>
//           <Button
//             type="primary"
//             htmlType="submit"
//             loading={loading}
//             icon={<SaveOutlined />}
//             style={{
//               backgroundColor: PRIMARY_COLOR,
//               borderColor: PRIMARY_COLOR,
//             }}
//           >
//             {submitText}
//           </Button>

//           {onCancel && (
//             <Button
//               onClick={onCancel}
//               icon={<CloseOutlined />}
//               style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
//             >
//               {cancelText}
//             </Button>
//           )}
//         </Space>
//       </Form.Item>
//     </Form>
//   );
// };

// export default FormBuilder;

