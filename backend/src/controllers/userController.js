import * as userModel from '../models/userModel.js';
import { asyncHandler, sendSuccess } from '../utils/helpers.js';
import { HTTP } from '../config/constants.js';

export const getProfile = asyncHandler(async (req, res) => {
  console.log('Fetching profile for userId:', req.user.userId);
  const user = await userModel.findById(req.user.userId);
  console.log('User data from DB:', user);
  if (!user) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'User not found' });
  }
  sendSuccess(res, { user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { full_name, email, phone, location } = req.body;

  if (email) {
    const taken = await userModel.emailExists(email, req.user.userId);
    if (taken) {
      return res.status(HTTP.CONFLICT).json({ success: false, error: 'Email already in use' });
    }
  }

  const user = await userModel.updateById(req.user.userId, { full_name, email, phone, location });
  sendSuccess(res, { user });
});
