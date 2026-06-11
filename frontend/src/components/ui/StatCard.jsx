import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'var(--primary)', trend, trendValue, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const numValue = parseInt(value) || 0;
    if (numValue === 0) { setDisplayValue(0); return; }

    const duration = 1500;
    const steps = 60;
    const stepValue = numValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(stepValue * step), numValue);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const colorMap = {
    blue: { bg: 'rgba(59,130,246,0.08)', icon: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    green: { bg: 'rgba(16,185,129,0.08)', icon: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    amber: { bg: 'rgba(245,158,11,0.08)', icon: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    red: { bg: 'rgba(239,68,68,0.08)', icon: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    purple: { bg: 'rgba(139,92,246,0.08)', icon: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="card"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '1rem',
        cursor: 'default'
      }}
    >
      <div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.5rem' }}>
          {title}
        </p>
        <motion.h3
          key={displayValue}
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.025em'
          }}
        >
          {displayValue.toLocaleString()}
        </motion.h3>
        {trend && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: trend === 'up' ? '#10b981' : '#ef4444'
          }}>
            <span>{trend === 'up' ? '↑' : '↓'}</span>
            <span>{trendValue}</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>vs last month</span>
          </div>
        )}
      </div>

      <div style={{
        width: 48,
        height: 48,
        borderRadius: 'var(--radius)',
        background: colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon style={{ fontSize: '1.375rem', color: colors.icon }} />
      </div>
    </motion.div>
  );
};

export default StatCard;
