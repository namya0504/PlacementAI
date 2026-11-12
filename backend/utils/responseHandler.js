export const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res, message = 'Internal Server Error', statusCode = 500, error = null, errorCode = null, data = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || error || null,
    ...(errorCode ? { errorCode } : {}),
    ...(data ? { data } : {})
  });
};
