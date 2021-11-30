import express from 'express'
import ProductModel from './schema.js'
import { JWTAuthMiddleware } from '../../auth/token.js'

const productsRouter = express.Router()

productsRouter.post('/', async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})
productsRouter.get('/', async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})
productsRouter.get('/:id', async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})
productsRouter.get('/:id', async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})
productsRouter.put('/:id', async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

export default productsRouter
