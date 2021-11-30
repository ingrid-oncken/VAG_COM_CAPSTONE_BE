import express from 'express'
import UserModel from './schema.js'
import createHttpError from 'http-errors'

import { JWTAuthenticate } from '../../auth/tools.js'
import { JWTAuthMiddleware } from '../../auth/token.js'
// import { basicAuthMiddleware } from '../auth/basic.js'
import { adminOnlyMiddleware } from '../../auth/admin.js'

const usersRouter = express.Router()

usersRouter.post('/register', async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()

    res
      .status(201)
      .send(
        `The new user ${newUser.name.toUpperCase()} ${newUser.surname.toUpperCase()} was created with ID: ${_id}`
      )
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
// /me are the personal routes accessed by the user
//attaching the CURRENT LOGGED USER to the request
usersRouter.get('/me', JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})

usersRouter.put('/me', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const userID = req.user._id
    const updatedUser = await UserModel.findByIdAndUpdate(userID, req.body, {
      new: true,
    })

    updatedUser
      ? res.send(updatedUser)
      : next(createHttpError(404, `User with id ${userID} not found!`))
  } catch (error) {
    next(error)
  }
})

usersRouter.delete('/me', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const deletedUser = await req.user.deleteOne()

    if (deletedUser) {
      res.status(204).send()
    } else {
      next(createError(404, `The user was not found!`))
    }
  } catch (error) {
    next(error)
  }
})
usersRouter.post('/me/purchaseHistory'),
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      //retriving the product id from req.user
      const purchasedProduct = await User.findById(req.user.productId)

      if (purchasedProduct) {
        const productToInsert = {
          ...purchasedProduct.toObject(),
          purchaseDate: new Date(),
        }

        //update take 3 parameters WHO, HOW and OPTIONS
        //updating the user adding the product to its array
        const updatedUser = await UserModel.findByIdAndUpdate(
          req.user.userId,
          { $push: { purchaseHistory: productToInsert } },
          { new: true }
        )
          res.send(updatedUser)
          
        // updatedUser
        //   ? res.send(updatedUser)
        //   : //Does it make sense? if the user is already logged?
        //     next(
        //       createError(
        //         404,
        //         `***This is actually an error that I don't know if it will ever happen *** The user with id ${req.user.userId} was not found`
        //       )
        //     )
      } else {
        next(
          createError(
            404,
            `The product with id ${req.user.productId} was not found`
          )
        )
      }
    } catch (error) {
      next(error)
    }
  }
usersRouter.get('/me/purchaseHistory'),
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error)
    }
  }
usersRouter.get('/me/purchaseHistory/:productId'),
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error)
    }
  }
usersRouter.put('/me/purchaseHistory/:productId'),
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error)
    }
  }
usersRouter.delete('/me/purchaseHistory/:productId'),
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error)
    }
  }

//the order os the Middleware are important, 1as check if the user has credentials = basicAuthMiddleware
//then check if it is an Admin = adminOnlyMiddleware
usersRouter.get(
  '/:id',
  JWTAuthMiddleware,
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
