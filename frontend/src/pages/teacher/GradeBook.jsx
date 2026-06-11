import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import axios from '../../api/axios';
import { useTheme } from '../../context/ThemeContext';
import { getGradeColor, getGradeHex } from '../../utils/gradeColors';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const GradeBook = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(courseId || '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => { try { const res = await axios.get('/api/teacher/courses'); setCourses(res.data.data); } catch {} };
    fetch();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    setLoading(true);
    const fetch = async () => {
      try { const res = await axios.get(`/api/teacher/results/${selectedCourse}`); setData(res.data.data); }
      catch { setData(null); } finally { setLoading(false); }
    };
    fetch();
  }, [selectedCourse]);

  const gradeChartData = data ? {
    labels: Object.keys(data.gradeDistribution),
    datasets: [{ data: Object.values(data.gradeDistribution), backgroundColor: Object.keys(data.gradeDistribution).map(g => getGradeHex(g)), borderWidth: 0, spacing: 3 }]
  } : null;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Grade Book</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>View and manage entered grades</p>
      </motion.div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <select className="form-input form-select" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ width: 'auto', minWidth: 250 }}>
          <option value="">Select Course</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.code} — {c.title}</option>)}
        </select>
      </div>

      {!selectedCourse ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Select a course to view its grade book.</div>
      ) : loading ? <LoadingSkeleton type="cards" /> : !data ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No results found.</div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Students', value: data.stats.totalStudents, color: '#3b82f6' },
              { label: 'Average', value: data.stats.avgScore, color: '#8b5cf6' },
              { label: 'Highest', value: data.stats.highestScore, color: '#10b981' },
              { label: 'Lowest', value: data.stats.lowestScore, color: '#ef4444' },
              { label: 'Passed', value: data.stats.passed, color: '#059669' },
              { label: 'Failed', value: data.stats.failed, color: '#dc2626' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem' }}>
            {/* Results Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead><tr><th>Student</th><th>CA</th><th>Exam</th><th>Total</th><th>Grade</th><th>Status</th></tr></thead>
                  <tbody>
                    {data.results.map(r => (
                      <tr key={r._id}>
                        <td style={{ fontWeight: 600 }}>{r.studentId?.firstName} {r.studentId?.lastName}</td>
                        <td>{r.caScore}</td>
                        <td>{r.examScore}</td>
                        <td style={{ fontWeight: 700 }}>{r.totalScore}</td>
                        <td><span style={{ ...getGradeColor(r.letterGrade, theme), padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>{r.letterGrade}</span></td>
                        <td><span className={`badge badge-${r.status === 'approved' ? 'success' : r.status === 'submitted' ? 'info' : 'warning'}`}>{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Grade Distribution */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem' }}>Grade Distribution</h3>
              {gradeChartData && <div style={{ height: 200 }}><Doughnut data={gradeChartData} options={{ responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 8 } } } }} /></div>}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default GradeBook;
