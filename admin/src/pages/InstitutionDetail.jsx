import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineBuildingOffice2,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlinePauseCircle,
  HiOutlineTrash,
  HiOutlineGlobeAlt,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineDocumentText
} from 'react-icons/hi2';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import StatCard from '../components/ui/StatCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const InstitutionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { fetchInstitution(); }, [id]);

  const fetchInstitution = async () => {
    try {
      const res = await axios.get(`/api/admin/institutions/${id}`);
      setInstitution(res.data.data);
    } catch {
      // Mock data for development
      setInstitution({
        _id: id,
        name: 'University of Lagos',
        code: 'UNILAG',
        type: 'university',
        status: 'active',
        email: 'admin@unilag.edu.ng',
        phone: '+234-1-2802439',
        website: 'https://unilag.edu.ng',
        address: 'Akoka, Yaba, Lagos, Nigeria',
        logo: null,
        registrationDate: '2025-01-15',
        subscriptionPlan: 'premium',
        subscriptionExpiry: '2027-01-15',
        studentCount: 1200,
        teacherCount: 85,
        departmentCount: 12,
        courseCount: 156,
        adminUserId: { firstName: 'Admin', lastName: 'User', email: 'admin@unilag.edu.ng' },
        gradingScales: [
          { grade: 'A', minScore: 70, maxScore: 100, gradePoint: 5.0, remark: 'Excellent' },
          { grade: 'B', minScore: 60, maxScore: 69, gradePoint: 4.0, remark: 'Very Good' },
          { grade: 'C', minScore: 50, maxScore: 59, gradePoint: 3.0, remark: 'Good' },
          { grade: 'D', minScore: 45, maxScore: 49, gradePoint: 2.0, remark: 'Fair' },
          { grade: 'E', minScore: 40, maxScore: 44, gradePoint: 1.0, remark: 'Pass' },
          { grade: 'F', minScore: 0, maxScore: 39, gradePoint: 0.0, remark: 'Fail' }
        ],
        recentActivity: [
          { action: 'Student enrolled', details: 'John Doe enrolled in CSC 101', date: '2026-06-08' },
          { action: 'Result submitted', details: 'Dr. Smith submitted CSC 201 results', date: '2026-06-07' },
          { action: 'Department created', details: 'Computer Science department added', date: '2026-06-05' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      await axios.put(`/api/admin/institutions/${id}/status`, { status });
      toast.success(`Institution ${status} successfully`);
      fetchInstitution();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this institution? This action cannot be undone.')) return;
    try {
      await axios.delete(`/api/admin/institutions/${id}`);
      toast.success('Institution deleted');
      navigate('/institutions');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  const statusBadge = (status) => {
    const map = { active: 'badge-success', pending: 'badge-warning', suspended: 'badge-danger' };
    return map[status] || 'badge-neutral';
  };

  if (loading) return <LoadingSkeleton type="details" />;
  if (!institution) return <div>Institution not found</div>;

  const tabs = ['overview', 'grading', 'activity'];

  return (
    <div>
      {/* Back button & Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate('/institutions')} className="btn btn-outline btn-sm" style={{ marginBottom: '1rem' }}>
          <HiOutlineArrowLeft size={16} /> Back to Institutions
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 'var(--radius)',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(5,150,105,0.15))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <HiOutlineBuildingOffice2 size={28} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
                {institution.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{institution.code}</span>
                <span className={`badge ${statusBadge(institution.status)}`}>{institution.status}</span>
                <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{institution.type}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {institution.status === 'pending' && (
              <button onClick={() => updateStatus('active')} className="btn btn-sm btn-secondary">
                <HiOutlineCheckCircle size={16} /> Approve
              </button>
            )}
            {institution.status === 'active' && (
              <button onClick={() => updateStatus('suspended')} className="btn btn-sm btn-outline" style={{ color: 'var(--accent)' }}>
                <HiOutlinePauseCircle size={16} /> Suspend
              </button>
            )}
            {institution.status === 'suspended' && (
              <button onClick={() => updateStatus('active')} className="btn btn-sm btn-secondary">
                <HiOutlineCheckCircle size={16} /> Reactivate
              </button>
            )}
            <button onClick={handleDelete} className="btn btn-sm btn-danger">
              <HiOutlineTrash size={16} /> Delete
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard title="Total Students" value={institution.studentCount} icon={HiOutlineAcademicCap} color="blue" delay={0} />
        <StatCard title="Total Teachers" value={institution.teacherCount} icon={HiOutlineUserGroup} color="green" delay={1} />
        <StatCard title="Departments" value={institution.departmentCount || 12} icon={HiOutlineBuildingOffice2} color="purple" delay={2} />
        <StatCard title="Courses" value={institution.courseCount || 156} icon={HiOutlineDocumentText} color="amber" delay={3} />
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '0', marginBottom: '1.5rem',
        borderBottom: '2px solid var(--border)', paddingBottom: 0
      }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: '-2px',
              transition: 'var(--transition)',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatedTab>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Contact Information</h3>
              <InfoRow icon={HiOutlineEnvelope} label="Email" value={institution.email} />
              <InfoRow icon={HiOutlinePhone} label="Phone" value={institution.phone} />
              <InfoRow icon={HiOutlineGlobeAlt} label="Website" value={institution.website} />
              <InfoRow icon={HiOutlineBuildingOffice2} label="Address" value={institution.address} />
            </div>
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Subscription Details</h3>
              <InfoRow icon={HiOutlineDocumentText} label="Plan" value={institution.subscriptionPlan} />
              <InfoRow icon={HiOutlineCalendar} label="Registered" value={new Date(institution.registrationDate).toLocaleDateString()} />
              <InfoRow icon={HiOutlineCalendar} label="Expires" value={institution.subscriptionExpiry ? new Date(institution.subscriptionExpiry).toLocaleDateString() : 'N/A'} />
              <InfoRow icon={HiOutlineUserGroup} label="Admin" value={`${institution.adminUserId?.firstName} ${institution.adminUserId?.lastName}`} />
            </div>
          </div>
        )}

        {activeTab === 'grading' && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Grading Scale</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Grade</th>
                  <th>Min Score</th>
                  <th>Max Score</th>
                  <th>Grade Point</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {institution.gradingScales?.map((scale, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{scale.grade}</td>
                    <td>{scale.minScore}</td>
                    <td>{scale.maxScore}</td>
                    <td>{scale.gradePoint.toFixed(1)}</td>
                    <td><span className="badge badge-info">{scale.remark}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {institution.recentActivity?.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--primary)', marginTop: '0.4rem', flexShrink: 0
                  }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{activity.action}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{activity.details}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{new Date(activity.date).toLocaleDateString()}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatedTab>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.625rem 0',
    borderBottom: '1px solid var(--border-light)'
  }}>
    <Icon size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', width: 100, flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value || 'N/A'}</span>
  </div>
);

const AnimatedTab = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
);

export default InstitutionDetail;
