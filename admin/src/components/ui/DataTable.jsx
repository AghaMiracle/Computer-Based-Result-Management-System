import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChevronUp, HiOutlineChevronDown, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';

const DataTable = ({
  columns = [],
  data = [],
  pagination = null,
  onPageChange,
  onSort,
  sortField = '',
  sortOrder = 'asc',
  loading = false,
  emptyMessage = 'No data found',
  rowKey = '_id',
  onRowClick
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSort = (field) => {
    if (!onSort) return;
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(field, newOrder);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <HiOutlineChevronUp size={12} style={{ opacity: 0.3 }} />;
    return sortOrder === 'asc'
      ? <HiOutlineChevronUp size={12} style={{ color: 'var(--primary)' }} />
      : <HiOutlineChevronDown size={12} style={{ color: 'var(--primary)' }} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
      style={{ padding: 0, overflow: 'hidden' }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    width: col.width
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    {col.label}
                    {col.sortable && <SortIcon field={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <motion.tr
                    key={row[rowKey] || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 * i }}
                    onClick={() => onRowClick?.(row)}
                    onMouseEnter={() => setHoveredRow(row[rowKey])}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      cursor: onRowClick ? 'pointer' : 'default',
                      background: hoveredRow === row[rowKey] ? 'rgba(59, 130, 246, 0.03)' : 'transparent'
                    }}
                  >
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {pagination && pagination.pages > 1 && (
        <div style={{
          padding: '0.875rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border)'
        }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-sm btn-outline"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
            >
              <HiOutlineChevronLeft size={14} /> Previous
            </button>
            <button
              className="btn btn-sm btn-outline"
              disabled={pagination.page >= pagination.pages}
              onClick={() => onPageChange?.(pagination.page + 1)}
            >
              Next <HiOutlineChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DataTable;
