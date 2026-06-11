const Badge = ({ children, variant = 'neutral', size = 'sm', dot = false }) => {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    neutral: 'badge-neutral'
  };

  const statusMap = {
    active: 'success',
    approved: 'success',
    completed: 'success',
    pending: 'warning',
    draft: 'warning',
    submitted: 'info',
    rejected: 'danger',
    suspended: 'danger',
    expired: 'danger',
    inactive: 'neutral'
  };

  // Auto-detect variant from children text
  const autoVariant = typeof children === 'string'
    ? statusMap[children.toLowerCase()] || variant
    : variant;

  const dotColors = {
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    neutral: '#94a3b8'
  };

  return (
    <span
      className={`badge ${variants[autoVariant]}`}
      style={{
        fontSize: size === 'xs' ? '0.6875rem' : '0.75rem',
        padding: size === 'xs' ? '0.125rem 0.5rem' : '0.25rem 0.75rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: dot ? '0.375rem' : 0
      }}
    >
      {dot && (
        <span style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: dotColors[autoVariant],
          flexShrink: 0
        }} />
      )}
      {children}
    </span>
  );
};

export default Badge;
