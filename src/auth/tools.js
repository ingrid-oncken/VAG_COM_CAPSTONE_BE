import jwt from 'jsonwebtoken'

export const JWTAuthenticate = async (user) => {
  const accessToken = await generateJWT({ _id: user._id })

  return accessToken
}

//Here I will sign tokens and verify tokens
//new Promise to make the JWT func return a promise, originally it would return callback
export const generateJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '6 weekS' },
      (err, token) => {
        if (err) reject(err)
        else resolve(token)
      }
    )
  )
