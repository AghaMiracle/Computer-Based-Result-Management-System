// Grade color mappings for visual representation
const gradeColors = {
  'A': { bg: '#dcfce7', text: '#166534', border: '#86efac', gradient: 'linear-gradient(135deg, #10b981, #059669)', hex: '#10b981' },
  'B': { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', hex: '#3b82f6' },
  'C': { bg: '#fef3c7', text: '#92400e', border: '#fde68a', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', hex: '#f59e0b' },
  'D': { bg: '#fed7aa', text: '#9a3412', border: '#fdba74', gradient: 'linear-gradient(135deg, #f97316, #ea580c)', hex: '#f97316' },
  'E': { bg: '#fce7f3', text: '#9d174d', border: '#f9a8d4', gradient: 'linear-gradient(135deg, #ec4899, #db2777)', hex: '#ec4899' },
  'F': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', hex: '#ef4444' }
};

export const getGradeColor = (grade, theme) => {
  const key = (grade || '').toUpperCase().charAt(0);
  const colors = gradeColors[key] || { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0', gradient: 'linear-gradient(135deg, #94a3b8, #64748b)', hex: '#94a3b8' };
  // When called with theme, return inline style object for direct spreading
  if (theme !== undefined) {
    return { background: colors.bg, color: colors.text };
  }
  return colors;
};

export const getGradeHex = (grade) => {
  const key = (grade || '').toUpperCase().charAt(0);
  return (gradeColors[key] || { hex: '#94a3b8' }).hex;
};

export const getGradeEmoji = (grade) => {
  const map = { 'A': '🌟', 'B': '👍', 'C': '📘', 'D': '⚠️', 'E': '📉', 'F': '❌' };
  return map[(grade || '').toUpperCase().charAt(0)] || '📋';
};

export const getScoreColor = (score) => {
  if (score >= 70) return '#10b981';
  if (score >= 60) return '#3b82f6';
  if (score >= 50) return '#f59e0b';
  if (score >= 45) return '#f97316';
  if (score >= 40) return '#ec4899';
  return '#ef4444';
};

export default gradeColors;
