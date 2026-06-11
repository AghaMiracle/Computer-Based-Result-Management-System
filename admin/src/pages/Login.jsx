import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import {
  HiOutlineAcademicCap,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

/* ─── Floating orb used in background ─── */
const Orb = ({ size, x, y, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.6 }}
    animate={{
      opacity: [0.15, 0.3, 0.15],
      scale: [1, 1.15, 1],
      x: [0, 30, -20, 0],
      y: [0, -25, 15, 0],
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      repeatType: 'mirror',
      delay,
      ease: 'easeInOut',
    }}
    style={{
      position: 'absolute',
      width: size,
      height: size,
      left: x,
      top: y,
      borderRadius: '50%',
      background: color,
      filter: 'blur(80px)',
      pointerEvents: 'none',
    }}
  />
);

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back, Admin!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(135deg, #0a0f1e 0%, #0d1426 40%, #091020 100%)'
          : 'linear-gradient(135deg, #eef2ff 0%, #f0f9ff 40%, #ecfdf5 100%)',
      }}
    >
      {/* ─── Animated background orbs ─── */}
      <Orb size="500px" x="5%" y="10%" color="rgba(59,130,246,0.25)" delay={0} />
      <Orb size="400px" x="65%" y="55%" color="rgba(16,185,129,0.2)" delay={2} />
      <Orb size="350px" x="40%" y="-5%" color="rgba(139,92,246,0.15)" delay={4} />

      {/* ─── Subtle grid overlay ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: isDark
            ? 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)'
            : 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }}
      />

      {/* ─── Login Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          width: '100%',
          maxWidth: '440px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: isDark
              ? 'rgba(15, 23, 42, 0.75)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(24px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
            border: `1px solid ${isDark ? 'rgba(148,163,184,0.12)' : 'rgba(203,213,225,0.6)'}`,
            borderRadius: '1.5rem',
            padding: '1.75rem 2rem',
            boxShadow: isDark
              ? '0 24px 60px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset'
              : '0 24px 60px -12px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.6) inset',
          }}
        >
          {/* ─── Logo & Header ─── */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.15 }}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '1.25rem',
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                boxShadow: '0 12px 32px -4px rgba(59,130,246,0.35)',
              }}
            >
              <HiOutlineAcademicCap style={{ color: '#fff', fontSize: '1.75rem' }} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: isDark ? '#f1f5f9' : '#0f172a',
                marginBottom: '0.25rem',
              }}
            >
              Admin Panel
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isDark ? '#94a3b8' : '#64748b',
              }}
            >
              Student Result Management System
            </motion.p>
          </div>

          {/* ─── Form ─── */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.35 }}
              style={{ marginBottom: '0.875rem' }}
            >
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: isDark ? '#94a3b8' : '#475569',
                  marginBottom: '0.5rem',
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: focusedField === 'email' ? '#3b82f6' : (isDark ? '#64748b' : '#94a3b8'),
                    transition: 'color 0.2s',
                    display: 'flex',
                  }}
                >
                  <HiOutlineEnvelope style={{ width: '18px', height: '18px' }} />
                </div>
                <input
                  id="login-email"
                  type="email"
                  placeholder="admin@resultmanager.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.875rem 0.7rem 2.75rem',
                    borderRadius: '0.875rem',
                    border: `1.5px solid ${
                      focusedField === 'email'
                        ? '#3b82f6'
                        : isDark
                        ? 'rgba(71,85,105,0.5)'
                        : 'rgba(203,213,225,0.8)'
                    }`,
                    background: isDark ? 'rgba(30,41,59,0.6)' : 'rgba(248,250,252,0.8)',
                    color: isDark ? '#f1f5f9' : '#0f172a',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow:
                      focusedField === 'email'
                        ? '0 0 0 3px rgba(59,130,246,0.12)'
                        : 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.35 }}
              style={{ marginBottom: '0.875rem' }}
            >
              <label
                htmlFor="login-password"
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: isDark ? '#94a3b8' : '#475569',
                  marginBottom: '0.5rem',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: focusedField === 'password' ? '#3b82f6' : (isDark ? '#64748b' : '#94a3b8'),
                    transition: 'color 0.2s',
                    display: 'flex',
                  }}
                >
                  <HiOutlineLockClosed style={{ width: '18px', height: '18px' }} />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '0.7rem 3rem 0.7rem 2.75rem',
                    borderRadius: '0.875rem',
                    border: `1.5px solid ${
                      focusedField === 'password'
                        ? '#3b82f6'
                        : isDark
                        ? 'rgba(71,85,105,0.5)'
                        : 'rgba(203,213,225,0.8)'
                    }`,
                    background: isDark ? 'rgba(30,41,59,0.6)' : 'rgba(248,250,252,0.8)',
                    color: isDark ? '#f1f5f9' : '#0f172a',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow:
                      focusedField === 'password'
                        ? '0 0 0 3px rgba(59,130,246,0.12)'
                        : 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: isDark ? '#64748b' : '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = isDark ? '#cbd5e1' : '#475569')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = isDark ? '#64748b' : '#94a3b8')
                  }
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash style={{ width: '20px', height: '20px' }} />
                  ) : (
                    <HiOutlineEye style={{ width: '20px', height: '20px' }} />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.35 }}
              whileHover={{ scale: 1.015, boxShadow: '0 16px 40px -8px rgba(59,130,246,0.35)' }}
              whileTap={{ scale: 0.985 }}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.875rem',
                border: 'none',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #10b981 100%)',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 24px -4px rgba(59,130,246,0.3)',
                opacity: loading ? 0.75 : 1,
                transition: 'opacity 0.2s',
                fontFamily: 'inherit',
                letterSpacing: '0.01em',
              }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2.5px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                  }}
                />
              ) : (
                <>
                  <HiOutlineArrowRightOnRectangle style={{ fontSize: '1.15rem' }} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* ─── Footer hint ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: `1px solid ${isDark ? 'rgba(71,85,105,0.3)' : 'rgba(226,232,240,0.8)'}`,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: isDark ? '#475569' : '#94a3b8',
              }}
            >
              Default credentials
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: isDark ? '#64748b' : '#64748b',
                marginTop: '0.25rem',
                fontFamily: 'monospace',
              }}
            >
              admin@resultmanager.com / Admin@123456
            </p>
          </motion.div>
        </div>

        {/* ─── Bottom branding ─── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: isDark ? '#334155' : '#cbd5e1',
          }}
        >
          © {new Date().getFullYear()} Student Result Manager
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
