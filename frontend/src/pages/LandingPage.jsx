import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  HiOutlineAcademicCap, HiOutlineShieldCheck, HiOutlineChartBar,
  HiOutlineDocumentText, HiOutlineUserGroup, HiOutlineBookOpen,
  HiOutlineClipboardDocumentCheck, HiOutlineCog6Tooth, HiOutlineArrowRight,
  HiOutlineBuildingLibrary, HiOutlineSparkles, HiOutlineBell,
  HiOutlineSun, HiOutlineMoon
} from 'react-icons/hi2';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } })
};

const features = [
  { icon: HiOutlineShieldCheck, title: 'Accurate Grading', desc: 'Auto-computed grades with institution-specific grading scales. No more manual errors.', color: '#059669' },
  { icon: HiOutlineUserGroup, title: 'Multi-Role Access', desc: 'Dedicated dashboards for institutions, teachers, and students with role-based permissions.', color: '#1e40af' },
  { icon: HiOutlineChartBar, title: 'Real-Time Analytics', desc: 'Live performance analytics, grade distributions, and GPA tracking at a glance.', color: '#7c3aed' },
  { icon: HiOutlineDocumentText, title: 'Transcript Generation', desc: 'Generate official transcripts and broadsheets instantly with full academic history.', color: '#dc2626' },
  { icon: HiOutlineClipboardDocumentCheck, title: 'Result Approval Flow', desc: 'Teachers submit, institutions approve. Complete audit trail for every grade change.', color: '#ea580c' },
  { icon: HiOutlineBookOpen, title: 'Course Management', desc: 'Create departments, courses, and sessions. Assign teachers and manage enrollments.', color: '#0891b2' },
];

const steps = [
  { num: '01', title: 'Register Your Institution', desc: 'Sign up your university or college. An admin will approve your account.', icon: HiOutlineBuildingLibrary },
  { num: '02', title: 'Set Up Courses & People', desc: 'Create departments, add courses, register teachers and students. Credentials sent automatically.', icon: HiOutlineCog6Tooth },
  { num: '03', title: 'Publish Results', desc: 'Teachers enter grades, submit for approval. Students see results instantly once approved.', icon: HiOutlineSparkles },
];

