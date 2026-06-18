import * as paymentModel from '../models/paymentModel.js';
import { asyncHandler, sendSuccess, sendCreated } from '../utils/helpers.js';
import { HTTP } from '../config/constants.js';

export const getMethods = asyncHandler(async (req, res) => {
  const methods = await paymentModel.getMethodsByUser(req.user.userId);
  sendSuccess(res, { methods });
});

export const addMethod = asyncHandler(async (req, res) => {
  const method = await paymentModel.addMethod(req.user.userId, req.body);
  sendCreated(res, { method });
});

export const setDefault = asyncHandler(async (req, res) => {
  const method = await paymentModel.setDefault(Number(req.params.id), req.user.userId);
  if (!method) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Payment method not found' });
  }
  sendSuccess(res, { method });
});

export const removeMethod = asyncHandler(async (req, res) => {
  const deleted = await paymentModel.removeMethod(Number(req.params.id), req.user.userId);
  if (!deleted) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Payment method not found' });
  }
  res.status(HTTP.NO_CONTENT).send();
});

export const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await paymentModel.getTransactionsByUser(req.user.userId);
  sendSuccess(res, { transactions });
});

export const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await paymentModel.createTransaction(req.user.userId, req.body);
  sendCreated(res, { transaction });
});

export const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await paymentModel.getInvoicesByUser(req.user.userId);
  sendSuccess(res, { invoices });
});

export const createInvoice = asyncHandler(async (req, res) => {
  const invoice = await paymentModel.createInvoice(req.user.userId, req.body);
  sendCreated(res, { invoice });
});

export const updateInvoiceStatus = asyncHandler(async (req, res) => {
  const invoice = await paymentModel.updateInvoiceStatus(
    Number(req.params.id),
    req.user.userId,
    req.body.status
  );
  if (!invoice) {
    return res.status(HTTP.NOT_FOUND).json({ success: false, error: 'Invoice not found' });
  }
  sendSuccess(res, { invoice });
});
