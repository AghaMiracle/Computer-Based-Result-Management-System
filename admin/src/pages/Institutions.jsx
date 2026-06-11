import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineBuildingOffice2,
  HiOutlineMagnifyingGlass,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlinePauseCircle,
  HiOutlineTrash,
  HiOutlineEye
} from 'react-icons/hi2';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const Institutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => { fetchInstitutions(); }, [page, statusFilter]);

  const fetchInstitutions = async () => {
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);
      const res = await axios.get(`/api/admin/institutions?${params}`);
      setInstitutions(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      // Mock data
      setInstitutions([
        { _id: '1', name: 'University of Lagos', code: 'UNILAG', type: 'university', status: 'active', email: 'admin@unilag.edu.ng', studentCount: 1200, teacherCount: 85, createdAt: '2025-01-15', subscriptionPlan: 'premium', adminUserId: { firstName: 'Admin', lastName: 'User' } },
        { _id: '2', name: 'Covenant University', code: 'CU', type: 'university', status: 'active', email: 'admin@cu.edu.ng', studentCount: 850, teacherCount: 60, createdAt: '2025-03-20', subscriptionPlan: 'basic', adminUserId: { firstName: 'John', lastName: 'Smith' } },
        { _id: '3', name: 'Lagos State Polytechnic', code: 'LASPOTECH', type: 'polytechnic', status: 'pending', email: 'admin@laspotech.edu.ng', studentCount: 0, teacherCount: 0, createdAt: '2026-06-01', subscriptionPlan: 'free', adminUserId: { firstName: 'Jane', lastName: 'Doe' } },
        { _id: '4', name: 'Federal College of Education', code: 'FCE', type: 'college', status: 'suspended', email: 'admin@fce.edu.ng', studentCount: 320, teacherCount: 25, createdAt: '2024-09-10', subscriptionPlan: 'basic', adminUserId: { firstName: 'Mark', lastName: 'Jones' } }
      ]);
      setPagination({ total: 4, page: 1, pages: 1 });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/institutions/${id}/status`, { status });
      toast.success(`Institution ${status} successfully`);
      fetchInstitutions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const statusBadge = (status) => {
    const map = { active: 'badge-success', pending: 'badge-warning', suspended: 'badge-danger', rejected: 'badge-danger' };
    return map[status] || 'badge-neutral';
  };

  const planBadge = (plan) => {
    const map = { free: 'badge-neutral', basic: 'badge-info', premium: 'badge-warning', enterprise: 'badge-success' };
    return map[plan] || 'badge-neutral';
  };

  if (loading) return <LoadingSkeleton type="table" rows={5} />;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>Institutions</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Manage all registered institutions</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem'
            }}>
              <HiOutlineMagnifyingGlass style={{ color: 'var(--text-muted)' }} />
              <input
                type="text" placeholder="Search institutions..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchInstitutions()}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.875rem', color: 'var(--text-primary)', width: 200, fontFamily: 'inherit' }}
              />
            </div>
            {/* Status Filter */}
            <select
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input form-select"
              style={{ width: 'auto', padding: '0.5rem 2.5rem 0.5rem 0.75rem' }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Institution</th>
                <th>Type</th>
                <th>Students</th>
                <th>Teachers</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map((inst, i) => (
                <motion.tr
                  key={inst._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(5,150,105,0.1))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem'
                      }}>
                        {inst.code?.substring(0, 3)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{inst.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inst.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{inst.type}</td>
                  <td style={{ fontWeight: 600 }}>{inst.studentCount?.toLocaleString()}</td>
                  <td style={{ fontWeight: 600 }}>{inst.teacherCount?.toLocaleString()}</td>
                  <td><span className={`badge ${planBadge(inst.subscriptionPlan)}`}>{inst.subscriptionPlan}</span></td>
                  <td><span className={`badge ${statusBadge(inst.status)}`}>{inst.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      {inst.status === 'pending' && (
                        <button onClick={() => updateStatus(inst._id, 'active')} className="btn btn-sm btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                          <HiOutlineCheckCircle size={14} /> Approve
                        </button>
                      )}
                      {inst.status === 'active' && (
                        <button onClick={() => updateStatus(inst._id, 'suspended')} className="btn btn-sm btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--accent)' }}>
                          <HiOutlinePauseCircle size={14} /> Suspend
                        </button>
                      )}
                      {inst.status === 'suspended' && (
                        <button onClick={() => updateStatus(inst._id, 'active')} className="btn btn-sm btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                          <HiOutlineCheckCircle size={14} /> Activate
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm btn-outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
              <button className="btn btn-sm btn-outline" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Institutions;
