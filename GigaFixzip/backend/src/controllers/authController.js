import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel.js';
import * as professionalModel from '../models/professionalModel.js';
import { jwtConfig, securityConfig } from '../config/index.js';
import { asyncHandler, sendSuccess, sendCreated, stripSensitive } from '../utils/helpers.js';
import { HTTP } from '../config/constants.js';

const signToken = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, role } = req.body;

  if (await userModel.emailExists(email)) {
    return res.status(HTTP.CONFLICT).json({ success: false, error: 'Email already registered' });
  }

  const hashed = await bcrypt.hash(password, securityConfig.bcryptRounds);
  const user   = await userModel.create({ fullName, email, phone, password: hashed, role });
  const token  = signToken(user);

  sendCreated(res, { token, user: stripSensitive(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  const user = await userModel.findByEmail(email);
  if (!user) {
    return res.status(HTTP.UNAUTHORIZED).json({ success: false, error: 'Invalid credentials' });
  }

  if (role && user.role !== role) {
    return res.status(HTTP.UNAUTHORIZED).json({
      success: false,
      error: `This account is registered as a ${user.role}`,
    });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(HTTP.UNAUTHORIZED).json({ success: false, error: 'Invalid credentials' });
  }

  const token = signToken(user);
  sendSuccess(res, { token, user: stripSensitive(user) });
});

export const verify = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  if (!user) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'User not found' });
  }
  sendSuccess(res, { user });
});
