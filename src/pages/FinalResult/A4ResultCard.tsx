import React from 'react';
import {
  fmt,
  fmt1,
  buildSubjectRows,
  thStyle,
  thSmall,
  tdStyle,
} from '../../utils/resultUtils'; // path ঠিক করে নাও

import logo from '@/assets/logo.jpeg';

export default function A4ResultCard({ result, schoolInfo }) {
  const student = result?.studentId || {};
  const classGroupName = (result?.classGroupId?.name || '').toLowerCase();

  const isPrimary =
    classGroupName.includes('nursery') ||
    classGroupName.includes('primary') ||
    /[1-5]/.test(classGroupName);

  const isIndependent =
    result?.mergeStrategy === 'INDEPENDENT' || classGroupName.includes('10');

  const subjectRows = buildSubjectRows(result);

  const terms = isPrimary
    ? [1, 2, 3]
    : (result.termResults || []).map((t) => t.term).sort((a, b) => a - b);

  const termName = (t) =>
    result.termResults?.find((tr) => tr.term === t)?.examId?.name || `Term ${t}`;

  // Color theme
  const theme = isPrimary
    ? { bg: '#FDF2F8', border: '#9D174D', accent: '#BE185D' }
    : { bg: '#FFFBEB', border: '#1E293B', accent: '#B45309' };

  return (
    <div
      className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg font-sans text-[13px] relative"
      style={{ border: `4px double ${theme.border}` }}
    >
      {/* ========== HEADER ========== */}
      <div
        className="px-8 pt-6 pb-4 text-center"
        style={{ background: theme.bg, borderBottom: `2px solid ${theme.border}` }}
      >
        <div className="flex items-center justify-center gap-4 mb-2">
          <img
            src={logo}
            alt="logo"
            className="w-16 h-16 rounded-full border-2 object-cover"
            style={{ borderColor: theme.border }}
          />
          <div>
            <h1
              className="text-2xl font-bold tracking-wide"
              style={{ fontFamily: 'Tiro Bangla, serif', color: theme.border }}
            >
              {schoolInfo?.name || 'বাউনিয়া আবদুল জলিল উচ্চ বিদ্যালয়'}
            </h1>
            <p className="text-xs mt-0.5 opacity-80">
              {schoolInfo?.address || 'বাউনিয়া, তুরাগ, ঢাকা'}
            </p>
            <p className="text-[11px] mt-0.5">
              স্থাপিত: ১৯৭৯ খ্রিষ্টাব্দ | {schoolInfo?.phone}
            </p>
          </div>
        </div>

        <div
          className="inline-block mt-3 px-6 py-1.5 rounded text-white text-sm font-semibold"
          style={{ background: theme.border }}
        >
          চূড়ান্ত ফলাফল বিবরণী — শিক্ষাবর্ষ ২০২৬
        </div>
      </div>

      {/* ========== STUDENT INFO ========== */}
      <div
        className="px-8 py-4 grid grid-cols-2 gap-x-8 gap-y-2 border-b"
        style={{ borderColor: theme.border }}
      >
        <div className="flex">
          <span className="w-28 font-semibold text-[#4B5563]">শিক্ষার্থীর নাম</span>
          <span className="mx-1">:</span>
          <span className="font-bold">{student.name || '—'}</span>
        </div>
        <div className="flex">
          <span className="w-28 font-semibold text-[#4B5563]">রোল নং</span>
          <span className="mx-1">:</span>
          <span className="font-bold">{result.roll || student.roll || '—'}</span>
        </div>
        <div className="flex">
          <span className="w-28 font-semibold text-[#4B5563]">পিতার নাম</span>
          <span className="mx-1">:</span>
          <span>{student.fatherName || '—'}</span>
        </div>
        <div className="flex">
          <span className="w-28 font-semibold text-[#4B5563]">শ্রেণি</span>
          <span className="mx-1">:</span>
          <span className="font-bold">{result.classGroupId?.name || '—'}</span>
        </div>
        <div className="flex">
          <span className="w-28 font-semibold text-[#4B5563]">মাতার নাম</span>
          <span className="mx-1">:</span>
          <span>{student.motherName || '—'}</span>
        </div>
        <div className="flex">
          <span className="w-28 font-semibold text-[#4B5563]">সেশন</span>
          <span className="mx-1">:</span>
          <span>{result.sessionId?.name || '—'}</span>
        </div>
      </div>

      {/* ========== MARKS TABLE ========== */}
      <div className="px-6 py-4">
        {isIndependent ? (
          // Class 10 - Independent
          <div className="space-y-4">
            {(result.termResults || []).map((t) => (
              <div key={t.term}>
                <div className="flex justify-between mb-1 font-semibold">
                  <span>{t.examId?.name || `Term ${t.term}`}</span>
                  <span>GPA: {fmt(t.gpa)}</span>
                </div>
                <table
                  className="w-full border-collapse text-center text-[12px]"
                  style={{ border: `1px solid ${theme.border}` }}
                >
                  <thead>
                    <tr>
                      <th style={thStyle}>বিষয়</th>
                      <th style={thSmall}>সৃজন</th>
                      <th style={thSmall}>নৈর্ব</th>
                      <th style={thSmall}>ব্যব</th>
                      <th style={thSmall}>মোট</th>
                      <th style={thSmall}>পূর্ণমান</th>
                      <th style={thSmall}>গ্রেড</th>
                      <th style={thSmall}>জিপি</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(t.examResultId?.subjects || []).map((s) => (
                      <tr key={s._id}>
                        <td style={{ ...tdStyle, textAlign: 'left' }}>
                          {s.subjectId?.name}
                        </td>
                        <td style={tdStyle}>{s.written ?? '—'}</td>
                        <td style={tdStyle}>{s.mcq ?? '—'}</td>
                        <td style={tdStyle}>{s.ca ?? '—'}</td>
                        <td style={tdStyle}>{s.total}</td>
                        <td style={tdStyle}>{s.fullMarks}</td>
                        <td style={tdStyle}>{s.grade}</td>
                        <td style={tdStyle}>{s.gradePoint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ) : (
          // Primary / 6-9 Combined Table
          <table
            className="w-full border-collapse text-center text-[12px]"
            style={{ border: `1px solid ${theme.border}` }}
          >
            <thead>
              <tr>
                <th rowSpan={2} style={thStyle}>
                  বিষয়
                </th>
                {terms.map((t) => (
                  <th key={t} colSpan={isPrimary ? 4 : 5} style={thStyle}>
                    {isPrimary
                      ? `${['১ম', '২য়', '৩য়'][t - 1]} সেমিস্টার`
                      : termName(t)}
                  </th>
                ))}
                <th colSpan={3} style={thStyle}>
                  গড় / ফাইনাল
                </th>
              </tr>
              <tr>
                {terms.map((t) => (
                  <React.Fragment key={t}>
                    {isPrimary ? (
                      <>
                        <th style={thSmall}>এম.টি</th>
                        <th style={thSmall}>সামষ্টিক</th>
                        <th style={thSmall}>মোট</th>
                        <th style={thSmall}>গ্রেড</th>
                      </>
                    ) : (
                      <>
                        <th style={thSmall}>সৃজন</th>
                        <th style={thSmall}>নৈর্ব</th>
                        <th style={thSmall}>ব্যব</th>
                        <th style={thSmall}>মোট</th>
                        <th style={thSmall}>গ্রেড</th>
                      </>
                    )}
                  </React.Fragment>
                ))}
                <th style={thSmall}>মোট</th>
                <th style={thSmall}>গ্রেড</th>
                <th style={thSmall}>জিপি</th>
              </tr>
            </thead>
            <tbody>
              {subjectRows.map((row) => {
                const vals = terms
                  .map((t) => row.byTerm[t]?.total)
                  .filter((v) => typeof v === 'number');
                const avg = vals.length
                  ? vals.reduce((a, b) => a + b, 0) / vals.length
                  : null;
                const last = terms
                  .map((t) => row.byTerm[t])
                  .filter(Boolean)
                  .slice(-1)[0];

                return (
                  <tr key={row.id}>
                    <td style={{ ...tdStyle, textAlign: 'left' }}>{row.name}</td>
                    {terms.map((t) => {
                      const cell = row.byTerm[t];
                      return (
                        <React.Fragment key={t}>
                          {isPrimary ? (
                            <>
                              <td style={tdStyle}>{cell?.written ?? '—'}</td>
                              <td style={tdStyle}>{cell?.mcq ?? '—'}</td>
                              <td style={tdStyle}>{cell?.total ?? '—'}</td>
                              <td style={tdStyle}>{cell?.grade ?? '—'}</td>
                            </>
                          ) : (
                            <>
                              <td style={tdStyle}>{cell?.written ?? '—'}</td>
                              <td style={tdStyle}>{cell?.mcq ?? '—'}</td>
                              <td style={tdStyle}>{cell?.ca ?? '—'}</td>
                              <td style={tdStyle}>{cell?.total ?? '—'}</td>
                              <td style={tdStyle}>{cell?.grade ?? '—'}</td>
                            </>
                          )}
                        </React.Fragment>
                      );
                    })}
                    <td style={tdStyle}>{avg != null ? fmt1(avg) : '—'}</td>
                    <td style={tdStyle}>{last?.grade ?? '—'}</td>
                    <td style={tdStyle}>{last?.gradePoint ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ========== FOOTER ========== */}
      <div className="px-8 pb-6 pt-2 flex justify-between items-end">
        <div className="text-sm space-y-1">
          <p>
            মোট কার্যদিবস: <strong>{result.workingDays ?? '—'}</strong>
          </p>
          <p>
            উপস্থিতি: <strong>{result.attendance ?? '—'}</strong>
          </p>
        </div>

        <div
          className="text-center px-6 py-3 rounded-lg border-2"
          style={{ borderColor: theme.border, background: theme.bg }}
        >
          <p className="text-xs text-[#6B7280]">চূড়ান্ত ফলাফল</p>
          <p className="text-2xl font-bold mt-1" style={{ color: theme.border }}>
            {fmt(result.cgpa)}
          </p>
          <p className="text-sm font-semibold mt-0.5">
            {result.overallStatus === 'Pass' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
          </p>
        </div>

        <div className="text-right text-sm">
          <p
            className="mt-8 border-t border-dashed pt-1"
            style={{ borderColor: theme.border }}
          >
            অধ্যক্ষের স্বাক্ষর
          </p>
        </div>
      </div>
    </div>
  );
}