import { useState } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineXMark } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  filters = [],
  activeFilter = '',
  onFilterChange,
  rightContent
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      flexWrap: 'wrap'
    }}>
      {/* Search Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'var(--bg-card)',
        border: `1.5px solid ${isFocused ? 'var(--primary-light)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '0.5rem 0.75rem',
        transition: 'var(--transition)',
        boxShadow: isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
        flex: '1',
        minWidth: 200,
        maxWidth: 350
      }}>
        <HiOutlineMagnifyingGlass style={{ color: isFocused ? 'var(--primary)' : 'var(--text-muted)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            width: '100%',
            fontFamily: 'inherit'
          }}
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => { onChange?.(''); onSearch?.(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}
            >
              <HiOutlineXMark size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Buttons */}
      {filters.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <HiOutlineFunnel size={14} style={{ color: 'var(--text-muted)' }} />
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange?.(activeFilter === filter.value ? '' : filter.value)}
              className="btn btn-sm"
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                background: activeFilter === filter.value
                  ? 'linear-gradient(135deg, var(--primary), var(--primary-light))'
                  : 'transparent',
                color: activeFilter === filter.value ? 'white' : 'var(--text-secondary)',
                border: activeFilter === filter.value ? 'none' : '1px solid var(--border)',
                fontWeight: 500
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {/* Right Content */}
      {rightContent && <div style={{ marginLeft: 'auto' }}>{rightContent}</div>}
    </div>
  );
};

export default SearchBar;
