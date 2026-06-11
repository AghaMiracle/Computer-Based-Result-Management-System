import AuditLog from '../models/AuditLog.js';

/**
 * Log an audit trail entry
 */
export const logAudit = async ({
  userId,
  action,
  entity = null,
  entityId = null,
  description = null,
  oldValue = null,
  newValue = null,
  ipAddress = null,
  userAgent = null
}) => {
  try {
    await AuditLog.create({
      userId,
      action,
      entity,
      entityId,
      description,
      oldValue,
      newValue,
      ipAddress,
      userAgent
    });
  } catch (error) {
    console.error('Audit log error:', error.message);
  }
};

/**
 * Express middleware to auto-log requests (attach to specific routes)
 */
export const auditMiddleware = (action, entity) => {
  return (req, res, next) => {
    // Store audit info on request for controller to use
    req.auditInfo = {
      action,
      entity,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent']
    };
    next();
  };
};
