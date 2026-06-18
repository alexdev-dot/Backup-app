export const ROLES = Object.freeze({
  CUSTOMER:     'customer',
  PROFESSIONAL: 'professional',
});

export const BOOKING_STATUS = Object.freeze({
  PENDING:    'pending',
  SCHEDULED:  'scheduled',
  COMPLETED:  'completed',
  CANCELLED:  'cancelled',
});

export const JOB_STATUS = Object.freeze({
  ACTIVE:    'active',
  COMPLETED: 'completed',
  DRAFT:     'draft',
});

export const TX_STATUS = Object.freeze({
  COMPLETED: 'completed',
  PENDING:   'pending',
  FAILED:    'failed',
});

export const INVOICE_STATUS = Object.freeze({
  PAID:    'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
});

export const HTTP = Object.freeze({
  OK:                    200,
  CREATED:               201,
  NO_CONTENT:            204,
  BAD_REQUEST:           400,
  UNAUTHORIZED:          401,
  FORBIDDEN:             403,
  NOT_FOUND:             404,
  CONFLICT:              409,
  UNPROCESSABLE_ENTITY:  422,
  INTERNAL_SERVER_ERROR: 500,
});
