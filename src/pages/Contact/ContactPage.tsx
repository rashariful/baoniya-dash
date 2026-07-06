import React from 'react'

function ContactPage() {
  return (
    <div>ContactPage</div>
  )
}

export default ContactPage

// import React from "react";
// import { message } from "antd";
// import CrudTemplate from "@/components/templates/CrudTemplate/CrudTemplate";
// import { contactColumns } from "@/utils/tableConfigs";
// import { contactFormFields } from "@/utils/formSchemas";
// import {
//   useCreateContactMutation,
//   useGetAllContactQuery,
//   useUpdateContactMutation,
//   useDeleteContactMutation,
// } from "@/redux/api/contactApi";

// type ContactFormData = {
//   name: string;
//   email: string;
//   phone?: string;
//   subject?: string;
//   message: string;
// };

// const ContactPage: React.FC = () => {
//   const { data: contacts, isLoading, refetch } = useGetAllContactQuery();
//   const [createContact] = useCreateContactMutation();
//   const [updateContact] = useUpdateContactMutation();
//   const [deleteContact] = useDeleteContactMutation();

//   // Convert form data to FormData (optional, but keeps consistent)
// //   const convertToFormData = (data: Record<string, any>) => {
// //     const formData = new FormData();
// //     console.log(formData, "from convert to form data")
// //     Object.entries(data).forEach(([key, value]) => {
// //       if (value !== undefined && value !== null) {
// //         formData.append(key, String(value));
// //       }
// //     });
// //     return formData;
// //   };

//   // Handle add
//   const handleAdd = async (data: ContactFormData) => {
//     console.log(data, "from handle add")
//     try {
//     //   const formData = convertToFormData(data);
//       await createContact(data).unwrap();
//       message.success("Contact added successfully");
//       refetch();
//     } catch (error: any) {
//       message.error(error?.data?.message || "Failed to add contact");
//     }
//   };

//   // Handle edit
// const handleEdit = async (id: string, data: ContactFormData) => {
//   console.log("Updating contact:", id, data);
//   try {
//     await updateContact({ id, body: data }).unwrap();
//     message.success("Contact updated successfully");
//     refetch();
//   } catch (error: any) {
//     console.error(error);
//     message.error(error?.data?.message || "Failed to update contact");
//   }
// };



//   // Handle delete
//   const handleDelete = async (id: string | number) => {
//     try {
//       await deleteContact(id).unwrap();
//       message.success("Contact deleted successfully");
//       refetch();
//     } catch (error: any) {
//       message.error(error?.data?.message || "Failed to delete contact");
//     }
//   };

//   return (
//     <section>
//       <CrudTemplate
//         title="Contact Management"
//         data={contacts?.data || []}
//         columns={contactColumns}
//         formFields={contactFormFields}
//         loading={isLoading}
//         onAdd={handleAdd}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//       />
//     </section>
//   );
// };

// export default ContactPage;
