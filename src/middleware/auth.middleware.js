// server/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';

import AccountMember from '../models/accountMember.model.js';
import Account from '../models/account.model.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const accountId = req.headers['x-account-id'];

      const member = await AccountMember.findOne({ user_id: userId, account_id: accountId }).populate('role_id');

      if (!member || !allowedRoles.includes(member.role_id.role_name)) {
        return res.status(403).json({ success: false, message: 'Access denied: insufficient permissions' });
      }

      req.role = member.role_id.role_name;
      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Authorization error', error });
    }
  };
};

export const validateDataHeaders = async (req, res, next) => {
  const appSecret = req.header('CL-X-TOKEN');
  const eventId = req.header('CL-X-EVENT-ID');

  if (!appSecret || !eventId) {
    return res.status(400).json({ success: false, message: 'Missing required headers: CL-X-TOKEN or CL-X-EVENT-ID' });
  }

  try {
    const account = await Account.findOne({ app_secret_token: appSecret });
    if (!account) {
      return res.status(401).json({ success: false, message: 'Invalid App Secret Token' });
    }

    req.account = account;
    req.eventId = eventId;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error validating headers', error });
  }
};
