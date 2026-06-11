import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Enrollment from '../models/Enrollment.js';
import Result from '../models/Result.js';
import Course from '../models/Course.js';
import Semester from '../models/Semester.js';
import Session from '../models/Session.js';
import Notification from '../models/Notification.js';
import { calculateSemesterGPA, calculateCGPA } from '../utils/gpaCalculator.js';

/**
 * @desc    Get student dashboard
 * @route   GET /api/student/dashboard
 * @access  Private/Student
 */
export const getDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;
    const institutionId = req.user.institutionId;

    const profile = await StudentProfile.findOne({ userId: studentId })
      .populate('departmentId', 'name code');

    const [totalCourses, totalResults, unreadNotifications] = await Promise.all([
      Enrollment.countDocuments({ studentId, status: 'registered' }),
      Result.countDocuments({ studentId, status: 'approved' }),
      Notification.countDocuments({ recipientId: studentId, isRead: false })
    ]);

    // Get all approved results for CGPA
    const allResults = await Result.find({ studentId, status: 'approved' })
      .populate('courseId', 'creditUnits');
    const cgpaResult = calculateCGPA(allResults);
    const cgpa = cgpaResult.cgpa;
    const classification = cgpaResult.classification;

    // Recent results
    const recentResults = await Result.find({ studentId, status: 'approved' })
      .populate('courseId', 'title code creditUnits')
      .populate('semesterId', 'name')
      .populate('sessionId', 'name')
      .sort({ approvedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        profile,
        stats: { totalCourses, totalResults, unreadNotifications, cgpa, classification },
        recentResults
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard', error: error.message });
  }
};

/**
 * @desc    Get student results (by semester)
 * @route   GET /api/student/results
 * @access  Private/Student
 */
