import express from 'express'
import UserModel from './schema.js'

const usersRouter = express.Router()

usersRouter.post('/register', async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const {_id} = await newUser.save()

    res.status(201).send(`The user id is: ${_id}`)
  } catch (error) {
    next(error)
  }
})
usersRouter.get('/', async (req, res, next) => {
  try {
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
