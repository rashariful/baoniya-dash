import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// School Information
const schoolInfo = {
  name: "বাওনিয়া উচ্চ বিদ্যালয়",
  address: "বাওনিয়া রোড, ঢাকা-১২৩০",
  phone: "০১৯৮০৪৭৬০১১",
  email: "support@baoniyaschool.com",
  logo: "🏫",
  motto: "শিক্ষাই আলো",
  website: "www.baoniyaschool.com"
};

// API Base URL - Update with your actual API URL
const API_BASE_URL = import.meta.env.VITE_REACT_APP_ROOT;

function FinalResult() {
  const [finalResults, setFinalResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [examDetails, setExamDetails] = useState({});
  const [allStudents, setAllStudents] = useState([]);
  const resultRef = useRef(null);

  // Fetch all necessary data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch final results
      const finalResultResponse = await axios.get(`${API_BASE_URL}/final-result`, {
        params: { limit: 500 }
      });
      
      if (finalResultResponse.data.success) {
        setFinalResults(finalResultResponse.data.data);
        
        // Fetch student details for each final result
        const studentPromises = finalResultResponse.data.data.map(async (result) => {
          try {
            const studentResponse = await axios.get(`${API_BASE_URL}/student/${result.studentId}`);
            return {
              ...result,
              studentDetails: studentResponse.data.data
            };
          } catch (err) {
            console.error(`Failed to fetch student ${result.studentId}:`, err);
            return result;
          }
        });
        
        const studentsWithDetails = await Promise.all(studentPromises);
        setAllStudents(studentsWithDetails);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  // Get student details
  const getStudentInfo = (result) => {
    const student = result.studentDetails || {};
    return {
      name: student.name || result.studentId || 'N/A',
      id: student.studentId || 'N/A',
      class: student.classId || 'N/A',
      section: student.sectionId || 'N/A',
      roll: student.roll || 'N/A'
    };
  };

  // Calculate grade and grade point
  const getGradeInfo = (marks, fullMarks) => {
    const percentage = (marks / fullMarks) * 100;
    if (percentage >= 80) return { grade: 'A+', gradePoint: 5.0, status: 'Pass' };
    if (percentage >= 70) return { grade: 'A', gradePoint: 4.0, status: 'Pass' };
    if (percentage >= 60) return { grade: 'A-', gradePoint: 3.5, status: 'Pass' };
    if (percentage >= 50) return { grade: 'B', gradePoint: 3.0, status: 'Pass' };
    if (percentage >= 40) return { grade: 'C', gradePoint: 2.0, status: 'Pass' };
    if (percentage >= 33) return { grade: 'D', gradePoint: 1.0, status: 'Pass' };
    return { grade: 'F', gradePoint: 0.0, status: 'Fail' };
  };

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
      pdf.save(`Final_Result_${selectedStudent?.studentDetails?.name || 'Student'}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Get subject marks from term results
  const getSubjectMarks = async (examResultId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/exam-results/${examResultId}`);
      return response.data.data.subjects || [];
    } catch (err) {
      console.error('Failed to fetch exam result:', err);
      return [];
    }
  };

  // Render Final Result Card
  const renderFinalResultCard = (result) => {
    const studentInfo = getStudentInfo(result);
    const termResults = result.termResults || [];
    const overallGPA = result.cgpa || 0;
    const overallStatus = result.overallStatus || 'N/A';

    // Sample subject data - in real scenario, fetch from exam results
    const subjects = [
      { name: 'বাংলা', term1: 165, term2: 150, fullMarks: 200 },
      { name: 'গণিত', term1: 80, term2: 87, fullMarks: 100 },
      { name: 'তথ্য ও যোগাযোগ প্রযুক্তি', term1: 35, term2: 37, fullMarks: 50 },
      { name: 'ইংরেজি', term1: 140, term2: 160, fullMarks: 200 },
      { name: 'বিজ্ঞান', term1: 75, term2: 82, fullMarks: 100 },
    ];

    return (
      <div ref={resultRef} className="bg-white p-8 max-w-5xl mx-auto shadow-xl rounded-lg">
        {/* School Header */}
        <div className="border-b-4 border-blue-600 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{schoolInfo.logo}</div>
              <div>
                <h1 className="text-3xl font-bold text-blue-800">{schoolInfo.name}</h1>
                <p className="text-sm text-gray-600">{schoolInfo.address}</p>
                <p className="text-sm text-gray-600">📞 {schoolInfo.phone} | ✉️ {schoolInfo.email}</p>
                <p className="text-sm text-gray-600">🌐 {schoolInfo.website}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">{schoolInfo.motto}</p>
              <div className="mt-2 text-xs text-gray-500">Session: {result.sessionId || '2026'}</div>
            </div>
          </div>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Student Name</p>
            <p className="text-xl font-bold text-gray-800">{studentInfo.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Student ID</p>
            <p className="text-xl font-bold text-gray-800">{studentInfo.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Class</p>
            <p className="text-lg font-semibold text-gray-800">{studentInfo.class}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Section</p>
            <p className="text-lg font-semibold text-gray-800">{studentInfo.section}</p>
          </div>
        </div>

        {/* Overall Result Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
            <p className="text-sm text-gray-600">Total GPA</p>
            <p className="text-3xl font-bold text-blue-700">{overallGPA.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
            <p className="text-sm text-gray-600">Overall Status</p>
            <span className={`text-xl font-bold px-4 py-2 rounded-full ${
              overallStatus === 'Pass' 
                ? 'text-green-700' 
                : 'text-red-700'
            }`}>
              {overallStatus}
            </span>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
            <p className="text-sm text-gray-600">Merge Strategy</p>
            <p className="text-lg font-semibold text-purple-700">{result.mergeStrategy || 'N/A'}</p>
          </div>
        </div>

        {/* Term Results Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Term Results Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            {termResults.map((term, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Term {term.term}</p>
                <p className="text-xl font-bold text-blue-700">GPA: {term.gpa?.toFixed(2) || 'N/A'}</p>
                <p className="text-xs text-gray-500">Exam: {term.examId || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subject-wise Detailed Marks */}
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Subject-wise Marks (Term 1 & 2)</h3>
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">SL</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Subject</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Term 1</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Term 2</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Total</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Full Marks</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Average</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Grade</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">GP</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject, index) => {
                const total = subject.term1 + subject.term2;
                const average = total / 2;
                const gradeInfo = getGradeInfo(average, subject.fullMarks);
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-800">
                      {subject.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700">{subject.term1}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700">{subject.term2}</td>
                    <td className="px-4 py-2 text-sm text-center font-semibold text-blue-700">
                      {total}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700">{subject.fullMarks}</td>
                    <td className="px-4 py-2 text-sm text-center font-semibold">
                      {average.toFixed(1)}
                    </td>
                    <td className="px-4 py-2 text-sm text-center font-semibold text-blue-700">
                      {gradeInfo.grade}
                    </td>
                    <td className="px-4 py-2 text-sm text-center">
                      {gradeInfo.gradePoint.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="8" className="px-4 py-3 text-right font-semibold text-gray-700">
                  Overall GPA:
                </td>
                <td className="px-4 py-3 text-center font-bold text-blue-700 text-lg">
                  {overallGPA.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Additional Information */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">📅 Result Published: {result.isPublished ? '✅ Yes' : '❌ No'}</p>
            <p className="text-gray-600">📋 Merge Strategy: {result.mergeStrategy || 'N/A'}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Generated: {new Date().toLocaleDateString('en-BD', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            This is a computer-generated final result. {schoolInfo.name}
          </p>
        </div>
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading final results...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-2xl font-bold">❌ Error</p>
          <p>{error}</p>
          <button 
            onClick={fetchAllData}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Filter students
  const filteredStudents = allStudents.filter(result => {
    const student = result.studentDetails || {};
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(searchLower) ||
      student.studentId?.toLowerCase().includes(searchLower) ||
      student.roll?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
        🎓 Final Result Cards
      </h1>

      {/* Search and Stats */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-lg">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="🔍 Search by name, ID or roll..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4 text-sm">
          <span className="bg-blue-100 px-4 py-2 rounded-full text-blue-700">
            📊 Total: {filteredStudents.length}
          </span>
          <span className="bg-green-100 px-4 py-2 rounded-full text-green-700">
            ✅ Pass: {filteredStudents.filter(s => s.overallStatus === 'Pass').length}
          </span>
        </div>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {filteredStudents.map((result) => {
          const student = result.studentDetails || {};
          return (
            <div
              key={result._id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-xl ${
                selectedStudent?._id === result._id 
                  ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg' 
                  : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
              }`}
              onClick={() => setSelectedStudent(result)}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {student.name?.charAt(0) || 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{student.name || 'N/A'}</p>
                  <p className="text-sm text-gray-600">ID: {student.studentId || 'N/A'}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      CGPA: {result.cgpa?.toFixed(2) || 'N/A'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.overallStatus === 'Pass' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {result.overallStatus || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Student's Final Result Card */}
      {selectedStudent && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-2xl font-bold text-gray-800">
              📄 Final Result: {selectedStudent.studentDetails?.name}
            </h2>
            <button
              onClick={downloadPDF}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              📥 Download PDF
            </button>
          </div>
          {renderFinalResultCard(selectedStudent)}
        </div>
      )}

      {/* No Selection Message */}
      {!selectedStudent && filteredStudents.length > 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500">
            👆 Click on a student to view their final result card
          </p>
        </div>
      )}

      {/* No Results Message */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500">
            😕 No students found matching your search
          </p>
        </div>
      )}
    </div>
  );
}

export default FinalResult;