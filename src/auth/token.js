import createHttpError from 'http-errors'
import UserModel from '../services/users/schema.js'
import { verifyJWT } from './tools.js'

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    createHttpError(401, 'Please provide credentials in Authorization header')
  } else {
    try {
      //exctracting the token from the headers
      const token = req.headers.authorization.replace('Bearer ', '')

      //Verifying the token
      const decodedToken = await verifyJWT(token)

      //this clg will return basically the payload
      //Ex: Decoded TOKEN:  { _id: '61a0bc6e27ea5ebeefb699fd', iat: 1638105603, exp: 1641734403 }
      console.log('Decoded TOKEN: ', decodedToken)

      //bringing the user from the DB, he will be findede by the id number present in the token
      const user = await UserModel.findById(decodedToken._id)
      if (user) {
        //atatch the user to the request
        req.user = user
        next()
      } else {
        next(createHttpError(404, '404: User not found. ***token.js***'))
      }
    } catch (error) {
      //If the token is not valid, then I 'catch' the error
      //Invalid Signature ertror
      console.log(error)
      next(createHttpError(401, '401: Token not valid!'))
    }
  }
}
