export function notFoundError(message = 'Not found') {
  const err = new Error(message);
  err.status = 404;
  return err;
}

export function badRequestError(message = 'Bad request') {
  const err = new Error(message);
  err.status = 400;
  return err;
}

export function unauthorizedError(message = 'Unauthorized') {
  const err = new Error(message);
  err.status = 401;
  return err;
}

export function methodNotAllowedError(message = 'Method not allowed') {
  const err = new Error(message);
  err.status = 405;
  return err;
}
