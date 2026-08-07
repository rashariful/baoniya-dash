import React, { useRef, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Search,
  Download,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Users,
  Layers,
  Phone,
  Mail,
  Globe,
} from 'lucide-react';
// import ResultCardSwitcher from './ResultCards';
import CoverPage from '../FinalResult/CoverPage';
import ResultCardSwitcher from '../FinalResult/Resultcards';

const schoolInfo = {
  name: 'বাউনিয়া আবদুল জলিল উচ্চ বিদ্যালয়।',
  address: 'বাউনিয়া মেইন রোড, ঢাকা ২৮৭৬। ',
  phone: '০১৯৮০৪৭৬০১১',
  email: 'support@baoniyaschool.com',
  motto: 'শিক্ষাই আলো',
  website: 'www.bajhs.edu.bd',
};

const API_BASE_URL = import.meta.env.VITE_REACT_APP_ROOT;

const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Tiro+Bangla&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Hind+Siliguri:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .frx-root { font-family: 'Hind Siliguri', 'Fraunces', sans-serif; background: #F3EEE1; }
    .frx-bn-display { font-family: 'Tiro Bangla', serif; }
    .frx-display { font-family: 'Fraunces', serif; }
    .frx-mono { font-family: 'JetBrains Mono', monospace; }

    .frx-perforation {
      height: 14px;
      background-image: radial-gradient(circle, #F3EEE1 3.5px, transparent 3.6px);
      background-size: 18px 100%;
      background-position: center;
      background-color: #1D2438;
    }
    .frx-roster-item { border-left: 3px solid transparent; }
    .frx-roster-item.is-active { border-left-color: #A9752B; }
    .frx-scrollbar::-webkit-scrollbar { width: 6px; }
    .frx-scrollbar::-webkit-scrollbar-thumb { background: #D9CDA9; border-radius: 999px; }
    .frx-scrollbar::-webkit-scrollbar-track { background: transparent; }
  `}</style>
);

export default function FinalResult() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const resultRef = useRef(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const finalResultResponse = await axios.get(`${API_BASE_URL}/final-result`, {
        params: { limit: 500 },
      });

      if (finalResultResponse.data.success) {
        setAllStudents(finalResultResponse.data.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Final_Result_${selectedStudent?.studentId?.name || 'Student'}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const filteredStudents = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return allStudents.filter((r) => {
      const s = r.studentId || {};
      return (
        s.name?.toLowerCase().includes(q) ||
        s.studentId?.toLowerCase().includes(q)
      );
    });
  }, [allStudents, searchTerm]);

  if (loading) {
    return (
      <div className="frx-root min-h-screen flex items-center justify-center">
        <FontStyles />
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#1D2438] border-t-transparent animate-spin" />
          <p className="mt-4 text-[#4B5273] frx-mono text-sm tracking-wide">খাতা খোলা হচ্ছে…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="frx-root min-h-screen flex items-center justify-center">
        <FontStyles />
        <div className="text-center bg-white border border-[#E4D9BC] rounded-lg px-8 py-6 shadow-sm">
          <XCircle className="w-10 h-10 text-[#96342C] mx-auto mb-3" />
          <p className="text-lg font-semibold text-[#1D2438]">লোড করা যায়নি</p>
          <p className="text-sm text-[#4B5273] mt-1">{error}</p>
          <button
            onClick={fetchAllData}
            className="mt-5 px-5 py-2 bg-[#1D2438] text-white rounded-md text-sm hover:bg-[#2B3555] transition-colors"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="frx-root min-h-screen">
      <FontStyles />

      {/* Top bar */}
      <div className="bg-[#1D2438] text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-[#C79A49]" />
            <div>
              <p className="frx-bn-display text-xl leading-none">চূড়ান্ত ফলাফল</p>
              <p className="frx-mono text-[11px] text-white/50 tracking-widest mt-1">FINAL RESULT LEDGER</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/70">
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {filteredStudents.length} শিক্ষার্থী</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        {/* Roster panel */}
        <div className="bg-white border border-[#E4D9BC] rounded-lg shadow-sm overflow-hidden h-fit lg:sticky lg:top-6">
          <div className="p-4 border-b border-[#EFE7D2]">
            <div className="relative">
              <Search className="w-4 h-4 text-[#9C927A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="নাম বা আইডি খুঁজুন…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#E4D9BC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C79A49]/40 focus:border-[#C79A49] bg-[#FBF8F0]"
              />
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto frx-scrollbar divide-y divide-[#F0E9D6]">
            {filteredStudents.length === 0 && (
              <p className="text-sm text-[#9C927A] text-center py-10">কোনো শিক্ষার্থী পাওয়া যায়নি</p>
            )}
            {filteredStudents.map((result) => {
              const s = result.studentId || {};
              const isActive = selectedStudent?._id === result._id;
              const passed = result.overallStatus === 'Pass';
              return (
                <button
                  key={result._id}
                  onClick={() => setSelectedStudent(result)}
                  className={`frx-roster-item w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#FBF6E8] transition-colors ${isActive ? 'is-active bg-[#FBF6E8]' : ''}`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#1D2438] text-white flex items-center justify-center frx-display text-sm shrink-0">
                    {s.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1D2438] truncate">{s.name || 'N/A'}</p>
                    <p className="frx-mono text-[11px] text-[#9C927A]">{s.studentId || '—'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="frx-mono text-xs font-semibold text-[#A9752B]">
                      {result.cgpa != null ? result.cgpa.toFixed(2) : '—'}
                    </span>
                    {passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2F5D45]" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-[#96342C]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate / Report Container */}
        <div>
          {!selectedStudent && (
            <div className="h-full min-h-[420px] flex items-center justify-center bg-white/60 border border-dashed border-[#D9CDA9] rounded-lg">
              <div className="text-center text-[#9C927A]">
                <Layers className="w-8 h-8 mx-auto mb-3" />
                <p className="text-sm">ফলাফল দেখতে বাম পাশ থেকে একজন শিক্ষার্থী নির্বাচন করুন</p>
              </div>
            </div>
          )}

          {selectedStudent && (
            <>
              <div className="flex justify-end mb-3">
                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 bg-[#A9752B] hover:bg-[#96631F] text-white text-sm rounded-md flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  পিডিএফ ডাউনলোড
                </button>
              </div>

              <div ref={resultRef} className="space-y-6">
                <CoverPage student={selectedStudent} schoolInfo={schoolInfo} />

                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#E4D9BC]">
                  {/* Letterhead */}
                  <div className="bg-[#1D2438] text-white px-8 pt-7 pb-9">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="frx-bn-display text-2xl">{schoolInfo.name}</p>
                        <p className="text-xs text-white/60 mt-1">{schoolInfo.address}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-white/50 frx-mono">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{schoolInfo.phone}</span>
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{schoolInfo.email}</span>
                          <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{schoolInfo.website}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#C79A49] tracking-wide">{schoolInfo.motto}</p>
                        <p className="frx-mono text-[11px] text-white/50 mt-1">{selectedStudent.sessionId?.name || '—'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="frx-perforation" />

                  {/* Body */}
                  <div className="px-8 pt-8 pb-8">
                    <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                        <div>
                          <p className="text-[11px] text-[#9C927A] tracking-wide">শিক্ষার্থীর নাম</p>
                          <p className="frx-display text-lg text-[#1D2438]">{selectedStudent.studentId?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#9C927A] tracking-wide">শিক্ষার্থী আইডি</p>
                          <p className="frx-mono text-sm text-[#1D2438] mt-1">{selectedStudent.studentId?.studentId || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#9C927A] tracking-wide">শ্রেণি / গ্রুপ</p>
                          <p className="text-sm text-[#1D2438] mt-1">{selectedStudent.classGroupId?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#9C927A] tracking-wide">মার্জ পদ্ধতি</p>
                          <p className="text-sm text-[#1D2438] mt-1">{selectedStudent.mergeStrategy || 'N/A'}</p>
                        </div>
                      </div>

                      {/* CGPA Badge */}
                      <div className="relative shrink-0 mx-auto">
                        <div
                          className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg"
                          style={{ background: 'radial-gradient(circle at 35% 30%, #E0B978, #A9752B 70%)' }}
                        >
                          <span className="frx-display text-2xl font-bold text-white">
                            {selectedStudent.cgpa != null ? selectedStudent.cgpa.toFixed(2) : '—'}
                          </span>
                          <span className="text-[10px] tracking-widest text-white/90 font-mono mt-0.5">CGPA</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <ResultCardSwitcher result={selectedStudent} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}



// import React, { useRef, useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import {
//   Search,
//   Download,
//   GraduationCap,
//   CheckCircle2,
//   XCircle,
//   Users,
//   Layers,
//   Phone,
//   Mail,
//   Globe,
// } from 'lucide-react';
// import ResultCardSwitcher from './ResultCards';
// import CoverPage from './CoverPage'; // ১. কভার পেজ কম্পোনেন্ট ইমপোর্ট করে নিন

// const schoolInfo = {
//   name: 'বাউনিয়া আবদুল জলিল উচ্চ বিদ্যালয়।',
//   address: 'বাউনিয়া মেইন রোড, ঢাকা ২৮৭৬। ',
//   phone: '০১৯৮০৪৭৬০১১',
//   email: 'support@baoniyaschool.com',
//   motto: 'শিক্ষাই আলো',
//   website: 'www.bajhs.edu.bd',
// };

// const API_BASE_URL = import.meta.env.VITE_REACT_APP_ROOT;

// const FontStyles = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Tiro+Bangla&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Hind+Siliguri:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

//     .frx-root { font-family: 'Hind Siliguri', 'Fraunces', sans-serif; background: #F3EEE1; }
//     .frx-bn-display { font-family: 'Tiro Bangla', serif; }
//     .frx-display { font-family: 'Fraunces', serif; }
//     .frx-mono { font-family: 'JetBrains Mono', monospace; }

//     .frx-perforation {
//       height: 14px;
//       background-image: radial-gradient(circle, #F3EEE1 3.5px, transparent 3.6px);
//       background-size: 18px 100%;
//       background-position: center;
//       background-color: #1D2438;
//     }
//     .frx-roster-item { border-left: 3px solid transparent; }
//     .frx-roster-item.is-active { border-left-color: #A9752B; }
//     .frx-scrollbar::-webkit-scrollbar { width: 6px; }
//     .frx-scrollbar::-webkit-scrollbar-thumb { background: #D9CDA9; border-radius: 999px; }
//     .frx-scrollbar::-webkit-scrollbar-track { background: transparent; }
//   `}</style>
// );

// export default function FinalResult() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [allStudents, setAllStudents] = useState([]);
//   const resultRef = useRef(null);

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const finalResultResponse = await axios.get(`${API_BASE_URL}/final-result`, {
//         params: { limit: 500 },
//       });

//       if (finalResultResponse.data.success) {
//         setAllStudents(finalResultResponse.data.data || []);
//       }
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err.response?.data?.message || 'Failed to fetch data');
//       setLoading(false);
//     }
//   };

//   const downloadPDF = async () => {
//     if (!resultRef.current) return;
//     try {
//       const canvas = await html2canvas(resultRef.current, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         backgroundColor: '#ffffff',
//       });
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`Final_Result_${selectedStudent?.studentId?.name || 'Student'}.pdf`);
//     } catch (err) {
//       console.error('PDF generation failed:', err);
//       alert('Failed to generate PDF. Please try again.');
//     }
//   };

//   const filteredStudents = useMemo(() => {
//     const q = searchTerm.toLowerCase();
//     return allStudents.filter((r) => {
//       const s = r.studentId || {};
//       return (
//         s.name?.toLowerCase().includes(q) ||
//         s.studentId?.toLowerCase().includes(q)
//       );
//     });
//   }, [allStudents, searchTerm]);

//   if (loading) {
//     return (
//       <div className="frx-root min-h-screen flex items-center justify-center">
//         <FontStyles />
//         <div className="text-center">
//           <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#1D2438] border-t-transparent animate-spin" />
//           <p className="mt-4 text-[#4B5273] frx-mono text-sm tracking-wide">খাতা খোলা হচ্ছে…</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="frx-root min-h-screen flex items-center justify-center">
//         <FontStyles />
//         <div className="text-center bg-white border border-[#E4D9BC] rounded-lg px-8 py-6 shadow-sm">
//           <XCircle className="w-10 h-10 text-[#96342C] mx-auto mb-3" />
//           <p className="text-lg font-semibold text-[#1D2438]">লোড করা যায়নি</p>
//           <p className="text-sm text-[#4B5273] mt-1">{error}</p>
//           <button
//             onClick={fetchAllData}
//             className="mt-5 px-5 py-2 bg-[#1D2438] text-white rounded-md text-sm hover:bg-[#2B3555] transition-colors"
//           >
//             আবার চেষ্টা করুন
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="frx-root min-h-screen">
//       <FontStyles />

//       {/* Top bar */}
//       <div className="bg-[#1D2438] text-white">
//         <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <GraduationCap className="w-7 h-7 text-[#C79A49]" />
//             <div>
//               <p className="frx-bn-display text-xl leading-none">চূড়ান্ত ফলাফল</p>
//               <p className="frx-mono text-[11px] text-white/50 tracking-widest mt-1">FINAL RESULT LEDGER</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 text-xs text-white/70">
//             <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {filteredStudents.length} শিক্ষার্থী</span>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
//         {/* Roster panel */}
//         <div className="bg-white border border-[#E4D9BC] rounded-lg shadow-sm overflow-hidden h-fit lg:sticky lg:top-6">
//           <div className="p-4 border-b border-[#EFE7D2]">
//             <div className="relative">
//               <Search className="w-4 h-4 text-[#9C927A] absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="text"
//                 placeholder="নাম বা আইডি খুঁজুন…"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-9 pr-3 py-2 text-sm border border-[#E4D9BC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C79A49]/40 focus:border-[#C79A49] bg-[#FBF8F0]"
//               />
//             </div>
//           </div>

//           <div className="max-h-[70vh] overflow-y-auto frx-scrollbar divide-y divide-[#F0E9D6]">
//             {filteredStudents.length === 0 && (
//               <p className="text-sm text-[#9C927A] text-center py-10">কোনো শিক্ষার্থী পাওয়া যায়নি</p>
//             )}
//             {filteredStudents.map((result) => {
//               const s = result.studentId || {};
//               const isActive = selectedStudent?._id === result._id;
//               const passed = result.overallStatus === 'Pass';
//               return (
//                 <button
//                   key={result._id}
//                   onClick={() => setSelectedStudent(result)}
//                   className={`frx-roster-item w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#FBF6E8] transition-colors ${isActive ? 'is-active bg-[#FBF6E8]' : ''}`}
//                 >
//                   <div className="w-9 h-9 rounded-full bg-[#1D2438] text-white flex items-center justify-center frx-display text-sm shrink-0">
//                     {s.name?.charAt(0) || '?'}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-[#1D2438] truncate">{s.name || 'N/A'}</p>
//                     <p className="frx-mono text-[11px] text-[#9C927A]">{s.studentId || '—'}</p>
//                   </div>
//                   <div className="flex flex-col items-end gap-1 shrink-0">
//                     <span className="frx-mono text-xs font-semibold text-[#A9752B]">
//                       {result.cgpa != null ? result.cgpa.toFixed(2) : '—'}
//                     </span>
//                     {passed ? (
//                       <CheckCircle2 className="w-3.5 h-3.5 text-[#2F5D45]" />
//                     ) : (
//                       <XCircle className="w-3.5 h-3.5 text-[#96342C]" />
//                     )}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Certificate / Report Container */}
//         <div>
//           {!selectedStudent && (
//             <div className="h-full min-h-[420px] flex items-center justify-center bg-white/60 border border-dashed border-[#D9CDA9] rounded-lg">
//               <div className="text-center text-[#9C927A]">
//                 <Layers className="w-8 h-8 mx-auto mb-3" />
//                 <p className="text-sm">ফলাফল দেখতে বাম পাশ থেকে একজন শিক্ষার্থী নির্বাচন করুন</p>
//               </div>
//             </div>
//           )}

//           {selectedStudent && (
//             <>
//               <div className="flex justify-end mb-3">
//                 <button
//                   onClick={downloadPDF}
//                   className="px-4 py-2 bg-[#A9752B] hover:bg-[#96631F] text-white text-sm rounded-md flex items-center gap-2 transition-colors shadow-sm"
//                 >
//                   <Download className="w-4 h-4" />
//                   পিডিএফ ডাউনলোড
//                 </button>
//               </div>

//               {/* পুরো রিপোর্টটি (কভার পেজসহ) পিডিএফ ডাউনলোড বা প্রিন্ট করার জন্য একটি রেফ (resultRef) এর মধ্যে রাখা হলো */}
//               <div ref={resultRef} className="space-y-6">
                
//                 {/* ২. এখানে আপনার কভার পেজটি কল করা হলো */}
//                 <CoverPage student={selectedStudent} schoolInfo={schoolInfo} />

//                 {/* ৩. মূল রেজাল্ট কার্ড অংশ */}
//                 <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#E4D9BC]">
//                   {/* Letterhead */}
//                   <div className="bg-[#1D2438] text-white px-8 pt-7 pb-9">
//                     <div className="flex items-start justify-between gap-4 flex-wrap">
//                       <div>
//                         <p className="frx-bn-display text-2xl">{schoolInfo.name}</p>
//                         <p className="text-xs text-white/60 mt-1">{schoolInfo.address}</p>
//                         <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-white/50 frx-mono">
//                           <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{schoolInfo.phone}</span>
//                           <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{schoolInfo.email}</span>
//                           <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{schoolInfo.website}</span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-xs text-[#C79A49] tracking-wide">{schoolInfo.motto}</p>
//                         <p className="frx-mono text-[11px] text-white/50 mt-1">{selectedStudent.sessionId?.name || '—'}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="frx-perforation" />

//                   {/* Body */}
//                   <div className="px-8 pt-8 pb-8">
//                     <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
//                       <div className="grid grid-cols-2 gap-x-8 gap-y-3">
//                         <div>
//                           <p className="text-[11px] text-[#9C927A] tracking-wide">শিক্ষার্থীর নাম</p>
//                           <p className="frx-display text-lg text-[#1D2438]">{selectedStudent.studentId?.name || 'N/A'}</p>
//                         </div>
//                         <div>
//                           <p className="text-[11px] text-[#9C927A] tracking-wide">শিক্ষার্থী আইডি</p>
//                           <p className="frx-mono text-sm text-[#1D2438] mt-1">{selectedStudent.studentId?.studentId || 'N/A'}</p>
//                         </div>
//                         <div>
//                           <p className="text-[11px] text-[#9C927A] tracking-wide">শ্রেণি / গ্রুপ</p>
//                           <p className="text-sm text-[#1D2438] mt-1">{selectedStudent.classGroupId?.name || 'N/A'}</p>
//                         </div>
//                         <div>
//                           <p className="text-[11px] text-[#9C927A] tracking-wide">মার্জ পদ্ধতি</p>
//                           <p className="text-sm text-[#1D2438] mt-1">{selectedStudent.mergeStrategy || 'N/A'}</p>
//                         </div>
//                       </div>

//                       {/* CGPA Badge */}
//                       <div className="relative shrink-0 mx-auto">
//                         <div
//                           className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg"
//                           style={{ background: 'radial-gradient(circle at 35% 30%, #E0B978, #A9752B 70%)' }}
//                         >
//                           <span className="frx-display text-2xl font-bold text-white">
//                             {selectedStudent.cgpa != null ? selectedStudent.cgpa.toFixed(2) : '—'}
//                           </span>
//                           <span className="text-[10px] tracking-widest text-white/90 font-mono mt-0.5">CGPA</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Dynamic Result Cards Display via Switcher */}
//                     <div className="mt-6">
//                       <ResultCardSwitcher result={selectedStudent} />
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useRef, useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import {
//   Search,
//   Download,
//   GraduationCap,
//   CheckCircle2,
//   XCircle,
//   Users,
//   Layers,
//   Phone,
//   Mail,
//   Globe,
// } from 'lucide-react';
// import ResultCardSwitcher from './Resultcards';
// import CoverPage from './CoverPage';
// // import ResultCardSwitcher from './ResultCards'; // সুনির্দিষ্ট কার্ড সুইচিং কম্পোনেন্ট ইমপোর্ট করা হলো

// const schoolInfo = {
//   name: 'বাওনিয়া উচ্চ বিদ্যালয়',
//   address: 'বাউনিয়া মেইন রোড, ঢাকা ২৮৭৬। ',
//   phone: '০১৯৮০৪৭৬০১১',
//   email: 'support@baoniyaschool.com',
//   motto: 'শিক্ষাই আলো',
//   website: 'www.bajhs.edu.bd',
// };

// const API_BASE_URL = import.meta.env.VITE_REACT_APP_ROOT;

// const FontStyles = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Tiro+Bangla&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Hind+Siliguri:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

//     .frx-root { font-family: 'Hind Siliguri', 'Fraunces', sans-serif; background: #F3EEE1; }
//     .frx-bn-display { font-family: 'Tiro Bangla', serif; }
//     .frx-display { font-family: 'Fraunces', serif; }
//     .frx-mono { font-family: 'JetBrains Mono', monospace; }

//     .frx-perforation {
//       height: 14px;
//       background-image: radial-gradient(circle, #F3EEE1 3.5px, transparent 3.6px);
//       background-size: 18px 100%;
//       background-position: center;
//       background-color: #1D2438;
//     }
//     .frx-roster-item { border-left: 3px solid transparent; }
//     .frx-roster-item.is-active { border-left-color: #A9752B; }
//     .frx-scrollbar::-webkit-scrollbar { width: 6px; }
//     .frx-scrollbar::-webkit-scrollbar-thumb { background: #D9CDA9; border-radius: 999px; }
//     .frx-scrollbar::-webkit-scrollbar-track { background: transparent; }
//   `}</style>
// );

// export default function FinalResult() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [allStudents, setAllStudents] = useState([]);
//   const resultRef = useRef(null);

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const finalResultResponse = await axios.get(`${API_BASE_URL}/final-result`, {
//         params: { limit: 500 },
//       });

//       if (finalResultResponse.data.success) {
//         setAllStudents(finalResultResponse.data.data || []);
//       }
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err.response?.data?.message || 'Failed to fetch data');
//       setLoading(false);
//     }
//   };

//   const downloadPDF = async () => {
//     if (!resultRef.current) return;
//     try {
//       const canvas = await html2canvas(resultRef.current, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         backgroundColor: '#ffffff',
//       });
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`Final_Result_${selectedStudent?.studentId?.name || 'Student'}.pdf`);
//     } catch (err) {
//       console.error('PDF generation failed:', err);
//       alert('Failed to generate PDF. Please try again.');
//     }
//   };

//   const filteredStudents = useMemo(() => {
//     const q = searchTerm.toLowerCase();
//     return allStudents.filter((r) => {
//       const s = r.studentId || {};
//       return (
//         s.name?.toLowerCase().includes(q) ||
//         s.studentId?.toLowerCase().includes(q)
//       );
//     });
//   }, [allStudents, searchTerm]);

//   if (loading) {
//     return (
//       <div className="frx-root min-h-screen flex items-center justify-center">
//         <FontStyles />
//         <div className="text-center">
//           <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#1D2438] border-t-transparent animate-spin" />
//           <p className="mt-4 text-[#4B5273] frx-mono text-sm tracking-wide">খাতা খোলা হচ্ছে…</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="frx-root min-h-screen flex items-center justify-center">
//         <FontStyles />
//         <div className="text-center bg-white border border-[#E4D9BC] rounded-lg px-8 py-6 shadow-sm">
//           <XCircle className="w-10 h-10 text-[#96342C] mx-auto mb-3" />
//           <p className="text-lg font-semibold text-[#1D2438]">লোড করা যায়নি</p>
//           <p className="text-sm text-[#4B5273] mt-1">{error}</p>
//           <button
//             onClick={fetchAllData}
//             className="mt-5 px-5 py-2 bg-[#1D2438] text-white rounded-md text-sm hover:bg-[#2B3555] transition-colors"
//           >
//             আবার চেষ্টা করুন
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="frx-root min-h-screen">
//       <FontStyles />

//       {/* Top bar */}
//       <div className="bg-[#1D2438] text-white">
//         <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <GraduationCap className="w-7 h-7 text-[#C79A49]" />
//             <div>
//               <p className="frx-bn-display text-xl leading-none">চূড়ান্ত ফলাফল</p>
//               <p className="frx-mono text-[11px] text-white/50 tracking-widest mt-1">FINAL RESULT LEDGER</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 text-xs text-white/70">
//             <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {filteredStudents.length} শিক্ষার্থী</span>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
//         {/* Roster panel */}
//         <div className="bg-white border border-[#E4D9BC] rounded-lg shadow-sm overflow-hidden h-fit lg:sticky lg:top-6">
//           <div className="p-4 border-b border-[#EFE7D2]">
//             <div className="relative">
//               <Search className="w-4 h-4 text-[#9C927A] absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="text"
//                 placeholder="নাম বা আইডি খুঁজুন…"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-9 pr-3 py-2 text-sm border border-[#E4D9BC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C79A49]/40 focus:border-[#C79A49] bg-[#FBF8F0]"
//               />
//             </div>
//           </div>

//           <div className="max-h-[70vh] overflow-y-auto frx-scrollbar divide-y divide-[#F0E9D6]">
//             {filteredStudents.length === 0 && (
//               <p className="text-sm text-[#9C927A] text-center py-10">কোনো শিক্ষার্থী পাওয়া যায়নি</p>
//             )}
//             {filteredStudents.map((result) => {
//               const s = result.studentId || {};
//               const isActive = selectedStudent?._id === result._id;
//               const passed = result.overallStatus === 'Pass';
//               return (
//                 <button
//                   key={result._id}
//                   onClick={() => setSelectedStudent(result)}
//                   className={`frx-roster-item w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#FBF6E8] transition-colors ${isActive ? 'is-active bg-[#FBF6E8]' : ''}`}
//                 >
//                   <div className="w-9 h-9 rounded-full bg-[#1D2438] text-white flex items-center justify-center frx-display text-sm shrink-0">
//                     {s.name?.charAt(0) || '?'}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-[#1D2438] truncate">{s.name || 'N/A'}</p>
//                     <p className="frx-mono text-[11px] text-[#9C927A]">{s.studentId || '—'}</p>
//                   </div>
//                   <div className="flex flex-col items-end gap-1 shrink-0">
//                     <span className="frx-mono text-xs font-semibold text-[#A9752B]">
//                       {result.cgpa != null ? result.cgpa.toFixed(2) : '—'}
//                     </span>
//                     {passed ? (
//                       <CheckCircle2 className="w-3.5 h-3.5 text-[#2F5D45]" />
//                     ) : (
//                       <XCircle className="w-3.5 h-3.5 text-[#96342C]" />
//                     )}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Certificate panel */}
//         <div>
//           {!selectedStudent && (
//             <div className="h-full min-h-[420px] flex items-center justify-center bg-white/60 border border-dashed border-[#D9CDA9] rounded-lg">
//               <div className="text-center text-[#9C927A]">
//                 <Layers className="w-8 h-8 mx-auto mb-3" />
//                 <p className="text-sm">ফলাফল দেখতে বাম পাশ থেকে একজন শিক্ষার্থী নির্বাচন করুন</p>
//               </div>
//             </div>
//           )}

//           {selectedStudent && (
//             <>
//               <div className="flex justify-end mb-3">
//                 <button
//                   onClick={downloadPDF}
//                   className="px-4 py-2 bg-[#A9752B] hover:bg-[#96631F] text-white text-sm rounded-md flex items-center gap-2 transition-colors shadow-sm"
//                 >
//                   <Download className="w-4 h-4" />
//                   পিডিএফ ডাউনলোড
//                 </button>
//               </div>

//               <div ref={resultRef} className="bg-white rounded-lg shadow-md overflow-hidden border border-[#E4D9BC]">
//                 <CoverPage schoolInfo="{schoolInfo}" student="{selectedStudent}"/>
//                 {/* Letterhead */}
//                 <div className="bg-[#1D2438] text-white px-8 pt-7 pb-9">
//                   <div className="flex items-start justify-between gap-4 flex-wrap">
//                     <div>
//                       <p className="frx-bn-display text-2xl">{schoolInfo.name}</p>
//                       <p className="text-xs text-white/60 mt-1">{schoolInfo.address}</p>
//                       <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-white/50 frx-mono">
//                         <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{schoolInfo.phone}</span>
//                         <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{schoolInfo.email}</span>
//                         <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{schoolInfo.website}</span>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xs text-[#C79A49] tracking-wide">{schoolInfo.motto}</p>
//                       <p className="frx-mono text-[11px] text-white/50 mt-1">{selectedStudent.sessionId?.name || '—'}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="frx-perforation" />

//                 {/* Body */}
//                 <div className="px-8 pt-8 pb-8">
//                   <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
//                     <div className="grid grid-cols-2 gap-x-8 gap-y-3">
//                       <div>
//                         <p className="text-[11px] text-[#9C927A] tracking-wide">শিক্ষার্থীর নাম</p>
//                         <p className="frx-display text-lg text-[#1D2438]">{selectedStudent.studentId?.name || 'N/A'}</p>
//                       </div>
//                       <div>
//                         <p className="text-[11px] text-[#9C927A] tracking-wide">শিক্ষার্থী আইডি</p>
//                         <p className="frx-mono text-sm text-[#1D2438] mt-1">{selectedStudent.studentId?.studentId || 'N/A'}</p>
//                       </div>
//                       <div>
//                         <p className="text-[11px] text-[#9C927A] tracking-wide">শ্রেণি / গ্রুপ</p>
//                         <p className="text-sm text-[#1D2438] mt-1">{selectedStudent.classGroupId?.name || 'N/A'}</p>
//                       </div>
//                       <div>
//                         <p className="text-[11px] text-[#9C927A] tracking-wide">মার্জ পদ্ধতি</p>
//                         <p className="text-sm text-[#1D2438] mt-1">{selectedStudent.mergeStrategy || 'N/A'}</p>
//                       </div>
//                     </div>

//                     {/* CGPA Badge */}
//                     <div className="relative shrink-0 mx-auto">
//                       <div
//                         className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg"
//                         style={{ background: 'radial-gradient(circle at 35% 30%, #E0B978, #A9752B 70%)' }}
//                       >
//                         <span className="frx-display text-2xl font-bold text-white">
//                           {selectedStudent.cgpa != null ? selectedStudent.cgpa.toFixed(2) : '—'}
//                         </span>
//                         <span className="text-[10px] tracking-widest text-white/90 font-mono mt-0.5">CGPA</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Dynamic Result Cards Display via Switcher */}
//                   <div className="mt-6">
//                     <ResultCardSwitcher result={selectedStudent} />
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useRef, useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import {
//   Search,
//   Download,
//   GraduationCap,
//   CheckCircle2,
//   XCircle,
//   Users,
//   Layers,
//   Phone,
//   Mail,
//   Globe,
// } from 'lucide-react';

// // ---------------------------------------------------------------------------
// // School Information
// // ---------------------------------------------------------------------------
// const schoolInfo = {
//   name: 'বাওনিয়া উচ্চ বিদ্যালয়',
//   address: 'বাউনিয়া মেইন রোড, ঢাকা ২৮৭৬। ',
//   phone: '০১৯৮০৪৭৬০১১',
//   email: 'support@baoniyaschool.com',
//   motto: 'শিক্ষাই আলো',
//   website: 'www.bajhs.edu.bd',
// };

// const API_BASE_URL = import.meta.env.VITE_REACT_APP_ROOT;

// // ---------------------------------------------------------------------------
// // Fonts + design tokens
// // ---------------------------------------------------------------------------
// const FontStyles = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Tiro+Bangla&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Hind+Siliguri:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

//     .frx-root { font-family: 'Hind Siliguri', 'Fraunces', sans-serif; background: #F3EEE1; }
//     .frx-bn-display { font-family: 'Tiro Bangla', serif; }
//     .frx-display { font-family: 'Fraunces', serif; }
//     .frx-mono { font-family: 'JetBrains Mono', monospace; }

//     .frx-perforation {
//       height: 14px;
//       background-image: radial-gradient(circle, #F3EEE1 3.5px, transparent 3.6px);
//       background-size: 18px 100%;
//       background-position: center;
//       background-color: #1D2438;
//     }
//     .frx-ledger-row dt::after {
//       content: '';
//       flex: 1 1 auto;
//       border-bottom: 1.5px dotted #C9BFA6;
//       margin: 0 8px;
//       transform: translateY(-4px);
//     }
//     .frx-roster-item { border-left: 3px solid transparent; }
//     .frx-roster-item.is-active { border-left-color: #A9752B; }
//     .frx-scrollbar::-webkit-scrollbar { width: 6px; }
//     .frx-scrollbar::-webkit-scrollbar-thumb { background: #D9CDA9; border-radius: 999px; }
//     .frx-scrollbar::-webkit-scrollbar-track { background: transparent; }
//   `}</style>
// );

// function FinalResult() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [allStudents, setAllStudents] = useState([]);
//   const resultRef = useRef(null);

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const finalResultResponse = await axios.get(`${API_BASE_URL}/final-result`, {
//         params: { limit: 500 },
//       });

//       if (finalResultResponse.data.success) {
//         setAllStudents(finalResultResponse.data.data || []);
//       }
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err.response?.data?.message || 'Failed to fetch data');
//       setLoading(false);
//     }
//   };

//   const getGradeInfo = (marks, fullMarks) => {
//     const percentage = fullMarks ? (marks / fullMarks) * 100 : 0;
//     if (percentage >= 80) return { grade: 'A+', gradePoint: 5.0 };
//     if (percentage >= 70) return { grade: 'A', gradePoint: 4.0 };
//     if (percentage >= 60) return { grade: 'A-', gradePoint: 3.5 };
//     if (percentage >= 50) return { grade: 'B', gradePoint: 3.0 };
//     if (percentage >= 40) return { grade: 'C', gradePoint: 2.0 };
//     if (percentage >= 33) return { grade: 'D', gradePoint: 1.0 };
//     return { grade: 'F', gradePoint: 0.0 };
//   };

//   const downloadPDF = async () => {
//     if (!resultRef.current) return;
//     try {
//       const canvas = await html2canvas(resultRef.current, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         backgroundColor: '#ffffff',
//       });
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`Final_Result_${selectedStudent?.studentId?.name || 'Student'}.pdf`);
//     } catch (err) {
//       console.error('PDF generation failed:', err);
//       alert('Failed to generate PDF. Please try again.');
//     }
//   };

//   // Merge subject marks across every term into one row-per-subject table
//   const buildSubjectRows = (result) => {
//     const rows = {};
//     let order = 0;
//     (result.termResults || []).forEach((t) => {
//       const subs = t.examResultId?.subjects || [];
//       subs.forEach((s) => {
//         const id = s.subjectId?._id || s.subjectId;
//         if (!rows[id]) {
//           rows[id] = {
//             id,
//             name: s.subjectId?.name || 'বিষয়',
//             fullMarks: s.subjectId?.fullMarks || s.fullMarks || 0,
//             marks: {},
//             order: order++,
//           };
//         }
//         rows[id].marks[t.term] = s.total;
//       });
//     });
//     return Object.values(rows).sort((a, b) => a.order - b.order);
//   };

//   const filteredStudents = useMemo(() => {
//     const q = searchTerm.toLowerCase();
//     return allStudents.filter((r) => {
//       const s = r.studentId || {};
//       return (
//         s.name?.toLowerCase().includes(q) ||
//         s.studentId?.toLowerCase().includes(q)
//       );
//     });
//   }, [allStudents, searchTerm]);

//   // ---------------------------------------------------------------------
//   // Loading / error states
//   // ---------------------------------------------------------------------
//   if (loading) {
//     return (
//       <div className="frx-root min-h-screen flex items-center justify-center">
//         <FontStyles />
//         <div className="text-center">
//           <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#1D2438] border-t-transparent animate-spin" />
//           <p className="mt-4 text-[#4B5273] frx-mono text-sm tracking-wide">খাতা খোলা হচ্ছে…</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="frx-root min-h-screen flex items-center justify-center">
//         <FontStyles />
//         <div className="text-center bg-white border border-[#E4D9BC] rounded-lg px-8 py-6 shadow-sm">
//           <XCircle className="w-10 h-10 text-[#96342C] mx-auto mb-3" />
//           <p className="text-lg font-semibold text-[#1D2438]">লোড করা যায়নি</p>
//           <p className="text-sm text-[#4B5273] mt-1">{error}</p>
//           <button
//             onClick={fetchAllData}
//             className="mt-5 px-5 py-2 bg-[#1D2438] text-white rounded-md text-sm hover:bg-[#2B3555] transition-colors"
//           >
//             আবার চেষ্টা করুন
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const subjectRows = selectedStudent ? buildSubjectRows(selectedStudent) : [];
//   const termNumbers = selectedStudent
//     ? (selectedStudent.termResults || []).map((t) => t.term).sort((a, b) => a - b)
//     : [];

//     console.log(subjectRows, "subject rows info")

//   return (
//     <div className="frx-root min-h-screen">
//       <FontStyles />

//       {/* Top bar */}
//       <div className="bg-[#1D2438] text-white">
//         <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <GraduationCap className="w-7 h-7 text-[#C79A49]" />
//             <div>
//               <p className="frx-bn-display text-xl leading-none">চূড়ান্ত ফলাফল</p>
//               <p className="frx-mono text-[11px] text-white/50 tracking-widest mt-1">FINAL RESULT LEDGER</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 text-xs text-white/70">
//             <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {filteredStudents.length} শিক্ষার্থী</span>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
//         {/* ------------------------------------------------------------ */}
//         {/* Roster panel                                                  */}
//         {/* ------------------------------------------------------------ */}
//         <div className="bg-white border border-[#E4D9BC] rounded-lg shadow-sm overflow-hidden h-fit lg:sticky lg:top-6">
//           <div className="p-4 border-b border-[#EFE7D2]">
//             <div className="relative">
//               <Search className="w-4 h-4 text-[#9C927A] absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="text"
//                 placeholder="নাম বা আইডি খুঁজুন…"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-9 pr-3 py-2 text-sm border border-[#E4D9BC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C79A49]/40 focus:border-[#C79A49] bg-[#FBF8F0]"
//               />
//             </div>
//           </div>

//           <div className="max-h-[70vh] overflow-y-auto frx-scrollbar divide-y divide-[#F0E9D6]">
//             {filteredStudents.length === 0 && (
//               <p className="text-sm text-[#9C927A] text-center py-10">কোনো শিক্ষার্থী পাওয়া যায়নি</p>
//             )}
//             {filteredStudents.map((result) => {
//               const s = result.studentId || {};
//               const isActive = selectedStudent?._id === result._id;
//               const passed = result.overallStatus === 'Pass';
//               return (
//                 <button
//                   key={result._id}
//                   onClick={() => setSelectedStudent(result)}
//                   className={`frx-roster-item w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#FBF6E8] transition-colors ${isActive ? 'is-active bg-[#FBF6E8]' : ''}`}
//                 >
//                   <div className="w-9 h-9 rounded-full bg-[#1D2438] text-white flex items-center justify-center frx-display text-sm shrink-0">
//                     {s.name?.charAt(0) || '?'}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-[#1D2438] truncate">{s.name || 'N/A'}</p>
//                     <p className="frx-mono text-[11px] text-[#9C927A]">{s.studentId || '—'}</p>
//                   </div>
//                   <div className="flex flex-col items-end gap-1 shrink-0">
//                     <span className="frx-mono text-xs font-semibold text-[#A9752B]">
//                       {result.cgpa != null ? result.cgpa.toFixed(2) : '—'}
//                     </span>
//                     {passed ? (
//                       <CheckCircle2 className="w-3.5 h-3.5 text-[#2F5D45]" />
//                     ) : (
//                       <XCircle className="w-3.5 h-3.5 text-[#96342C]" />
//                     )}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* ------------------------------------------------------------ */}
//         {/* Certificate panel                                             */}
//         {/* ------------------------------------------------------------ */}
//         <div>
//           {!selectedStudent && (
//             <div className="h-full min-h-[420px] flex items-center justify-center bg-white/60 border border-dashed border-[#D9CDA9] rounded-lg">
//               <div className="text-center text-[#9C927A]">
//                 <Layers className="w-8 h-8 mx-auto mb-3" />
//                 <p className="text-sm">ফলাফল দেখতে বাম পাশ থেকে একজন শিক্ষার্থী নির্বাচন করুন</p>
//               </div>
//             </div>
//           )}

//           {selectedStudent && (
//             <>
//               <div className="flex justify-end mb-3">
//                 <button
//                   onClick={downloadPDF}
//                   className="px-4 py-2 bg-[#A9752B] hover:bg-[#96631F] text-white text-sm rounded-md flex items-center gap-2 transition-colors shadow-sm"
//                 >
//                   <Download className="w-4 h-4" />
//                   পিডিএফ ডাউনলোড
//                 </button>
//               </div>

//               <div ref={resultRef} className="bg-white rounded-lg shadow-md overflow-hidden border border-[#E4D9BC]">
//                 {/* Letterhead */}
//                 <div className="bg-[#1D2438] text-white px-8 pt-7 pb-9">
//                   <div className="flex items-start justify-between gap-4 flex-wrap">
//                     <div>
//                       <p className="frx-bn-display text-2xl">{schoolInfo.name}</p>
//                       <p className="text-xs text-white/60 mt-1">{schoolInfo.address}</p>
//                       <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-white/50 frx-mono">
//                         <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{schoolInfo.phone}</span>
//                         <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{schoolInfo.email}</span>
//                         <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{schoolInfo.website}</span>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xs text-[#C79A49] tracking-wide">{schoolInfo.motto}</p>
//                       <p className="frx-mono text-[11px] text-white/50 mt-1">{selectedStudent.sessionId?.name || '—'}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Perforated tear line */}
//                 <div className="frx-perforation" />

//                 {/* Body */}
//                 <div className="px-8 pt-8 pb-8">
//                   {/* Student + seal row */}
//                   <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
//                     <div className="grid grid-cols-2 gap-x-8 gap-y-3">
//                       <div>
//                         <p className="text-[11px] text-[#9C927A] tracking-wide">শিক্ষার্থীর নাম</p>
//                         <p className="frx-display text-lg text-[#1D2438]">{selectedStudent.studentId?.name || 'N/A'}</p>
//                       </div>
//                       <div>
//                         <p className="text-[11px] text-[#9C927A] tracking-wide">শিক্ষার্থী আইডি</p>
//                         <p className="frx-mono text-sm text-[#1D2438] mt-1">{selectedStudent.studentId?.studentId || 'N/A'}</p>
//                       </div>
//                       <div>
//                         <p className="text-[11px] text-[#9C927A] tracking-wide">শ্রেণি / গ্রুপ</p>
//                         <p className="text-sm text-[#1D2438] mt-1">{selectedStudent.classGroupId?.name || 'N/A'}</p>
//                       </div>
//                       <div>
//                         <p className="text-[11px] text-[#9C927A] tracking-wide">মার্জ পদ্ধতি</p>
//                         <p className="text-sm text-[#1D2438] mt-1">{selectedStudent.mergeStrategy || 'N/A'}</p>
//                       </div>
//                     </div>

//                     {/* Wax-seal CGPA badge */}
//                     <div className="relative shrink-0 mx-auto">
//                       <div
//                         className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg"
//                         style={{ background: 'radial-gradient(circle at 35% 30%, #E0B978, #A9752B 70%)' }}
//                       >
//                         <span className="frx-display text-2xl text-white leading-none">
//                           {selectedStudent.cgpa != null ? selectedStudent.cgpa.toFixed(2) : '—'}
//                         </span>
//                         <span className="frx-mono text-[9px] text-white/80 tracking-[0.2em] mt-1">CGPA</span>
//                       </div>
//                       <div
//                         className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-semibold frx-mono tracking-wide shadow ${
//                           selectedStudent.overallStatus === 'Pass'
//                             ? 'bg-[#2F5D45] text-white'
//                             : 'bg-[#96342C] text-white'
//                         }`}
//                       >
//                         {selectedStudent.overallStatus === 'Pass' ? 'PASS' : 'FAIL'}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Term summary — dot-leader ledger rows */}
//                   <div className="mb-8">
//                     <p className="text-[11px] tracking-wide text-[#9C927A] mb-2">টার্ম অনুযায়ী ফলাফল</p>
//                     <dl className="border-t border-[#EFE7D2]">
//                       {(selectedStudent.termResults || []).map((t) => (
//                         <div key={t.term} className="frx-ledger-row flex items-baseline py-2 border-b border-[#EFE7D2]">
//                           <dt className="flex-1 flex items-baseline text-sm text-[#4B5273]">
//                             <span>টার্ম {t.term} · {t.examId?.name || '—'}</span>
//                           </dt>
//                           <dd className="frx-mono text-sm font-semibold text-[#1D2438]">
//                             GPA {t.gpa != null ? t.gpa.toFixed(2) : '—'}
//                           </dd>
//                         </div>
//                       ))}
//                     </dl>
//                   </div>

//                   {/* Subject-wise table */}
//                   <div>
//                     <p className="text-[11px] tracking-wide text-[#9C927A] mb-2">বিষয়ভিত্তিক নম্বর</p>
//                     <div className="overflow-x-auto rounded-md border border-[#EFE7D2]">
//                       <table className="min-w-full text-sm">
//                         <thead className="bg-[#FBF6E8]">
//                           <tr className="text-[#4B5273] text-xs">
//                             <th className="px-4 py-2 text-left font-medium">বিষয়</th>
//                             {termNumbers.map((tn) => (
//                               <th key={tn} className="px-4 py-2 text-center font-medium frx-mono">T{tn}</th>
//                             ))}
//                             <th className="px-4 py-2 text-center font-medium">পূর্ণমান</th>
//                             <th className="px-4 py-2 text-center font-medium">গড়</th>
//                             <th className="px-4 py-2 text-center font-medium">গ্রেড</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-[#F0E9D6]">
//                           {subjectRows.length === 0 && (
//                             <tr>
//                               <td colSpan={termNumbers.length + 4} className="px-4 py-6 text-center text-[#9C927A] text-xs">
//                                 বিষয়ভিত্তিক নম্বর পাওয়া যায়নি
//                               </td>
//                             </tr>
//                           )}
//                           {subjectRows.map((subject) => {
//                             const marksPresent = termNumbers
//                               .map((tn) => subject.marks[tn])
//                               .filter((v) => typeof v === 'number');
//                             const average = marksPresent.length
//                               ? marksPresent.reduce((a, b) => a + b, 0) / marksPresent.length
//                               : 0;
//                             const gradeInfo = getGradeInfo(average, subject.fullMarks);
//                             return (
//                               <tr key={subject.id} className="hover:bg-[#FBF8F0]">
//                                 <td className="px-4 py-2 font-medium text-[#1D2438]">{subject.name}</td>
//                                 {termNumbers.map((tn) => (
//                                   <td key={tn} className="px-4 py-2 text-center frx-mono text-[#4B5273]">
//                                     {typeof subject.marks[tn] === 'number' ? subject.marks[tn] : '—'}
//                                   </td>
//                                 ))}
//                                 <td className="px-4 py-2 text-center frx-mono text-[#9C927A]">{subject.fullMarks}</td>
//                                 <td className="px-4 py-2 text-center frx-mono font-semibold text-[#1D2438]">
//                                   {average.toFixed(1)}
//                                 </td>
//                                 <td className="px-4 py-2 text-center font-semibold text-[#A9752B]">{gradeInfo.grade}</td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>

//                   {/* Footer */}
//                   <div className="mt-8 pt-4 border-t border-[#EFE7D2] flex items-center justify-between text-[11px] text-[#9C927A]">
//                     <span>{selectedStudent.isPublished ? '✓ প্রকাশিত' : 'অপ্রকাশিত খসড়া'}</span>
//                     <span className="frx-mono">
//                       Generated {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FinalResult;

// // import React, { useRef, useState, useEffect, useMemo } from 'react';
// // import axios from 'axios';
// // import html2canvas from 'html2canvas';
// // import jsPDF from 'jspdf';
// // import {
// //   Search,
// //   Download,
// //   GraduationCap,
// //   CheckCircle2,
// //   XCircle,
// //   Users,
// //   Layers,
// //   Phone,
// //   Mail,
// //   Globe,
// // } from 'lucide-react';

// // // ---------------------------------------------------------------------------
// // // School Information
// // // ---------------------------------------------------------------------------
// // const schoolInfo = {
// //   name: 'বাওনিয়া উচ্চ বিদ্যালয়',
// //   address: 'বাউনিয়া মেইন রোড, ঢাকা ২৮৭৬। ',
// //   phone: '০১৯৮০৪৭৬০১১',
// //   email: 'support@baoniyaschool.com',
// //   motto: 'শিক্ষাই আলো',
// //   website: 'www.bajhs.edu.bd',
// // };

// // const API_BASE_URL = import.meta.env.VITE_REACT_APP_ROOT;

// // // ---------------------------------------------------------------------------
// // // Fonts + design tokens
// // // ---------------------------------------------------------------------------
// // const FontStyles = () => (
// //   <style>{`
// //     @import url('https://fonts.googleapis.com/css2?family=Tiro+Bangla&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Hind+Siliguri:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

// //     .frx-root { font-family: 'Hind Siliguri', 'Fraunces', sans-serif; background: #F3EEE1; }
// //     .frx-bn-display { font-family: 'Tiro Bangla', serif; }
// //     .frx-display { font-family: 'Fraunces', serif; }
// //     .frx-mono { font-family: 'JetBrains Mono', monospace; }

// //     .frx-perforation {
// //       height: 14px;
// //       background-image: radial-gradient(circle, #F3EEE1 3.5px, transparent 3.6px);
// //       background-size: 18px 100%;
// //       background-position: center;
// //       background-color: #1D2438;
// //     }
// //     .frx-ledger-row dt::after {
// //       content: '';
// //       flex: 1 1 auto;
// //       border-bottom: 1.5px dotted #C9BFA6;
// //       margin: 0 8px;
// //       transform: translateY(-4px);
// //     }
// //     .frx-roster-item { border-left: 3px solid transparent; }
// //     .frx-roster-item.is-active { border-left-color: #A9752B; }
// //     .frx-scrollbar::-webkit-scrollbar { width: 6px; }
// //     .frx-scrollbar::-webkit-scrollbar-thumb { background: #D9CDA9; border-radius: 999px; }
// //     .frx-scrollbar::-webkit-scrollbar-track { background: transparent; }
// //   `}</style>
// // );

// // function FinalResult() {
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [selectedStudent, setSelectedStudent] = useState(null);
// //   const [allStudents, setAllStudents] = useState([]);
// //   const [termSubjectsMap, setTermSubjectsMap] = useState({});
// //   const [subjectsLoading, setSubjectsLoading] = useState(false);
// //   const resultRef = useRef(null);

// //   useEffect(() => {
// //     fetchAllData();
// //   }, []);

// //   const fetchAllData = async () => {
// //     try {
// //       setLoading(true);
// //       const finalResultResponse = await axios.get(`${API_BASE_URL}/final-result`, {
// //         params: { limit: 500 },
// //       });

// //       if (finalResultResponse.data.success) {
// //         setAllStudents(finalResultResponse.data.data || []);
// //       }
// //       setLoading(false);
// //     } catch (err) {
// //       console.error('Error fetching data:', err);
// //       setError(err.response?.data?.message || 'Failed to fetch data');
// //       setLoading(false);
// //     }
// //   };

// //   // Fetch subject-wise marks for each term's exam result once a student is selected
// //   useEffect(() => {
// //     if (!selectedStudent) return;
// //     let cancelled = false;

// //     const loadSubjects = async () => {
// //       setSubjectsLoading(true);
// //       const entries = await Promise.all(
// //         (selectedStudent.termResults || []).map(async (t) => {
// //           const subjects = await getSubjectMarks(t.examResultId);
// //           return [t.examResultId, subjects];
// //         })
// //       );
// //       if (!cancelled) {
// //         setTermSubjectsMap(Object.fromEntries(entries));
// //         setSubjectsLoading(false);
// //       }
// //     };

// //     loadSubjects();
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [selectedStudent]);

// //   const getSubjectMarks = async (examResultId) => {
// //     try {
// //       const response = await axios.get(`${API_BASE_URL}/exam-results/${examResultId}`);
// //       return response.data?.data?.subjects || [];
// //     } catch (err) {
// //       console.error('Failed to fetch exam result:', err);
// //       return [];
// //     }
// //   };

// //   const getGradeInfo = (marks, fullMarks) => {
// //     const percentage = fullMarks ? (marks / fullMarks) * 100 : 0;
// //     if (percentage >= 80) return { grade: 'A+', gradePoint: 5.0 };
// //     if (percentage >= 70) return { grade: 'A', gradePoint: 4.0 };
// //     if (percentage >= 60) return { grade: 'A-', gradePoint: 3.5 };
// //     if (percentage >= 50) return { grade: 'B', gradePoint: 3.0 };
// //     if (percentage >= 40) return { grade: 'C', gradePoint: 2.0 };
// //     if (percentage >= 33) return { grade: 'D', gradePoint: 1.0 };
// //     return { grade: 'F', gradePoint: 0.0 };
// //   };

// //   const downloadPDF = async () => {
// //     if (!resultRef.current) return;
// //     try {
// //       const canvas = await html2canvas(resultRef.current, {
// //         scale: 2,
// //         useCORS: true,
// //         logging: false,
// //         backgroundColor: '#ffffff',
// //       });
// //       const imgData = canvas.toDataURL('image/png');
// //       const pdf = new jsPDF('p', 'mm', 'a4');
// //       const pdfWidth = pdf.internal.pageSize.getWidth();
// //       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
// //       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
// //       pdf.save(`Final_Result_${selectedStudent?.studentId?.name || 'Student'}.pdf`);
// //     } catch (err) {
// //       console.error('PDF generation failed:', err);
// //       alert('Failed to generate PDF. Please try again.');
// //     }
// //   };

// //   // Merge subject marks across every term into one row-per-subject table
// //   const buildSubjectRows = (result) => {
// //     const rows = {};
// //     let order = 0;
// //     (result.termResults || []).forEach((t) => {
// //       const subs = termSubjectsMap[t.examResultId] || [];
// //       subs.forEach((s) => {
// //         const id = s.subjectId?._id || s.subjectId;
// //         if (!rows[id]) {
// //           rows[id] = {
// //             id,
// //             name: s.subjectId?.name || 'বিষয়',
// //             fullMarks: s.subjectId?.fullMarks || s.fullMarks || 0,
// //             marks: {},
// //             order: order++,
// //           };
// //         }
// //         rows[id].marks[t.term] = s.total;
// //       });
// //     });
// //     return Object.values(rows).sort((a, b) => a.order - b.order);
// //   };

// //   const filteredStudents = useMemo(() => {
// //     const q = searchTerm.toLowerCase();
// //     return allStudents.filter((r) => {
// //       const s = r.studentId || {};
// //       return (
// //         s.name?.toLowerCase().includes(q) ||
// //         s.studentId?.toLowerCase().includes(q)
// //       );
// //     });
// //   }, [allStudents, searchTerm]);

// //   // ---------------------------------------------------------------------
// //   // Loading / error states
// //   // ---------------------------------------------------------------------
// //   if (loading) {
// //     return (
// //       <div className="frx-root min-h-screen flex items-center justify-center">
// //         <FontStyles />
// //         <div className="text-center">
// //           <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#1D2438] border-t-transparent animate-spin" />
// //           <p className="mt-4 text-[#4B5273] frx-mono text-sm tracking-wide">খাতা খোলা হচ্ছে…</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="frx-root min-h-screen flex items-center justify-center">
// //         <FontStyles />
// //         <div className="text-center bg-white border border-[#E4D9BC] rounded-lg px-8 py-6 shadow-sm">
// //           <XCircle className="w-10 h-10 text-[#96342C] mx-auto mb-3" />
// //           <p className="text-lg font-semibold text-[#1D2438]">লোড করা যায়নি</p>
// //           <p className="text-sm text-[#4B5273] mt-1">{error}</p>
// //           <button
// //             onClick={fetchAllData}
// //             className="mt-5 px-5 py-2 bg-[#1D2438] text-white rounded-md text-sm hover:bg-[#2B3555] transition-colors"
// //           >
// //             আবার চেষ্টা করুন
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const subjectRows = selectedStudent ? buildSubjectRows(selectedStudent) : [];
// //   const termNumbers = selectedStudent
// //     ? (selectedStudent.termResults || []).map((t) => t.term).sort((a, b) => a - b)
// //     : [];

// //   return (
// //     <div className="frx-root min-h-screen">
// //       <FontStyles />

// //       {/* Top bar */}
// //       <div className="bg-[#1D2438] text-white">
// //         <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
// //           <div className="flex items-center gap-3">
// //             <GraduationCap className="w-7 h-7 text-[#C79A49]" />
// //             <div>
// //               <p className="frx-bn-display text-xl leading-none">চূড়ান্ত ফলাফল</p>
// //               <p className="frx-mono text-[11px] text-white/50 tracking-widest mt-1">FINAL RESULT LEDGER</p>
// //             </div>
// //           </div>
// //           <div className="flex items-center gap-3 text-xs text-white/70">
// //             <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {filteredStudents.length} শিক্ষার্থী</span>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
// //         {/* ------------------------------------------------------------ */}
// //         {/* Roster panel                                                  */}
// //         {/* ------------------------------------------------------------ */}
// //         <div className="bg-white border border-[#E4D9BC] rounded-lg shadow-sm overflow-hidden h-fit lg:sticky lg:top-6">
// //           <div className="p-4 border-b border-[#EFE7D2]">
// //             <div className="relative">
// //               <Search className="w-4 h-4 text-[#9C927A] absolute left-3 top-1/2 -translate-y-1/2" />
// //               <input
// //                 type="text"
// //                 placeholder="নাম বা আইডি খুঁজুন…"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="w-full pl-9 pr-3 py-2 text-sm border border-[#E4D9BC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C79A49]/40 focus:border-[#C79A49] bg-[#FBF8F0]"
// //               />
// //             </div>
// //           </div>

// //           <div className="max-h-[70vh] overflow-y-auto frx-scrollbar divide-y divide-[#F0E9D6]">
// //             {filteredStudents.length === 0 && (
// //               <p className="text-sm text-[#9C927A] text-center py-10">কোনো শিক্ষার্থী পাওয়া যায়নি</p>
// //             )}
// //             {filteredStudents.map((result) => {
// //               const s = result.studentId || {};
// //               const isActive = selectedStudent?._id === result._id;
// //               const passed = result.overallStatus === 'Pass';
// //               return (
// //                 <button
// //                   key={result._id}
// //                   onClick={() => setSelectedStudent(result)}
// //                   className={`frx-roster-item w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#FBF6E8] transition-colors ${isActive ? 'is-active bg-[#FBF6E8]' : ''}`}
// //                 >
// //                   <div className="w-9 h-9 rounded-full bg-[#1D2438] text-white flex items-center justify-center frx-display text-sm shrink-0">
// //                     {s.name?.charAt(0) || '?'}
// //                   </div>
// //                   <div className="flex-1 min-w-0">
// //                     <p className="text-sm font-semibold text-[#1D2438] truncate">{s.name || 'N/A'}</p>
// //                     <p className="frx-mono text-[11px] text-[#9C927A]">{s.studentId || '—'}</p>
// //                   </div>
// //                   <div className="flex flex-col items-end gap-1 shrink-0">
// //                     <span className="frx-mono text-xs font-semibold text-[#A9752B]">
// //                       {result.cgpa != null ? result.cgpa.toFixed(2) : '—'}
// //                     </span>
// //                     {passed ? (
// //                       <CheckCircle2 className="w-3.5 h-3.5 text-[#2F5D45]" />
// //                     ) : (
// //                       <XCircle className="w-3.5 h-3.5 text-[#96342C]" />
// //                     )}
// //                   </div>
// //                 </button>
// //               );
// //             })}
// //           </div>
// //         </div>

// //         {/* ------------------------------------------------------------ */}
// //         {/* Certificate panel                                             */}
// //         {/* ------------------------------------------------------------ */}
// //         <div>
// //           {!selectedStudent && (
// //             <div className="h-full min-h-[420px] flex items-center justify-center bg-white/60 border border-dashed border-[#D9CDA9] rounded-lg">
// //               <div className="text-center text-[#9C927A]">
// //                 <Layers className="w-8 h-8 mx-auto mb-3" />
// //                 <p className="text-sm">ফলাফল দেখতে বাম পাশ থেকে একজন শিক্ষার্থী নির্বাচন করুন</p>
// //               </div>
// //             </div>
// //           )}

// //           {selectedStudent && (
// //             <>
// //               <div className="flex justify-end mb-3">
// //                 <button
// //                   onClick={downloadPDF}
// //                   className="px-4 py-2 bg-[#A9752B] hover:bg-[#96631F] text-white text-sm rounded-md flex items-center gap-2 transition-colors shadow-sm"
// //                 >
// //                   <Download className="w-4 h-4" />
// //                   পিডিএফ ডাউনলোড
// //                 </button>
// //               </div>

// //               <div ref={resultRef} className="bg-white rounded-lg shadow-md overflow-hidden border border-[#E4D9BC]">
// //                 {/* Letterhead */}
// //                 <div className="bg-[#1D2438] text-white px-8 pt-7 pb-9">
// //                   <div className="flex items-start justify-between gap-4 flex-wrap">
// //                     <div>
// //                       <p className="frx-bn-display text-2xl">{schoolInfo.name}</p>
// //                       <p className="text-xs text-white/60 mt-1">{schoolInfo.address}</p>
// //                       <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-white/50 frx-mono">
// //                         <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{schoolInfo.phone}</span>
// //                         <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{schoolInfo.email}</span>
// //                         <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{schoolInfo.website}</span>
// //                       </div>
// //                     </div>
// //                     <div className="text-right">
// //                       <p className="text-xs text-[#C79A49] tracking-wide">{schoolInfo.motto}</p>
// //                       <p className="frx-mono text-[11px] text-white/50 mt-1">{selectedStudent.sessionId?.name || '—'}</p>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Perforated tear line */}
// //                 <div className="frx-perforation" />

// //                 {/* Body */}
// //                 <div className="px-8 pt-8 pb-8">
// //                   {/* Student + seal row */}
// //                   <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
// //                     <div className="grid grid-cols-2 gap-x-8 gap-y-3">
// //                       <div>
// //                         <p className="text-[11px] text-[#9C927A] tracking-wide">শিক্ষার্থীর নাম</p>
// //                         <p className="frx-display text-lg text-[#1D2438]">{selectedStudent.studentId?.name || 'N/A'}</p>
// //                       </div>
// //                       <div>
// //                         <p className="text-[11px] text-[#9C927A] tracking-wide">শিক্ষার্থী আইডি</p>
// //                         <p className="frx-mono text-sm text-[#1D2438] mt-1">{selectedStudent.studentId?.studentId || 'N/A'}</p>
// //                       </div>
// //                       <div>
// //                         <p className="text-[11px] text-[#9C927A] tracking-wide">শ্রেণি / গ্রুপ</p>
// //                         <p className="text-sm text-[#1D2438] mt-1">{selectedStudent.classGroupId?.name || 'N/A'}</p>
// //                       </div>
// //                       <div>
// //                         <p className="text-[11px] text-[#9C927A] tracking-wide">মার্জ পদ্ধতি</p>
// //                         <p className="text-sm text-[#1D2438] mt-1">{selectedStudent.mergeStrategy || 'N/A'}</p>
// //                       </div>
// //                     </div>

// //                     {/* Wax-seal CGPA badge */}
// //                     <div className="relative shrink-0 mx-auto">
// //                       <div
// //                         className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg"
// //                         style={{ background: 'radial-gradient(circle at 35% 30%, #E0B978, #A9752B 70%)' }}
// //                       >
// //                         <span className="frx-display text-2xl text-white leading-none">
// //                           {selectedStudent.cgpa != null ? selectedStudent.cgpa.toFixed(2) : '—'}
// //                         </span>
// //                         <span className="frx-mono text-[9px] text-white/80 tracking-[0.2em] mt-1">CGPA</span>
// //                       </div>
// //                       <div
// //                         className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-semibold frx-mono tracking-wide shadow ${
// //                           selectedStudent.overallStatus === 'Pass'
// //                             ? 'bg-[#2F5D45] text-white'
// //                             : 'bg-[#96342C] text-white'
// //                         }`}
// //                       >
// //                         {selectedStudent.overallStatus === 'Pass' ? 'PASS' : 'FAIL'}
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* Term summary — dot-leader ledger rows */}
// //                   <div className="mb-8">
// //                     <p className="text-[11px] tracking-wide text-[#9C927A] mb-2">টার্ম অনুযায়ী ফলাফল</p>
// //                     <dl className="border-t border-[#EFE7D2]">
// //                       {(selectedStudent.termResults || []).map((t) => (
// //                         <div key={t.term} className="frx-ledger-row flex items-baseline py-2 border-b border-[#EFE7D2]">
// //                           <dt className="flex-1 flex items-baseline text-sm text-[#4B5273]">
// //                             <span>টার্ম {t.term} · {t.examId?.name || '—'}</span>
// //                           </dt>
// //                           <dd className="frx-mono text-sm font-semibold text-[#1D2438]">
// //                             GPA {t.gpa != null ? t.gpa.toFixed(2) : '—'}
// //                           </dd>
// //                         </div>
// //                       ))}
// //                     </dl>
// //                   </div>

// //                   {/* Subject-wise table */}
// //                   <div>
// //                     <p className="text-[11px] tracking-wide text-[#9C927A] mb-2">বিষয়ভিত্তিক নম্বর</p>
// //                     <div className="overflow-x-auto rounded-md border border-[#EFE7D2]">
// //                       <table className="min-w-full text-sm">
// //                         <thead className="bg-[#FBF6E8]">
// //                           <tr className="text-[#4B5273] text-xs">
// //                             <th className="px-4 py-2 text-left font-medium">বিষয়</th>
// //                             {termNumbers.map((tn) => (
// //                               <th key={tn} className="px-4 py-2 text-center font-medium frx-mono">T{tn}</th>
// //                             ))}
// //                             <th className="px-4 py-2 text-center font-medium">পূর্ণমান</th>
// //                             <th className="px-4 py-2 text-center font-medium">গড়</th>
// //                             <th className="px-4 py-2 text-center font-medium">গ্রেড</th>
// //                           </tr>
// //                         </thead>
// //                         <tbody className="divide-y divide-[#F0E9D6]">
// //                           {subjectsLoading && (
// //                             <tr>
// //                               <td colSpan={termNumbers.length + 4} className="px-4 py-6 text-center text-[#9C927A] text-xs">
// //                                 নম্বর লোড হচ্ছে…
// //                               </td>
// //                             </tr>
// //                           )}
// //                           {!subjectsLoading && subjectRows.length === 0 && (
// //                             <tr>
// //                               <td colSpan={termNumbers.length + 4} className="px-4 py-6 text-center text-[#9C927A] text-xs">
// //                                 বিষয়ভিত্তিক নম্বর পাওয়া যায়নি
// //                               </td>
// //                             </tr>
// //                           )}
// //                           {!subjectsLoading && subjectRows.map((subject) => {
// //                             const marksPresent = termNumbers
// //                               .map((tn) => subject.marks[tn])
// //                               .filter((v) => typeof v === 'number');
// //                             const average = marksPresent.length
// //                               ? marksPresent.reduce((a, b) => a + b, 0) / marksPresent.length
// //                               : 0;
// //                             const gradeInfo = getGradeInfo(average, subject.fullMarks);
// //                             return (
// //                               <tr key={subject.id} className="hover:bg-[#FBF8F0]">
// //                                 <td className="px-4 py-2 font-medium text-[#1D2438]">{subject.name}</td>
// //                                 {termNumbers.map((tn) => (
// //                                   <td key={tn} className="px-4 py-2 text-center frx-mono text-[#4B5273]">
// //                                     {typeof subject.marks[tn] === 'number' ? subject.marks[tn] : '—'}
// //                                   </td>
// //                                 ))}
// //                                 <td className="px-4 py-2 text-center frx-mono text-[#9C927A]">{subject.fullMarks}</td>
// //                                 <td className="px-4 py-2 text-center frx-mono font-semibold text-[#1D2438]">
// //                                   {average.toFixed(1)}
// //                                 </td>
// //                                 <td className="px-4 py-2 text-center font-semibold text-[#A9752B]">{gradeInfo.grade}</td>
// //                               </tr>
// //                             );
// //                           })}
// //                         </tbody>
// //                       </table>
// //                     </div>
// //                   </div>

// //                   {/* Footer */}
// //                   <div className="mt-8 pt-4 border-t border-[#EFE7D2] flex items-center justify-between text-[11px] text-[#9C927A]">
// //                     <span>{selectedStudent.isPublished ? '✓ প্রকাশিত' : 'অপ্রকাশিত খসড়া'}</span>
// //                     <span className="frx-mono">
// //                       Generated {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default FinalResult;

// // import React, { useRef, useState, useEffect } from 'react';
// // import axios from 'axios';
// // import html2canvas from 'html2canvas';
// // import jsPDF from 'jspdf';

// // // School Information
// // const schoolInfo = {
// //   name: "বাওনিয়া উচ্চ বিদ্যালয়",
// //   address: "বাউনিয়া মেইন রোড, ঢাকা ২৮৭৬। ",
// //   phone: "০১৯৮০৪৭৬০১১",
// //   email: "support@baoniyaschool.com",
// //   logo: "🏫",
// //   motto: "শিক্ষাই আলো",
// //   website: "www.bajhs.edu.bd"
// // };

// // // API Base URL - Update with your actual API URL
// // const API_BASE_URL = import.meta.env.VITE_REACT_APP_ROOT;

// // function FinalResult() {
// //   const [finalResults, setFinalResults] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [selectedStudent, setSelectedStudent] = useState(null);
// //   const [examDetails, setExamDetails] = useState({});
// //   const [allStudents, setAllStudents] = useState([]);
// //   const resultRef = useRef(null);

// //   // Fetch all necessary data
// //   useEffect(() => {
// //     fetchAllData();
// //   }, []);

// //   const fetchAllData = async () => {
// //     try {
// //       setLoading(true);
      
// //       // Fetch final results
// //       const finalResultResponse = await axios.get(`${API_BASE_URL}/final-result`, {
// //         params: { limit: 500 }
// //       });
// //       console.log(finalResultResponse, "final reslt response")
// //       if (finalResultResponse.data.success) {
// //         setFinalResults(finalResultResponse.data.data);
        
// //         // Fetch student details for each final result
// //         const studentPromises = finalResultResponse.data.data.map(async (result) => {
// //           console.log(result.studentId)
// //           try {
// //             const studentResponse = await axios.get(`${API_BASE_URL}/student/${result.studentId._id}`);
// //             return {
// //               ...result,
// //               studentDetails: studentResponse.data.data
// //             };
// //           } catch (err) {
// //             console.error(`Failed to fetch student ${result.studentId}:`, err);
// //             return result;
// //           }
// //         });
        
// //         const studentsWithDetails = await Promise.all(studentPromises);
// //         setAllStudents(studentsWithDetails);
// //       }
      
// //       setLoading(false);
// //     } catch (err) {
// //       console.error('Error fetching data:', err);
// //       setError(err.response?.data?.message || 'Failed to fetch data');
// //       setLoading(false);
// //     }
// //   };

// //   // Get student details
// //   const getStudentInfo = (result) => {
// //     const student = result.studentDetails || {};
// //     return {
// //       name: student.name || result.studentId || 'N/A',
// //       id: student.studentId || 'N/A',
// //       class: student.classId || 'N/A',
// //       section: student.sectionId || 'N/A',
// //       roll: student.roll || 'N/A'
// //     };
// //   };

// //   // Calculate grade and grade point
// //   const getGradeInfo = (marks, fullMarks) => {
// //     const percentage = (marks / fullMarks) * 100;
// //     if (percentage >= 80) return { grade: 'A+', gradePoint: 5.0, status: 'Pass' };
// //     if (percentage >= 70) return { grade: 'A', gradePoint: 4.0, status: 'Pass' };
// //     if (percentage >= 60) return { grade: 'A-', gradePoint: 3.5, status: 'Pass' };
// //     if (percentage >= 50) return { grade: 'B', gradePoint: 3.0, status: 'Pass' };
// //     if (percentage >= 40) return { grade: 'C', gradePoint: 2.0, status: 'Pass' };
// //     if (percentage >= 33) return { grade: 'D', gradePoint: 1.0, status: 'Pass' };
// //     return { grade: 'F', gradePoint: 0.0, status: 'Fail' };
// //   };

// //   // PDF Download Function
// //   const downloadPDF = async () => {
// //     if (!resultRef.current) return;
    
// //     try {
// //       const canvas = await html2canvas(resultRef.current, {
// //         scale: 2,
// //         useCORS: true,
// //         logging: false,
// //         backgroundColor: '#ffffff'
// //       });
      
// //       const imgData = canvas.toDataURL('image/png');
// //       const pdf = new jsPDF('p', 'mm', 'a4');
// //       const pdfWidth = pdf.internal.pageSize.getWidth();
// //       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
// //       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
// //       pdf.save(`Final_Result_${selectedStudent?.studentDetails?.name || 'Student'}.pdf`);
// //     } catch (error) {
// //       console.error('PDF generation failed:', error);
// //       alert('Failed to generate PDF. Please try again.');
// //     }
// //   };

// //   // Get subject marks from term results
// //   const getSubjectMarks = async (examResultId) => {
// //     try {
// //       const response = await axios.get(`${API_BASE_URL}/exam-results/${examResultId}`);
// //       return response.data.data.subjects || [];
// //     } catch (err) {
// //       console.error('Failed to fetch exam result:', err);
// //       return [];
// //     }
// //   };

// //   // Render Final Result Card
// //   const renderFinalResultCard = (result) => {
// //     const studentInfo = getStudentInfo(result);
// //     const termResults = result.termResults || [];
// //     const overallGPA = result.cgpa || 0;
// //     const overallStatus = result.overallStatus || 'N/A';

// //     // Sample subject data - in real scenario, fetch from exam results
// //     const subjects = [
// //       { name: 'বাংলা', term1: 165, term2: 150, fullMarks: 200 },
// //       { name: 'গণিত', term1: 80, term2: 87, fullMarks: 100 },
// //       { name: 'তথ্য ও যোগাযোগ প্রযুক্তি', term1: 35, term2: 37, fullMarks: 50 },
// //       { name: 'ইংরেজি', term1: 140, term2: 160, fullMarks: 200 },
// //       { name: 'বিজ্ঞান', term1: 75, term2: 82, fullMarks: 100 },
// //     ];

// //     return (
// //       <div ref={resultRef} className="bg-white p-8 max-w-5xl mx-auto shadow-xl rounded-lg">
// //         {/* School Header */}
// //         <div className="border-b-4 border-blue-600 pb-4 mb-6">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center gap-4">
// //               <div className="text-6xl">{schoolInfo.logo}</div>
// //               <div>
// //                 <h1 className="text-3xl font-bold text-blue-800">{schoolInfo.name}</h1>
// //                 <p className="text-sm text-gray-600">{schoolInfo.address}</p>
// //                 <p className="text-sm text-gray-600">📞 {schoolInfo.phone} | ✉️ {schoolInfo.email}</p>
// //                 <p className="text-sm text-gray-600">🌐 {schoolInfo.website}</p>
// //               </div>
// //             </div>
// //             <div className="text-right">
// //               <p className="text-sm font-semibold text-gray-700">{schoolInfo.motto}</p>
// //               <div className="mt-2 text-xs text-gray-500">Session: {result.sessionId || '2026'}</div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Student Info */}
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
// //           <div>
// //             <p className="text-sm text-gray-600">Student Name</p>
// //             <p className="text-xl font-bold text-gray-800">{studentInfo.name}</p>
// //           </div>
// //           <div>
// //             <p className="text-sm text-gray-600">Student ID</p>
// //             <p className="text-xl font-bold text-gray-800">{studentInfo.id}</p>
// //           </div>
// //           <div>
// //             <p className="text-sm text-gray-600">Class</p>
// //             <p className="text-lg font-semibold text-gray-800">{studentInfo.class}</p>
// //           </div>
// //           <div>
// //             <p className="text-sm text-gray-600">Section</p>
// //             <p className="text-lg font-semibold text-gray-800">{studentInfo.section}</p>
// //           </div>
// //         </div>

// //         {/* Overall Result Summary */}
// //         <div className="grid grid-cols-3 gap-4 mb-6">
// //           <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
// //             <p className="text-sm text-gray-600">Total GPA</p>
// //             <p className="text-3xl font-bold text-blue-700">{overallGPA.toFixed(2)}</p>
// //           </div>
// //           <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
// //             <p className="text-sm text-gray-600">Overall Status</p>
// //             <span className={`text-xl font-bold px-4 py-2 rounded-full ${
// //               overallStatus === 'Pass' 
// //                 ? 'text-green-700' 
// //                 : 'text-red-700'
// //             }`}>
// //               {overallStatus}
// //             </span>
// //           </div>
// //           <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
// //             <p className="text-sm text-gray-600">Merge Strategy</p>
// //             <p className="text-lg font-semibold text-purple-700">{result.mergeStrategy || 'N/A'}</p>
// //           </div>
// //         </div>

// //         {/* Term Results Summary */}
// //         <div className="mb-6">
// //           <h3 className="text-lg font-semibold text-gray-800 mb-3">Term Results Summary</h3>
// //           <div className="grid grid-cols-2 gap-4">
// //             {termResults.map((term, index) => (
// //               <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
// //                 <p className="text-sm text-gray-600">Term {term.term}</p>
// //                 <p className="text-xl font-bold text-blue-700">GPA: {term.gpa?.toFixed(2) || 'N/A'}</p>
// //                 <p className="text-xs text-gray-500">Exam: {term.examId || 'N/A'}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Subject-wise Detailed Marks */}
// //         <div className="overflow-x-auto">
// //           <h3 className="text-lg font-semibold text-gray-800 mb-3">Subject-wise Marks (Term 1 & 2)</h3>
// //           <table className="min-w-full divide-y divide-gray-200 border">
// //             <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
// //               <tr>
// //                 <th className="px-4 py-3 text-left text-sm font-semibold">SL</th>
// //                 <th className="px-4 py-3 text-left text-sm font-semibold">Subject</th>
// //                 <th className="px-4 py-3 text-center text-sm font-semibold">Term 1</th>
// //                 <th className="px-4 py-3 text-center text-sm font-semibold">Term 2</th>
// //                 <th className="px-4 py-3 text-center text-sm font-semibold">Total</th>
// //                 <th className="px-4 py-3 text-center text-sm font-semibold">Full Marks</th>
// //                 <th className="px-4 py-3 text-center text-sm font-semibold">Average</th>
// //                 <th className="px-4 py-3 text-center text-sm font-semibold">Grade</th>
// //                 <th className="px-4 py-3 text-center text-sm font-semibold">GP</th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {subjects.map((subject, index) => {
// //                 const total = subject.term1 + subject.term2;
// //                 const average = total / 2;
// //                 const gradeInfo = getGradeInfo(average, subject.fullMarks);
                
// //                 return (
// //                   <tr key={index} className="hover:bg-gray-50">
// //                     <td className="px-4 py-2 text-sm text-gray-600">{index + 1}</td>
// //                     <td className="px-4 py-2 text-sm font-medium text-gray-800">
// //                       {subject.name}
// //                     </td>
// //                     <td className="px-4 py-2 text-sm text-center text-gray-700">{subject.term1}</td>
// //                     <td className="px-4 py-2 text-sm text-center text-gray-700">{subject.term2}</td>
// //                     <td className="px-4 py-2 text-sm text-center font-semibold text-blue-700">
// //                       {total}
// //                     </td>
// //                     <td className="px-4 py-2 text-sm text-center text-gray-700">{subject.fullMarks}</td>
// //                     <td className="px-4 py-2 text-sm text-center font-semibold">
// //                       {average.toFixed(1)}
// //                     </td>
// //                     <td className="px-4 py-2 text-sm text-center font-semibold text-blue-700">
// //                       {gradeInfo.grade}
// //                     </td>
// //                     <td className="px-4 py-2 text-sm text-center">
// //                       {gradeInfo.gradePoint.toFixed(1)}
// //                     </td>
// //                   </tr>
// //                 );
// //               })}
// //             </tbody>
// //             <tfoot className="bg-gray-50">
// //               <tr>
// //                 <td colSpan="8" className="px-4 py-3 text-right font-semibold text-gray-700">
// //                   Overall GPA:
// //                 </td>
// //                 <td className="px-4 py-3 text-center font-bold text-blue-700 text-lg">
// //                   {overallGPA.toFixed(2)}
// //                 </td>
// //               </tr>
// //             </tfoot>
// //           </table>
// //         </div>

// //         {/* Additional Information */}
// //         <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
// //           <div>
// //             <p className="text-gray-600">📅 Result Published: {result.isPublished ? '✅ Yes' : '❌ No'}</p>
// //             <p className="text-gray-600">📋 Merge Strategy: {result.mergeStrategy || 'N/A'}</p>
// //           </div>
// //           <div className="text-right">
// //             <p className="text-gray-600">Generated: {new Date().toLocaleDateString('en-BD', { 
// //               day: 'numeric', 
// //               month: 'long', 
// //               year: 'numeric' 
// //             })}</p>
// //           </div>
// //         </div>

// //         {/* Footer */}
// //         <div className="mt-6 pt-4 border-t-2 border-gray-200 text-center">
// //           <p className="text-xs text-gray-400">
// //             This is a computer-generated final result. {schoolInfo.name}
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Loading State
// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center min-h-screen">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Loading final results...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Error State
// //   if (error) {
// //     return (
// //       <div className="flex justify-center items-center min-h-screen">
// //         <div className="text-center text-red-600">
// //           <p className="text-2xl font-bold">❌ Error</p>
// //           <p>{error}</p>
// //           <button 
// //             onClick={fetchAllData}
// //             className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// //           >
// //             Retry
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Filter students
// //   const filteredStudents = allStudents.filter(result => {
// //     const student = result.studentDetails || {};
// //     const searchLower = searchTerm.toLowerCase();
// //     return (
// //       student.name?.toLowerCase().includes(searchLower) ||
// //       student.studentId?.toLowerCase().includes(searchLower) ||
// //       student.roll?.toLowerCase().includes(searchLower)
// //     );
// //   });

// //   return (
// //     <div className="container mx-auto p-4">
// //       <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
// //         🎓 Final Result Cards
// //       </h1>

// //       {/* Search and Stats */}
// //       <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-lg">
// //         <div className="flex-1 min-w-[200px]">
// //           <input
// //             type="text"
// //             placeholder="🔍 Search by name, ID or roll..."
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           />
// //         </div>
// //         <div className="flex gap-4 text-sm">
// //           <span className="bg-blue-100 px-4 py-2 rounded-full text-blue-700">
// //             📊 Total: {filteredStudents.length}
// //           </span>
// //           <span className="bg-green-100 px-4 py-2 rounded-full text-green-700">
// //             ✅ Pass: {filteredStudents.filter(s => s.overallStatus === 'Pass').length}
// //           </span>
// //         </div>
// //       </div>

// //       {/* Student Grid */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
// //         {filteredStudents.map((result) => {
// //           const student = result.studentDetails || {};
// //           return (
// //             <div
// //               key={result._id}
// //               className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-xl ${
// //                 selectedStudent?._id === result._id 
// //                   ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg' 
// //                   : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
// //               }`}
// //               onClick={() => setSelectedStudent(result)}
// //             >
// //               <div className="flex items-center gap-3">
// //                 <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
// //                   {student.name?.charAt(0) || 'S'}
// //                 </div>
// //                 <div className="flex-1 min-w-0">
// //                   <p className="font-semibold text-gray-800 truncate">{student.name || 'N/A'}</p>
// //                   <p className="text-sm text-gray-600">ID: {student.studentId || 'N/A'}</p>
// //                   <div className="flex items-center gap-2 mt-1 flex-wrap">
// //                     <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
// //                       CGPA: {result.cgpa?.toFixed(2) || 'N/A'}
// //                     </span>
// //                     <span className={`text-xs px-2 py-1 rounded ${
// //                       result.overallStatus === 'Pass' 
// //                         ? 'bg-green-100 text-green-700' 
// //                         : 'bg-red-100 text-red-700'
// //                     }`}>
// //                       {result.overallStatus || 'N/A'}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {/* Selected Student's Final Result Card */}
// //       {selectedStudent && (
// //         <div className="mt-8">
// //           <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
// //             <h2 className="text-2xl font-bold text-gray-800">
// //               📄 Final Result: {selectedStudent.studentDetails?.name}
// //             </h2>
// //             <button
// //               onClick={downloadPDF}
// //               className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center gap-2 shadow-lg"
// //             >
// //               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
// //                   d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
// //               </svg>
// //               📥 Download PDF
// //             </button>
// //           </div>
// //           {renderFinalResultCard(selectedStudent)}
// //         </div>
// //       )}

// //       {/* No Selection Message */}
// //       {!selectedStudent && filteredStudents.length > 0 && (
// //         <div className="text-center py-12 bg-gray-50 rounded-lg">
// //           <p className="text-xl text-gray-500">
// //             👆 Click on a student to view their final result card
// //           </p>
// //         </div>
// //       )}

// //       {/* No Results Message */}
// //       {filteredStudents.length === 0 && (
// //         <div className="text-center py-12 bg-gray-50 rounded-lg">
// //           <p className="text-xl text-gray-500">
// //             😕 No students found matching your search
// //           </p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default FinalResult;