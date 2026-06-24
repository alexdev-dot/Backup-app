import * as jobModel from '../models/jobModel.js';
import { asyncHandler, sendSuccess, sendCreated } from '../utils/helpers.js';
import { HTTP, ROLES } from '../config/constants.js';

export const getPublic = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const jobs = await jobModel.findAllPublic({ category });
  sendSuccess(res, { jobs });
});

export const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await jobModel.findByCustomerId(req.user.userId);
  sendSuccess(res, { jobs });
});

export const getById = asyncHandler(async (req, res) => {
  const job = await jobModel.findById(Number(req.params.id));
  if (!job) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Job not found' });
  }
  await jobModel.incrementViews(job.id);
  sendSuccess(res, { job });
});

export const create = asyncHandler(async (req, res) => {
  const job = await jobModel.create(req.user.userId, req.body);
  sendCreated(res, { job });
});

export const update = asyncHandler(async (req, res) => {
  const job = await jobModel.update(Number(req.params.id), req.user.userId, req.body);
  if (!job) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Job not found or access denied' });
  }
  sendSuccess(res, { job });
});

export const remove = asyncHandler(async (req, res) => {
  const deleted = await jobModel.remove(Number(req.params.id), req.user.userId);
  if (!deleted) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Job not found or access denied' });
  }
  res.status(HTTP.NO_CONTENT).send();
});
