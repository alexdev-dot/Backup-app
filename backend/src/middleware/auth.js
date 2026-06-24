import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/index.js';
import { HTTP } from '../config/constants.js';
import { setCurrentUser } from '../config/database.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(HTTP.UNAUTHORIZED).json({
      success: false,
      error: 'Authentication token required',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;

    // Set current user context for RLS policies
    await setCurrentUser(decoded.userId);

    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token';
    return res.status(HTTP.UNAUTHORIZED).json({ success: false, error: message });
  }
};

export const authorize = (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP.UNAUTHORIZED).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(HTTP.FORBIDDEN).json({
        success: false,
        error: 'You do not have permission to access this resource',
      });
    }

    next();
  };

export const requireOwnership = (getResourceUserId) =>
  async (req, res, next) => {
    try {
      const resourceUserId = await getResourceUserId(req);
      if (resourceUserId !== req.user.userId) {
        return res.status(HTTP.FORBIDDEN).json({
          success: false,
          error: 'You do not have permission to access this resource',
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
