import React, { useMemo } from "react";
import { message } from "antd";

import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

import { examResultColumns } from "@/utils/tableConfigs";
import { examResultFormFields } from "@/utils/formSchemas";

import {
  useCreateExamResultMutation,
  useGetAllExamResultQuery,
  useUpdateExamResultMutation,
  useDeleteExamResultMutation,
} from "@/redux/api/examResultApi";

import { useGetAllStudentQuery } from "@/redux/api/studentApi";
import { useGetAllExaminationQuery } from "@/redux/api/examinationApi";
import { useGetAllAcademicSessionQuery } from "@/redux/api/academicSessionApi";
import { useGetAllSubjectQuery } from "@/redux/api/subjectApi";
import ExamTest from "./ExamTest";
import FinalResult from "./FinalResult";

const ExamResultPage = () => {
  const { data, isLoading, refetch } = useGetAllExamResultQuery();

  const { data: studentData } = useGetAllStudentQuery();
  const { data: examData } = useGetAllExaminationQuery();
  const { data: sessionData } = useGetAllAcademicSessionQuery();
  const { data: subjectData } = useGetAllSubjectQuery();

  

  const [create] = useCreateExamResultMutation();
  const [update] = useUpdateExamResultMutation();
  const [remove] = useDeleteExamResultMutation();

  // 🔥 dynamic form
  const dynamicFormFields = useMemo(() => {
    const mapOptions = (arr: any[] = [], labelKey: string) =>
      arr.map((item) => ({
        label: item[labelKey],
        value: item._id,
      }));

    const studentOptions = mapOptions(studentData?.data, "name");
    const examOptions = mapOptions(examData?.data, "title");
    const sessionOptions = mapOptions(sessionData?.data, "year");
    const subjectOptions = mapOptions(subjectData?.data, "name");

    return examResultFormFields.map((field) => {
      // Case 1: top-level dynamic select fields (studentId, examId, sessionId)
      if (field.dynamicOptions && field.type === "select") {
        if (field.name === "studentId") {
          return { ...field, options: studentOptions };
        }
        if (field.name === "examId") {
          return { ...field, options: examOptions };
        }
        if (field.name === "sessionId") {
          return { ...field, options: sessionOptions };
        }
        return field;
      }

      // Case 2: dynamicList field (subjects) — fix nested subjectId options
      if (field.type === "dynamicList" && field.fields) {
        const updatedSubFields = field.fields.map((subField) => {
          if (subField.name === "subjectId" && subField.dynamicOptions) {
            return { ...subField, options: subjectOptions };
          }
          return subField;
        });

        return { ...field, fields: updatedSubFields };
      }

      return field;
    });
  }, [studentData, examData, sessionData, subjectData]);

  // CREATE
  const handleAdd = async (d: any) => {
    try {
      await create(d).unwrap();
      message.success("Result Created");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create result");
    }
  };

  // UPDATE
  const handleEdit = async (id: string, d: any) => {
    try {
      await update({ id, data: d }).unwrap();
      message.success("Updated");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update result");
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await remove(id).unwrap();
      message.success("Deleted");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete result");
    }
  };

  return (
    <div>
      <ExamTest/>
      <FinalResult/>


      <CrudTemplate
        title="Exam Result Management"
        subtitle="Manage student exam results"
        data={data?.data || []}
        columns={examResultColumns}
        formFields={dynamicFormFields}
        loading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ExamResultPage;


// import React from "react";
// import { message } from "antd";
// import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";

// import { examResultColumns } from "@/utils/tableConfigs";
// import { examResultFormFields } from "@/utils/formSchemas";

// import {
//   useCreateExamResultMutation,
//   useGetAllExamResultQuery,
//   useUpdateExamResultMutation,
//   useDeleteExamResultMutation,
// } from "@/redux/api/examResultApi";

// const ExamResultPage = () => {
//   const { data, isLoading, refetch } = useGetAllExamResultQuery();

//   const [create] = useCreateExamResultMutation();
//   const [update] = useUpdateExamResultMutation();
//   const [remove] = useDeleteExamResultMutation();

//   return (
//     <CrudTemplate
//       title="Exam Result"
//       subtitle="Manage student results"
//       data={data?.data || []}
//       columns={examResultColumns}
//       formFields={examResultFormFields}
//       loading={isLoading}
//       onAdd={async (d) => {
//         await create(d);
//         message.success("Created");
//         refetch();
//       }}
//       onEdit={async (id, d) => update({ id, data: d })}
//       onDelete={remove}
//     />
//   );
// };

// export default ExamResultPage;