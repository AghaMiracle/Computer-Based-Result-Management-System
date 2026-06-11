import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';
import {
  getDashboardStats,
  getInstitutions,
  updateInstitutionStatus,
  deleteInstitution,
  getAllUsers,
  getAuditLogs,
  updateSettings
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/institutions', getInstitutions);
router.put('/institutions/:id/status', updateInstitutionStatus);
router.delete('/institutions/:id', deleteInstitution);
router.get('/users', getAllUsers);
router.get('/audit-logs', getAuditLogs);
router.put('/settings', updateSettings);

export default router;
