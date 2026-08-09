import React from 'react';
import {
  fmt,
  fmt1,
  buildSubjectRows,
  thStyle,
  thSmall,
  tdStyle,
} from '@/utils/resultUtils.js'; // ← path ঠিক করে নাও

// =============================================================================
// ১. PINK CARD — Nursery-5 (৩ সেমিস্টার)
// =============================================================================
export function PinkCard({ result }) {
  const subjectRows = buildSubjectRows(result);
  const terms = [1, 2, 3];

  const rowAverage = (row) => {
    const vals = terms.map((t) => row.byTerm[t]?.total).filter((v) => typeof v === 'number');
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  };

  return (
    <div
      style={{ background: '#F3D9E4', border: '2px solid #7A3B57' }}
      className="rounded-md p-4 text-[13px] font-sans"
    >
      <div className="flex justify-between mb-2">
        <span className="font-semibold">মোট শিক্ষার্থী: {result.classRoster || '—'}</span>
        <span className="font-semibold">পাস নম্বর ৩৫%</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center" style={{ border: '1px solid #7A3B57' }}>
          <thead>
            <tr>
              <th rowSpan={2} style={thStyle}>বিষয়</th>
              {terms.map((t) => (
                <th key={t} colSpan={4} style={thStyle}>
                  {['১ম', '২য়', '৩য়'][t - 1]} সেমিস্টার
                </th>
              ))}
              <th colSpan={3} style={thStyle}>১ম,২য়,৩য় সেমিস্টার গড়</th>
            </tr>
            <tr>
              {terms.map((t) => (
                <React.Fragment key={t}>
                  <th style={thSmall}>এম.টি</th>
                  <th style={thSmall}>সামষ্টিক</th>
                  <th style={thSmall}>মোট</th>
                  <th style={thSmall}>লেটার গ্রেড</th>
                </React.Fragment>
              ))}
              <th style={thSmall}>মোট</th>
              <th style={thSmall}>লেটার গ্রেড</th>
              <th style={thSmall}>জি পি</th>
            </tr>
          </thead>
          <tbody>
            {subjectRows.map((row) => {
              const avg = rowAverage(row);
              const lastTerm = terms.map((t) => row.byTerm[t]).filter(Boolean).slice(-1)[0];

              return (
                <tr key={row.id}>
                  <td style={{ ...tdStyle, textAlign: 'left' }}>{row.name}</td>
                  {terms.map((t) => {
                    const cell = row.byTerm[t];
                    return (
                      <React.Fragment key={t}>
                        <td style={tdStyle}>{cell?.written ?? '—'}</td>
                        <td style={tdStyle}>{cell?.mcq ?? '—'}</td>
                        <td style={tdStyle}>{cell?.total ?? '—'}</td>
                        <td style={tdStyle}>{cell?.grade ?? '—'}</td>
                      </React.Fragment>
                    );
                  })}
                  <td style={tdStyle}>{avg != null ? fmt1(avg) : '—'}</td>
                  <td style={tdStyle}>{lastTerm?.grade ?? '—'}</td>
                  <td style={tdStyle}>{lastTerm?.gradePoint ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <div className="flex justify-between border-b border-[#7A3B57] py-1">
            <span>মোট কার্য দিবস</span>
            <span>{result.workingDays ?? '—'}</span>
          </div>
          <div className="flex justify-between border-b border-[#7A3B57] py-1">
            <span>উপস্থিতি</span>
            <span>{result.attendance ?? '—'}</span>
          </div>
        </div>
        <div className="border border-[#7A3B57] rounded p-3">
          <p className="font-semibold mb-1">চূড়ান্ত ফলাফল:</p>
          <div className="flex justify-between">
            <span>CGPA</span>
            <span className="font-bold">{fmt(result.cgpa)}</span>
          </div>
          <div className="flex justify-between">
            <span>ফলাফল</span>
            <span className="font-bold">
              {result.overallStatus === 'Pass' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ২. YELLOW CARD — Class 6-8 / 9
// =============================================================================
export function YellowCard({ result }) {
  const subjectRows = buildSubjectRows(result);
  const terms = (result.termResults || []).map((t) => t.term).sort((a, b) => a - b);
  const termName = (t) =>
    result.termResults.find((tr) => tr.term === t)?.examId?.name || `Term ${t}`;

  const rowAverage = (row) => {
    const vals = terms.map((t) => row.byTerm[t]?.total).filter((v) => typeof v === 'number');
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  };

  return (
    <div
      style={{ background: '#FBEFC8', border: '2px solid #1D2438' }}
      className="rounded-md p-4 text-[13px] font-sans"
    >
      <div className="flex justify-between mb-2">
        <span className="font-semibold">মোট শিক্ষার্থী: {result.classRoster || '—'}</span>
        <span className="font-semibold">পাশ নম্বর: ৩৩%</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center" style={{ border: '1px solid #1D2438' }}>
          <thead>
            <tr>
              <th rowSpan={2} style={thStyle}>বিষয়</th>
              {terms.map((t) => (
                <th key={t} colSpan={5} style={thStyle}>
                  {termName(t)}
                </th>
              ))}
              <th colSpan={3} style={thStyle}>পরীক্ষার গড়</th>
            </tr>
            <tr>
              {terms.map((t) => (
                <React.Fragment key={t}>
                  <th style={thSmall}>সৃজন</th>
                  <th style={thSmall}>নৈর্ব</th>
                  <th style={thSmall}>ব্যব</th>
                  <th style={thSmall}>মোট</th>
                  <th style={thSmall}>গ্রেড</th>
                </React.Fragment>
              ))}
              <th style={thSmall}>মোট</th>
              <th style={thSmall}>গ্রেড</th>
              <th style={thSmall}>জিপি</th>
            </tr>
          </thead>
          <tbody>
            {subjectRows.map((row) => {
              const avg = rowAverage(row);
              const lastTerm = terms.map((t) => row.byTerm[t]).filter(Boolean).slice(-1)[0];

              return (
                <tr key={row.id}>
                  <td style={{ ...tdStyle, textAlign: 'left' }}>{row.name}</td>
                  {terms.map((t) => {
                    const cell = row.byTerm[t];
                    return (
                      <React.Fragment key={t}>
                        <td style={tdStyle}>{cell?.written ?? '—'}</td>
                        <td style={tdStyle}>{cell?.mcq ?? '—'}</td>
                        <td style={tdStyle}>{cell?.ca ?? '—'}</td>
                        <td style={tdStyle}>{cell?.total ?? '—'}</td>
                        <td style={tdStyle}>{cell?.grade ?? '—'}</td>
                      </React.Fragment>
                    );
                  })}
                  <td style={tdStyle}>{avg != null ? fmt1(avg) : '—'}</td>
                  <td style={tdStyle}>{lastTerm?.grade ?? '—'}</td>
                  <td style={tdStyle}>{lastTerm?.gradePoint ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-6">
          {terms.map((t) => {
            const tr = result.termResults.find((x) => x.term === t);
            return (
              <div key={t}>
                <span className="text-[#4B5273]">{termName(t)} GPA=</span>{' '}
                <span className="font-bold">{fmt(tr?.gpa)}</span>
              </div>
            );
          })}
        </div>
        <div className="border border-[#1D2438] rounded px-4 py-2 text-right">
          <p className="text-[#4B5273]">CGPA=</p>
          <p className="font-bold text-lg">{fmt(result.cgpa)}</p>
          <p className="font-semibold">
            {result.overallStatus === 'Pass' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
          </p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ৩. INDEPENDENT CARD — Class 10
// =============================================================================
export function IndependentCard({ result }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-[#9C927A] px-1">
        এই ক্লাসগ্রুপের পরীক্ষাগুলো (Test / Pre-test) আলাদা ও স্বতন্ত্র হিসেবে গণ্য হয় —
        তাই কোনো গড় (CGPA) দেখানো হচ্ছে না।
      </p>

      {(result.termResults || []).map((t) => {
        const subjects = t.examResultId?.subjects || [];

        return (
          <div
            key={t.term}
            style={{ background: '#FBEFC8', border: '2px solid #1D2438' }}
            className="rounded-md p-4 text-[13px] font-sans"
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold">{t.examId?.name || `Term ${t.term}`}</span>
              <span className="font-semibold">GPA: {fmt(t.gpa)}</span>
            </div>

            <table
              className="w-full border-collapse text-center"
              style={{ border: '1px solid #1D2438' }}
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
                {subjects.map((s) => (
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

            <p className="mt-2 font-semibold">
              ফলাফল:{' '}
              {t.examResultId?.overallStatus === 'Pass' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// SWITCHER
// =============================================================================
export default function ResultCardSwitcher({ result }) {
  const strategy = result?.mergeStrategy;
  const classGroupName = (result?.classGroupId?.name || '').toLowerCase();

  // Class 10 → Independent
  if (strategy === 'INDEPENDENT' || classGroupName.includes('10')) {
    return <IndependentCard result={result} />;
  }

  // Nursery / Primary / 1-5 → Pink
  if (
    classGroupName.includes('nursery') ||
    classGroupName.includes('primary') ||
    /[1-5]/.test(classGroupName)
  ) {
    return <PinkCard result={result} />;
  }

  // 6-8 / 9 → Yellow
  return <YellowCard result={result} />;
}