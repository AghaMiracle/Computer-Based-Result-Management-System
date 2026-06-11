import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineBuildingLibrary, HiOutlineUser, HiOutlineCheck, HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

const steps = ['Institution Details', 'Admin Account', 'Confirmation'];

const RegisterInstitution = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '', code: '', type: 'university', email: '', phone: '', address: '', website: '', motto: '',
    adminFirstName: '', adminLastName: '', adminEmail: '', adminPassword: '', confirmPassword: ''
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const canProceed = () => {
    if (currentStep === 0) return form.name && form.code && form.type && form.email;
    if (currentStep === 1) return form.adminFirstName && form.adminLastName && form.adminEmail && form.adminPassword && form.adminPassword === form.confirmPassword;
    return true;
  };

  const handleSubmit = async () => {
    if (form.adminPassword !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      await axios.post('/api/institution/register', data);
      setSuccess(true);
      setCurrentStep(2);
      toast.success('Institution registered successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: 10,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    color: isDark ? '#e2e8f0' : '#1e293b', fontSize: '0.9375rem', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box'
  };

  const labelStyle = { display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: isDark ? '#cbd5e1' : '#475569' };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: isDark
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
        : 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 50%, #eff6ff 100%)',
      padding: '2rem'
    }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 560, position: 'relative' }}>

        {/* Back to home */}
        <button onClick={() => navigate('/')} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none',
          color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer', fontSize: '0.875rem',
          marginBottom: '1.5rem', padding: 0
        }}>
          <HiOutlineArrowLeft /> Back to Home
        </button>

        <div style={{
          background: isDark ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)', borderRadius: 20,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          padding: '2.5rem', boxShadow: isDark ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.08)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #1e40af, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
            }}>
              <HiOutlineBuildingLibrary style={{ color: 'white', fontSize: '1.5rem' }} />
            </div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.25rem' }}>
              Register Your Institution
            </h1>
            <p style={{ fontSize: '0.875rem', color: isDark ? '#94a3b8' : '#64748b' }}>
              Create an account for your university or college
            </p>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700,
                  background: i <= currentStep ? 'linear-gradient(135deg, #1e40af, #059669)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                  color: i <= currentStep ? 'white' : (isDark ? '#64748b' : '#94a3b8')
                }}>
                  {i < currentStep || success ? <HiOutlineCheck /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 40, height: 2, borderRadius: 1, background: i < currentStep ? '#059669' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)') }} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Institution Details */}
            {currentStep === 0 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Institution Name *</label>
                    <input style={inputStyle} placeholder="e.g. University of Technology" value={form.name} onChange={e => update('name', e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Institution Code *</label>
                      <input style={inputStyle} placeholder="e.g. UNILAG" value={form.code} onChange={e => update('code', e.target.value.toUpperCase())} maxLength={10} />
                    </div>
                    <div>
                      <label style={labelStyle}>Type *</label>
                      <select style={inputStyle} value={form.type} onChange={e => update('type', e.target.value)}>
                        <option value="university">University</option>
                        <option value="college">College</option>
                        <option value="polytechnic">Polytechnic</option>
                        <option value="school">School</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Institution Email *</label>
                    <input style={inputStyle} type="email" placeholder="info@university.edu" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Phone</label>
                      <input style={inputStyle} placeholder="+234..." value={form.phone} onChange={e => update('phone', e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Website</label>
                      <input style={inputStyle} placeholder="https://..." value={form.website} onChange={e => update('website', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Address</label>
                    <input style={inputStyle} placeholder="Institution address" value={form.address} onChange={e => update('address', e.target.value)} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Admin Account */}
            {currentStep === 1 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <p style={{ fontSize: '0.8125rem', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  This will be the admin account for your institution. You'll use these credentials to log in and manage everything.
                </p>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>First Name *</label>
                      <input style={inputStyle} placeholder="John" value={form.adminFirstName} onChange={e => update('adminFirstName', e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Name *</label>
                      <input style={inputStyle} placeholder="Doe" value={form.adminLastName} onChange={e => update('adminLastName', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Admin Email *</label>
                    <input style={inputStyle} type="email" placeholder="admin@university.edu" value={form.adminEmail} onChange={e => update('adminEmail', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input style={{ ...inputStyle, paddingRight: '2.75rem' }} type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.adminPassword} onChange={e => update('adminPassword', e.target.value)} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#64748b' : '#94a3b8', display: 'flex', padding: 0 }}>
                        {showPassword ? <HiOutlineEyeSlash size={18} /> : <HiOutlineEye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password *</label>
                    <input style={inputStyle} type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
                    {form.confirmPassword && form.adminPassword !== form.confirmPassword && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 4 }}>Passwords do not match</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {currentStep === 2 && success && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #10b981)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                  boxShadow: '0 12px 24px -8px rgba(5,150,105,0.4)'
                }}>
                  <HiOutlineCheck style={{ color: 'white', fontSize: '2rem' }} />
                </div>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.75rem' }}>Registration Successful!</h2>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                  Your institution <strong>{form.name}</strong> has been registered successfully.
                </p>
                <div style={{
                  background: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)',
                  border: `1px solid ${isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)'}`,
                  borderRadius: 12, padding: '1rem', margin: '1.25rem 0', textAlign: 'left'
                }}>
                  <p style={{ fontSize: '0.8125rem', color: '#3b82f6', fontWeight: 600, marginBottom: 4 }}>📋 What happens next?</p>
                  <ul style={{ fontSize: '0.8125rem', color: isDark ? '#94a3b8' : '#64748b', paddingLeft: '1.25rem', margin: 0, lineHeight: 1.8 }}>
                    <li>A system admin will review and approve your institution</li>
                    <li>Once approved, log in with your admin credentials</li>
                    <li>Start setting up departments, courses, teachers, and students</li>
                  </ul>
                </div>
                <button onClick={() => navigate('/login')} style={{
                  background: 'linear-gradient(135deg, #1e40af, #059669)', color: 'white', border: 'none',
                  padding: '0.75rem 2rem', borderRadius: 10, fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem'
                }}>
                  Go to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {!success && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              {currentStep > 0 ? (
                <button onClick={() => setCurrentStep(currentStep - 1)} style={{
                  background: 'none', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  color: isDark ? '#e2e8f0' : '#1e293b', padding: '0.625rem 1.5rem', borderRadius: 10,
                  fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <HiOutlineArrowLeft /> Back
                </button>
              ) : <div />}

              {currentStep === 0 && (
                <button onClick={() => setCurrentStep(1)} disabled={!canProceed()} style={{
                  background: canProceed() ? 'linear-gradient(135deg, #1e40af, #059669)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                  color: canProceed() ? 'white' : (isDark ? '#64748b' : '#94a3b8'),
                  border: 'none', padding: '0.625rem 1.5rem', borderRadius: 10,
                  fontSize: '0.875rem', fontWeight: 600, cursor: canProceed() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  Next <HiOutlineArrowRight />
                </button>
              )}

              {currentStep === 1 && (
                <button onClick={handleSubmit} disabled={!canProceed() || loading} style={{
                  background: canProceed() && !loading ? 'linear-gradient(135deg, #1e40af, #059669)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                  color: canProceed() && !loading ? 'white' : (isDark ? '#64748b' : '#94a3b8'),
                  border: 'none', padding: '0.625rem 1.5rem', borderRadius: 10,
                  fontSize: '0.875rem', fontWeight: 600, cursor: canProceed() && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1
                }}>
                  {loading ? 'Registering...' : 'Register Institution'}
                </button>
              )}
            </div>
          )}

          {/* Login link */}
          {!success && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.8125rem', color: isDark ? '#64748b' : '#94a3b8' }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>Sign In</a>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterInstitution;
