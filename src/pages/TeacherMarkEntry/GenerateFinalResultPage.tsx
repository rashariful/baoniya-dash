
import React, { useState } from 'react';
import { useGenerateBulkFinalResultMutation } from '@/redux/api/finalResultApi.js'; 
import { useGetAllClassGroupQuery } from '@/redux/api/classGroupApi.js'; 
import { useGetAllClassesQuery } from '@/redux/api/classesApi.js';
import { useGetAllSectionQuery } from '@/redux/api/sectionApi.js';
import { useGetAllAcademicSessionQuery } from '@/redux/api/academicSessionApi.js'; // আপনার সঠিক পাথ অনুযায়ী ইম্পোর্ট করবেন

export default function GenerateFinalResult() {
  // ফিল্টার স্টেটসমূহ
  const [classGroupId, setClassGroupId] = useState('');
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sessionId, setSessionId] = useState('');

  // ১. ক্লাস গ্রুপ ফেচ করা (Array format)
  const { data: classGroupRes } = useGetAllClassGroupQuery([
    { name: 'limit', value: 100 }
  ]);
  const classGroups = classGroupRes?.data || [];

  // ২. ক্লাস ফেচ করা (classGroupId ডিপেন্ডেন্ট)
  const { data: classesRes } = useGetAllClassesQuery(
    [{ name: 'classGroupId', value: classGroupId }, { name: 'limit', value: 100 }],
    { skip: !classGroupId }
  );
  const classesList = classesRes?.data || [];

  // ৩. সেকশন ফেচ করা (classId ডিপেন্ডেন্ট)
  const { data: sectionRes } = useGetAllSectionQuery(
    [{ name: 'classId', value: classId }, { name: 'limit', value: 100 }],
    { skip: !classId }
  );
  const sectionsList = sectionRes?.data || [];

  // ৪. একাডেমিক সেশন ফেচ করা (డাইনামিক সেশন)
  const { data: sessionRes } = useGetAllAcademicSessionQuery([
    { name: 'limit', value: 100 }
  ]);
  const sessionList = sessionRes?.data || [];

  // RTK Query Mutation for Bulk Generation
  const [generateBulkFinalResult, { isLoading }] = useGenerateBulkFinalResultMutation();

  // বাল্ক রেজাল্ট সাবমিট হ্যান্ডলার
  const handleBulkGenerate = async (e) => {
    e.preventDefault();

    if (!classGroupId || !sessionId) {
      alert('Please select at least Class Group and Academic Session!');
      return;
    }

    const confirmAction = window.confirm(
      'Are you sure you want to generate final results for this selection?'
    );

    if (!confirmAction) return;

    try {
      const payload = {
        classGroupId,
        classId: classId || undefined,
        sectionId: sectionId || undefined,
        sessionId,
      };

      const res = await generateBulkFinalResult(payload).unwrap();
      alert(res.message || 'Successfully generated results for all students!');
      
    } catch (error) {
      console.error('Failed to generate bulk results:', error);
      alert(error?.data?.message || 'Something went wrong during bulk generation!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-8 border border-gray-100">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Batch Final Result Generation</h2>
        <p className="text-sm text-gray-500 mt-1">
          Filter by Class Group, Class, Section and Session to trigger bulk final result calculation.
        </p>
      </div>

      <form onSubmit={handleBulkGenerate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Class Group Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Class Group <span className="text-red-500">*</span>
            </label>
            <select
              value={classGroupId}
              onChange={(e) => {
                setClassGroupId(e.target.value);
                setClassId(''); // Reset dependent fields
                setSectionId('');
              }}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50"
            >
              <option value="">-- Choose Class Group --</option>
              {classGroups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Class (Optional)
            </label>
            <select
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setSectionId(''); // Reset section
              }}
              disabled={!classGroupId}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50 disabled:bg-gray-200"
            >
              <option value="">-- Choose Class --</option>
              {classesList.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Section (Optional)
            </label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              disabled={!classId}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50 disabled:bg-gray-200"
            >
              <option value="">-- Choose Section --</option>
              {sectionsList.map((sec) => (
                <option key={sec._id} value={sec._id}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Session Select (Dynamic) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Academic Session <span className="text-red-500">*</span>
            </label>
            <select
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50"
            >
              <option value="">-- Choose Session --</option>
              {sessionList.map((session) => (
                <option key={session._id} value={session._id}>
                  {session.name || session.year} {/* আপনার ব্যাকএন্ডের প্রপার্টি নেম অনুযায়ী নাম বা ইয়ার দিতে পারেন */}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/85 text-white font-medium px-6 py-3 rounded-lg shadow transition-all flex items-center gap-2 disabled:bg-gray-400"
          >
            {isLoading ? 'Processing Bulk Results...' : '⚡ Generate Class Final Results'}
          </button>
        </div>
      </form>
    </div>
  );
}
// import React, { useState } from 'react';
// import { useGenerateBulkFinalResultMutation } from '@/redux/api/finalResultApi.js'; // আপনার পাথ ঠিক করে নিবেন
// import { useGetAllClassGroupQuery } from '@/redux/api/classGroupApi.js'; // আপনার API হুক
// import { useGetAllClassesQuery } from '@/redux/api/classesApi.js';
// import { useGetAllSectionQuery } from '@/redux/api/sectionApi.js';
// // যদি সেশন ফেচ করার হুক থাকে তা এখানে ইম্পোর্ট করবেন

// export default function GenerateFinalResult() {
//   // ফিল্টার স্টেটসমূহ
//   const [classGroupId, setClassGroupId] = useState('');
//   const [classId, setClassId] = useState('');
//   const [sectionId, setSectionId] = useState('');
//   const [sessionId, setSessionId] = useState('');

//   // ১. ক্লাস গ্রুপ ফেচ করা (Array format)
//   const { data: classGroupRes } = useGetAllClassGroupQuery([
//     { name: 'limit', value: 100 }
//   ]);
//   const classGroups = classGroupRes?.data || [];

//   // ২. ক্লাস ফেচ করা (classGroupId ডিপেন্ডেন্ট)
//   const { data: classesRes } = useGetAllClassesQuery(
//     [{ name: 'classGroupId', value: classGroupId }, { name: 'limit', value: 100 }],
//     { skip: !classGroupId }
//   );
//   const classesList = classesRes?.data || [];

//   // ৩. সেকশন ফেচ করা (classId ডিপেন্ডেন্ট)
//   const { data: sectionRes } = useGetAllSectionQuery(
//     [{ name: 'classId', value: classId }, { name: 'limit', value: 100 }],
//     { skip: !classId }
//   );
//   const sectionsList = sectionRes?.data || [];

//   // RTK Query Mutation for Bulk Generation
//   const [generateBulkFinalResult, { isLoading }] = useGenerateBulkFinalResultMutation();

//   // বাল্ক রেজাল্ট সাবমিট হ্যান্ডলার
//   const handleBulkGenerate = async (e) => {
//     e.preventDefault();

//     if (!classGroupId || !sessionId) {
//       alert('Please select at least Class Group and Academic Session!');
//       return;
//     }

//     const confirmAction = window.confirm(
//       'Are you sure you want to generate final results for this selection?'
//     );

//     if (!confirmAction) return;

//     try {
//       const payload = {
//         classGroupId,
//         classId: classId || undefined,
//         sectionId: sectionId || undefined,
//         sessionId,
//       };

//       const res = await generateBulkFinalResult(payload).unwrap();
//       alert(res.message || 'Successfully generated results for all students!');
      
//     } catch (error) {
//       console.error('Failed to generate bulk results:', error);
//       alert(error?.data?.message || 'Something went wrong during bulk generation!');
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-8 border border-gray-100">
//       <div className="mb-6 border-b pb-4">
//         <h2 className="text-2xl font-bold text-gray-800">Batch Final Result Generation</h2>
//         <p className="text-sm text-gray-500 mt-1">
//           Filter by Class Group, Class, Section and Session to trigger bulk final result calculation.
//         </p>
//       </div>

//       <form onSubmit={handleBulkGenerate} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
//           {/* Class Group Select */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Select Class Group <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={classGroupId}
//               onChange={(e) => {
//                 setClassGroupId(e.target.value);
//                 setClassId(''); // Reset dependent fields
//                 setSectionId('');
//               }}
//               required
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50"
//             >
//               <option value="">-- Choose Class Group --</option>
//               {classGroups.map((group) => (
//                 <option key={group._id} value={group._id}>
//                   {group.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Class Select */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Select Class (Optional)
//             </label>
//             <select
//               value={classId}
//               onChange={(e) => {
//                 setClassId(e.target.value);
//                 setSectionId(''); // Reset section
//               }}
//               disabled={!classGroupId}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50 disabled:bg-gray-200"
//             >
//               <option value="">-- Choose Class --</option>
//               {classesList.map((cls) => (
//                 <option key={cls._id} value={cls._id}>
//                   {cls.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Section Select */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Select Section (Optional)
//             </label>
//             <select
//               value={sectionId}
//               onChange={(e) => setSectionId(e.target.value)}
//               disabled={!classId}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50 disabled:bg-gray-200"
//             >
//               <option value="">-- Choose Section --</option>
//               {sectionsList.map((sec) => (
//                 <option key={sec._id} value={sec._id}>
//                   {sec.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Session Select */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Select Academic Session <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={sessionId}
//               onChange={(e) => setSessionId(e.target.value)}
//               required
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50"
//             >
//               <option value="">-- Choose Session --</option>
//               {/* আপনার সেশন ডাটা এখানে ম্যাপ করে দেবেন */}
//               <option value="6a651d3c1927a53fb0159a1a">2025 - 2026</option>
//             </select>
//           </div>

//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end pt-4 border-t">
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow transition-all flex items-center gap-2 disabled:bg-gray-400"
//           >
//             {isLoading ? 'Processing Bulk Results...' : '⚡ Generate Class Final Results'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }