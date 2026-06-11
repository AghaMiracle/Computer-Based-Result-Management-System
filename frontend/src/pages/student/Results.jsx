import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineDocumentText, HiOutlineFunnel } from 'react-icons/hi2';
import axios from '../../api/axios';
import { useTheme } from '../../context/ThemeContext';
import { getGradeColor } from '../../utils/gradeColors';
import { formatGPA } from '../../utils/formatters';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const Results = () => {
  const { theme } = useTheme();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [sessRes, semRes] = await Promise.all([
          axios.get('/api/institution/sessions'),
          axios.get('/api/institution/semesters')
        ]);
        setSessions(sessRes.data.data);
        setSemesters(semRes.data.data);
      } catch {}
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedSession) params.set('sessionId', selectedSession);
    if (selectedSemester) params.set('semesterId', selectedSemester);
    const fetchResults = async () => {
      try { const res = await axios.get(`/api/student/results?${params}`); setResults(res.data.data?.results || res.data.data || []); }
      catch { setResults([]); } finally { setLoading(false); }
    };
    fetchResults();
  }, [selectedSession, selectedSemester]);

  const totalCU = results.reduce((sum, r) => sum + (r.courseId?.creditUnits || 0), 0);
  const weightedGP = results.reduce((sum, r) => sum + ((r.gradePoint || 0) * (r.courseId?.creditUnits || 0)), 0);
  const gpa = totalCU > 0 ? weightedGP / totalCU : 0;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>My Results</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>View your semester results</p>
      </motion.div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <HiOutlineFunnel size={18} style={{ color: 'var(--text-muted)' }} />
        <select className="form-input form-select" value={selectedSession} onChange={e => setSelectedSession(e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
          <option value="">All Sessions</option>
          {sessions.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <select className="form-input form-select" value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
          <option value="">All Semesters</option>
          {semesters.filter(s => !selectedSession || s.sessionId?._id === selectedSession || s.sessionId === selectedSession).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>

      {/* GPA Summary */}
      {results.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{formatGPA(gpa)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>GPA</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>{results.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Courses</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{totalCU}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Credit Units</div>
          </div>
        </motion.div>
      )}

      {loading ? <LoadingSkeleton type="cards" /> : results.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <HiOutlineDocumentText size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No Results Yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Your results will appear here once they are published.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead><tr><th>Code</th><th>Course Title</th><th>CU</th><th>CA</th><th>Exam</th><th>Total</th><th>Grade</th><th>GP</th></tr></thead>
              <tbody>
                {results.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>{r.courseId?.code}</td>
                    <td>{r.courseId?.title}</td>
                    <td>{r.courseId?.creditUnits}</td>
                    <td>{r.caScore}</td>
                    <td>{r.examScore}</td>
                    <td style={{ fontWeight: 700 }}>{r.totalScore}</td>
                    <td><span style={{ ...getGradeColor(r.letterGrade, theme), padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>{r.letterGrade}</span></td>
                    <td style={{ fontWeight: 600 }}>{r.gradePoint?.toFixed(1)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 700, background: 'var(--bg-primary)' }}>
                  <td colSpan="2" style={{ textAlign: 'right' }}>Total / GPA</td>
                  <td>{totalCU}</td><td colSpan="3"></td>
                  <td colSpan="2" style={{ fontSize: '1rem', color: 'var(--primary)' }}>{formatGPA(gpa)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Results;
