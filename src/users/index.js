import express from 'express'
import UserSchema from './schema.js'
import { basicAuthMiddleware } from '../auth/basic.js'
import { adminOnlyMiddleware } from '../auth/admin.js'

const usersRouter = express.Router()

usersRouter.post('/register', async (req, res, next) => {
  try {
    const newUser = new UserSchema(req.body)
    const { _id } = await newUser.save()

    res.status(201).send(`The user id is: ${_id}`)
  } catch (error) {
    next(error)
  }
})
usersRouter.get(
  '/',
  basicAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const users = await UserSchema.find()

      res.send(users)
    } catch (error) {
      next(error)
    }
  }
)
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
      const users = await UserSchema.findById(req.params.id)
      res.send(users)
    } catch (error) {
      next(error)
    }
  }
)

export default usersRouter
