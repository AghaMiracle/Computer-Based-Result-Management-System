import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineKey } from 'react-icons/hi2';
import axios from '../../api/axios';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { theme } = useTheme();
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { newPassword: password });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) { toast.error(err.response?.data?.message || 'Reset failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme === 'dark' ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)', padding: '1rem' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ background: theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius)', background: 'linear-gradient(135deg, #1e40af, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <HiOutlineKey style={{ color: 'white', fontSize: '1.5rem' }} />
            </div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>Reset Password</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>Enter your new password</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">New Password</label><input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} /></div>
            <div className="form-group"><label className="form-label">Confirm Password</label><input type="password" className="form-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/login" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 500 }}>← Back to Login</Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
