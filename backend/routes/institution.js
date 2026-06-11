import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';
import {
  registerInstitution,
  getDashboard,
  createStudent, getStudents, updateStudent, deleteStudent,
  createTeacher, getTeachers, updateTeacher, deleteTeacher,
  createDepartment, getDepartments, updateDepartment, deleteDepartment,
  createCourse, getCourses, updateCourse, deleteCourse,
  createSession, getSessions,
  createSemester, getSemesters,
  getGradingScales, updateGradingScale,
  getPendingResults, approveResult, rejectResult, bulkApproveResults,
  bulkUploadStudents, bulkUploadTeachers,
  getStudentTranscript, getBroadsheet
} from '../controllers/institutionController.js';

const router = express.Router();

// Public route for institution registration
router.post('/register', registerInstitution);

// Protected routes (institution role)
router.use(protect, authorize('institution'));

router.get('/dashboard', getDashboard);

// Students
router.route('/students').get(getStudents).post(createStudent);
router.route('/students/:id').put(updateStudent).delete(deleteStudent);

// Teachers
router.route('/teachers').get(getTeachers).post(createTeacher);
router.route('/teachers/:id').put(updateTeacher).delete(deleteTeacher);

// Departments
router.route('/departments').get(getDepartments).post(createDepartment);
router.route('/departments/:id').put(updateDepartment).delete(deleteDepartment);

// Courses
router.route('/courses').get(getCourses).post(createCourse);
router.route('/courses/:id').put(updateCourse).delete(deleteCourse);

// Sessions & Semesters
router.route('/sessions').get(getSessions).post(createSession);
router.route('/semesters').get(getSemesters).post(createSemester);

// Grading Scales
router.get('/grading-scales', getGradingScales);
router.put('/grading-scales/:id', updateGradingScale);

// Result Approval
router.get('/results/pending', getPendingResults);
router.put('/results/:id/approve', approveResult);
router.put('/results/:id/reject', rejectResult);
router.post('/results/bulk-approve', bulkApproveResults);

// Bulk Upload
router.post('/students/bulk', bulkUploadStudents);
router.post('/teachers/bulk', bulkUploadTeachers);

// Transcript & Broadsheet
router.get('/transcript/:studentId', getStudentTranscript);
router.get('/broadsheet/:courseId/:semesterId', getBroadsheet);

export default router;
