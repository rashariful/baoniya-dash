import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserCheck,
  ClipboardList,
} from 'lucide-react';

// -----------------------------------------------------------------------
// ⚠️ IMPORT PATH / HOOK NAME — নিজের actual RTK slice ফাইল অনুযায়ী মিলিয়ে নাও
// -----------------------------------------------------------------------
import { useGetAllClassGroupQuery } from '../../redux/api/classGroupApi.js';
import { useGetAllClassesQuery } from '../../redux/api/classesApi.js';
import { useGetAllSectionQuery } from '../../redux/api/sectionApi.js';
import { useGetAllExamQuery } from '../../redux/api/examApi.js';
import { useGetAllSubjectQuery } from '../../redux/api/subjectApi.js';
import { useGetAllStudentQuery } from '../../redux/api/studentApi.js';
import { useGetAllAcademicSessionQuery } from '../../redux/api/academicSessionApi.js'; // ← NEW
import {
  useSubmitStudentAllSubjectsMutation,
  useSubmitSubjectAllStudentsMutation,
} from '../../redux/api/examResultApi';

function FieldSelect({ label, value, onChange, options, placeholder, disabled }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#4B5273] mb-1">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 text-sm border border-[#E4D9BC] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#C79A49]/40 focus:border-[#C79A49] disabled:bg-[#F3EEE1] disabled:text-[#9C927A]"
      >
        <option value="">{placeholder || 'নির্বাচন করুন'}</option>
        {options.map((o) => (
          <option key={o._id} value={o._id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function TeacherMarkEntry() {
  const [mode, setMode] = useState('bulk'); // 'bulk' | 'student'

  const [classGroupId, setClassGroupId] = useState('');
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [examId, setExamId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [sessionId, setSessionId] = useState(''); // ← NEW

  const [bulkEntries, setBulkEntries] = useState({});
  const [studentEntries, setStudentEntries] = useState({});
  const [status, setStatus] = useState(null);

  // RTK Query
  const { data: classGroupRes } = useGetAllClassGroupQuery([
    { name: 'limit', value: 100 },
  ]);

  const { data: classesRes } = useGetAllClassesQuery(
    [
      { name: 'classGroupId', value: classGroupId },
      { name: 'limit', value: 100 },
    ],
    { skip: !classGroupId }
  );

  const { data: sectionRes } = useGetAllSectionQuery(
    [
      { name: 'classId', value: classId },
      { name: 'limit', value: 100 },
    ],
    { skip: !classId }
  );

  const { data: examRes } = useGetAllExamQuery(
    [
      { name: 'classGroupId', value: classGroupId },
      { name: 'limit', value: 100 },
    ],
    { skip: !classGroupId }
  );

  const { data: subjectRes } = useGetAllSubjectQuery(
    [
      { name: 'classId', value: classId },
      { name: 'limit', value: 100 },
    ],
    { skip: !classId }
  );

  const { data: studentRes, isFetching: studentsLoading } = useGetAllStudentQuery(
    [
      { name: 'classId', value: classId },
      { name: 'sectionId', value: sectionId },
      { name: 'limit', value: 500 },
    ],
    { skip: !classId || !sectionId }
  );

  // ← NEW: Session list
  const { data: sessionRes } = useGetAllAcademicSessionQuery([
    { name: 'limit', value: 50 },
  ]);

  const [submitSubjectAllStudents, { isLoading: submittingBulk }] =
    useSubmitSubjectAllStudentsMutation();
  const [submitStudentAllSubjects, { isLoading: submittingStudent }] =
    useSubmitStudentAllSubjectsMutation();

  const classGroups = classGroupRes?.data || [];
  const classes = classesRes?.data || [];
  const sections = sectionRes?.data || [];
  const exams = examRes?.data || [];
  const subjects = subjectRes?.data || [];
  const students = studentRes?.data || [];
  const sessions = sessionRes?.data || []; // ← NEW
  const submitting = submittingBulk || submittingStudent;

  // Reset dependent fields
  useEffect(() => {
    setClassId('');
    setSectionId('');
    setExamId('');
    setSubjectId('');
    setStudentId('');
  }, [classGroupId]);

  useEffect(() => {
    setSectionId('');
    setSubjectId('');
    setStudentId('');
  }, [classId]);

  // Initialize bulk entries
  useEffect(() => {
    if (mode !== 'bulk' || !subjectId || students.length === 0) return;
    const initial = {};
    students.forEach((s) => {
      initial[s._id] = { written: '', mcq: '', ca: '', practical: '', isAbsent: false };
    });
    setBulkEntries(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, subjectId, students.length]);

  // Initialize student entries
  useEffect(() => {
    if (mode !== 'student' || !studentId || subjects.length === 0) return;
    const initial = {};
    subjects.forEach((s) => {
      initial[s._id] = { written: '', mcq: '', ca: '', practical: '', isAbsent: false };
    });
    setStudentEntries(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, studentId, subjects.length]);

  const selectedSubject = subjects.find((s) => s._id === subjectId);

  const updateBulkCell = (sid, field, value) => {
    setBulkEntries((prev) => ({ ...prev, [sid]: { ...prev[sid], [field]: value } }));
  };

  const updateStudentCell = (subId, field, value) => {
    setStudentEntries((prev) => ({ ...prev, [subId]: { ...prev[subId], [field]: value } }));
  };

  const rowTotal = (entry) => {
    if (!entry || entry.isAbsent) return '—';
    const n = (v) => (v === '' || v == null ? 0 : Number(v));
    return n(entry.written) + n(entry.mcq) + n(entry.ca) + n(entry.practical);
  };

  // -------------------- SUBMIT HANDLERS (FIXED) --------------------
  const handleSubmitBulk = async () => {
    if (!examId || !subjectId || !classGroupId) {
      setStatus({ type: 'error', message: 'Class, Exam ও Subject সিলেক্ট করুন' });
      return;
    }
    if (!sessionId) {
      setStatus({
        type: 'error',
        message: 'সেশন সিলেক্ট করুন — সেশন ছাড়া মার্ক সাবমিট করা যাবে না',
      });
      return;
    }

    const entries = Object.entries(bulkEntries).map(([sid, e]) => ({
      studentId: sid,
      marksObj: {
        written: e.written === '' ? 0 : Number(e.written),
        mcq: e.mcq === '' ? 0 : Number(e.mcq),
        ca: e.ca === '' ? 0 : Number(e.ca),
        practical: e.practical === '' ? 0 : Number(e.practical),
      },
      isAbsent: !!e.isAbsent,
    }));

    setStatus(null);
    try {
      await submitSubjectAllStudents({
        examId,
        sessionId, // ← state থেকে সরাসরি
        classGroupId,
        subjectId,
        entries,
      }).unwrap();

      setStatus({
        type: 'success',
        message: `${entries.length} জন শিক্ষার্থীর মার্ক সফলভাবে সাবমিট হয়েছে`,
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err?.data?.message || 'সাবমিট ব্যর্থ হয়েছে',
      });
    }
  };

  const handleSubmitStudent = async () => {
    if (!examId || !studentId || !classGroupId) {
      setStatus({ type: 'error', message: 'Class, Exam ও Student সিলেক্ট করুন' });
      return;
    }
    if (!sessionId) {
      setStatus({
        type: 'error',
        message: 'সেশন সিলেক্ট করুন — সেশন ছাড়া মার্ক সাবমিট করা যাবে না',
      });
      return;
    }

    const marksInput = Object.entries(studentEntries).map(([subId, e]) => ({
      subjectId: subId,
      marksObj: {
        written: e.written === '' ? 0 : Number(e.written),
        mcq: e.mcq === '' ? 0 : Number(e.mcq),
        ca: e.ca === '' ? 0 : Number(e.ca),
        practical: e.practical === '' ? 0 : Number(e.practical),
      },
      isAbsent: !!e.isAbsent,
    }));

    setStatus(null);
    try {
      await submitStudentAllSubjects({
        studentId,
        examId,
        sessionId, // ← state থেকে সরাসরি
        classGroupId,
        marksInput,
      }).unwrap();

      setStatus({
        type: 'success',
        message: 'শিক্ষার্থীর সব বিষয়ের মার্ক সফলভাবে সাবমিট হয়েছে',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err?.data?.message || 'সাবমিট ব্যর্থ হয়েছে',
      });
    }
  };

  // Options
  const classGroupOptions = classGroups.map((c) => ({ _id: c._id, label: c.name }));
  const classOptions = classes.map((c) => ({ _id: c._id, label: c.name }));
  const sectionOptions = sections.map((s) => ({ _id: s._id, label: s.name }));
  const examOptions = exams.map((e) => ({
    _id: e._id,
    label: `${e.name} (Term ${e.term})`,
  }));
  const subjectOptions = subjects.map((s) => ({
    _id: s._id,
    label: `${s.name} (পূর্ণমান ${s.fullMarks})`,
  }));
  const studentOptions = students.map((s) => ({
    _id: s._id,
    label: `${s.roll || ''} — ${s.name}`,
  }));
  const sessionOptions = sessions.map((s) => ({
    _id: s._id,
    label: s.name || s.year || s.sessionName || 'Session',
  })); // ← NEW

  return (
    <div className="min-h-screen bg-[#F3EEE1] font-sans">
      {/* Header */}
      <div className="bg-primary rounded-md text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-[#C79A49]" />
          <div>
            <p className="text-lg font-semibold">মার্ক এন্ট্রি</p>
            <p className="text-[11px] text-white/50 tracking-wide">TEACHER MARK ENTRY</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Mode Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('bulk')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border ${
              mode === 'bulk'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-[#4B5273] border-[#E4D9BC]'
            }`}
          >
            <Users className="w-4 h-4" />
            এক সাবজেক্ট — সব স্টুডেন্ট
          </button>
          <button
            onClick={() => setMode('student')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border ${
              mode === 'student'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-[#4B5273] border-[#E4D9BC]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            এক স্টুডেন্ট — সব সাবজেক্ট
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#E4D9BC] rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <FieldSelect
            label="ক্লাস গ্রুপ"
            value={classGroupId}
            onChange={setClassGroupId}
            options={classGroupOptions}
          />
          <FieldSelect
            label="ক্লাস"
            value={classId}
            onChange={setClassId}
            options={classOptions}
            disabled={!classGroupId}
          />
          <FieldSelect
            label="সেকশন"
            value={sectionId}
            onChange={setSectionId}
            options={sectionOptions}
            disabled={!classId}
          />
          <FieldSelect
            label="পরীক্ষা (Term)"
            value={examId}
            onChange={setExamId}
            options={examOptions}
            disabled={!classGroupId}
          />
          <FieldSelect
            label="সেশন"
            value={sessionId}
            onChange={setSessionId}
            options={sessionOptions}
          />
          {mode === 'bulk' ? (
            <FieldSelect
              label="বিষয়"
              value={subjectId}
              onChange={setSubjectId}
              options={subjectOptions}
              disabled={!classId}
            />
          ) : (
            <FieldSelect
              label="শিক্ষার্থী"
              value={studentId}
              onChange={setStudentId}
              options={studentOptions}
              disabled={!sectionId}
            />
          )}
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-md mb-4 text-sm ${
              status.type === 'success'
                ? 'bg-[#E7F3EC] text-[#2F5D45]'
                : 'bg-[#FBEAE8] text-[#96342C]'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {status.message}
          </div>
        )}

        {/* Loading students */}
        {sectionId && classId && studentsLoading && (
          <div className="flex items-center gap-2 text-[#9C927A] text-sm py-6">
            <Loader2 className="w-4 h-4 animate-spin" /> শিক্ষার্থী তালিকা লোড হচ্ছে…
          </div>
        )}

        {/* ========== BULK MODE ========== */}
        {mode === 'bulk' && subjectId && students.length > 0 && (
          <div className="bg-white border border-[#E4D9BC] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#EFE7D2] flex items-center gap-2 text-sm text-[#4B5273]">
              <BookOpen className="w-4 h-4 text-primary" />
              {selectedSubject?.name} — পূর্ণমান {selectedSubject?.fullMarks}, পাস নম্বর{' '}
              {selectedSubject?.passMarks}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FBF6E8] text-[#4B5273] text-xs">
                  <tr>
                    <th className="text-left px-4 py-2">শিক্ষার্থী</th>
                    <th className="px-3 py-2">সৃজন/MT</th>
                    <th className="px-3 py-2">নৈর্ব/সামষ্টিক</th>
                    <th className="px-3 py-2">CA</th>
                    <th className="px-3 py-2">ব্যবহারিক</th>
                    <th className="px-3 py-2">মোট</th>
                    <th className="px-3 py-2">অনুপস্থিত</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E9D6]">
                  {students.map((s) => {
                    const entry = bulkEntries[s._id] || {};
                    return (
                      <tr key={s._id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {s.roll ? `Roll ${s.roll} — ` : ''}
                          {s.name}
                        </td>
                        {['written', 'mcq', 'ca', 'practical'].map((f) => (
                          <td key={f} className="px-2 py-1">
                            <input
                              type="number"
                              disabled={entry.isAbsent}
                              value={entry[f] ?? ''}
                              onChange={(e) => updateBulkCell(s._id, f, e.target.value)}
                              className="w-16 text-center border border-[#E4D9BC] rounded px-1 py-1 disabled:bg-[#F3EEE1]"
                            />
                          </td>
                        ))}
                        <td className="px-3 py-2 text-center font-semibold">
                          {rowTotal(entry)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={!!entry.isAbsent}
                            onChange={(e) =>
                              updateBulkCell(s._id, 'isAbsent', e.target.checked)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-[#EFE7D2] flex justify-end">
              <button
                onClick={handleSubmitBulk}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/85 text-white text-sm rounded-md disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                সব শিক্ষার্থীর মার্ক সাবমিট করুন
              </button>
            </div>
          </div>
        )}

        {/* ========== STUDENT MODE ========== */}
        {mode === 'student' && studentId && subjects.length > 0 && (
          <div className="bg-white border border-[#E4D9BC] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#EFE7D2] flex items-center gap-2 text-sm text-[#4B5273]">
              <UserCheck className="w-4 h-4 text-primary" />
              {studentOptions.find((s) => s._id === studentId)?.label}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FBF6E8] text-[#4B5273] text-xs">
                  <tr>
                    <th className="text-left px-4 py-2">বিষয়</th>
                    <th className="px-3 py-2">সৃজন/MT</th>
                    <th className="px-3 py-2">নৈর্ব/সামষ্টিক</th>
                    <th className="px-3 py-2">CA</th>
                    <th className="px-3 py-2">ব্যবহারিক</th>
                    <th className="px-3 py-2">মোট</th>
                    <th className="px-3 py-2">অনুপস্থিত</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E9D6]">
                  {subjects.map((sub) => {
                    const entry = studentEntries[sub._id] || {};
                    return (
                      <tr key={sub._id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {sub.name}{' '}
                          <span className="text-[#9C927A] text-xs">({sub.fullMarks})</span>
                        </td>
                        {['written', 'mcq', 'ca', 'practical'].map((f) => (
                          <td key={f} className="px-2 py-1">
                            <input
                              type="number"
                              disabled={entry.isAbsent}
                              value={entry[f] ?? ''}
                              onChange={(e) =>
                                updateStudentCell(sub._id, f, e.target.value)
                              }
                              className="w-16 text-center border border-[#E4D9BC] rounded px-1 py-1 disabled:bg-[#F3EEE1]"
                            />
                          </td>
                        ))}
                        <td className="px-3 py-2 text-center font-semibold">
                          {rowTotal(entry)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={!!entry.isAbsent}
                            onChange={(e) =>
                              updateStudentCell(sub._id, 'isAbsent', e.target.checked)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-[#EFE7D2] flex justify-end">
              <button
                onClick={handleSubmitStudent}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-[#96631F] text-white text-sm rounded-md disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                সব বিষয়ের মার্ক সাবমিট করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import {
//   Users,
//   BookOpen,
//   Save,
//   CheckCircle2,
//   AlertCircle,
//   Loader2,
//   UserCheck,
//   ClipboardList,
// } from 'lucide-react';

// // -----------------------------------------------------------------------
// // ⚠️ IMPORT PATH / HOOK NAME — নিজের actual RTK slice ফাইল অনুযায়ী মিলিয়ে নাও
// // -----------------------------------------------------------------------
// import { useGetAllClassGroupQuery } from '../../redux/api/classGroupApi.js';
// import { useGetAllClassesQuery } from '../../redux/api/classesApi.js';
// import { useGetAllSectionQuery } from '../../redux/api/sectionApi.js';
// import { useGetAllExamQuery } from '../../redux/api/examApi.js';
// import { useGetAllSubjectQuery } from '../../redux/api/subjectApi.js';
// import { useGetAllStudentQuery } from '../../redux/api/studentApi.js';
// import {
//   useSubmitStudentAllSubjectsMutation,
//   useSubmitSubjectAllStudentsMutation,
// } from '../../redux/api/examResultApi';

// function FieldSelect({ label, value, onChange, options, placeholder, disabled }) {
//   return (
//     <div>
//       <label className="block text-xs font-medium text-[#4B5273] mb-1">{label}</label>
//       <select
//         value={value || ''}
//         onChange={(e) => onChange(e.target.value)}
//         disabled={disabled}
//         className="w-full px-3 py-2 text-sm border border-[#E4D9BC] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#C79A49]/40 focus:border-[#C79A49] disabled:bg-[#F3EEE1] disabled:text-[#9C927A]"
//       >
//         <option value="">{placeholder || 'নির্বাচন করুন'}</option>
//         {options.map((o) => (
//           <option key={o._id} value={o._id}>
//             {o.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// export default function TeacherMarkEntry() {
//   const [mode, setMode] = useState('bulk'); // 'bulk' | 'student'

//   const [classGroupId, setClassGroupId] = useState('');
//   const [classId, setClassId] = useState('');
//   const [sectionId, setSectionId] = useState('');
//   const [examId, setExamId] = useState('');
//   const [subjectId, setSubjectId] = useState('');
//   const [studentId, setStudentId] = useState('');

//   const [bulkEntries, setBulkEntries] = useState({});
//   const [studentEntries, setStudentEntries] = useState({});
//   const [status, setStatus] = useState(null);

//   // RTK Query — parent selection না থাকলে skip
// // Ager moto object na diye evabe array pathaben:
// const { data: classGroupRes } = useGetAllClassGroupQuery([
//   { name: 'limit', value: 100 }
// ]);
// const { data: classesRes } = useGetAllClassesQuery(
//     [{ name: 'classGroupId', value: classGroupId }, { name: 'limit', value: 100 }],
//     { skip: !classGroupId }
//   );

//   const { data: sectionRes } = useGetAllSectionQuery(
//     [{ name: 'classId', value: classId }, { name: 'limit', value: 100 }],
//     { skip: !classId }
//   );

//   const { data: examRes } = useGetAllExamQuery(
//     [{ name: 'classGroupId', value: classGroupId }, { name: 'limit', value: 100 }],
//     { skip: !classGroupId }
//   );

//   const { data: subjectRes } = useGetAllSubjectQuery(
//     [{ name: 'classId', value: classId }, { name: 'limit', value: 100 }],
//     { skip: !classId }
//   );

//   const { data: studentRes, isFetching: studentsLoading } = useGetAllStudentQuery(
//     [
//       { name: 'classId', value: classId },
//       { name: 'sectionId', value: sectionId },
//       { name: 'limit', value: 500 }
//     ],
//     { skip: !classId || !sectionId }
//   );
//   const [submitSubjectAllStudents, { isLoading: submittingBulk }] =
//     useSubmitSubjectAllStudentsMutation();
//   const [submitStudentAllSubjects, { isLoading: submittingStudent }] =
//     useSubmitStudentAllSubjectsMutation();

//   const classGroups = classGroupRes?.data || [];
//   const classes = classesRes?.data || [];
//   const sections = sectionRes?.data || [];
//   const exams = examRes?.data || [];
//   const subjects = subjectRes?.data || [];
//   const students = studentRes?.data || [];
//   const submitting = submittingBulk || submittingStudent;

//   useEffect(() => {
//     setClassId('');
//     setSectionId('');
//     setExamId('');
//     setSubjectId('');
//     setStudentId('');
//   }, [classGroupId]);

//   useEffect(() => {
//     setSectionId('');
//     setSubjectId('');
//     setStudentId('');
//   }, [classId]);

//   useEffect(() => {
//     if (mode !== 'bulk' || !subjectId || students.length === 0) return;
//     const initial = {};
//     students.forEach((s) => {
//       initial[s._id] = { written: '', mcq: '', ca: '', practical: '', isAbsent: false };
//     });
//     setBulkEntries(initial);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [mode, subjectId, students.length]);

//   useEffect(() => {
//     if (mode !== 'student' || !studentId || subjects.length === 0) return;
//     const initial = {};
//     subjects.forEach((s) => {
//       initial[s._id] = { written: '', mcq: '', ca: '', practical: '', isAbsent: false };
//     });
//     setStudentEntries(initial);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [mode, studentId, subjects.length]);

//   const selectedSubject = subjects.find((s) => s._id === subjectId);

//   const updateBulkCell = (sid, field, value) => {
//     setBulkEntries((prev) => ({ ...prev, [sid]: { ...prev[sid], [field]: value } }));
//   };
//   const updateStudentCell = (subId, field, value) => {
//     setStudentEntries((prev) => ({ ...prev, [subId]: { ...prev[subId], [field]: value } }));
//   };

//   const rowTotal = (entry) => {
//     if (!entry || entry.isAbsent) return '—';
//     const n = (v) => (v === '' || v == null ? 0 : Number(v));
//     return n(entry.written) + n(entry.mcq) + n(entry.ca) + n(entry.practical);
//   };

//   const handleSubmitBulk = async () => {
//     if (!examId || !subjectId || !classGroupId) {
//       setStatus({ type: 'error', message: 'Class, Exam ও Subject সিলেক্ট করুন' });
//       return;
//     }
//     const entries = Object.entries(bulkEntries).map(([sid, e]) => ({
//       studentId: sid,
//       marksObj: {
//         written: e.written === '' ? 0 : Number(e.written),
//         mcq: e.mcq === '' ? 0 : Number(e.mcq),
//         ca: e.ca === '' ? 0 : Number(e.ca),
//         practical: e.practical === '' ? 0 : Number(e.practical),
//       },
//       isAbsent: !!e.isAbsent,
//     }));

//     setStatus(null);
//     try {
//       await submitSubjectAllStudents({
//         examId,
//         sessionId: exams.find((e) => e._id === examId)?.sessionId,
//         classGroupId,
//         subjectId,
//         entries,
//       }).unwrap();
//       setStatus({ type: 'success', message: `${entries.length} জন শিক্ষার্থীর মার্ক সফলভাবে সাবমিট হয়েছে` });
//     } catch (err) {
//       setStatus({ type: 'error', message: err?.data?.message || 'সাবমিট ব্যর্থ হয়েছে' });
//     }
//   };

//   const handleSubmitStudent = async () => {
//     if (!examId || !studentId || !classGroupId) {
//       setStatus({ type: 'error', message: 'Class, Exam ও Student সিলেক্ট করুন' });
//       return;
//     }
//     const marksInput = Object.entries(studentEntries).map(([subId, e]) => ({
//       subjectId: subId,
//       marksObj: {
//         written: e.written === '' ? 0 : Number(e.written),
//         mcq: e.mcq === '' ? 0 : Number(e.mcq),
//         ca: e.ca === '' ? 0 : Number(e.ca),
//         practical: e.practical === '' ? 0 : Number(e.practical),
//       },
//       isAbsent: !!e.isAbsent,
//     }));

//     setStatus(null);
//     try {
//       await submitStudentAllSubjects({
//         studentId,
//         examId,
//         sessionId: exams.find((e) => e._id === examId)?.sessionId,
//         classGroupId,
//         marksInput,
//       }).unwrap();
//       setStatus({ type: 'success', message: 'শিক্ষার্থীর সব বিষয়ের মার্ক সফলভাবে সাবমিট হয়েছে' });
//     } catch (err) {
//       setStatus({ type: 'error', message: err?.data?.message || 'সাবমিট ব্যর্থ হয়েছে' });
//     }
//   };

//   const classGroupOptions = classGroups.map((c) => ({ _id: c._id, label: c.name }));
//   const classOptions = classes.map((c) => ({ _id: c._id, label: c.name }));
//   const sectionOptions = sections.map((s) => ({ _id: s._id, label: s.name }));
//   const examOptions = exams.map((e) => ({ _id: e._id, label: `${e.name} (Term ${e.term})` }));
//   const subjectOptions = subjects.map((s) => ({ _id: s._id, label: `${s.name} (পূর্ণমান ${s.fullMarks})` }));
//   const studentOptions = students.map((s) => ({ _id: s._id, label: `${s.roll || ''} — ${s.name}` }));

//   return (
//     <div className="min-h-screen bg-[#F3EEE1] font-sans">
      
//       <div className="bg-primary rounded-md text-white">
//         <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-3">
//           <ClipboardList className="w-6 h-6 text-[#C79A49]" />
//           <div>
//             <p className="text-lg font-semibold">মার্ক এন্ট্রি</p>
//             <p className="text-[11px] text-white/50 tracking-wide">TEACHER MARK ENTRY</p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-6 py-6">
//         <div className="flex gap-2 mb-6">
//           <button
//             onClick={() => setMode('bulk')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border ${
//               mode === 'bulk' ? 'bg-primary text-white border-pribg-primary' : 'bg-white text-[#4B5273] border-[#E4D9BC]'
//             }`}
//           >
//             <Users className="w-4 h-4" />
//             এক সাবজেক্ট — সব স্টুডেন্ট
//           </button>
//           <button
//             onClick={() => setMode('student')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border ${
//               mode === 'student' ? 'bg-primary text-white border-pribg-primary' : 'bg-white text-[#4B5273] border-[#E4D9BC]'
//             }`}
//           >
//             <UserCheck className="w-4 h-4" />
//             এক স্টুডেন্ট — সব সাবজেক্ট
//           </button>
//         </div>

//         <div className="bg-white border border-[#E4D9BC] rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
//           <FieldSelect label="ক্লাস গ্রুপ" value={classGroupId} onChange={setClassGroupId} options={classGroupOptions} />
//           <FieldSelect label="ক্লাস" value={classId} onChange={setClassId} options={classOptions} disabled={!classGroupId} />
//           <FieldSelect label="সেকশন" value={sectionId} onChange={setSectionId} options={sectionOptions} disabled={!classId} />
//           <FieldSelect label="পরীক্ষা (Term)" value={examId} onChange={setExamId} options={examOptions} disabled={!classGroupId} />
//           {mode === 'bulk' ? (
//             <FieldSelect label="বিষয়" value={subjectId} onChange={setSubjectId} options={subjectOptions} disabled={!classId} />
//           ) : (
//             <FieldSelect label="শিক্ষার্থী" value={studentId} onChange={setStudentId} options={studentOptions} disabled={!sectionId} />
//           )}
//         </div>

//         {status && (
//           <div
//             className={`flex items-center gap-2 px-4 py-3 rounded-md mb-4 text-sm ${
//               status.type === 'success' ? 'bg-[#E7F3EC] text-[#2F5D45]' : 'bg-[#FBEAE8] text-[#96342C]'
//             }`}
//           >
//             {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
//             {status.message}
//           </div>
//         )}

//         {sectionId && classId && studentsLoading && (
//           <div className="flex items-center gap-2 text-[#9C927A] text-sm py-6">
//             <Loader2 className="w-4 h-4 animate-spin" /> শিক্ষার্থী তালিকা লোড হচ্ছে…
//           </div>
//         )}

//         {mode === 'bulk' && subjectId && students.length > 0 && (
//           <div className="bg-white border border-[#E4D9BC] rounded-lg overflow-hidden">
//             <div className="px-4 py-3 border-b border-[#EFE7D2] flex items-center gap-2 text-sm text-[#4B5273]">
//               <BookOpen className="w-4 h-4 text-pribg-primary" />
//               {selectedSubject?.name} — পূর্ণমান {selectedSubject?.fullMarks}, পাস নম্বর {selectedSubject?.passMarks}
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-[#FBF6E8] text-[#4B5273] text-xs">
//                   <tr>
//                     <th className="text-left px-4 py-2">শিক্ষার্থী</th>
//                     <th className="px-3 py-2">সৃজন/MT</th>
//                     <th className="px-3 py-2">নৈর্ব/সামষ্টিক</th>
//                     <th className="px-3 py-2">CA</th>
//                     <th className="px-3 py-2">ব্যবহারিক</th>
//                     <th className="px-3 py-2">মোট</th>
//                     <th className="px-3 py-2">অনুপস্থিত</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#F0E9D6]">
//                   {students.map((s) => {
//                     const entry = bulkEntries[s._id] || {};
//                     return (
//                       <tr key={s._id}>
//                         <td className="px-4 py-2 whitespace-nowrap">
//                           {s.roll ? `Roll ${s.roll} — ` : ''}
//                           {s.name}
//                         </td>
//                         {['written', 'mcq', 'ca', 'practical'].map((f) => (
//                           <td key={f} className="px-2 py-1">
//                             <input
//                               type="number"
//                               disabled={entry.isAbsent}
//                               value={entry[f] ?? ''}
//                               onChange={(e) => updateBulkCell(s._id, f, e.target.value)}
//                               className="w-16 text-center border border-[#E4D9BC] rounded px-1 py-1 disabled:bg-[#F3EEE1]"
//                             />
//                           </td>
//                         ))}
//                         <td className="px-3 py-2 text-center font-semibold">{rowTotal(entry)}</td>
//                         <td className="px-3 py-2 text-center">
//                           <input
//                             type="checkbox"
//                             checked={!!entry.isAbsent}
//                             onChange={(e) => updateBulkCell(s._id, 'isAbsent', e.target.checked)}
//                           />
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//             <div className="px-4 py-3 border-t border-[#EFE7D2] flex justify-end">
//               <button
//                 onClick={handleSubmitBulk}
//                 disabled={submitting}
//                 className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/85 text-white text-sm rounded-md disabled:opacity-60"
//               >
//                 {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                 সব শিক্ষার্থীর মার্ক সাবমিট করুন
//               </button>
//             </div>
//           </div>
//         )}

//         {mode === 'student' && studentId && subjects.length > 0 && (
//           <div className="bg-white border border-[#E4D9BC] rounded-lg overflow-hidden">
//             <div className="px-4 py-3 border-b border-[#EFE7D2] flex items-center gap-2 text-sm text-[#4B5273]">
//               <UserCheck className="w-4 h-4 text-pribg-primary" />
//               {studentOptions.find((s) => s._id === studentId)?.label}
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-[#FBF6E8] text-[#4B5273] text-xs">
//                   <tr>
//                     <th className="text-left px-4 py-2">বিষয়</th>
//                     <th className="px-3 py-2">সৃজন/MT</th>
//                     <th className="px-3 py-2">নৈর্ব/সামষ্টিক</th>
//                     <th className="px-3 py-2">CA</th>
//                     <th className="px-3 py-2">ব্যবহারিক</th>
//                     <th className="px-3 py-2">মোট</th>
//                     <th className="px-3 py-2">অনুপস্থিত</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#F0E9D6]">
//                   {subjects.map((sub) => {
//                     const entry = studentEntries[sub._id] || {};
//                     return (
//                       <tr key={sub._id}>
//                         <td className="px-4 py-2 whitespace-nowrap">
//                           {sub.name} <span className="text-[#9C927A] text-xs">({sub.fullMarks})</span>
//                         </td>
//                         {['written', 'mcq', 'ca', 'practical'].map((f) => (
//                           <td key={f} className="px-2 py-1">
//                             <input
//                               type="number"
//                               disabled={entry.isAbsent}
//                               value={entry[f] ?? ''}
//                               onChange={(e) => updateStudentCell(sub._id, f, e.target.value)}
//                               className="w-16 text-center border border-[#E4D9BC] rounded px-1 py-1 disabled:bg-[#F3EEE1]"
//                             />
//                           </td>
//                         ))}
//                         <td className="px-3 py-2 text-center font-semibold">{rowTotal(entry)}</td>
//                         <td className="px-3 py-2 text-center">
//                           <input
//                             type="checkbox"
//                             checked={!!entry.isAbsent}
//                             onChange={(e) => updateStudentCell(sub._id, 'isAbsent', e.target.checked)}
//                           />
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//             <div className="px-4 py-3 border-t border-[#EFE7D2] flex justify-end">
//               <button
//                 onClick={handleSubmitStudent}
//                 disabled={submitting}
//                 className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-[#96631F] text-white text-sm rounded-md disabled:opacity-60"
//               >
//                 {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                 সব বিষয়ের মার্ক সাবমিট করুন
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }