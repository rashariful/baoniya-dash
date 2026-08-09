// utils/resultUtils.js

export const fmt = (n) => (typeof n === 'number' ? n.toFixed(2) : '—');
export const fmt1 = (n) => (typeof n === 'number' ? n.toFixed(1) : '—');

export function buildSubjectRows(result) {
  const rows = {};
  let order = 0;

  (result.termResults || []).forEach((t) => {
    const subs = t.examResultId?.subjects || [];
    subs.forEach((s) => {
      const id = s.subjectId?._id || s.subjectId;
      if (!rows[id]) {
        rows[id] = {
          id,
          name: s.subjectId?.name || 'বিষয়',
          fullMarks: s.subjectId?.fullMarks || s.fullMarks || 0,
          byTerm: {},
          order: order++,
        };
      }
      rows[id].byTerm[t.term] = s;
    });
  });

  return Object.values(rows).sort((a, b) => a.order - b.order);
}

// Common table styles
export const thStyle = {
  border: '1px solid #000',
  padding: '4px 6px',
  background: '#f0f0f0',
  fontWeight: 600,
  fontSize: '12px',
};

export const thSmall = {
  ...thStyle,
  fontSize: '11px',
  padding: '3px 4px',
};

export const tdStyle = {
  border: '1px solid #000',
  padding: '3px 5px',
  fontSize: '12px',
};