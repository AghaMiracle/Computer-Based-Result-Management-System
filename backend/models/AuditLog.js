import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN', 'LOGOUT', 'PASSWORD_CHANGE', 'PASSWORD_RESET',
      'USER_CREATE', 'USER_UPDATE', 'USER_DELETE',
      'INSTITUTION_CREATE', 'INSTITUTION_UPDATE', 'INSTITUTION_STATUS_CHANGE',
      'STUDENT_CREATE', 'STUDENT_UPDATE', 'STUDENT_DELETE', 'STUDENT_BULK_UPLOAD',
      'TEACHER_CREATE', 'TEACHER_UPDATE', 'TEACHER_DELETE',
      'COURSE_CREATE', 'COURSE_UPDATE', 'COURSE_DELETE',
      'RESULT_CREATE', 'RESULT_UPDATE', 'RESULT_SUBMIT', 'RESULT_APPROVE', 'RESULT_REJECT',
      'GRADE_MODIFY', 'ENROLLMENT_CREATE', 'ENROLLMENT_DROP',
      'SESSION_CREATE', 'SEMESTER_CREATE',
      'GRADING_SCALE_UPDATE', 'SETTINGS_UPDATE',
      'EXPORT_DATA', 'BULK_OPERATION'
    ]
  },
  entity: {
    type: String,
    default: null
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  oldValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ entity: 1, entityId: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
