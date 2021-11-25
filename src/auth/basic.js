import createHttpError from 'http-errors'
import atob from 'atob' //used to decode based 64 strings
import UserModel from '../users/schema.js'

//Here I am creating basic authentication to protect routes that use ID
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
      next()
    } else {
      //credentials problems --> user was null
      next(createHttpError(401, '401: Credentials are not correct!'))
    }
  }
}
