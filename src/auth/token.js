import createHttpError from 'http-errors'
import { verifyJWT } from './tools.js'

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    createHttpError(401, 'Please provide credentials in Authorization header')
  } else {
    //exctracting the token from the headers
    const token = req.headers.authorization.replace('Bearer ', '')

    //Verifying the token
    const decodedToken = await verifyJWT(token)
    next()
  }
}
