// Format GPA to 2 decimal places
export const formatGPA = (gpa) => {
  if (gpa == null || isNaN(gpa)) return '0.00';
  return Number(gpa).toFixed(2);
};

// Format date to readable string
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format date with time
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
};

// Format large numbers with commas
export const formatNumber = (num) => {
  if (num == null) return '0';
  return Number(num).toLocaleString();
};

// Format percentage
export const formatPercent = (value, total) => {
  if (!total || total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
};

// Get grade classification
export const getClassification = (cgpa) => {
  if (cgpa >= 4.50) return { label: 'First Class', color: '#10b981' };
  if (cgpa >= 3.50) return { label: 'Second Class Upper', color: '#3b82f6' };
  if (cgpa >= 2.50) return { label: 'Second Class Lower', color: '#f59e0b' };
  if (cgpa >= 1.50) return { label: 'Third Class', color: '#f97316' };
  if (cgpa >= 1.00) return { label: 'Pass', color: '#ec4899' };
  return { label: 'Fail', color: '#ef4444' };
};

// Truncate text
export const truncate = (text, maxLength = 30) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Format academic session
export const formatSession = (session) => {
  if (!session) return 'N/A';
  return typeof session === 'string' ? session : session.name || 'N/A';
};
