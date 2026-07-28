import React, { useRef, useState } from 'react';
import { useGetAllExamResultQuery } from "@/redux/api/examResultApi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ExamTest() {
  const { data, isLoading, isError, error } = useGetAllExamResultQuery();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const resultRef = useRef(null);

  // School Information
  const schoolInfo = {
    name: "বাওনিয়া উচ্চ বিদ্যালয়",
    address: "বাওনিয়া রোড, ঢাকা-১২৩০",
    phone: "০১৯৮০৪৭৬০১১",
    email: "support@baoniyaschool.com",
    logo: "🏫", // Dummy logo
    motto: "শিক্ষাই আলো"
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

  const examResults = data?.data || [];

  // Filter students by search term
  const filteredResults = examResults.filter(result =>
    result.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.studentId?.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get student info with class/section
  const getStudentInfo = (result) => ({
    name: result.studentId?.name || 'N/A',
    id: result.studentId?.studentId || 'N/A',
    className: result.studentId?.classId || 'N/A',
    section: result.studentId?.sectionId || 'N/A',
    exam: result.examId?.name || 'N/A',
    session: result.sessionId?.year || 'N/A',
    gpa: result.gpa || 0,
    overallStatus: result.overallStatus || 'N/A',
    subjects: result.subjects || []
  });

  // PDF Download Function
  const downloadPDF = async () => {
    if (!resultRef.current) return;
    
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Result_${selectedStudent?.studentId?.name || 'Student'}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Render Single Result Card
  const renderResultCard = (result) => {
    const info = getStudentInfo(result);
    
    return (
      <div ref={resultRef} className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
        {/* School Header */}
        <div className="border-b-4 border-blue-600 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{schoolInfo.logo}</div>
              <div>
                <h1 className="text-3xl font-bold text-blue-800">{schoolInfo.name}</h1>
                <p className="text-sm text-gray-600">{schoolInfo.address}</p>
                <p className="text-sm text-gray-600">📞 {schoolInfo.phone} | ✉️ {schoolInfo.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">{schoolInfo.motto}</p>
              <div className="mt-2 text-xs text-gray-500">Academic Year: {info.session}</div>
            </div>
          </div>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Student Name</p>
            <p className="text-xl font-bold text-gray-800">{info.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Student ID</p>
            <p className="text-xl font-bold text-gray-800">{info.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Class</p>
            <p className="text-lg font-semibold text-gray-800">{info.className}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Section</p>
            <p className="text-lg font-semibold text-gray-800">{info.section}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Exam</p>
            <p className="text-lg font-semibold text-gray-800">{info.exam}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Overall Status</p>
            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
              info.overallStatus === 'Pass' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {info.overallStatus}
            </span>
          </div>
        </div>

        {/* GPA Display */}
        <div className="text-center mb-6">
          <div className="inline-block bg-blue-50 px-8 py-3 rounded-lg">
            <p className="text-sm text-gray-600">Grade Point Average (GPA)</p>
            <p className="text-4xl font-bold text-blue-700">{info.gpa.toFixed(2)}</p>
          </div>
        </div>

        {/* Subjects Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">SL</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Subject</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Written</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">MCQ</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">CA</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Total</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Full Marks</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Grade</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">GP</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {info.subjects.map((subject, index) => (
                <tr key={subject._id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600">{index + 1}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-800">
                    {subject.subjectId?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700">{subject.written || 0}</td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700">{subject.mcq || 0}</td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700">{subject.ca || 0}</td>
                  <td className="px-4 py-2 text-sm text-center font-semibold text-blue-700">
                    {subject.total || 0}
                  </td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700">{subject.fullMarks || 0}</td>
                  <td className="px-4 py-2 text-sm text-center font-semibold text-blue-700">
                    {subject.grade || 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-sm text-center">{subject.gradePoint || 0}</td>
                  <td className="px-4 py-2 text-sm text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      subject.status === 'Pass' 
                        ? 'bg-green-100 text-green-700' 
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

        {/* Footer */}
        <div className="mt-8 pt-4 border-t-2 border-gray-200 text-center">
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
        Student Result Cards
      </h1>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="text-sm text-gray-600">
          Total Students: {filteredResults.length}
        </div>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredResults.map((result) => (
          <div
            key={result._id}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-lg ${
              selectedStudent?._id === result._id 
                ? 'border-blue-600 bg-blue-50 shadow-lg' 
                : 'border-gray-200 hover:border-blue-400'
            }`}
            onClick={() => setSelectedStudent(result)}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                {result.studentId?.name?.charAt(0) || 'S'}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{result.studentId?.name}</p>
                <p className="text-sm text-gray-600">ID: {result.studentId?.studentId}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    GPA: {result.gpa}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    result.overallStatus === 'Pass' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {result.overallStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Student Result Card */}
      {selectedStudent && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Result Card: {selectedStudent.studentId?.name}
            </h2>
            <button
              onClick={downloadPDF}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          </div>
          {renderResultCard(selectedStudent)}
        </div>
      )}

      {!selectedStudent && filteredResults.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          Click on a student to view their result card
        </div>
      )}
    </div>
  );
}

export default ExamTest;