/**
 * Role-based access control middleware factory
 * Usage: authorize('institution', 'teacher')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route.`
      });
    }

    next();
  };
};

/**
 * Ensure user belongs to the same institution (for institution-scoped routes)
 */
export const sameInstitution = (req, res, next) => {
  const institutionId = req.params.institutionId || req.body.institutionId || req.user.institutionId;
  
  if (!institutionId) {
    return res.status(400).json({
      success: false,
      message: 'Institution context is required.'
    });
  }

  if (req.user.institutionId && req.user.institutionId.toString() !== institutionId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You can only access data from your own institution.'
    });
  }

  next();
};
