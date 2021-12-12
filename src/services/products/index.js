import express from 'express'
import ProductModel from './schema.js'
import createHttpError from 'http-errors'
import q2m from 'query-to-mongo'
import { JWTAuthMiddleware } from '../../auth/token.js'
import { adminOnlyMiddleware } from '../../auth/admin.js'

const productsRouter = express.Router()

//adminOnlyMiddleware,

productsRouter.post(
  '/',
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const newProduct = new ProductModel(req.body)
      const { _id } = await newProduct.save()

      res
        .status(201)
        .send(
          `The new product ${newProduct.productName.toUpperCase()} was added with the ID: ${_id}`
        )
    } catch (error) {
      // console.log(error)
      next(error)
    }
  }
)
productsRouter.get('/', async (req, res, next) => {
  try {
    const products = await ProductModel.find()
    //console.log(products)
    res.send(products)

    // const mongoQuery = q2m(req.query)
    // console.log(mongoQuery)

    //countDocuments() will return to the frontend the total of documents GET is getting, total of items
    //That is important fro the pagination, and by passing the query.criteria I retrive the filtered total

    //query.options.fields = PROJECTION

    // const total = await ProductModel.countDocuments(mongoQuery.criteria)
    // const products = await ProductModel.find(
    //   mongoQuery.criteria
    //   //mongoQuery.options.fields
    // )
    //   .sort(mongoQuery.options.sort)
    //   .skip(mongoQuery.options.skip)
    //   .limit(mongoQuery.options.limit)

    // //links: query.links('/products', total) is creating links for FE to use as prev/first/next/last in pagination
    // //pageTotal: Math.ceil(total / query.options.limit) is dividing the total of items for the stabilhed limit, also to be used by FE as info
    // res.send({
    //   links: mongoQuery.links('/products', total),
    //   pageTotal: Math.ceil(total / mongoQuery.options.limit),
    //   total,
    //   products,
    // })
  } catch (error) {
    console.log(error)
    next(error)
  }
})
productsRouter.get('/:id', async (req, res, next) => {
  try {
  } catch (error) {
    next(erro)
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
