export default function errorHandler(err, _req, res, next) {
  const defaultMessage =
    'Something went wrong with your request, please check with the server administrator.'

  const message = err.message || defaultMessage

  if (res.headersSent) return next(err)

  const error =
    // isDev
    // ?
    JSON.stringify(err, Object.getOwnPropertyNames(err), 4)
  // : null

  res.status(err.statusCode || 500).json({ message, error })
}
