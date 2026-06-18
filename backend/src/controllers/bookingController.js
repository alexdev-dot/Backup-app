import * as bookingModel from '../models/bookingModel.js';
import { asyncHandler, sendSuccess, sendCreated } from '../utils/helpers.js';
import { HTTP, ROLES } from '../config/constants.js';

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings =
    req.user.role === ROLES.CUSTOMER
      ? await bookingModel.findByCustomerId(req.user.userId)
      : await bookingModel.findByProfessionalId(req.user.userId);
  sendSuccess(res, { bookings });
});

export const getById = asyncHandler(async (req, res) => {
  const booking = await bookingModel.findByIdAndOwner(Number(req.params.id), req.user.userId);
  if (!booking) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Booking not found' });
  }
  sendSuccess(res, { booking });
});

export const create = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.CUSTOMER) {
    return res.status(HTTP.FORBIDDEN).json({ success: false, error: 'Only customers can create bookings' });
  }
  const booking = await bookingModel.create(req.user.userId, req.body);
  sendCreated(res, { booking });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const booking = await bookingModel.updateStatus(Number(req.params.id), req.body.status, req.user.userId);
  if (!booking) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Booking not found or access denied' });
  }
  sendSuccess(res, { booking });
});

export const cancel = asyncHandler(async (req, res) => {
  const booking = await bookingModel.updateStatus(Number(req.params.id), 'cancelled', req.user.userId);
  if (!booking) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Booking not found or access denied' });
  }
  sendSuccess(res, { booking });
});
