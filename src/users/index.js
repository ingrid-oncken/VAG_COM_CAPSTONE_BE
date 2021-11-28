import express from 'express'
import UserModel from './schema.js'
import createHttpError from 'http-errors'

import { JWTAuthenticate } from '../auth/tools.js'
import { JWTAuthMiddleware } from '../auth/token.js'
import { basicAuthMiddleware } from '../auth/basic.js'
import { adminOnlyMiddleware } from '../auth/admin.js'

const usersRouter = express.Router()

usersRouter.post('/register', async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()

    res.status(201).send(`The user id is: ${_id}`)
  } catch (error) {
    next(error)
  }
})
usersRouter.get('/', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const users = await UserModel.find()

    res.send(users)
  } catch (error) {
    next(error)
  }
})
//:me are the personal routes accessed by the user
//attaching the CURRENT LOGGED USER to the request
usersRouter.get('/me', basicAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})

usersRouter.put('/me', basicAuthMiddleware, async (req, res, next) => {
  try {
    req.user.name = 'Jhon'
    await req.user.save()
    res.send()
  } catch (error) {
    next(error)
  }
})

usersRouter.delete('/me', basicAuthMiddleware, async (req, res, next) => {
  try {
    await req.user.deleteOne()
    res.send()
  } catch (error) {
    next(error)
  }
})

//the order os the Middleware are important, 1as check if the user has credentials = basicAuthMiddleware
//then check if it is an Admin = adminOnlyMiddleware
usersRouter.get(
  '/:id',
  basicAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.params.id)
      res.send(user)
    } catch (error) {
      next(error)
    }
  }
)

usersRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.checkCredentials(email, password)

    if (user) {
      const accessToken = await JWTAuthenticate(user)

      //frotend will get this token and save on local storage
      res.send({ accessToken })
    } else {
      next(createHttpError(401, '401: Credentials are not correct!'))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter
