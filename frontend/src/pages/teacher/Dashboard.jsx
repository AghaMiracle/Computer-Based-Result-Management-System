import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineBookOpen, HiOutlineDocumentText, HiOutlineClipboardDocumentCheck, HiOutlinePaperAirplane } from 'react-icons/hi2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import axios from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

ChartJS.register(ArcElement, Tooltip, Legend);

const TeacherDashboard = () => {
  const { theme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/teacher/dashboard');
        setData(res.data.data);
      } catch {
        setData({
          stats: { totalCourses: 5, draftResults: 42, submittedResults: 18, approvedResults: 156 },
          myCourses: [
            { _id: '1', title: 'Computer Science 301', code: 'CSC301', creditUnits: 3, departmentId: { name: 'Computer Science' }, level: 300 },
            { _id: '2', title: 'Data Structures', code: 'CSC203', creditUnits: 4, departmentId: { name: 'Computer Science' }, level: 200 },
            { _id: '3', title: 'Operating Systems', code: 'CSC401', creditUnits: 3, departmentId: { name: 'Computer Science' }, level: 400 },
            { _id: '4', title: 'Introduction to Programming', code: 'CSC101', creditUnits: 3, departmentId: { name: 'Computer Science' }, level: 100 },
            { _id: '5', title: 'Database Management', code: 'CSC305', creditUnits: 3, departmentId: { name: 'Computer Science' }, level: 300 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton type="cards" />;

  const resultStatusData = {
    labels: ['Draft', 'Submitted', 'Approved'],
    datasets: [{
      data: [data?.stats?.draftResults || 0, data?.stats?.submittedResults || 0, data?.stats?.approvedResults || 0],
      backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
      borderWidth: 0, spacing: 3
    }]
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Teacher Dashboard</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Manage your courses and results</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard title="My Courses" value={data?.stats?.totalCourses || 0} icon={HiOutlineBookOpen} color="blue" delay={0} />
        <StatCard title="Draft Results" value={data?.stats?.draftResults || 0} icon={HiOutlineDocumentText} color="amber" delay={1} />
        <StatCard title="Submitted" value={data?.stats?.submittedResults || 0} icon={HiOutlinePaperAirplane} color="blue" delay={2} />
        <StatCard title="Approved" value={data?.stats?.approvedResults || 0} icon={HiOutlineClipboardDocumentCheck} color="green" delay={3} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>My Courses</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(data?.myCourses || []).map((course, i) => (
              <motion.div key={course._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                  border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)',
                  transition: 'var(--transition)', cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-light)'; e.currentTarget.style.background = 'rgba(59,130,246,0.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(5,150,105,0.1))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.75rem', color: 'var(--primary)'
                }}>
                  {course.code?.substring(0, 3)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{course.code} — {course.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.departmentId?.name} • Level {course.level} • {course.creditUnits} CU</div>
                </div>
                <span className="badge badge-info">Active</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Result Status</h3>
          <div style={{ height: 180, display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={resultStatusData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false } } }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem' }}>
            {[{ label: 'Draft', color: '#f59e0b', count: data?.stats?.draftResults }, { label: 'Submitted', color: '#3b82f6', count: data?.stats?.submittedResults }, { label: 'Approved', color: '#10b981', count: data?.stats?.approvedResults }].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
                <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{item.label}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
