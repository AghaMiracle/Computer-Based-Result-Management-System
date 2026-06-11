import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';
import {
  getDashboard,
  getResults,
  getTranscript,
  getAvailableCourses,
  registerCourses,
  getNotifications,
  markNotificationRead,
  getProfile,
  getSemesters
} from '../controllers/studentController.js';

const router = express.Router();

router.use(protect, authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/results', getResults);
router.get('/transcript', getTranscript);
router.get('/courses/available', getAvailableCourses);
router.post('/courses/register', registerCourses);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.get('/profile', getProfile);
router.get('/semesters', getSemesters);

export default router;
