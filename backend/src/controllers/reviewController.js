import * as reviewModel from '../models/reviewModel.js';
import * as professionalModel from '../models/professionalModel.js';
import { asyncHandler, sendSuccess, sendCreated } from '../utils/helpers.js';
import { HTTP, ROLES } from '../config/constants.js';

export const getForProfessional = asyncHandler(async (req, res) => {
  const professional = await professionalModel.findById(Number(req.params.id));
  if (!professional) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Professional not found' });
  }
  const reviews = await reviewModel.findByProfessional(professional.user_id);
  sendSuccess(res, { reviews });
});

export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewModel.findByCustomer(req.user.userId);
  sendSuccess(res, { reviews });
});

export const create = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.CUSTOMER) {
    return res.status(HTTP.FORBIDDEN).json({ success: false, error: 'Only customers can leave reviews' });
  }
  const review = await reviewModel.create(req.user.userId, req.body);
  await professionalModel.updateRating(req.body.professional_id);
  sendCreated(res, { review });
});