export const getResults = async (req, res) => {
  try {
    const { semesterId, sessionId } = req.query;
    const query = { studentId: req.user._id, status: 'approved' };
    if (semesterId) query.semesterId = semesterId;
    if (sessionId) query.sessionId = sessionId;

    const results = await Result.find(query)
      .populate('courseId', 'title code creditUnits')
      .populate('semesterId', 'name')
      .populate('sessionId', 'name')
      .sort({ 'courseId.code': 1 });

    // Calculate semester GPA
    const gpa = calculateSemesterGPA(results);

    // All results for CGPA
    const allResults = await Result.find({ studentId: req.user._id, status: 'approved' })
      .populate('courseId', 'creditUnits');
    const cgpa = calculateCGPA(allResults).cgpa;

    // Total credit units this semester
    const totalCredits = results.reduce((sum, r) => sum + (r.courseId?.creditUnits || 0), 0);
    const totalQualityPoints = results.reduce((sum, r) => sum + (r.gradePoint * (r.courseId?.creditUnits || 0)), 0);

    res.status(200).json({
      success: true,
      data: {
        results,
        summary: { gpa, cgpa, totalCredits, totalQualityPoints, totalCourses: results.length }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch results', error: error.message });
  }
};

/**
 * @desc    Get full transcript
 * @route   GET /api/student/transcript
 * @access  Private/Student
 */
export const getTranscript = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    const profile = await StudentProfile.findOne({ userId: studentId })
      .populate('departmentId', 'name code')
      .populate('institutionId', 'name code logo');

    const user = await User.findById(studentId);

    // Get all approved results grouped by session/semester
    const results = await Result.find({ studentId, status: 'approved' })
      .populate('courseId', 'title code creditUnits')
      .populate('semesterId', 'name')
      .populate('sessionId', 'name')
      .sort({ 'sessionId.name': 1, 'semesterId.name': 1 });

    // Group by session and semester
    const transcript = {};
    results.forEach(r => {
      const sessionName = r.sessionId?.name || 'Unknown Session';
      const semesterName = r.semesterId?.name || 'Unknown Semester';
      const key = `${sessionName}___${semesterName}`;
      
      if (!transcript[key]) {
        transcript[key] = {
          session: sessionName,
          semester: semesterName,
          courses: [],
          gpa: 0
        };
      }
      transcript[key].courses.push(r);
    });

    // Calculate GPA for each semester
    Object.values(transcript).forEach(sem => {
      sem.gpa = calculateSemesterGPA(sem.courses);
    });

    const cgpaResult = calculateCGPA(results);
    const cgpa = cgpaResult.cgpa;
    const classification = cgpaResult.classification;

    res.status(200).json({
      success: true,
      data: {
        student: { ...user.toObject(), profile },
        transcript: Object.values(transcript),
        summary: { cgpa, classification, totalCredits: results.reduce((s, r) => s + (r.courseId?.creditUnits || 0), 0) }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate transcript', error: error.message });
  }
};

/**
 * @desc    Get available courses for registration
 * @route   GET /api/student/courses/available
 * @access  Private/Student
 */
export const getAvailableCourses = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Get active semester
    const activeSemester = await Semester.findOne({ institutionId: req.user.institutionId, isActive: true });
    if (!activeSemester) {
      return res.status(400).json({ success: false, message: 'No active semester for registration' });
    }

    // Check registration deadline
    if (activeSemester.registrationDeadline && new Date() > activeSemester.registrationDeadline) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed' });
    }

    // Get courses for student's department and level
    const courses = await Course.find({
      institutionId: req.user.institutionId,
      departmentId: profile.departmentId,
      level: profile.level,
      isActive: true
    }).populate('teacherId', 'firstName lastName').populate('departmentId', 'name code');

    // Get already enrolled courses
    const enrollments = await Enrollment.find({
      studentId: req.user._id,
      semesterId: activeSemester._id
    });
    const enrolledCourseIds = enrollments.map(e => e.courseId.toString());

    const availableCourses = courses.map(course => ({
      ...course.toObject(),
      isEnrolled: enrolledCourseIds.includes(course._id.toString())
    }));

    res.status(200).json({ success: true, data: { courses: availableCourses, semester: activeSemester } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch courses', error: error.message });
  }
};

/**
 * @desc    Register for courses
 * @route   POST /api/student/courses/register
 * @access  Private/Student
 */
export const registerCourses = async (req, res) => {
  try {
    const { courseIds } = req.body;
    const studentId = req.user._id;
    const institutionId = req.user.institutionId;

    const activeSemester = await Semester.findOne({ institutionId, isActive: true }).populate('sessionId');
    if (!activeSemester) {
      return res.status(400).json({ success: false, message: 'No active semester' });
    }

    const enrollments = [];
    const errors = [];

    for (const courseId of courseIds) {
      try {
        const enrollment = await Enrollment.create({
          studentId, courseId,
          semesterId: activeSemester._id,
          sessionId: activeSemester.sessionId._id,
          institutionId
        });
        enrollments.push(enrollment);
      } catch (err) {
        errors.push({ courseId, error: err.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `${enrollments.length} courses registered`,
      data: { enrollments, errors }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to register courses', error: error.message });
  }
};

/**
 * @desc    Get student notifications
 * @route   GET /api/student/notifications
 * @access  Private/Student
 */
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const notifications = await Notification.find({ recipientId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments({ recipientId: req.user._id });
    const unread = await Notification.countDocuments({ recipientId: req.user._id, isRead: false });

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: { total, unread, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/student/notifications/:id/read
 * @access  Private/Student
 */
export const markNotificationRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user._id },
      { isRead: true }
    );
    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark notification', error: error.message });
  }
};

/**
 * @desc    Get student profile
 * @route   GET /api/student/profile
 * @access  Private/Student
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('institutionId', 'name code logo');
    const profile = await StudentProfile.findOne({ userId: req.user._id })
      .populate('departmentId', 'name code');

    res.status(200).json({
      success: true,
      data: { user, profile }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};

/**
 * @desc    Get available semesters for viewing results
 * @route   GET /api/student/semesters
 * @access  Private/Student
 */
export const getSemesters = async (req, res) => {
  try {
    // Get semesters that have approved results for this student
    const resultSemesters = await Result.distinct('semesterId', { studentId: req.user._id, status: 'approved' });
    const semesters = await Semester.find({ _id: { $in: resultSemesters } })
      .populate('sessionId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: semesters });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch semesters', error: error.message });
  }
};
