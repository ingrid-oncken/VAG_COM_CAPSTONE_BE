import express from 'express'
import ProductModel from './schema.js'
import createHttpError from 'http-errors'
import q2m from 'query-to-mongo'
import { adminOnlyMiddleware } from '../../auth/admin.js'

const productsRouter = express.Router()

//adminOnlyMiddleware,

productsRouter.post('/', async (req, res, next) => {
  console.log('Before try', req.body)
  try {
    const newProduct = new ProductModel(req.body)
    const { _id } = await newProduct.save()

    res
      .status(201)
      .send(
        `The new product ${newProduct.productName.toUpperCase()} was added with the ID: ${_id}`
      )
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
