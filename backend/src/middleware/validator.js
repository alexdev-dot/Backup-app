import { body, param, validationResult } from 'express-validator';
import { ROLES, BOOKING_STATUS, JOB_STATUS, TX_STATUS, INVOICE_STATUS } from '../config/constants.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

export const registerRules = [
  body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ min: 2, max: 120 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required').isLength({ max: 30 }),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(Object.values(ROLES)).withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),
];

export const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const updateProfileRules = [
  body('full_name').optional().trim().isLength({ min: 2, max: 120 }),
  body('email').optional().trim().isEmail().normalizeEmail(),
  body('phone').optional().trim().isLength({ max: 30 }),
  body('location').optional().trim().isLength({ max: 255 }),
];

export const createBookingRules = [
  body('professional_id').isInt({ min: 1 }).withMessage('Valid professional ID required'),
  body('service').trim().notEmpty().withMessage('Service is required'),
  body('date').isDate().withMessage('Valid date is required (YYYY-MM-DD)'),
  body('time').matches(/^\d{2}:\d{2}$/).withMessage('Valid time is required (HH:MM)'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('amount').isDecimal({ decimal_digits: '0,2' }).withMessage('Valid amount is required'),
];

export const updateBookingStatusRules = [
  param('id').isInt({ min: 1 }).withMessage('Valid booking ID required'),
  body('status').isIn(Object.values(BOOKING_STATUS)).withMessage('Invalid booking status'),
];

export const createJobRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('budget').trim().notEmpty().withMessage('Budget is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

export const updateJobRules = [
  param('id').isInt({ min: 1 }),
  body('title').optional().trim().isLength({ max: 200 }),
  body('status').optional().isIn(Object.values(JOB_STATUS)),
];

export const sendMessageRules = [
  body('conversation_id').isInt({ min: 1 }),
  body('receiver_id').isInt({ min: 1 }),
  body('text').trim().notEmpty().withMessage('Message text is required'),
];

export const createReviewRules = [
  body('professional_id').isInt({ min: 1 }),
  body('booking_id').optional().isInt({ min: 1 }),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 2000 }),
];

export const createTransactionRules = [
  body('description').trim().notEmpty(),
  body('amount').isDecimal({ decimal_digits: '0,2' }),
  body('date').isDate(),
  body('status').isIn(Object.values(TX_STATUS)),
  body('method').trim().notEmpty(),
];

export const createInvoiceRules = [
  body('number').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('amount').isDecimal({ decimal_digits: '0,2' }),
  body('date').isDate(),
  body('due_date').isDate(),
];

export const idParamRule = [
  param('id').isInt({ min: 1 }).withMessage('Invalid ID parameter'),
];
