import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineUserGroup, HiOutlineBookOpen, HiOutlineRectangleGroup, HiOutlineClipboardDocumentCheck, HiOutlineClock } from 'react-icons/hi2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import axios from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const InstitutionDashboard = () => {
  const { theme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/institution/dashboard');
        setData(res.data.data);
      } catch {
        setData({
          stats: { totalStudents: 1247, totalTeachers: 83, totalCourses: 156, totalDepartments: 12, pendingResults: 24 },
          recentResults: [
            { _id: '1', courseId: { title: 'Computer Science 301', code: 'CSC301' }, teacherId: { firstName: 'Prof.', lastName: 'Adams' }, status: 'submitted', submittedAt: new Date().toISOString() },
            { _id: '2', courseId: { title: 'Mathematics 201', code: 'MTH201' }, teacherId: { firstName: 'Dr.', lastName: 'Brown' }, status: 'submitted', submittedAt: new Date(Date.now() - 7200000).toISOString() }
          ],
          departmentDistribution: [
            { name: 'Computer Science', count: 350 },
            { name: 'Mathematics', count: 180 },
            { name: 'Physics', count: 120 },
            { name: 'Chemistry', count: 95 },
            { name: 'Biology', count: 140 },
            { name: 'Engineering', count: 280 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton type="cards" />;

  const deptData = {
    labels: data?.departmentDistribution?.map(d => d.name) || [],
    datasets: [{
      label: 'Students',
      data: data?.departmentDistribution?.map(d => d.count) || [],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'],
      borderWidth: 0, borderRadius: 6
    }]
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Institution Dashboard</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Overview of your institution's academic ecosystem</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard title="Students" value={data?.stats?.totalStudents || 0} icon={HiOutlineAcademicCap} color="blue" delay={0} />
        <StatCard title="Teachers" value={data?.stats?.totalTeachers || 0} icon={HiOutlineUserGroup} color="green" delay={1} />
        <StatCard title="Courses" value={data?.stats?.totalCourses || 0} icon={HiOutlineBookOpen} color="amber" delay={2} />
        <StatCard title="Departments" value={data?.stats?.totalDepartments || 0} icon={HiOutlineRectangleGroup} color="purple" delay={3} />
        <StatCard title="Pending Results" value={data?.stats?.pendingResults || 0} icon={HiOutlineClipboardDocumentCheck} color="red" delay={4} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Students by Department</h3>
          <div style={{ height: 250 }}>
            <Bar data={deptData} options={{
              responsive: true, maintainAspectRatio: false, indexAxis: 'y',
              plugins: { legend: { display: false } },
              scales: { x: { grid: { display: false }, ticks: { color: theme === 'dark' ? '#94a3b8' : '#64748b' } }, y: { grid: { display: false }, ticks: { color: theme === 'dark' ? '#94a3b8' : '#64748b', font: { size: 11 } } } }
            }} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Pending Approvals</h3>
            <a href="/dashboard/result-approval" style={{ fontSize: '0.8125rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 500 }}>View all →</a>
          </div>
          {(data?.recentResults || []).map((r, i) => (
            <div key={r._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 0', borderBottom: i < data.recentResults.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiOutlineClipboardDocumentCheck style={{ color: '#f59e0b', fontSize: '1.125rem' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{r.courseId?.code} - {r.courseId?.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Submitted by {r.teacherId?.firstName} {r.teacherId?.lastName}</div>
              </div>
              <span className="badge badge-warning">Pending</span>
            </div>
          ))}
          {(!data?.recentResults || data.recentResults.length === 0) && (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No pending approvals</div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
