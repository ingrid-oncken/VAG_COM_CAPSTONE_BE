//Here I am creating basic authentication to protect routes that use ID

export const basicAuthMiddleware = (req, res, next) => {
  console.log('BASIC AUTHENTICATION MIDDLEWARE')
  next()
}
