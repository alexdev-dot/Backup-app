export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const sendSuccess = (res, data, status = 200) =>
  res.status(status).json({ success: true, data });

export const sendCreated = (res, data) => sendSuccess(res, data, 201);

export const sendError = (res, message, status = 500) =>
  res.status(status).json({ success: false, error: message });

export const stripSensitive = (user) => {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
};

export const paginate = (query, page = 1, limit = 20) => {
  const offset = (Math.max(1, page) - 1) * limit;
  return { ...query, limit, offset };
};
