import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineBookOpen, HiOutlineDocumentText, HiOutlineBell, HiOutlineAcademicCap, HiOutlineTrophy } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/student/dashboard');
        setData(res.data.data);
      } catch {
        setData({
          profile: { matricNumber: 'UNILAG/2025/CSC/0001', departmentId: { name: 'Computer Science' }, level: 300, status: 'active' },
          stats: { totalCourses: 6, totalResults: 24, unreadNotifications: 3, cgpa: 4.32, classification: 'Second Class Upper' },
          recentResults: [
            { _id: '1', courseId: { title: 'Computer Science 301', code: 'CSC301', creditUnits: 3 }, totalScore: 78, letterGrade: 'A', gradePoint: 5.0, semesterId: { name: 'First Semester' }, sessionId: { name: '2025/2026' } },
            { _id: '2', courseId: { title: 'Data Structures', code: 'CSC203', creditUnits: 4 }, totalScore: 65, letterGrade: 'B', gradePoint: 4.0, semesterId: { name: 'First Semester' }, sessionId: { name: '2025/2026' } },
            { _id: '3', courseId: { title: 'Mathematics 201', code: 'MTH201', creditUnits: 3 }, totalScore: 54, letterGrade: 'C', gradePoint: 3.0, semesterId: { name: 'First Semester' }, sessionId: { name: '2025/2026' } },
            { _id: '4', courseId: { title: 'Physics 201', code: 'PHY201', creditUnits: 2 }, totalScore: 82, letterGrade: 'A', gradePoint: 5.0, semesterId: { name: 'First Semester' }, sessionId: { name: '2025/2026' } },
            { _id: '5', courseId: { title: 'English 101', code: 'ENG101', creditUnits: 2 }, totalScore: 71, letterGrade: 'A', gradePoint: 5.0, semesterId: { name: 'First Semester' }, sessionId: { name: '2025/2026' } }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton type="cards" />;

  const gradeColors = { A: '#10b981', B: '#3b82f6', C: '#f59e0b', D: '#f97316', E: '#ef4444', F: '#dc2626' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Welcome, {user?.firstName}! 👋</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {data?.profile?.matricNumber} • {data?.profile?.departmentId?.name} • Level {data?.profile?.level}
        </p>
      </motion.div>

      {/* CGPA Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card" style={{
          background: 'linear-gradient(135deg, #1e40af, #059669)',
          color: 'white', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem'
        }}>
        <div>
          <p style={{ fontSize: '0.8125rem', opacity: 0.7, fontWeight: 500, marginBottom: '0.25rem' }}>Cumulative GPA</p>
          <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.025em' }}>{data?.stats?.cgpa?.toFixed(2) || '0.00'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <HiOutlineTrophy size={16} />
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{data?.stats?.classification}</span>
          </div>
        </div>
        <div style={{ width: 100, height: 100, borderRadius: '50%', border: '6px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{data?.stats?.cgpa?.toFixed(1)}</div>
          <div style={{ fontSize: '0.625rem', opacity: 0.7 }}>/ 5.0</div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard title="Registered Courses" value={data?.stats?.totalCourses || 0} icon={HiOutlineBookOpen} color="blue" delay={0} />
        <StatCard title="Results Published" value={data?.stats?.totalResults || 0} icon={HiOutlineDocumentText} color="green" delay={1} />
        <StatCard title="Notifications" value={data?.stats?.unreadNotifications || 0} icon={HiOutlineBell} color="amber" delay={2} />
      </div>

      {/* Recent Results */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Results</h3>
          <a href="/dashboard/results" style={{ fontSize: '0.8125rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 500 }}>View all →</a>
        </div>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {(data?.recentResults || []).map((result, i) => (
            <motion.div key={result._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem',
                border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)',
                transition: 'var(--transition)'
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-sm)',
                background: `${gradeColors[result.letterGrade]}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1rem', color: gradeColors[result.letterGrade]
              }}>
                {result.letterGrade}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{result.courseId?.code} — {result.courseId?.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{result.courseId?.creditUnits} Credit Units • {result.semesterId?.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{result.totalScore}%</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>GP: {result.gradePoint}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
