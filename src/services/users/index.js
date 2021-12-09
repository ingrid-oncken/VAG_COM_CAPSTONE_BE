import express from 'express'
import UserModel from './schema.js'
import createHttpError from 'http-errors'
import q2m from 'query-to-mongo'
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

// This rout will add new items to the purchased history
// or add a new comment to that product
usersRouter.post('/me/purchaseHistory'),
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      //retriving the product id from req.user
      const purchasedProduct = await User.findById(req.user.productId)
      console.log('purchasedProduct ID', purchasedProduct)

      if (purchasedProduct) {
        const productToInsert = {
          ...purchasedProduct.toObject(),
          purchaseDate: new Date(),
        }

        //update take 3 parameters WHO, HOW and OPTIONS
        //updating the user adding the product to its array
        const updatedUser = await UserModel.findByIdAndUpdate(
          req.user.userId, //who
          //$push is the Mongo update operator to push a new item to the array
          { $push: { purchaseHistory: productToInsert } }, //how
          { new: true } //options
        )
        res.send(updatedUser)
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

//this route will display the whole purchased history of the logged user
usersRouter.get('/me/purchaseHistory'),
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const query = q2m(req.query)
      console.log(query)

      const totalNumOrders = await UserModel.countDocuments(query.criteria)

      const orders = await UserModel.find(query.criteria, query.options.fields)
        .sort(query.options.sort)
        .skip(query.options.skip)
        .limit(query.options.limit)

      res.send({ totalNumOrders, orders })
    } catch (error) {
      next(error)
    }
  }

// displays one single item from the purchased history
// usersRouter.get('/me/purchaseHistory/:productId'),
//   JWTAuthMiddleware,
//   async (req, res, next) => {
//     try {
//     } catch (error) {
//       next(error)
//     }
//   }

// modifies one specific item from purchased history,
// for exemple modifying one comment about that product
// usersRouter.put('/me/purchaseHistory/:productId'),
//   JWTAuthMiddleware,
//   async (req, res, next) => {
//     try {
//     } catch (error) {
//       next(error)
//     }
//   }

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
