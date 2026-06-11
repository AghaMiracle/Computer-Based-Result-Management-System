import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineEnvelope } from 'react-icons/hi2';
import axios from '../../api/axios';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send reset link'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme === 'dark' ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)', padding: '1rem' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ background: theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius)', background: 'linear-gradient(135deg, #1e40af, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <HiOutlineEnvelope style={{ color: 'white', fontSize: '1.5rem' }} />
            </div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>Forgot Password</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>Enter your email to receive a reset link</p>
          </div>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>If an account exists for <strong>{email}</strong>, you will receive a password reset link.</p>
              <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none', width: '100%' }}>Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Email Address</label><input type="email" className="form-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus /></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/login" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 500 }}>← Back to Login</Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
