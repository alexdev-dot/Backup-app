import * as professionalModel from '../models/professionalModel.js';
import { asyncHandler, sendSuccess, sendCreated } from '../utils/helpers.js';
import { HTTP, ROLES } from '../config/constants.js';

export const getAll = asyncHandler(async (req, res) => {
  const { category, location } = req.query;
  const professionals = await professionalModel.findAll({ category, location });
  sendSuccess(res, { professionals });
});

export const getById = asyncHandler(async (req, res) => {
  const professional = await professionalModel.findById(Number(req.params.id));
  if (!professional) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Professional not found' });
  }
  sendSuccess(res, { professional });
});

export const getMyProfile = asyncHandler(async (req, res) => {
  const professional = await professionalModel.findByUserId(req.user.userId);
  if (!professional) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Professional profile not found' });
  }
  sendSuccess(res, { professional });
});

export const create = asyncHandler(async (req, res) => {
  const existing = await professionalModel.findByUserId(req.user.userId);
  if (existing) {
    return res.status(HTTP.CONFLICT).json({ success: false, error: 'Professional profile already exists' });
  }

  const professional = await professionalModel.create(req.user.userId, req.body);
  sendCreated(res, { professional });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const professional = await professionalModel.updateByUserId(req.user.userId, req.body);
  if (!professional) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Professional profile not found' });
  }
  sendSuccess(res, { professional });
});
