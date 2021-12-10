import createHttpError from 'http-errors'

export const adminOnlyMiddleware = (req, res, next) => {
  if (req.user.role === 'Admin') {
    //console.log('CLG req.user.role', req.user.role)
    next()
  } else {
    next(createHttpError(403, '403: Admins Only!'))
  }
}
