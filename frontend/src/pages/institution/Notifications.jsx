import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineBellAlert, HiOutlineCheckCircle, HiOutlinePlusCircle } from 'react-icons/hi2';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { formatRelativeTime } from '../../utils/formatters';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'announcement' });

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/institution/notifications');
      setNotifications(res.data.data || []);
    } catch {
      setNotifications([
        { _id: '1', title: 'Result Submission Deadline', message: 'All results for First Semester must be submitted by June 30, 2026.', type: 'announcement', isRead: false, createdAt: '2026-06-09T08:00:00Z' },
        { _id: '2', title: 'New Student Registration', message: '15 new students have been registered in the Computer Science department.', type: 'system', isRead: true, createdAt: '2026-06-08T14:30:00Z' },
        { _id: '3', title: 'Results Approved', message: 'CSC101 results have been approved and published.', type: 'result', isRead: true, createdAt: '2026-06-07T10:00:00Z' }
      ]);
    } finally { setLoading(false); }
  };

  const markRead = async (id) => {
    try {
      await axios.put(`/api/institution/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const sendNotification = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/institution/notifications', form);
      toast.success('Notification sent');
      setShowModal(false); setForm({ title: '', message: '', type: 'announcement' }); fetchNotifications();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const typeIcon = (type) => {
    const map = { announcement: '📢', result: '📊', system: '⚙️' };
    return map[type] || '📌';
  };

  const typeColor = (type) => {
    const map = { announcement: '#3b82f6', result: '#10b981', system: '#8b5cf6' };
    return map[type] || '#94a3b8';
  };

  if (loading) return <LoadingSkeleton type="table" rows={3} />;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Notifications</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Manage announcements and notifications</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm"><HiOutlinePlusCircle size={16} /> Send Notification</button>
        </div>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {notifications.map((notif, i) => (
          <motion.div key={notif._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="card" onClick={() => markRead(notif._id)}
            style={{
              cursor: 'pointer',
              borderLeft: `3px solid ${typeColor(notif.type)}`,
              opacity: notif.isRead ? 0.75 : 1,
              background: notif.isRead ? 'var(--bg-card)' : 'var(--bg-secondary)'
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{typeIcon(notif.type)}</span>
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

      {showModal && (
        <div onClick={(e) => e.target === e.currentTarget && setShowModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', width: '100%', maxWidth: 500, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}><h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Send Notification</h3></div>
            <form onSubmit={sendNotification} style={{ padding: '1.5rem' }}>
              <div className="form-group"><label className="form-label">Type</label>
                <select className="form-input form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="announcement">Announcement</option><option value="result">Result</option><option value="system">System</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Title</label><input className="form-input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-input" rows={4} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ resize: 'vertical' }} /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Send</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
