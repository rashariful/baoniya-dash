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
import CoverPage from '../FinalResult/CoverPage';
import ResultCardSwitcher from '../FinalResult/Resultcards';

const schoolInfo = {
  name: 'বাউনিয়া আবদুল জলিল উচ্চ বিদ্যালয়।',
  address: 'বাউনিয়া মেইন রোড, বাউনিয়া, তুরাগ ,ঢাকা-২৮৭৬। ',
  phone: '০১৩০৯১০৮১৯৬',
  email: 'baj2highschool@gmail.com',
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

 function FinalResultPage() {
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
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-primabg-primary border-t-transparent animate-spin" />
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
          <p className="text-lg font-semibold text-primabg">লোড করা যায়নি</p>
          <p className="text-sm text-[#4B5273] mt-1">{error}</p>
          <button
            onClick={fetchAllData}
            className="mt-5 px-5 py-2 bg-primary text-white rounded-md text-sm hover:bg-[#2B3555] transition-colors"
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
      <div className="bg-primary rounded-md text-white">
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
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center frx-display text-sm shrink-0">
                    {s.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primabg-primary truncate">{s.name || 'N/A'}</p>
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
                  <div className="bg-primary text-white px-8 pt-7 pb-9">
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
                          <p className="frx-display text-lg text-primabg-primary">{selectedStudent.studentId?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#9C927A] tracking-wide">শিক্ষার্থী আইডি</p>
                          <p className="frx-mono text-sm text-primabg-primary mt-1">{selectedStudent.studentId?.studentId || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#9C927A] tracking-wide">শ্রেণি / গ্রুপ</p>
                          <p className="text-sm text-primabg-primary mt-1">{selectedStudent.classGroupId?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#9C927A] tracking-wide">মার্জ পদ্ধতি</p>
                          <p className="text-sm text-primabg-primary mt-1">{selectedStudent.mergeStrategy || 'N/A'}</p>
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

export default  FinalResultPage