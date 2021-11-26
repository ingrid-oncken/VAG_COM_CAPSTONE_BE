import createHttpError from 'http-errors'
import atob from 'atob' //used to decode based 64 strings
import UserModel from '../users/schema.js'

//creating basic authentication to protect routes that uses ID
export const basicAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(401, 'Please provide credentials in Authorization header')
    )
  } else {
    const decodedCredentials = atob(req.headers.authorization.split(' ')[1])
    console.log(decodedCredentials)

    const [email, password] = decodedCredentials.split(':')
    console.log('EMAIL', email)
    console.log('PASSWORD', password)

    const user = await UserModel.checkCredentials(email, password)

    if (user) {
      req.user = user
      //if the user is logged in, he has acces to the protected routes
      // so he has acces to his own profile
      //attaching the CURRENT LOGGED USER to the request
      next()
    } else {
      //credentials problems --> user was null
      next(createHttpError(401, '401: Credentials are not correct!'))
    }
  }
}
