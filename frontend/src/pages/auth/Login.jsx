import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineEye, HiOutlineEyeSlash, HiOutlineArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please enter email and password'); return; }
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: isDark
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
        : 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 50%, #eff6ff 100%)',
      padding: '1rem', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59,130,246,0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(5,150,105,0.05) 0%, transparent 50%)`, pointerEvents: 'none' }} />

      {[...Array(4)].map((_, i) => (
        <motion.div key={i}
          animate={{ y: [0, -15, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
          style={{
            position: 'absolute', width: 50 + i * 25, height: 50 + i * 25,
            border: `1px solid ${isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.06)'}`,
            borderRadius: i % 2 === 0 ? '30%' : '50%',
            top: `${15 + i * 20}%`, left: `${8 + i * 22}%`, pointerEvents: 'none'
          }}
        />
      ))}

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        {/* Back to home */}
        <button onClick={() => navigate('/')} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none',
          color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer', fontSize: '0.875rem',
          marginBottom: '1.25rem', padding: 0
        }}>
          <HiOutlineArrowLeft /> Back to Home
        </button>

        <div style={{
          background: isDark ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', padding: '2.5rem',
          boxShadow: isDark ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              style={{
                width: 64, height: 64, borderRadius: 'var(--radius)',
                background: 'linear-gradient(135deg, #1e40af, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem', boxShadow: '0 8px 16px -4px rgba(30,64,175,0.3)'
              }}>
              <HiOutlineAcademicCap style={{ color: 'white', fontSize: '1.75rem' }} />
            </motion.div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: '0.375rem' }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="your@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Password
                <a href="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 500 }}>Forgot Password?</a>
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} className="form-input"
                  placeholder="Enter your password" value={password}
                  onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
                  style={{ paddingRight: '2.75rem' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}>
                  {showPassword ? <HiOutlineEyeSlash size={18} /> : <HiOutlineEye size={18} />}
                </button>
              </div>
            </div>

            <motion.button type="submit" className="btn btn-primary" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
              ) : 'Sign In'}
            </motion.button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <a href="/register" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>Register Institution</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
