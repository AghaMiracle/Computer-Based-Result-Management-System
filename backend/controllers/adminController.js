import User from '../models/User.js';
import Institution from '../models/Institution.js';
import AuditLog from '../models/AuditLog.js';
import StudentProfile from '../models/StudentProfile.js';
import Course from '../models/Course.js';
import Result from '../models/Result.js';
import { logAudit } from '../middleware/auditLogger.js';

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalInstitutions,
      activeInstitutions,
      pendingInstitutions,
      totalUsers,
      totalStudents,
      totalTeachers,
      recentAuditLogs,
      institutionsByType,
      monthlyRegistrations
    ] = await Promise.all([
      Institution.countDocuments(),
      Institution.countDocuments({ status: 'active' }),
      Institution.countDocuments({ status: 'pending' }),
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'firstName lastName email role'),
      Institution.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      // Monthly registration trend (last 6 months)
      User.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    // User role distribution
    const userDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalInstitutions,
          activeInstitutions,
          pendingInstitutions,
          totalUsers,
          totalStudents,
          totalTeachers
        },
        recentActivity: recentAuditLogs,
        institutionsByType,
        userDistribution,
        monthlyRegistrations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

/**
 * @desc    Get all institutions
 * @route   GET /api/admin/institutions
 * @access  Private/Admin
 */
export const getInstitutions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const institutions = await Institution.find(query)
      .populate('adminUserId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Institution.countDocuments(query);

    // Get student/teacher counts for each institution
    const institutionsWithCounts = await Promise.all(
      institutions.map(async (inst) => {
        const studentCount = await User.countDocuments({ institutionId: inst._id, role: 'student' });
        const teacherCount = await User.countDocuments({ institutionId: inst._id, role: 'teacher' });
        return {
          ...inst.toObject(),
          studentCount,
          teacherCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: institutionsWithCounts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch institutions',
      error: error.message
    });
  }
};

/**
 * @desc    Update institution status (approve/suspend/reject)
 * @route   PUT /api/admin/institutions/:id/status
 * @access  Private/Admin
 */
export const updateInstitutionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    const oldStatus = institution.status;
    institution.status = status;
    await institution.save();

    await logAudit({
      userId: req.user._id,
      action: 'INSTITUTION_STATUS_CHANGE',
      entity: 'Institution',
      entityId: institution._id,
      description: `Institution ${institution.name} status changed from ${oldStatus} to ${status}`,
      oldValue: { status: oldStatus },
      newValue: { status },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      success: true,
      message: `Institution ${status} successfully`,
      data: institution
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update institution status',
      error: error.message
    });
  }
};

/**
 * @desc    Delete institution
 * @route   DELETE /api/admin/institutions/:id
 * @access  Private/Admin
 */
export const deleteInstitution = async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    // Delete all related data
    await User.deleteMany({ institutionId: institution._id });
    await Course.deleteMany({ institutionId: institution._id });
    await StudentProfile.deleteMany({ institutionId: institution._id });
    await Result.deleteMany({ institutionId: institution._id });
    await Institution.findByIdAndDelete(institution._id);

    await logAudit({
      userId: req.user._id,
      action: 'INSTITUTION_STATUS_CHANGE',
      entity: 'Institution',
      entityId: institution._id,
      description: `Institution ${institution.name} deleted along with all related data`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      success: true,
      message: 'Institution and all related data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete institution',
      error: error.message
    });
  }
};

/**
 * @desc    Get all users across all institutions
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, institutionId } = req.query;

    const query = {};
    if (role) query.role = role;
    if (institutionId) query.institutionId = institutionId;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .populate('institutionId', 'name code')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

/**
 * @desc    Get audit logs
 * @route   GET /api/admin/audit-logs
 * @access  Private/Admin
 */
export const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, action, userId, startDate, endDate } = req.query;

    const query = {};
    if (action) query.action = action;
    if (userId) query.userId = userId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(query)
      .populate('userId', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message
    });
  }
};

/**
 * @desc    Update system settings
 * @route   PUT /api/admin/settings
 * @access  Private/Admin
 */
export const updateSettings = async (req, res) => {
  try {
    const { defaultGradingScale, systemName, maintenanceMode, maxInstitutions,
            emailNotifications, smsNotifications, backupFrequency, securitySettings } = req.body;

    // Store settings in a simple way (you could use a Settings model for more structure)
    // For now, we'll store this as an audit log and return the settings
    const settings = {
      systemName: systemName || 'Student Result Management System',
      maintenanceMode: maintenanceMode || false,
      maxInstitutions: maxInstitutions || 0,
      emailNotifications: emailNotifications !== false,
      smsNotifications: smsNotifications || false,
      backupFrequency: backupFrequency || 'daily',
      securitySettings: securitySettings || {
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requireTwoFactor: false
      },
      defaultGradingScale: defaultGradingScale || null
    };

    await logAudit({
      userId: req.user._id,
      action: 'SETTINGS_UPDATE',
      entity: 'Settings',
      description: 'System settings updated',
      newValue: settings,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message
    });
  }
};
