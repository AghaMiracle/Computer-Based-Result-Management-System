import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineBellAlert } from 'react-icons/hi2';
import axios from '../../api/axios';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { formatRelativeTime } from '../../utils/formatters';

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/student/notifications');
      setNotifications(res.data.data || []);
    } catch {
      setNotifications([
        { _id: '1', title: 'Results Published', message: 'Your First Semester results have been published. Check your results page.', type: 'result', isRead: false, createdAt: '2026-06-09T10:00:00Z' },
        { _id: '2', title: 'Course Registration Open', message: 'Course registration for Second Semester 2025/2026 is now open. Deadline: June 30.', type: 'announcement', isRead: false, createdAt: '2026-06-08T14:00:00Z' },
        { _id: '3', title: 'Welcome!', message: 'Your account has been created. Please update your profile information.', type: 'system', isRead: true, createdAt: '2026-06-01T09:00:00Z' }
      ]);
    } finally { setLoading(false); }
  };

  const markRead = async (id) => {
    try { await axios.put(`/api/student/notifications/${id}/read`); }
    catch {}
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = async () => {
    try { await axios.put('/api/student/notifications/read-all'); }
    catch {}
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const typeIcon = { result: '📊', announcement: '📢', system: '⚙️' };
  const typeColor = { result: '#10b981', announcement: '#3b82f6', system: '#8b5cf6' };
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <LoadingSkeleton type="table" rows={3} />;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Notifications</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn btn-outline btn-sm">Mark all as read</button>
          )}
        </div>
      </motion.div>

      {notifications.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem' }}>🔔</div>
          <h3 style={{ fontWeight: 700, marginTop: '0.75rem', color: 'var(--text-primary)' }}>No notifications</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>You're all caught up!</p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((notif, i) => (
            <motion.div key={notif._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => markRead(notif._id)}
              className="card" style={{
                cursor: 'pointer', borderLeft: `3px solid ${typeColor[notif.type] || '#94a3b8'}`,
                opacity: notif.isRead ? 0.7 : 1
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{typeIcon[notif.type] || '📌'}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>{notif.title}</h3>
                      {!notif.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>{notif.message}</p>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatRelativeTime(notif.createdAt)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;
