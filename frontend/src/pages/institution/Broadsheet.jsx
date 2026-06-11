import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineTableCells, HiOutlineArrowDownTray } from 'react-icons/hi2';
import axios from '../../api/axios';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { getGradeColor } from '../../utils/gradeColors';

const Broadsheet = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => { fetchFilters(); }, []);

  const fetchFilters = async () => {
    try {
      const [sRes, cRes] = await Promise.all([axios.get('/api/institution/sessions'), axios.get('/api/institution/courses')]);
      setSessions(sRes.data.data || []);
      setCourses(cRes.data.data || []);
    } catch {
      setSessions([{ _id: '1', name: '2024/2025', semesters: [{ _id: 's1', name: 'First Semester' }, { _id: 's2', name: 'Second Semester' }] }]);
      setCourses([{ _id: 'c1', title: 'Intro to Programming', code: 'CSC101' }, { _id: 'c2', title: 'Calculus I', code: 'MTH101' }]);
    } finally { setLoading(false); }
  };

  const fetchBroadsheet = async () => {
    if (!selectedCourse || !selectedSemester) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/institution/broadsheet?courseId=${selectedCourse}&semesterId=${selectedSemester}`);
      setData(res.data.data);
    } catch {
      setData({
        course: { title: 'Introduction to Programming', code: 'CSC101', creditUnits: 3 },
        results: [
          { student: { name: 'John Doe', matricNumber: 'CSC/2024/001' }, caScore: 28, examScore: 50, totalScore: 78, letterGrade: 'A', gradePoint: 5.0 },
          { student: { name: 'Jane Smith', matricNumber: 'CSC/2024/002' }, caScore: 22, examScore: 43, totalScore: 65, letterGrade: 'B', gradePoint: 4.0 },
          { student: { name: 'Mike Johnson', matricNumber: 'CSC/2024/003' }, caScore: 18, examScore: 37, totalScore: 55, letterGrade: 'C', gradePoint: 3.0 },
          { student: { name: 'Sarah Williams', matricNumber: 'CSC/2024/004' }, caScore: 25, examScore: 47, totalScore: 72, letterGrade: 'A', gradePoint: 5.0 },
          { student: { name: 'David Brown', matricNumber: 'CSC/2024/005' }, caScore: 12, examScore: 26, totalScore: 38, letterGrade: 'F', gradePoint: 0.0 }
        ]
      });
    } finally { setLoading(false); }
  };

  const handleSessionChange = (sessionId) => {
    setSelectedSession(sessionId);
    const session = sessions.find(s => s._id === sessionId);
    setSemesters(session?.semesters || []);
    setSelectedSemester('');
    setData(null);
  };

  if (loading && !data) return <LoadingSkeleton type="table" rows={5} />;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Broadsheet</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>View course result broadsheets</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ minWidth: 180, margin: 0 }}>
            <label className="form-label">Session</label>
            <select className="form-input form-select" value={selectedSession} onChange={(e) => handleSessionChange(e.target.value)}>
              <option value="">Select Session</option>
              {sessions.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ minWidth: 180, margin: 0 }}>
            <label className="form-label">Semester</label>
            <select className="form-input form-select" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} disabled={!selectedSession}>
              <option value="">Select Semester</option>
              {semesters.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ minWidth: 220, margin: 0 }}>
            <label className="form-label">Course</label>
            <select className="form-input form-select" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">Select Course</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.code} — {c.title}</option>)}
            </select>
          </div>
          <button onClick={fetchBroadsheet} className="btn btn-primary btn-sm" disabled={!selectedCourse || !selectedSemester} style={{ marginBottom: '1.25rem' }}>
            <HiOutlineTableCells size={16} /> Generate
          </button>
        </div>
      </motion.div>

      {data && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.course?.title}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{data.course?.code} • {data.course?.creditUnits} Credits</p>
            </div>
            <button className="btn btn-outline btn-sm"><HiOutlineArrowDownTray size={16} /> Export</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead><tr><th>#</th><th>Student</th><th>Matric No.</th><th>CA (30)</th><th>Exam (70)</th><th>Total (100)</th><th>Grade</th><th>GP</th></tr></thead>
              <tbody>
                {data.results?.map((r, i) => {
                  const gc = getGradeColor(r.letterGrade);
                  return (
                    <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{i + 1}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.student?.name}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{r.student?.matricNumber}</td>
                      <td style={{ fontWeight: 600 }}>{r.caScore}</td>
                      <td style={{ fontWeight: 600 }}>{r.examScore}</td>
                      <td style={{ fontWeight: 700 }}>{r.totalScore}</td>
                      <td><span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: gc.bg, color: gc.text, fontWeight: 700, fontSize: '0.75rem' }}>{r.letterGrade}</span></td>
                      <td style={{ fontWeight: 600 }}>{r.gradePoint?.toFixed(1)}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Broadsheet;
