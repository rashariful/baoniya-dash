import React, { useState } from "react";
import { message } from "antd";
import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { teacherColumns } from "@/utils/tableConfigs";
import { teacherFormFields } from "@/utils/formSchemas";

import {
  useCreateTeacherMutation,
  useGetAllTeacherQuery,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} from "@/redux/api/teacherApi";

type TeacherFormData = {
  name: string;
  phone: string;
  designation: string;
  thumbnail?: File;
};

const TeacherPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data,
    isLoading,
    refetch,
  } = useGetAllTeacherQuery(
    searchTerm
      ? [{ name: "searchTerm", value: searchTerm }]
      : undefined
  );

  const [createTeacher] = useCreateTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();
  const [deleteTeacher] = useDeleteTeacherMutation();


  // FormData Convert
  const convertToFormData = (data: Record<string, any>) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {

      if (!value && value !== 0) return;


      // File upload
      if (value.originFileObj instanceof File) {
        formData.append(key, value.originFileObj);
      } 
      else if (value instanceof File) {
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

      // Normal data
      else {
        formData.append(key, String(value));
      }
    });

    return formData;
  };


  const handleAdd = async (data: TeacherFormData) => {
    try {

      const formData = convertToFormData(data);

      await createTeacher(formData).unwrap();

      message.success("Teacher created successfully");
      refetch();

    } catch (error:any) {

      message.error(
        error?.data?.message || "Failed to create teacher"
      );

    }
  };


  const handleEdit = async (
    id: string,
    data: TeacherFormData
  ) => {

    try {

      const formData = convertToFormData(data);

      await updateTeacher({
        id,
        data: formData,
      }).unwrap();


      message.success("Teacher updated successfully");
      refetch();


    } catch(error:any){

      message.error(
        error?.data?.message || "Failed to update teacher"
      );

    }

  };


  const handleDelete = async (id:string) => {

    try {

      await deleteTeacher(id).unwrap();

      message.success("Teacher deleted successfully");
      refetch();


    } catch(error:any){

      message.error(
        error?.data?.message || "Failed to delete teacher"
      );

    }

  };



  return (
    <CrudTemplate

      title="Teacher Management"

      subtitle="Manage all teachers"

      data={data?.data || []}

      columns={teacherColumns}

      formFields={teacherFormFields}

      loading={isLoading}

      onAdd={handleAdd}

      onEdit={handleEdit}

      onDelete={handleDelete}

      enableSearch

      onSearch={setSearchTerm}

    />
  );
};


export default TeacherPage;