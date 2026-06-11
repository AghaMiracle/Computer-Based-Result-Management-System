import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineBuildingOffice2,
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineArrowTrendingUp
} from 'react-icons/hi2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler, BarElement } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import axios from '../api/axios';
import StatCard from '../components/ui/StatCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler, BarElement);

const Dashboard = () => {
  const { theme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setData(response.data.data);
    } catch (error) {
      // Use mock data if API unavailable
      setData({
        stats: {
          totalInstitutions: 12,
          activeInstitutions: 8,
          pendingInstitutions: 3,
          totalUsers: 4520,
          totalStudents: 3800,
          totalTeachers: 650
        },
        recentActivity: [
          { _id: '1', action: 'LOGIN', description: 'Admin logged in', createdAt: new Date().toISOString(), userId: { firstName: 'Super', lastName: 'Admin', role: 'admin' } },
          { _id: '2', action: 'INSTITUTION_CREATE', description: 'New institution registered', createdAt: new Date(Date.now() - 3600000).toISOString(), userId: { firstName: 'John', lastName: 'Doe', role: 'institution' } },
          { _id: '3', action: 'STUDENT_CREATE', description: 'Student registered', createdAt: new Date(Date.now() - 7200000).toISOString(), userId: { firstName: 'Jane', lastName: 'Smith', role: 'institution' } },
          { _id: '4', action: 'RESULT_APPROVE', description: 'Results approved', createdAt: new Date(Date.now() - 10800000).toISOString(), userId: { firstName: 'Prof', lastName: 'Wilson', role: 'institution' } },
          { _id: '5', action: 'USER_CREATE', description: 'Teacher account created', createdAt: new Date(Date.now() - 14400000).toISOString(), userId: { firstName: 'Admin', lastName: 'User', role: 'admin' } }
        ],
        userDistribution: [
          { _id: 'student', count: 3800 },
          { _id: 'teacher', count: 650 },
          { _id: 'institution', count: 60 },
          { _id: 'admin', count: 10 }
        ],
        monthlyRegistrations: [
          { _id: { month: 1, year: 2026 }, count: 120 },
          { _id: { month: 2, year: 2026 }, count: 250 },
          { _id: { month: 3, year: 2026 }, count: 380 },
          { _id: { month: 4, year: 2026 }, count: 520 },
          { _id: { month: 5, year: 2026 }, count: 680 },
          { _id: { month: 6, year: 2026 }, count: 450 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton type="cards" />;

  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? 'rgba(148,163,184,0.1)' : 'rgba(0,0,0,0.05)';

  // Chart data
  const doughnutData = {
    labels: (data?.userDistribution || []).map(d => d._id.charAt(0).toUpperCase() + d._id.slice(1)),
    datasets: [{
      data: (data?.userDistribution || []).map(d => d.count),
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
      borderWidth: 0,
      borderRadius: 4,
      spacing: 3
    }]
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const registrationData = {
    labels: (data?.monthlyRegistrations || []).map(d => months[d._id.month - 1]),
    datasets: [{
      label: 'New Users',
      data: (data?.monthlyRegistrations || []).map(d => d.count),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
        titleColor: theme === 'dark' ? '#f1f5f9' : '#0f172a',
        bodyColor: theme === 'dark' ? '#94a3b8' : '#475569',
        borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: textColor, font: { size: 12 } } },
      y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 12 } }, beginAtZero: true }
    }
  };

  const actionColors = {
    LOGIN: 'badge-info',
    LOGOUT: 'badge-neutral',
    INSTITUTION_CREATE: 'badge-success',
    INSTITUTION_STATUS_CHANGE: 'badge-warning',
    STUDENT_CREATE: 'badge-success',
    TEACHER_CREATE: 'badge-success',
    RESULT_APPROVE: 'badge-info',
    RESULT_REJECT: 'badge-danger',
    USER_CREATE: 'badge-success',
    PASSWORD_CHANGE: 'badge-warning'
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Welcome back! Here&apos;s an overview of your platform.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <StatCard title="Total Institutions" value={data?.stats?.totalInstitutions || 0} icon={HiOutlineBuildingOffice2} color="blue" delay={0} trend="up" trendValue="12%" />
        <StatCard title="Active Users" value={data?.stats?.totalUsers || 0} icon={HiOutlineUsers} color="green" delay={1} trend="up" trendValue="8%" />
        <StatCard title="Total Students" value={data?.stats?.totalStudents || 0} icon={HiOutlineAcademicCap} color="amber" delay={2} trend="up" trendValue="15%" />
        <StatCard title="Total Teachers" value={data?.stats?.totalTeachers || 0} icon={HiOutlineUserGroup} color="purple" delay={3} />
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        {/* Registration Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Registration Trend</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>New user registrations over time</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#10b981', fontSize: '0.8125rem', fontWeight: 600 }}>
              <HiOutlineArrowTrendingUp />
              <span>+24%</span>
            </div>
          </div>
          <div style={{ height: 260 }}>
            <Line data={registrationData} options={chartOptions} />
          </div>
        </motion.div>

        {/* User Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            User Distribution
          </h3>
          <div style={{ height: 200, display: 'flex', justifyContent: 'center' }}>
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                    titleColor: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                    bodyColor: theme === 'dark' ? '#94a3b8' : '#475569',
                    borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                  }
                }
              }}
            />
          </div>
          {/* Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
            {(data?.userDistribution || []).map((item, i) => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][i]
                }} />
                <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{item._id}</span>
                <span style={{ color: 'var(--text-muted)', marginLeft: 'auto', fontWeight: 600 }}>{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Activity</h3>
          <a href="/audit-logs" style={{ fontSize: '0.8125rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 500 }}>
            View all →
          </a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {(data?.recentActivity || []).map((activity, i) => (
            <motion.div
              key={activity._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.875rem 0',
                borderBottom: i < (data?.recentActivity?.length || 0) - 1 ? '1px solid var(--border-light)' : 'none'
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 700,
                flexShrink: 0
              }}>
                {activity.userId?.firstName?.[0]}{activity.userId?.lastName?.[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {activity.userId?.firstName} {activity.userId?.lastName}
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> — {activity.description || activity.action}</span>
                </div>
              </div>
              <span className={`badge ${actionColors[activity.action] || 'badge-neutral'}`}>
                {activity.action?.replace(/_/g, ' ')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', flexShrink: 0 }}>
                <HiOutlineClock size={14} />
                {formatTime(activity.createdAt)}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
