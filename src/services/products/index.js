import express from 'express'
import ProductModel from './schema.js'
import createHttpError from 'http-errors'
import q2m from 'query-to-mongo'
import { adminOnlyMiddleware } from '../../auth/admin.js'

const productsRouter = express.Router()

//adminOnlyMiddleware,

productsRouter.post('/', async (req, res, next) => {
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
    const query = q2m(req.query)

    console.log(query)

    //countDocuments() will return to the frontend the total of documents GET is getting, total of items
    //That is important fro the pagination, and by passing the query.criteria I retrive the filtered total
    const total = await ProductModel.countDocuments(query.criteria)

    //query.options.fields = PROJECTION

    const products = await ProductModel.find(
      query.criteria,
      query.options.fields
    )
      .sort(query.options.sort)
      .skip(query.options.skip)
      .limit(query.options.limit)

    //links: query.links('/products', total) is creating links for FE to use as prev/first/next/last in pagination
    //pageTotal: Math.ceil(total / query.options.limit) is dividing the total of items for the stabilhed limit, also to be used by FE as info
    res.send({
      links: query.links('/products', total),
      total,
      products,
      pageTotal: Math.ceil(total / query.options.limit),
    })
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
