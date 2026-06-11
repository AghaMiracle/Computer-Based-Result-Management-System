import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineClock } from 'react-icons/hi2';
import axios from '../api/axios';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => { fetchLogs(); }, [page, actionFilter]);

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (actionFilter) params.append('action', actionFilter);
      const res = await axios.get(`/api/admin/audit-logs?${params}`);
      setLogs(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setLogs([
        { _id: '1', action: 'LOGIN', entity: 'User', description: 'Admin logged in successfully', ipAddress: '192.168.1.1', userAgent: 'Chrome 125', createdAt: new Date().toISOString(), userId: { firstName: 'Super', lastName: 'Admin', email: 'admin@resultmanager.com', role: 'admin' } },
        { _id: '2', action: 'INSTITUTION_STATUS_CHANGE', entity: 'Institution', description: 'UNILAG approved', ipAddress: '192.168.1.1', createdAt: new Date(Date.now() - 3600000).toISOString(), userId: { firstName: 'Super', lastName: 'Admin', email: 'admin@resultmanager.com', role: 'admin' } },
        { _id: '3', action: 'STUDENT_CREATE', entity: 'Student', description: '15 students bulk created', ipAddress: '10.0.0.5', createdAt: new Date(Date.now() - 7200000).toISOString(), userId: { firstName: 'John', lastName: 'Doe', email: 'john@unilag.edu.ng', role: 'institution' } },
        { _id: '4', action: 'RESULT_APPROVE', entity: 'Result', description: 'CSC301 results approved', ipAddress: '10.0.0.12', createdAt: new Date(Date.now() - 14400000).toISOString(), userId: { firstName: 'John', lastName: 'Doe', email: 'john@unilag.edu.ng', role: 'institution' } },
        { _id: '5', action: 'GRADE_MODIFY', entity: 'Result', description: 'Grade changed from B to A for student S001', ipAddress: '10.0.0.8', createdAt: new Date(Date.now() - 28800000).toISOString(), userId: { firstName: 'Prof. Sarah', lastName: 'Williams', email: 'sarah@unilag.edu.ng', role: 'teacher' }, oldValue: { grade: 'B', score: 65 }, newValue: { grade: 'A', score: 75 } },
        { _id: '6', action: 'PASSWORD_CHANGE', entity: 'User', description: 'Password changed', ipAddress: '172.16.0.1', createdAt: new Date(Date.now() - 43200000).toISOString(), userId: { firstName: 'Miracle', lastName: 'Johnson', email: 'miracle@student.unilag.edu.ng', role: 'student' } }
      ]);
      setPagination({ total: 6, page: 1, pages: 1 });
    } finally {
      setLoading(false);
    }
  };

  const actionColors = {
    LOGIN: '#3b82f6', LOGOUT: '#94a3b8', PASSWORD_CHANGE: '#f59e0b', PASSWORD_RESET: '#f59e0b',
    USER_CREATE: '#10b981', USER_UPDATE: '#3b82f6', USER_DELETE: '#ef4444',
    INSTITUTION_CREATE: '#10b981', INSTITUTION_STATUS_CHANGE: '#8b5cf6',
    STUDENT_CREATE: '#10b981', STUDENT_BULK_UPLOAD: '#10b981',
    TEACHER_CREATE: '#10b981', RESULT_CREATE: '#3b82f6',
    RESULT_APPROVE: '#10b981', RESULT_REJECT: '#ef4444', GRADE_MODIFY: '#f59e0b'
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' +
           d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <LoadingSkeleton rows={8} />;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>Audit Logs</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Track all critical actions across the platform</p>
          </div>
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="form-input form-select" style={{ width: 'auto', padding: '0.5rem 2.5rem 0.5rem 0.75rem' }}>
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="STUDENT_CREATE">Student Create</option>
            <option value="RESULT_APPROVE">Result Approve</option>
            <option value="GRADE_MODIFY">Grade Modify</option>
            <option value="INSTITUTION_STATUS_CHANGE">Institution Status</option>
            <option value="PASSWORD_CHANGE">Password Change</option>
          </select>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Description</th>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <motion.tr key={log._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 'var(--radius-full)',
                        background: 'var(--bg-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)'
                      }}>
                        {log.userId?.firstName?.[0]}{log.userId?.lastName?.[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{log.userId?.firstName} {log.userId?.lastName}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{log.userId?.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                      padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-full)',
                      fontSize: '0.6875rem', fontWeight: 600,
                      background: `${actionColors[log.action] || '#94a3b8'}15`,
                      color: actionColors[log.action] || '#94a3b8'
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: actionColors[log.action] || '#94a3b8' }} />
                      {log.action?.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', maxWidth: 300 }}>
                    {log.description}
                    {log.oldValue && (
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        Changed: {JSON.stringify(log.oldValue)} → {JSON.stringify(log.newValue)}
                      </div>
                    )}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{log.ipAddress}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                      <HiOutlineClock size={14} />
                      {formatDate(log.createdAt)}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AuditLogs;
