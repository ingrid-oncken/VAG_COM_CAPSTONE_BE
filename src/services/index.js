import express from 'express'
import UserModel from './schema.js'
import { basicAuthMiddleware } from '../auth/basic.js'

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
usersRouter.get('/', basicAuthMiddleware, async (req, res, next) => {
  try {
    const allUsers = await UserModel.find()

    res.send(allUsers)
  } catch (error) {
    next(error)
  }
})
usersRouter.get('/:userID', async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})
usersRouter.put('/:userID', async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})
usersRouter.delete('/:userID', async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

export default usersRouter
