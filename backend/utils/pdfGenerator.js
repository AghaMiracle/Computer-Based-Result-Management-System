/**
 * PDF Generator Utility
 * Generates transcripts, broadsheets, and result slips as simple HTML that can be printed to PDF
 * Using a lightweight approach - returns HTML strings that frontend renders and prints via browser
 */

import Result from '../models/Result.js';
import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';
import Institution from '../models/Institution.js';
import Course from '../models/Course.js';
import { calculateCGPA } from './gpaCalculator.js';

/**
 * Generate transcript data for a student
 */
export const generateTranscriptData = async (studentId, institutionId) => {
  const user = await User.findById(studentId);
  const profile = await StudentProfile.findOne({ userId: studentId })
    .populate('departmentId', 'name code');
  const institution = await Institution.findById(institutionId);

  if (!user || !profile || !institution) {
    throw new Error('Student, profile, or institution not found');
  }

  const results = await Result.find({
    studentId, institutionId, status: 'approved'
  })
    .populate('courseId', 'title code creditUnits level')
    .populate('semesterId', 'name')
    .populate('sessionId', 'name')
    .sort({ 'sessionId.name': 1, 'semesterId.name': 1 });

  // Group results by session/semester
  const grouped = {};
  results.forEach(r => {
    const key = `${r.sessionId?.name || 'Unknown'} — ${r.semesterId?.name || 'Unknown'}`;
    if (!grouped[key]) {
      grouped[key] = { session: r.sessionId?.name, semester: r.semesterId?.name, results: [] };
    }
    grouped[key].results.push({
      code: r.courseId?.code,
      title: r.courseId?.title,
      creditUnits: r.courseId?.creditUnits,
      grade: r.letterGrade,
      gradePoint: r.gradePoint,
      totalScore: r.totalScore
    });
  });

  // Calculate semester GPAs and CGPA
  const semesters = Object.values(grouped).map(sem => {
    const totalCreditUnits = sem.results.reduce((sum, r) => sum + (r.creditUnits || 0), 0);
    const totalWeightedPoints = sem.results.reduce((sum, r) => sum + ((r.gradePoint || 0) * (r.creditUnits || 0)), 0);
    const gpa = totalCreditUnits > 0 ? (totalWeightedPoints / totalCreditUnits).toFixed(2) : '0.00';
    return { ...sem, gpa: parseFloat(gpa), totalCreditUnits };
  });

  const cgpaResult = calculateCGPA(results.map(r => ({
    gradePoint: r.gradePoint,
    creditUnits: r.courseId?.creditUnits || 0
  })));

  return {
    student: {
      name: `${user.firstName} ${user.lastName}`,
      matricNumber: profile.matricNumber,
      department: profile.departmentId?.name,
      level: profile.level,
      status: profile.status,
      enrollmentDate: profile.enrollmentDate
    },
    institution: {
      name: institution.name,
      code: institution.code,
      type: institution.type
    },
    semesters,
    cgpa: cgpaResult.cgpa,
    totalCreditUnits: cgpaResult.totalCreditUnits,
    classification: cgpaResult.classification,
    generatedAt: new Date().toISOString()
  };
};

/**
 * Generate broadsheet data for a course in a semester
 */
export const generateBroadsheetData = async (courseId, semesterId, institutionId) => {
  const course = await Course.findById(courseId)
    .populate('departmentId', 'name code')
    .populate('teacherId', 'firstName lastName');

  if (!course) throw new Error('Course not found');

  const results = await Result.find({
    courseId, semesterId, institutionId, status: 'approved'
  })
    .populate('studentId', 'firstName lastName email')
    .sort({ 'studentId.lastName': 1 });

  // Get matric numbers
  const studentIds = results.map(r => r.studentId?._id);
  const profiles = await StudentProfile.find({ userId: { $in: studentIds } });
  const profileMap = {};
  profiles.forEach(p => { profileMap[p.userId.toString()] = p.matricNumber; });

  const rows = results.map(r => ({
    name: `${r.studentId?.lastName}, ${r.studentId?.firstName}`,
    matricNumber: profileMap[r.studentId?._id?.toString()] || 'N/A',
    caScore: r.caScore,
    examScore: r.examScore,
    totalScore: r.totalScore,
    grade: r.letterGrade,
    gradePoint: r.gradePoint
  }));

  // Statistics
  const scores = results.map(r => r.totalScore);
  const gradeDistribution = {};
  results.forEach(r => {
    gradeDistribution[r.letterGrade] = (gradeDistribution[r.letterGrade] || 0) + 1;
  });

  return {
    course: {
      code: course.code,
      title: course.title,
      creditUnits: course.creditUnits,
      department: course.departmentId?.name,
      teacher: course.teacherId ? `${course.teacherId.firstName} ${course.teacherId.lastName}` : 'Unassigned'
    },
    rows,
    stats: {
      totalStudents: rows.length,
      average: scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0,
      highest: scores.length > 0 ? Math.max(...scores) : 0,
      lowest: scores.length > 0 ? Math.min(...scores) : 0,
      passRate: scores.length > 0 ? ((scores.filter(s => s >= 40).length / scores.length) * 100).toFixed(1) : 0,
      gradeDistribution
    },
    generatedAt: new Date().toISOString()
  };
};
