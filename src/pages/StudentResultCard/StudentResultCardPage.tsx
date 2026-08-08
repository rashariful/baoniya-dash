import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useGetAllExamResultQuery } from "@/redux/api/examResultApi";
import { useGetAllClassesQuery } from "@/redux/api/classesApi";
import { useGetAllSectionQuery } from "@/redux/api/sectionApi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from "@/assets/logo.jpeg"

// ★ Theme map — brand color (emerald green + golden yellow) ব্যবহার করা হচ্ছে,
// পুরো ওয়েবসাইটের সাথে consistent রাখার জন্য।
// Primary: Emerald Green #033320 | Secondary: Golden Yellow #CF962C | Accent: #014B27
const THEMES = {
  brand: {
    gradientHeader: 'from-[#033320] to-[#014B27]',
    gradientHeaderBar: 'from-[#033320] to-[#02291a]',
    text: 'text-[#033320]',
    textStrong: 'from-[#033320] to-[#014B27]',
    bgSoft: 'from-[#f0f9f4] to-gray-50',
    bgSofter: 'from-[#e6f4ec] to-[#d9efe3]',
    border: 'border-[#c9e4d4]',
    borderDashed: 'border-[#a8d4bb]',
    ring: 'focus:ring-[#CF962C]',
    chipBg: 'bg-[#e6f4ec] text-[#033320]',
    badge: 'bg-[#033320]',
    btnGradient: 'from-[#033320] to-[#014B27]',
    selectedBorder: 'border-[#033320]',
    selectedBg: 'from-[#f0f9f4] to-white',
    hoverBorder: 'hover:border-[#CF962C]',
    hoverRow: 'hover:bg-[#f0f9f4]',
    avatarGradient: 'from-[#033320] to-[#014B27]',
  },
};

const PAGE_SIZE = 20;

// 🔥 Captured card er fixed width — html2canvas ke off-screen e o
// thik ei width e render korte bolar jonno (max-w-5xl ~ 1024px)
const CARD_CAPTURE_WIDTH = 1024;