const roles = [
  { role: 'Institution', desc: 'Manage your entire academic structure — departments, courses, teachers, students, grading scales. Approve results before publication.', icon: HiOutlineBuildingLibrary, gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)' },
  { role: 'Teacher', desc: 'View assigned courses, enter student grades in a spreadsheet-style interface, and submit results for institutional approval.', icon: HiOutlineBookOpen, gradient: 'linear-gradient(135deg, #059669, #10b981)' },
  { role: 'Student', desc: 'Register for courses, view semester results with GPA, access your full transcript, and track academic progress.', icon: HiOutlineAcademicCap, gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
  { role: 'Admin', desc: 'Oversee all institutions on the platform. Approve registrations, monitor activity, and manage the entire system.', icon: HiOutlineShieldCheck, gradient: 'linear-gradient(135deg, #dc2626, #f87171)' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#0a0f1e' : '#f8fafc', color: isDark ? '#e2e8f0' : '#1e293b', overflowX: 'hidden' }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: isDark ? 'rgba(10,15,30,0.85)' : 'rgba(248,250,252,0.85)',
        backdropFilter: 'blur(20px)', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #1e40af, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HiOutlineAcademicCap style={{ color: 'white', fontSize: '1.25rem' }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-0.025em' }}>ResultManager</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#94a3b8' : '#64748b', display: 'flex', padding: 8, borderRadius: 8 }} aria-label="Toggle theme">
              {isDark ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
            </button>
            <button onClick={() => navigate('/login')} style={{
              background: 'none', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
              color: isDark ? '#e2e8f0' : '#1e293b', padding: '0.5rem 1.25rem', borderRadius: 8,
              fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}>Sign In</button>
            <button onClick={() => navigate('/register')} style={{
              background: 'linear-gradient(135deg, #1e40af, #059669)', color: 'white', border: 'none',
              padding: '0.5rem 1.25rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer'
            }}>Register</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 160, paddingBottom: 100, position: 'relative', overflow: 'hidden' }}>
        {/* Background decorations */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '10%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,64,175,0.08) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 70%)' }} />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 1rem',
              borderRadius: 50, background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)',
              border: `1px solid ${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.15)'}`,
              fontSize: '0.8125rem', color: '#3b82f6', fontWeight: 600, marginBottom: '1.5rem'
            }}>
              <HiOutlineSparkles /> Academic Results Platform
            </div>
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp} style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-0.03em', marginBottom: '1.5rem', maxWidth: 800, margin: '0 auto 1.5rem'
          }}>
            Academic Results,{' '}
            <span style={{ background: 'linear-gradient(135deg, #1e40af, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Simplified
            </span>
          </motion.h1>

          <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp} style={{
            fontSize: '1.125rem', color: isDark ? '#94a3b8' : '#64748b', maxWidth: 640,
            margin: '0 auto 2.5rem', lineHeight: 1.7
          }}>
            A comprehensive platform for managing student results with precision. From grade entry to transcript generation — every step automated, audited, and accurate.
          </motion.p>

          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} style={{
              background: 'linear-gradient(135deg, #1e40af, #059669)', color: 'white', border: 'none',
              padding: '0.875rem 2rem', borderRadius: 12, fontSize: '1rem', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 8px 32px -8px rgba(30,64,175,0.4)', transition: 'transform 0.2s'
            }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              Register Your Institution <HiOutlineArrowRight />
            </button>
            <button onClick={() => navigate('/login')} style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              color: isDark ? '#e2e8f0' : '#1e293b',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              padding: '0.875rem 2rem', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: 'pointer'
            }}>Sign In →</button>
          </motion.div>

          {/* Stats */}
          <motion.div initial="hidden" animate="visible" custom={5} variants={fadeUp} style={{
            display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap'
          }}>
            {[{ label: 'Grade Accuracy', value: '99.9%' }, { label: 'Faster Processing', value: '10x' }, { label: 'Data Security', value: '100%' }].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg, #1e40af, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.value}</div>
                <div style={{ fontSize: '0.875rem', color: isDark ? '#64748b' : '#94a3b8', fontWeight: 500, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 0', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
              Everything You Need to Manage Results
            </h2>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
              Built for educational institutions of all sizes. From a single department to a multi-faculty university.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  borderRadius: 16, padding: '2rem', transition: 'all 0.3s',
                  cursor: 'default'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 40px -12px ${f.color}15`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <f.icon style={{ fontSize: '1.375rem', color: f.color }} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
              Get Started in 3 Simple Steps
            </h2>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', maxWidth: 500, margin: '0 auto' }}>
              From registration to result publication in minutes, not weeks.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {steps.map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                style={{
                  textAlign: 'center', padding: '2.5rem 2rem',
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  borderRadius: 16, position: 'relative'
                }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, background: 'linear-gradient(135deg, #1e40af, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem', lineHeight: 1 }}>
                  {step.num}
                </div>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, margin: '0 auto 1.25rem',
                  background: 'linear-gradient(135deg, rgba(30,64,175,0.1), rgba(5,150,105,0.1))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <step.icon style={{ fontSize: '1.5rem', color: '#3b82f6' }} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section style={{ padding: '80px 0', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
              Built for Every Role
            </h2>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
              Each user sees exactly what they need — no more, no less. Powered by role-based access control.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {roles.map((r, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  borderRadius: 16, overflow: 'hidden', transition: 'transform 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ background: r.gradient, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <r.icon style={{ color: 'white', fontSize: '1.25rem' }} />
                  </div>
                  <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.0625rem', margin: 0 }}>{r.role}</h3>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div style={{
              background: 'linear-gradient(135deg, #1e40af, #059669)', borderRadius: 24,
              padding: '3.5rem 2.5rem', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
              <h2 style={{ color: 'white', fontSize: '1.875rem', fontWeight: 800, marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                Ready to Transform Your Result Management?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.0625rem', marginBottom: '2rem', position: 'relative', zIndex: 1, lineHeight: 1.6 }}>
                Join institutions already using ResultManager for efficient, accurate, and transparent academic result processing.
              </p>
              <button onClick={() => navigate('/register')} style={{
                background: 'white', color: '#1e40af', border: 'none',
                padding: '0.875rem 2.5rem', borderRadius: 12, fontSize: '1rem',
                fontWeight: 700, cursor: 'pointer', position: 'relative', zIndex: 1,
                boxShadow: '0 8px 32px -8px rgba(0,0,0,0.3)'
              }}>
                Get Started Free <HiOutlineArrowRight style={{ marginLeft: 8, verticalAlign: 'middle' }} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '2.5rem 2rem', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #1e40af, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HiOutlineAcademicCap style={{ color: 'white', fontSize: '1rem' }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>ResultManager</span>
        </div>
        <p style={{ color: isDark ? '#475569' : '#94a3b8', fontSize: '0.8125rem', margin: 0 }}>
          © {new Date().getFullYear()} Student Result Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
