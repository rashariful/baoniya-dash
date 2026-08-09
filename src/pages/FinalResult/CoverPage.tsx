import React from 'react';
import logo from '@/assets/logo.jpeg';
import ResultCardSwitcher from './Resultcards'; // path ঠিক করে নাও

export default function CoverPage({ student, schoolInfo }) {
  const isPrimary =
    (student?.classGroupId?.name || '').toLowerCase().includes('nursery') ||
    (student?.classGroupId?.name || '').toLowerCase().includes('primary') ||
    parseInt(student?.classGroupId?.name) <= 5;

  const bgStyle = isPrimary
    ? { background: '#F3D9E4', borderColor: '#7A3B57', textColor: '#7A3B57' }
    : { background: '#FBEFC8', borderColor: '#1D2438', textColor: '#1D2438' };

  return (
    <div
      className="w-[210mm] min-h-[297mm] mx-auto p-8 flex flex-col relative font-sans box-border shadow-md mb-8"
      style={{
        background: bgStyle.background,
        border: `6px double ${bgStyle.borderColor}`,
        color: bgStyle.textColor,
      }}
    >
      {/* Decorative Border Frame */}
      <div className="absolute inset-3 border border-current pointer-events-none opacity-40" />

      {/* ========== Top Header Section ========== */}
      <div className="text-center pt-4 z-10">
        <h1
          className="text-2xl font-bold tracking-wide mb-1"
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          {schoolInfo?.name || 'বাউনিয়া আবদুল জলিল উচ্চ বিদ্যালয়।'}
        </h1>

        {/* School Logo */}
        <div className="w-20 h-20 mx-auto my-2 rounded-full border-2 border-current flex items-center justify-center bg-white/40 overflow-hidden">
          <img src={logo} alt="logo" className="rounded-full w-full h-full object-cover" />
        </div>

        <p className="text-sm font-medium mt-1">
          {schoolInfo?.address || 'বাওনিয়া, তুরাগ (উত্তরা), ঢাকা-১২৩০।'}
        </p>
        <p className="text-xs mt-0.5 opacity-80">স্থাপিত : ১৯৭৯ খ্রিষ্টাব্দ</p>

        {/* Branch Title Badge */}
        <div
          className="inline-block mt-4 px-6 py-1.5 rounded-md text-white font-semibold text-sm shadow-sm"
          style={{ background: bgStyle.borderColor }}
        >
          ফলাফল বিবরণী ({isPrimary ? 'প্রাথমিক শাখা' : 'হাই শাখা'})
        </div>

        <p className="text-base font-semibold mt-3 tracking-wide">
          শিক্ষাবর্ষ : ২০২৬ খ্রিষ্টাব্দ
        </p>
      </div>

      {/* ========== RESULT CARD (এখানে বসবে) ========== */}
      <div className="my-4 z-10 px-2">
        <ResultCardSwitcher result={student} />
      </div>

      {/* ========== Student Info Box ========== */}
      <div
        className="z-10 border-2 rounded-lg p-5 bg-white/60 mx-4 mt-auto"
        style={{ borderColor: bgStyle.borderColor }}
      >
        <div className="space-y-3 text-sm font-medium">
          <div className="flex items-center border-b border-dashed border-current pb-1.5">
            <span className="w-28 font-semibold">শিক্ষার্থীর নাম</span>
            <span className="mx-2">:</span>
            <span className="flex-1 text-base font-bold">
              {student?.studentId?.name || '—'}
            </span>
          </div>

          <div className="flex items-center border-b border-dashed border-current pb-1.5">
            <span className="w-28 font-semibold">পিতার নাম</span>
            <span className="mx-2">:</span>
            <span className="flex-1">{student?.studentId?.fatherName || '—'}</span>
          </div>

          <div className="flex items-center border-b border-dashed border-current pb-1.5">
            <span className="w-28 font-semibold">মাতার নাম</span>
            <span className="mx-2">:</span>
            <span className="flex-1">{student?.studentId?.motherName || '—'}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="flex items-center">
              <span className="w-20 font-semibold">শ্রেণি</span>
              <span className="mx-2">:</span>
              <span className="flex-1 font-bold">
                {student?.classGroupId?.name || '—'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-20 font-semibold">রোল</span>
              <span className="mx-2">:</span>
              <span className="flex-1 font-bold">
                {student?.roll || student?.studentId?.roll || '—'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="flex items-center">
              <span className="w-20 font-semibold">শাখা</span>
              <span className="mx-2">:</span>
              <span className="flex-1">{student?.section || 'সাধারণ'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-20 font-semibold">বিভাগ</span>
              <span className="mx-2">:</span>
              <span className="flex-1">{student?.department || '—'}</span>
            </div>
          </div>

          <div className="flex items-center pt-1">
            <span className="w-28 font-semibold">ফোন</span>
            <span className="mx-2">:</span>
            <span className="flex-1">{student?.studentId?.phone || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// import React from 'react';

// import logo from "@/assets/logo.jpeg"

// export default function CoverPage({ student, schoolInfo }) {
//   const isPrimary = (student?.classGroupId?.name || '').toLowerCase().includes('nursery') || 
//                     (student?.classGroupId?.name || '').toLowerCase().includes('primary') ||
//                     parseInt(student?.classGroupId?.name) <= 5;

//   const bgStyle = isPrimary 
//     ? { background: '#F3D9E4', borderColor: '#7A3B57', textColor: '#7A3B57' } 
//     : { background: '#FBEFC8', borderColor: '#1D2438', textColor: '#1D2438' };

//   return (
//     <div 
//       className="w-[210mm] h-[297mm] mx-auto p-10 flex flex-col justify-between relative font-sans box-border shadow-md mb-8"
//       style={{ 
//         background: bgStyle.background, 
//         border: `6px double ${bgStyle.borderColor}`,
//         color: bgStyle.textColor 
//       }}
//     >
//       {/* Decorative Border Frame */}
//       <div className="absolute inset-3 border border-current pointer-events-none opacity-40" />

//       {/* Top Header Section */}
//       <div className="text-center pt-6 z-10">
//         <h1 className="text-3xl font-bold tracking-wide mb-2" style={{ fontFamily: 'Tiro Bangla, serif' }}>
//           {schoolInfo?.name || 'বাউনিয়া আবদুল জলিল উচ্চ বিদ্যালয়।'}
//         </h1>

//         {/* School Logo Circle */}
//         <div className="w-24 h-24 mx-auto my-3 rounded-full border-2 border-current flex flex-col items-center justify-center bg-white/40">
//         <img src={logo} alt="" className='rounded-full'/>
//           {/* <span className="text-[10px] font-semibold text-center leading-tight">বাউনিয়া আবদুল জলিল উচ্চ বিদ্যালয়।</span>
//           <div className="my-1 text-xs">🌿 📖</div>
//           <span className="text-[9px]">তুরাগ, ঢাকা</span> */}
//         </div>

//         <p className="text-sm font-medium mt-1">
//           {schoolInfo?.address || 'বাওনিয়া, তুরাগ (উত্তরা), ঢাকা-১২৩০।'}
//         </p>
//         <p className="text-xs mt-0.5 opacity-80">
//           স্থাপিত : ১৯৭৯ খ্রিষ্টাব্দ
//         </p>

//         {/* Branch Title Badge */}
//         <div className="inline-block mt-6 px-8 py-2 rounded-md text-white font-semibold text-base shadow-sm" style={{ background: bgStyle.borderColor }}>
//           ফলাফল বিবরণী ({isPrimary ? 'প্রাথমিক শাখা' : 'হাই শাখা'})
//         </div>

//         <p className="text-lg font-semibold mt-6 tracking-wide">
//           শিক্ষাবর্ষ : ২০২৬ খ্রিষ্টাব্দ
//         </p>
//       </div>

//       {/* Student Info Box */}
//       <div className="z-10 border-2 rounded-lg p-6 bg-white/60 mx-6 mb-8" style={{ borderColor: bgStyle.borderColor }}>
//         <div className="space-y-4 text-sm font-medium">
//           <div className="flex items-center border-b border-dashed border-current pb-2">
//             <span className="w-28 font-semibold">শিক্ষার্থীর নাম</span>
//             <span className="mx-2">:</span>
//             <span className="flex-1 text-base font-bold">{student?.studentId?.name || '—'}</span>
//           </div>

//           <div className="flex items-center border-b border-dashed border-current pb-2">
//             <span className="w-28 font-semibold">পিতার নাম</span>
//             <span className="mx-2">:</span>
//             <span className="flex-1">{student?.studentId?.fatherName || '—'}</span>
//           </div>

//           <div className="flex items-center border-b border-dashed border-current pb-2">
//             <span className="w-28 font-semibold">মাতার নাম</span>
//             <span className="mx-2">:</span>
//             <span className="flex-1">{student?.studentId?.motherName || '—'}</span>
//           </div>

//           <div className="grid grid-cols-2 gap-4 pt-1">
//             <div className="flex items-center">
//               <span className="w-20 font-semibold">শ্রেণি</span>
//               <span className="mx-2">:</span>
//               <span className="flex-1 font-bold">{student?.classGroupId?.name || '—'}</span>
//             </div>
//             <div className="flex items-center">
//               <span className="w-20 font-semibold">রোল</span>
//               <span className="mx-2">:</span>
//               <span className="flex-1 font-bold">{student?.roll || student?.studentId?.roll || '—'}</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4 pt-1">
//             <div className="flex items-center">
//               <span className="w-20 font-semibold">শাখা</span>
//               <span className="mx-2">:</span>
//               <span className="flex-1">{student?.section || 'সাধারণ'}</span>
//             </div>
//             <div className="flex items-center">
//               <span className="w-20 font-semibold">বিভাগ</span>
//               <span className="mx-2">:</span>
//               <span className="flex-1">{student?.department || '—'}</span>
//             </div>
//           </div>

//           <div className="flex items-center pt-1">
//             <span className="w-28 font-semibold">ফোন</span>
//             <span className="mx-2">:</span>
//             <span className="flex-1">{student?.studentId?.phone || '—'}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




















// import React from 'react';

// /*
//   কভার পেজ কম্পোনেন্ট:
//   - প্রাথমিক শাখা (পিংক কালার ব্যাকগ্রাউন্ড) এবং হাই শাখা (হলুদ কালার ব্যাকগ্রাউন্ড)
//   - props: { student, schoolInfo }
// */

// export default function CoverPage({ student, schoolInfo }) {
//   const isPrimary = (student?.classGroupId?.name || '').toLowerCase().includes('nursery') || 
//                     (student?.classGroupId?.name || '').toLowerCase().includes('primary') ||
//                     parseInt(student?.classGroupId?.name) <= 5;

//   const bgStyle = isPrimary 
//     ? { background: '#F3D9E4', borderColor: '#7A3B57', textColor: '#7A3B57' } 
//     : { background: '#FBEFC8', borderColor: '#1D2438', textColor: '#1D2438' };

//   return (
//     <div 
//       className="w-[210mm] h-[297mm] mx-auto p-10 flex flex-col justify-between relative font-sans box-border shadow-md mb-8"
//       style={{ 
//         background: bgStyle.background, 
//         border: `6px double ${bgStyle.borderColor}`,
//         color: bgStyle.textColor 
//       }}
//     >
//       {/* Decorative Border Frame */}
//       <div className="absolute inset-3 border border-current pointer-events-none opacity-40" />

//       {/* Top Header Section */}
//       <div className="text-center pt-6 z-10">
//         <h1 className="text-3xl font-bold tracking-wide mb-2" style={{ fontFamily: 'Tiro Bangla, serif' }}>
//           {schoolInfo?.name || 'বাউনিয়া আবদুল জলিল উচ্চ বিদ্যালয়।'}
//         </h1>

//         {/* School Logo Circle */}
//         <div className="w-24 h-24 mx-auto my-3 rounded-full border-2 border-current flex flex-col items-center justify-center p-1 bg-white/40">
//           <span className="text-[10px] font-semibold text-center leading-tight">বাউনিয়া আবদুল জলিল উচ্চ বিদ্যালয়।</span>
//           <div className="my-1 text-xs">🌿 📖</div>
//           <span className="text-[9px]">তুরাগ, ঢাকা</span>
//         </div>

//         <p className="text-sm font-medium mt-1">
//           {schoolInfo?.address || 'বাওনিয়া, তুরাগ (উত্তরা), ঢাকা-১২৩০।'}
//         </p>
//         <p className="text-xs mt-0.5 opacity-80">
//           স্থাপিত : ১৯৭৯ খ্রিষ্টাব্দ
//         </p>

//         {/* Branch Title Badge */}
//         <div className="inline-block mt-6 px-8 py-2 rounded-md text-white font-semibold text-base shadow-sm" style={{ background: bgStyle.borderColor }}>
//           ফলাফল বিবরণী ({isPrimary ? 'প্রাথমিক শাখা' : 'হাই শাখা'})
//         </div>

//         <p className="text-lg font-semibold mt-6 tracking-wide">
//           শিক্ষাবর্ষ : ২০২৬ খ্রিষ্টাব্দ
//         </p>
//       </div>

//       {/* Student Info Box */}
//       <div className="z-10 border-2 rounded-lg p-6 bg-white/60 mx-6 mb-8" style={{ borderColor: bgStyle.borderColor }}>
//         <div className="space-y-4 text-sm font-medium">
//           <div className="flex items-center border-b border-dashed border-current pb-2">
//             <span className="w-28 font-semibold">শিক্ষার্থীর নাম</span>
//             <span className="mx-2">:</span>
//             <span className="flex-1 text-base font-bold">{student?.studentId?.name || '—'}</span>
//           </div>

//           <div className="flex items-center border-b border-dashed border-current pb-2">
//             <span className="w-28 font-semibold">পিতার নাম</span>
//             <span className="mx-2">:</span>
//             <span className="flex-1">{student?.studentId?.fatherName || '—'}</span>
//           </div>

//           <div className="flex items-center border-b border-dashed border-current pb-2">
//             <span className="w-28 font-semibold">মাতার নাম</span>
//             <span className="mx-2">:</span>
//             <span className="flex-1">{student?.studentId?.motherName || '—'}</span>
//           </div>

//           <div className="grid grid-cols-2 gap-4 pt-1">
//             <div className="flex items-center">
//               <span className="w-20 font-semibold">শ্রেণি</span>
//               <span className="mx-2">:</span>
//               <span className="flex-1 font-bold">{student?.classGroupId?.name || '—'}</span>
//             </div>
//             <div className="flex items-center">
//               <span className="w-20 font-semibold">রোল</span>
//               <span className="mx-2">:</span>
//               <span className="flex-1 font-bold">{student?.roll || student?.studentId?.roll || '—'}</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4 pt-1">
//             <div className="flex items-center">
//               <span className="w-20 font-semibold">শাখা</span>
//               <span className="mx-2">:</span>
//               <span className="flex-1">{student?.section || 'সাধারণ'}</span>
//             </div>
//             <div className="flex items-center">
//               <span className="w-20 font-semibold">বিভাগ</span>
//               <span className="mx-2">:</span>
//               <span className="flex-1">{student?.department || '—'}</span>
//             </div>
//           </div>

//           <div className="flex items-center pt-1">
//             <span className="w-28 font-semibold">ফোন</span>
//             <span className="mx-2">:</span>
//             <span className="flex-1">{student?.studentId?.phone || '—'}</span>
//             <span className="text-xs opacity-75">শিফট: প্রভাতি / দিবা</span>
//           </div>
//         </div>
//       </div>

//       {/* Footer Note */}
//       <div className="text-center text-xs pb-4 opacity-70 z-10 font-mono">
//         {schoolInfo?.website || 'www.bajhs.edu.bd'}
//       </div>
//     </div>
//   );
// }