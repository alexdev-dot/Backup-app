import * as serviceModel from '../models/serviceModel.js';
import { asyncHandler, sendSuccess, sendCreated } from '../utils/helpers.js';
import { HTTP } from '../config/constants.js';

export const getAll = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const services = await serviceModel.findAll({ category });
  sendSuccess(res, { services });
});

export const getById = asyncHandler(async (req, res) => {
  const service = await serviceModel.findById(Number(req.params.id));
  if (!service) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Service not found' });
  }
  sendSuccess(res, { service });
});
