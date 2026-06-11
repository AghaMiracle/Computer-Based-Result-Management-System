import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineBookOpen, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const CourseRegistration = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const [avail, reg] = await Promise.all([
        axios.get('/api/student/courses/available'),
        axios.get('/api/student/courses/registered')
      ]);
      setAvailableCourses(avail.data.data || []);
      setRegisteredCourses(reg.data.data || []);
    } catch {
      setAvailableCourses([
        { _id: '1', title: 'Database Systems', code: 'CSC301', creditUnits: 3, departmentId: { name: 'Computer Science' }, teacherId: { firstName: 'Dr. James', lastName: 'Wilson' }, semesterType: 'first' },
        { _id: '2', title: 'Operating Systems', code: 'CSC302', creditUnits: 3, departmentId: { name: 'Computer Science' }, teacherId: { firstName: 'Prof. Mary', lastName: 'Adams' }, semesterType: 'first' },
        { _id: '3', title: 'Numerical Methods', code: 'MTH301', creditUnits: 3, departmentId: { name: 'Mathematics' }, teacherId: { firstName: 'Prof. Sarah', lastName: 'Chen' }, semesterType: 'first' },
        { _id: '4', title: 'Software Engineering', code: 'CSC303', creditUnits: 4, departmentId: { name: 'Computer Science' }, teacherId: null, semesterType: 'first' },
        { _id: '5', title: 'Computer Networks', code: 'CSC304', creditUnits: 3, departmentId: { name: 'Computer Science' }, teacherId: { firstName: 'Dr. Peter', lastName: 'Obi' }, semesterType: 'first' }
      ]);
      setRegisteredCourses([
        { _id: 'r1', courseId: { _id: 'c1', title: 'Data Structures', code: 'CSC201', creditUnits: 3 }, status: 'registered' },
        { _id: 'r2', courseId: { _id: 'c2', title: 'Linear Algebra', code: 'MTH201', creditUnits: 3 }, status: 'registered' }
      ]);
    } finally { setLoading(false); }
  };

  const toggleCourse = (courseId) => {
    setSelectedCourses(prev => prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]);
  };

  const handleRegister = async () => {
    if (selectedCourses.length === 0) { toast.error('Select at least one course'); return; }
    try {
      await axios.post('/api/student/courses/register', { courseIds: selectedCourses });
      toast.success(`${selectedCourses.length} course(s) registered`);
      setSelectedCourses([]);
      fetchCourses();
    } catch (error) { toast.error(error.response?.data?.message || 'Registration failed'); }
  };

  const totalSelectedCredits = selectedCourses.reduce((sum, id) => {
    const course = availableCourses.find(c => c._id === id);
    return sum + (course?.creditUnits || 0);
  }, 0);

  const totalRegisteredCredits = registeredCourses.reduce((sum, r) => sum + (r.courseId?.creditUnits || 0), 0);

  if (loading) return <LoadingSkeleton type="table" rows={5} />;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Course Registration</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Register for available courses</p>
      </motion.div>

      {/* Current Registrations */}
      {registeredCourses.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Registered Courses</h3>
            <span className="badge badge-info">{totalRegisteredCredits} Credits</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {registeredCourses.map(r => (
              <div key={r._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <HiOutlineCheckCircle size={16} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{r.courseId?.code}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({r.courseId?.creditUnits} cr)</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Available Courses */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Available Courses</h3>
          {selectedCourses.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{selectedCourses.length} selected • {totalSelectedCredits} credits</span>
              <button onClick={handleRegister} className="btn btn-primary btn-sm">Register Selected</button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {availableCourses.map((course, i) => {
            const isSelected = selectedCourses.includes(course._id);
            return (
              <motion.div key={course._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                onClick={() => toggleCourse(course._id)}
                className="card"
                style={{
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: isSelected ? 'rgba(59,130,246,0.03)' : 'var(--bg-card)',
                  transition: 'var(--transition)'
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: isSelected ? 'linear-gradient(135deg, var(--primary), var(--primary-light))' : 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}>
                      {isSelected ? <HiOutlineCheckCircle size={20} style={{ color: '#fff' }} /> : <HiOutlineBookOpen size={18} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{course.title}</h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{course.code}</p>
                    </div>
                  </div>
                  <span className="badge badge-info">{course.creditUnits} cr</span>
                </div>
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>{course.departmentId?.name}</span>
                  <span>•</span>
                  <span>{course.teacherId ? `${course.teacherId.firstName} ${course.teacherId.lastName}` : 'TBA'}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default CourseRegistration;