function StudentResultCard() {
  // ★ All hooks must be called at the top level, in the same order every time
  const { data, isLoading, isError, error } = useGetAllExamResultQuery();
  const { data: classData } = useGetAllClassesQuery([{ name: "limit", value: 100 }]);
  const { data: sectionData } = useGetAllSectionQuery([{ name: "limit", value: 500 }]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // ★ The card we're currently generating a PDF/print for (rendered off-screen)
  const [processingResult, setProcessingResult] = useState(null);
  const [processingAction, setProcessingAction] = useState(null); // 'pdf' | 'print' | null
  const resultRef = useRef(null);

  // ★ School Information
  const schoolInfo = {
    name: "বাওনিয়া উচ্চ বিদ্যালয়",
    address: "বাউনিয়া মেইন রোড, বাউনিয়া, তুরাগ ,ঢাকা-২৮৭৬। ",
    phone: "০১৩০৯১০৮১৯৬",
    email: "baj2highschool@gmail.com",
    logo: logo,
    motto: "শিক্ষাই আলো",
  };

  const t = THEMES.brand;

  // ★ Memoized values — ALL hooks (including these) must stay above any early return
  const classNameMap = useMemo(() => {
    const map = {};
    (classData?.data || []).forEach((cls) => {
      map[cls._id] = cls.name;
    });
    return map;
  }, [classData]);

  const sectionNameMap = useMemo(() => {
    const map = {};
    (sectionData?.data || []).forEach((sec) => {
      map[sec._id] = sec.name;
    });
    return map;
  }, [sectionData]);

  const examResults = data?.data || [];

  const filteredResults = useMemo(() => {
    return examResults.filter((result) => {
      const name = result.studentId?.name?.toLowerCase() || '';
      const id = result.studentId?.studentId?.toLowerCase() || '';
      const classId = result.studentId?.classId || '';
      const sectionId = result.studentId?.sectionId || '';
      const status = result.overallStatus || '';

      const matchSearch =
        name.includes(searchTerm.toLowerCase()) ||
        id.includes(searchTerm.toLowerCase());

      const matchClass = selectedClassId ? classId === selectedClassId : true;
      const matchSection = selectedSectionId ? sectionId === selectedSectionId : true;

      let matchStatus = true;
      if (statusFilter === 'Pass') matchStatus = status === 'Pass';
      else if (statusFilter === 'Fail') matchStatus = status === 'Fail';
      else if (statusFilter === 'Absent') matchStatus = status === 'Absent';

      return matchSearch && matchClass && matchSection && matchStatus;
    });
  }, [examResults, searchTerm, selectedClassId, selectedSectionId, statusFilter]);

  // ★ Reset to page 1 whenever filters change, so you don't get stuck on an empty page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedClassId, selectedSectionId, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE));

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredResults.slice(start, start + PAGE_SIZE);
  }, [filteredResults, currentPage]);

  // ★ Loading and Error states - safely AFTER every hook
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#033320]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Error: {error?.data?.message || 'Failed to fetch data'}
      </div>
    );
  }

  // Get student info
  const getStudentInfo = (result) => ({
    name: result.studentId?.name || 'N/A',
    id: result.studentId?.studentId || 'N/A',
    className: classNameMap[result.studentId?.classId] || result.studentId?.classId || 'N/A',
    section: sectionNameMap[result.studentId?.sectionId] || result.studentId?.sectionId || 'N/A',
    exam: result.examId?.name || 'N/A',
    session: result.sessionId?.year || 'N/A',
    gpa: result.gpa ?? 0,
    overallStatus: result.overallStatus || 'N/A',
    subjects: result.subjects || []
  });

  // ★ Wait one paint cycle so the off-screen card has actually rendered
  // with the new `processingResult` before we try to snapshot it.
  const waitForRender = () =>
    new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  // ★ Triggered by the row's "Download PDF" button
  const handleDownloadPDF = async (result) => {
    setProcessingAction('pdf');
    setProcessingResult(result);
    await waitForRender();

    if (!resultRef.current) {
      setProcessingResult(null);
      setProcessingAction(null);
      return;
    }

    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        // 🔥 Fixed capture window so layout doesn't collapse/shrink off-screen
        windowWidth: CARD_CAPTURE_WIDTH,
        width: CARD_CAPTURE_WIDTH,
        // 🔥 html2canvas doesn't support backdrop-filter / bg-clip-text well —
        // strip those out on the CLONE only (screen version stays untouched)
        onclone: (clonedDoc) => {
          const clone = clonedDoc.getElementById('print-result-card');
          if (!clone) return;
          clone.querySelectorAll('.pdf-safe-text').forEach((el) => {
            el.style.background = 'none';
            el.style.webkitBackgroundClip = 'unset';
            el.style.backgroundClip = 'unset';
            el.style.webkitTextFillColor = 'unset';
            el.style.color = '#033320';
          });
          clone.querySelectorAll('.pdf-safe-blur').forEach((el) => {
            el.style.backdropFilter = 'none';
            el.style.webkitBackdropFilter = 'none';
            el.style.backgroundColor = 'rgba(255,255,255,0.25)';
          });
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Result_${result.studentId?.name || 'Student'}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setProcessingResult(null);
      setProcessingAction(null);
    }
  };

  // ★ Triggered by the row's "Print" button — opens the browser print dialog
  // scoped to just this student's card via a temporary print-only class.
  const handlePrint = async (result) => {
    setProcessingAction('print');
    setProcessingResult(result);
    await waitForRender();

    window.print();

    setProcessingResult(null);
    setProcessingAction(null);
  };

  // Render Result Card (used for both PDF capture and print)
  const renderResultCard = (result) => {
    const info = getStudentInfo(result);

    return (
      <div
        ref={resultRef}
        style={{ width: CARD_CAPTURE_WIDTH }}
        className="bg-white p-8 mx-auto rounded-2xl border border-gray-100"
      >
        {/* School Header */}
        <div className={`bg-gradient-to-r ${t.gradientHeader} -mx-8 -mt-8 px-8 py-6 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* pdf-safe-blur: backdrop-blur is stripped for the PDF clone (see onclone) */}
              <div className="pdf-safe-blur text-5xl bg-white/20 p-1 rounded-xl backdrop-blur-sm">
                <img src={schoolInfo.logo} className='h-12 w-12 rounded-md object-cover' alt="" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{schoolInfo.name}</h1>
                <p className="text-white/80 text-sm">{schoolInfo.address}</p>
                <p className="text-white/80 text-sm">📞 {schoolInfo.phone} | ✉️ {schoolInfo.email}</p>
              </div>
            </div>
            <div className="text-right text-white">
              <p className="text-sm font-semibold text-white/80">{schoolInfo.motto}</p>
              <div className="mt-2 text-xs bg-white/20 px-3 py-1 rounded-full">
                Academic Year: {info.session}
              </div>
            </div>
          </div>
        </div>

        {/* Student Info Card */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 my-6 bg-gradient-to-br ${t.bgSoft} p-6 rounded-xl border ${t.border}`}>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Student Name</p>
            <p className="text-lg font-bold text-gray-800">{info.name}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Student ID</p>
            <p className="text-lg font-bold text-gray-800">{info.id}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Class</p>
            <p className={`text-lg font-bold ${t.text}`}>{info.className}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Section</p>
            <p className={`text-lg font-bold ${t.text}`}>{info.section}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Exam</p>
            <p className={`text-lg font-bold ${t.text}`}>{info.exam}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm col-span-2">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Overall Status</p>
            <span className={`mt-1 inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
              info.overallStatus === 'Pass'
                ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md'
                : info.overallStatus === 'Absent'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md'
                : 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-md'
            }`}>
              {info.overallStatus}
            </span>
          </div>
        </div>

        {/* GPA Display — pdf-safe-text: gradient-clip text is stripped for the PDF clone (renders solid green instead) */}
        <div className="text-center my-6">
          <div className={`inline-block bg-gradient-to-br ${t.bgSofter} px-10 py-4 rounded-2xl shadow-md border ${t.border}`}>
            <p className={`text-sm ${t.text} font-semibold uppercase tracking-wider`}>Grade Point Average (GPA)</p>
            <p className={`pdf-safe-text text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${t.textStrong}`}>
              {Number(info.gpa).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Subjects Table */}
        {info.subjects.length > 0 ? (
          <div className={`overflow-x-auto rounded-xl border ${t.border} shadow-sm`}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className={`bg-gradient-to-r ${t.gradientHeaderBar} text-white`}>
                  <th className="px-4 py-3 text-left text-sm font-bold">SL</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">Subject</th>
                  <th className="px-4 py-3 text-center text-sm font-bold">Written</th>
                  <th className="px-4 py-3 text-center text-sm font-bold">MCQ</th>
                  <th className="px-4 py-3 text-center text-sm font-bold">CA</th>
                  <th className="px-4 py-3 text-center text-sm font-bold">Practical</th>
                  <th className="px-4 py-3 text-center text-sm font-bold">Total</th>
                  <th className="px-4 py-3 text-center text-sm font-bold">Full Marks</th>
                  <th className="px-4 py-3 text-center text-sm font-bold">Grade</th>
                  <th className="px-4 py-3 text-center text-sm font-bold">GP</th>
                  <th className="px-4 py-3 text-center text-sm font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {info.subjects.map((subject, index) => (
                  <tr key={subject._id || index} className={index % 2 === 1 ? 'bg-gray-50/60' : ''}>
                    <td className="px-4 py-3 text-sm text-gray-600 font-medium">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                      {subject.subjectId?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">{subject.written ?? 0}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">{subject.mcq ?? 0}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">{subject.ca ?? 0}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">{subject.practical ?? 0}</td>
                    <td className={`px-4 py-3 text-sm text-center font-bold ${t.text}`}>
                      {subject.total ?? 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-600">{subject.fullMarks ?? 0}</td>
                    <td className={`px-4 py-3 text-sm text-center font-bold ${t.text}`}>
                      {subject.grade || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-semibold">{subject.gradePoint ?? 0}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        subject.status === 'Pass'
                          ? 'bg-green-100 text-green-700'
                          : subject.status === 'Absent'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {subject.status || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`text-center py-12 bg-gradient-to-br ${t.bgSoft} rounded-xl border-2 border-dashed ${t.borderDashed}`}>
            <p className="text-gray-500 text-lg font-medium">কোনো বিষয়ের নম্বর এখনো এন্ট্রি করা হয়নি</p>
            <p className="text-sm text-gray-400 mt-1">Subjects array is empty → GPA = 0</p>
          </div>
        )}

        {/* Footer */}
        <div className={`mt-8 pt-4 border-t-2 ${t.border} text-center`}>
          <p className="text-sm text-gray-500">
            Generated on: {new Date().toLocaleDateString('en-BD', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            This is a computer-generated result card. {schoolInfo.name}
          </p>
        </div>
      </div>
    );
  };

  const statusBadgeClass = (status) =>
    status === 'Pass'
      ? 'bg-green-100 text-green-700'
      : status === 'Absent'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700';

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className={`text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r ${t.textStrong}`}>
        Student Result Cards
      </h1>

      {/* Filters */}
      <div className={`mb-6 bg-white p-6 rounded-2xl shadow-lg border ${t.border} print:hidden sticky top-2 z-10`}>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[220px] relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder="Search by name or Student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition-all`}
            />
          </div>

          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedSectionId('');
            }}
            className={`px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition-all min-w-[160px] bg-white`}
          >
            <option value="">All Classes</option>
            {(classData?.data || []).map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className={`px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition-all min-w-[140px] bg-white`}
          >
            <option value="">All Sections</option>
            {(sectionData?.data || [])
              .filter(sec => !selectedClassId || sec.classId === selectedClassId)
              .map((sec) => (
                <option key={sec._id} value={sec._id}>
                  Section {sec.name}
                </option>
              ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition-all min-w-[140px] bg-white`}
          >
            <option value="All">All Status</option>
            <option value="Pass">✅ Pass</option>
            <option value="Fail">❌ Fail</option>
            <option value="Absent">⏳ Absent</option>
          </select>

          {(searchTerm || selectedClassId || selectedSectionId || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedClassId('');
                setSelectedSectionId('');
                setStatusFilter('All');
              }}
              className="px-4 py-2.5 text-sm font-semibold rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
            >
              ✕ Clear
            </button>
          )}
        </div>

        <div className={`mt-4 text-sm text-gray-600 px-4 py-2 rounded-lg ${t.chipBg.split(' ')[0]}/50 inline-block`}>
          Showing <span className={`font-bold ${t.text}`}>{filteredResults.length}</span> of {examResults.length} students
        </div>
      </div>

      {/* Student Table */}
      <div className={`bg-white rounded-2xl shadow-lg border ${t.border} overflow-hidden print:hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 z-[1]">
              <tr className={`bg-gradient-to-r ${t.gradientHeaderBar} text-white`}>
                <th className="px-4 py-3 text-left text-sm font-bold">SL</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Student</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Student ID</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Class</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Section</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Exam</th>
                <th className="px-4 py-3 text-center text-sm font-bold">GPA</th>
                <th className="px-4 py-3 text-center text-sm font-bold">Status</th>
                <th className="px-4 py-3 text-center text-sm font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedResults.map((result, index) => {
                const info = getStudentInfo(result);
                const isBusy = processingResult?._id === result._id;

                return (
                  <tr key={result._id} className={`${t.hoverRow} transition-colors duration-150 ${index % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0`}>
                          {result.studentId?.name?.charAt(0) || 'S'}
                        </div>
                        <span className="font-semibold text-gray-800">{info.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{info.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{info.className}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{info.section}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{info.exam}</td>
                    <td className={`px-4 py-3 text-sm text-center font-bold ${t.text}`}>
                      {Number(info.gpa).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadgeClass(info.overallStatus)}`}>
                        {info.overallStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDownloadPDF(result)}
                          disabled={isBusy}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r ${t.btnGradient} text-white hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isBusy && processingAction === 'pdf' ? '⏳ ...' : '📄 PDF'}
                        </button>
                        <button
                          onClick={() => handlePrint(result)}
                          disabled={isBusy}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border-2 ${t.border} ${t.text} hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isBusy && processingAction === 'print' ? '⏳ ...' : '🖨️ Print'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {paginatedResults.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-400">😕 কোনো রেজাল্ট পাওয়া যায়নি</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {filteredResults.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page <span className="font-semibold">{currentPage}</span> of{' '}
              <span className="font-semibold">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/*
        ★ Render target for the card being processed, used for both
        PDF capture (html2canvas) and browser printing.
        - For PDF: pushed off-screen with a FIXED width (see CARD_CAPTURE_WIDTH)
          so the layout doesn't collapse/shrink while hidden.
        - For Print: rendered in-place and shown normally; a print
          stylesheet hides everything else on the page so only this
          card ends up on the printed page, and print-color-adjust
          forces the browser to keep background colors/gradients.
      */}
      {processingResult && (
        <div
          id="print-result-card"
          className={processingAction === 'pdf' ? 'fixed -left-[9999px] top-0' : ''}
        >
          {renderResultCard(processingResult)}
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-result-card,
          #print-result-card * {
            visibility: visible;
          }
          #print-result-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          /* 🔥 Without this, most browsers strip background-color/gradient
             on print to save ink — this forces colors to print as shown */
          #print-result-card,
          #print-result-card * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}

export default StudentResultCard;

// import React, { useMemo, useRef, useState } from 'react';
// import { useGetAllExamResultQuery } from "@/redux/api/examResultApi";
// import { useGetAllClassesQuery } from "@/redux/api/classesApi";
// import { useGetAllSectionQuery } from "@/redux/api/sectionApi";
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import logo from "@/assets/logo.jpeg"

// // ★ Theme map — brand color (emerald green + golden yellow) ব্যবহার করা হচ্ছে,
// // পুরো ওয়েবসাইটের সাথে consistent রাখার জন্য।
// // Primary: Emerald Green #033320 | Secondary: Golden Yellow #CF962C | Accent: #014B27
// const THEMES = {
//   brand: {
//     gradientHeader: 'from-[#033320] to-[#014B27]',
//     gradientHeaderBar: 'from-[#033320] to-[#02291a]',
//     text: 'text-[#033320]',
//     textStrong: 'from-[#033320] to-[#014B27]',
//     bgSoft: 'from-[#f0f9f4] to-gray-50',
//     bgSofter: 'from-[#e6f4ec] to-[#d9efe3]',
//     border: 'border-[#c9e4d4]',
//     borderDashed: 'border-[#a8d4bb]',
//     ring: 'focus:ring-[#CF962C]',
//     chipBg: 'bg-[#e6f4ec] text-[#033320]',
//     badge: 'bg-[#033320]',
//     btnGradient: 'from-[#033320] to-[#014B27]',
//     selectedBorder: 'border-[#033320]',
//     selectedBg: 'from-[#f0f9f4] to-white',
//     hoverBorder: 'hover:border-[#CF962C]',
//     hoverRow: 'hover:bg-[#f0f9f4]',
//     avatarGradient: 'from-[#033320] to-[#014B27]',
//   },
// };

// function StudentResultCard() {
//   // ★ All hooks must be called at the top level, in the same order every time
//   const { data, isLoading, isError, error } = useGetAllExamResultQuery();
//   const { data: classData } = useGetAllClassesQuery([{ name: "limit", value: 100 }]);
//   const { data: sectionData } = useGetAllSectionQuery([{ name: "limit", value: 500 }]);

//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedClassId, setSelectedClassId] = useState('');
//   const [selectedSectionId, setSelectedSectionId] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const resultRef = useRef(null);

//   // ★ School Information
//   const schoolInfo = {
//     name: "বাওনিয়া উচ্চ বিদ্যালয়",
//     address: "বাউনিয়া মেইন রোড, বাউনিয়া, তুরাগ ,ঢাকা-২৮৭৬। ",
//     phone: "০১৩০৯১০৮১৯৬",
//     email: "baj2highschool@gmail.com",
//     logo: logo,
//     motto: "শিক্ষাই আলো",
//     primary: "blue", // ← change this to "purple" (or add more themes above) to switch color
//   };

//   const t = THEMES[schoolInfo.primary] || THEMES.brand;

//   // ★ Memoized values — ALL hooks (including these) must stay above any early return
//   const classNameMap = useMemo(() => {
//     const map = {};
//     (classData?.data || []).forEach((cls) => {
//       map[cls._id] = cls.name;
//     });
//     return map;
//   }, [classData]);

//   const sectionNameMap = useMemo(() => {
//     const map = {};
//     (sectionData?.data || []).forEach((sec) => {
//       map[sec._id] = sec.name;
//     });
//     return map;
//   }, [sectionData]);

//   const examResults = data?.data || [];

//   // ★ moved above the early returns — this was the bug causing
//   // "Rendered more hooks than during the previous render"
//   const filteredResults = useMemo(() => {
//     return examResults.filter((result) => {
//       const name = result.studentId?.name?.toLowerCase() || '';
//       const id = result.studentId?.studentId?.toLowerCase() || '';
//       const classId = result.studentId?.classId || '';
//       const sectionId = result.studentId?.sectionId || '';
//       const status = result.overallStatus || '';

//       const matchSearch =
//         name.includes(searchTerm.toLowerCase()) ||
//         id.includes(searchTerm.toLowerCase());

//       const matchClass = selectedClassId ? classId === selectedClassId : true;
//       const matchSection = selectedSectionId ? sectionId === selectedSectionId : true;

//       let matchStatus = true;
//       if (statusFilter === 'Pass') matchStatus = status === 'Pass';
//       else if (statusFilter === 'Fail') matchStatus = status === 'Fail';
//       else if (statusFilter === 'Absent') matchStatus = status === 'Absent';

//       return matchSearch && matchClass && matchSection && matchStatus;
//     });
//   }, [examResults, searchTerm, selectedClassId, selectedSectionId, statusFilter]);

//   // ★ Loading and Error states - now safely AFTER every hook
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${schoolInfo.primary}-600`}></div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="text-red-500 text-center py-4">
//         Error: {error?.data?.message || 'Failed to fetch data'}
//       </div>
//     );
//   }

//   // Get student info
//   const getStudentInfo = (result) => ({
//     name: result.studentId?.name || 'N/A',
//     id: result.studentId?.studentId || 'N/A',
//     className: classNameMap[result.studentId?.classId] || result.studentId?.classId || 'N/A',
//     section: sectionNameMap[result.studentId?.sectionId] || result.studentId?.sectionId || 'N/A',
//     exam: result.examId?.name || 'N/A',
//     session: result.sessionId?.year || 'N/A',
//     gpa: result.gpa ?? 0,
//     overallStatus: result.overallStatus || 'N/A',
//     subjects: result.subjects || []
//   });

//   // PDF Download
//   const downloadPDF = async () => {
//     if (!resultRef.current) return;

//     try {
//       const canvas = await html2canvas(resultRef.current, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         backgroundColor: '#ffffff'
//       });

//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`Result_${selectedStudent?.studentId?.name || 'Student'}.pdf`);
//     } catch (error) {
//       console.error('PDF generation failed:', error);
//       alert('Failed to generate PDF. Please try again.');
//     }
//   };

//   // Render Result Card
//   const renderResultCard = (result) => {
//     const info = getStudentInfo(result);

//     return (
//       <div ref={resultRef} className="bg-white p-8 max-w-5xl mx-auto shadow-2xl rounded-2xl border border-gray-100">
//         {/* School Header */}
//         <div className={`bg-gradient-to-r ${t.gradientHeader} -mx-8 -mt-8 px-8 py-6 rounded-t-2xl`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="text-5xl bg-white/20 p-1 rounded-xl backdrop-blur-sm">
//               <img src={schoolInfo.logo} className='h-12 w-12 rounded-md' alt="" />
//                 {/* {schoolInfo.logo} */}
//               </div>
//               <div className="text-white">
//                 <h1 className="text-3xl font-bold">{schoolInfo.name}</h1>
//                 <p className="text-white/80 text-sm">{schoolInfo.address}</p>
//                 <p className="text-white/80 text-sm">📞 {schoolInfo.phone} | ✉️ {schoolInfo.email}</p>
//               </div>
//             </div>
//             <div className="text-right text-white">
//               <p className="text-sm font-semibold text-white/80">{schoolInfo.motto}</p>
//               <div className="mt-2 text-xs bg-white/20 px-3 py-1 rounded-full">
//                 Academic Year: {info.session}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Student Info Card */}
//         <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 my-6 bg-gradient-to-br ${t.bgSoft} p-6 rounded-xl border ${t.border}`}>
//           <div className="bg-white p-3 rounded-lg shadow-sm">
//             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Student Name</p>
//             <p className="text-lg font-bold text-gray-800">{info.name}</p>
//           </div>
//           <div className="bg-white p-3 rounded-lg shadow-sm">
//             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Student ID</p>
//             <p className="text-lg font-bold text-gray-800">{info.id}</p>
//           </div>
//           <div className="bg-white p-3 rounded-lg shadow-sm">
//             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Class</p>
//             <p className={`text-lg font-bold ${t.text}`}>{info.className}</p>
//           </div>
//           <div className="bg-white p-3 rounded-lg shadow-sm">
//             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Section</p>
//             <p className={`text-lg font-bold ${t.text}`}>{info.section}</p>
//           </div>
//           <div className="bg-white p-3 rounded-lg shadow-sm">
//             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Exam</p>
//             <p className={`text-lg font-bold ${t.text}`}>{info.exam}</p>
//           </div>
//           <div className="bg-white p-3 rounded-lg shadow-sm col-span-2">
//             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Overall Status</p>
//             <span className={`mt-1 inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
//               info.overallStatus === 'Pass'
//                 ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md'
//                 : info.overallStatus === 'Absent'
//                 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md'
//                 : 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-md'
//             }`}>
//               {info.overallStatus}
//             </span>
//           </div>
//         </div>

//         {/* GPA Display */}
//         <div className="text-center my-6">
//           <div className={`inline-block bg-gradient-to-br ${t.bgSofter} px-10 py-4 rounded-2xl shadow-md border ${t.border}`}>
//             <p className={`text-sm ${t.text} font-semibold uppercase tracking-wider`}>Grade Point Average (GPA)</p>
//             <p className={`text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${t.textStrong}`}>
//               {Number(info.gpa).toFixed(2)}
//             </p>
//           </div>
//         </div>

//         {/* Subjects Table */}
//         {info.subjects.length > 0 ? (
//           <div className={`overflow-x-auto rounded-xl border ${t.border} shadow-sm`}>
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead>
//                 <tr className={`bg-gradient-to-r ${t.gradientHeaderBar} text-white`}>
//                   <th className="px-4 py-3 text-left text-sm font-bold">SL</th>
//                   <th className="px-4 py-3 text-left text-sm font-bold">Subject</th>
//                   <th className="px-4 py-3 text-center text-sm font-bold">Written</th>
//                   <th className="px-4 py-3 text-center text-sm font-bold">MCQ</th>
//                   <th className="px-4 py-3 text-center text-sm font-bold">CA</th>
//                   <th className="px-4 py-3 text-center text-sm font-bold">Practical</th>
//                   <th className="px-4 py-3 text-center text-sm font-bold">Total</th>
//                   <th className="px-4 py-3 text-center text-sm font-bold">Full Marks</th>
//                   <th className="px-4 py-3 text-center text-sm font-bold">Grade</th>
//                   <th className="px-4 py-3 text-center text-sm font-bold">GP</th>
//                   <th className="px-4 py-3 text-center text-sm font-bold">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {info.subjects.map((subject, index) => (
//                   <tr key={subject._id || index} className={`${t.hoverRow} transition-colors duration-150`}>
//                     <td className="px-4 py-3 text-sm text-gray-600 font-medium">{index + 1}</td>
//                     <td className="px-4 py-3 text-sm font-semibold text-gray-800">
//                       {subject.subjectId?.name || 'N/A'}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-center text-gray-700">{subject.written ?? 0}</td>
//                     <td className="px-4 py-3 text-sm text-center text-gray-700">{subject.mcq ?? 0}</td>
//                     <td className="px-4 py-3 text-sm text-center text-gray-700">{subject.ca ?? 0}</td>
//                     <td className="px-4 py-3 text-sm text-center text-gray-700">{subject.practical ?? 0}</td>
//                     <td className={`px-4 py-3 text-sm text-center font-bold ${t.text}`}>
//                       {subject.total ?? 0}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-center text-gray-600">{subject.fullMarks ?? 0}</td>
//                     <td className={`px-4 py-3 text-sm text-center font-bold ${t.text}`}>
//                       {subject.grade || 'N/A'}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-center font-semibold">{subject.gradePoint ?? 0}</td>
//                     <td className="px-4 py-3 text-sm text-center">
//                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                         subject.status === 'Pass'
//                           ? 'bg-green-100 text-green-700'
//                           : subject.status === 'Absent'
//                           ? 'bg-yellow-100 text-yellow-700'
//                           : 'bg-red-100 text-red-700'
//                       }`}>
//                         {subject.status || 'N/A'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className={`text-center py-12 bg-gradient-to-br ${t.bgSoft} rounded-xl border-2 border-dashed ${t.borderDashed}`}>
//             <p className="text-gray-500 text-lg font-medium">কোনো বিষয়ের নম্বর এখনো এন্ট্রি করা হয়নি</p>
//             <p className="text-sm text-gray-400 mt-1">Subjects array is empty → GPA = 0</p>
//           </div>
//         )}

//         {/* Footer */}
//         <div className={`mt-8 pt-4 border-t-2 ${t.border} text-center`}>
//           <p className="text-sm text-gray-500">
//             Generated on: {new Date().toLocaleDateString('en-BD', {
//               day: 'numeric',
//               month: 'long',
//               year: 'numeric'
//             })}
//           </p>
//           <p className="text-xs text-gray-400 mt-1">
//             This is a computer-generated result card. {schoolInfo.name}
//           </p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
//       <h1 className={`text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r ${t.textStrong}`}>
//         Student Result Cards
//       </h1>

//       {/* Filters */}
//       <div className={`mb-8 bg-white p-6 rounded-2xl shadow-lg border ${t.border}`}>
//         <div className="flex flex-wrap gap-4 items-center">
//           <div className="flex-1 min-w-[200px]">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="🔍 Search by name or Student ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className={`w-full pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition-all`}
//               />
//             </div>
//           </div>

//           <select
//             value={selectedClassId}
//             onChange={(e) => {
//               setSelectedClassId(e.target.value);
//               setSelectedSectionId('');
//             }}
//             className={`px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition-all min-w-[160px] bg-white`}
//           >
//             <option value="">All Classes</option>
//             {(classData?.data || []).map((cls) => (
//               <option key={cls._id} value={cls._id}>
//                 {cls.name}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedSectionId}
//             onChange={(e) => setSelectedSectionId(e.target.value)}
//             className={`px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition-all min-w-[140px] bg-white`}
//           >
//             <option value="">All Sections</option>
//             {(sectionData?.data || [])
//               .filter(sec => !selectedClassId || sec.classId === selectedClassId)
//               .map((sec) => (
//                 <option key={sec._id} value={sec._id}>
//                   Section {sec.name}
//                 </option>
//               ))}
//           </select>

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className={`px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition-all min-w-[140px] bg-white`}
//           >
//             <option value="All">All Status</option>
//             <option value="Pass">✅ Pass</option>
//             <option value="Fail">❌ Fail</option>
//             <option value="Absent">⏳ Absent</option>
//           </select>
//         </div>

//         <div className={`mt-4 text-sm text-gray-600 ${t.chipBg.split(' ')[0]}/50 px-4 py-2 rounded-lg`}>
//           Showing <span className={`font-bold ${t.text}`}>{filteredResults.length}</span> of {examResults.length} students
//         </div>
//       </div>

//       {/* Student List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
//         {filteredResults.map((result) => {
//           const info = getStudentInfo(result);
//           return (
//             <div
//               key={result._id}
//               className={`p-4 bg-white rounded-xl border-2 cursor-pointer transition-all hover:shadow-xl ${
//                 selectedStudent?._id === result._id
//                   ? `${t.selectedBorder} bg-gradient-to-br ${t.selectedBg} shadow-xl scale-105`
//                   : `border-gray-200 ${t.hoverBorder} hover:shadow-lg`
//               }`}
//               onClick={() => setSelectedStudent(result)}
//             >
//               <div className="flex items-center gap-3">
//                 <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center text-xl font-bold text-white shadow-md flex-shrink-0`}>
//                   {result.studentId?.name?.charAt(0) || 'S'}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="font-bold text-gray-800 truncate">{result.studentId?.name}</p>
//                   <p className="text-sm text-gray-600">ID: {result.studentId?.studentId}</p>
//                   <p className="text-xs text-gray-500">
//                     {info.className} - Section {info.section}
//                   </p>
//                   <div className="flex items-center gap-2 mt-1 flex-wrap">
//                     <span className={`text-xs ${t.chipBg} px-2.5 py-1 rounded-full font-semibold`}>
//                       GPA: {result.gpa}
//                     </span>
//                     <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
//                       result.overallStatus === 'Pass'
//                         ? 'bg-green-100 text-green-700'
//                         : result.overallStatus === 'Absent'
//                         ? 'bg-yellow-100 text-yellow-700'
//                         : 'bg-red-100 text-red-700'
//                     }`}>
//                       {result.overallStatus}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {filteredResults.length === 0 && (
//         <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
//           <p className="text-2xl text-gray-400">😕 কোনো রেজাল্ট পাওয়া যায়নি</p>
//           <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
//         </div>
//       )}

//       {/* Selected Result Card */}
//       {selectedStudent && (
//         <div className="mt-8">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//               <span className={`${t.badge} text-white px-3 py-1 rounded-lg text-sm`}>Result Card</span>
//               {selectedStudent.studentId?.name}
//             </h2>
//             <button
//               onClick={downloadPDF}
//               className={`px-6 py-3 bg-gradient-to-r ${t.btnGradient} text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold`}
//             >
//               📄 Download PDF
//             </button>
//           </div>
//           {renderResultCard(selectedStudent)}
//         </div>
//       )}

//       {!selectedStudent && filteredResults.length > 0 && (
//         <div className={`text-center py-12 bg-white rounded-2xl shadow-lg border-2 border-dashed ${t.borderDashed}`}>
//           <p className="text-xl text-gray-500">👆 Click on a student to view their result card</p>
//           <p className="text-sm text-gray-400 mt-1">Select any student from the list above</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StudentResultCard;