const LoadingSkeleton = ({ rows = 5, type = 'table' }) => {
  if (type === 'cards') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card" style={{ height: 120 }}>
            <div className="skeleton" style={{ width: '40%', height: 14, marginBottom: 12 }} />
            <div className="skeleton" style={{ width: '60%', height: 28, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: '80%', height: 12 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div className="skeleton" style={{ width: 200, height: 20 }} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid var(--border-light)' }}>
          <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '50%', height: 14, marginBottom: 6 }} />
            <div className="skeleton" style={{ width: '30%', height: 12 }} />
          </div>
          <div className="skeleton" style={{ width: 80, height: 26, borderRadius: 20 }} />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
