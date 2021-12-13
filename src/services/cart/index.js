import express from 'express'
import createHttpError from 'http-errors'
import ProductModel from '../products/schema.js'
import CartModel from './schema.js'
import { JWTAuthMiddleware } from '../../auth/token.js'
const cartsRouter = express.Router()

cartsRouter.post(
  '/me/addProduct',
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      //retrive the product
      const productId = req.body.productId
      console.log('LINE 15 - THIS IS productId cart/index.js', productId)

      const purchasedProduct = await ProductModel.findById(productId)

      const x = req.params.ownerId
      console.log('LINE 20 - THIS IS req.params.ownerId on cart/index.js', x)

      if (purchasedProduct) {
        //looking for the product using the ownerId AND the status
        const isProductThere = await CartModel.findOne({
          ownerId: req.params.ownerId,
          status: 'active',
          'products.productName': purchasedProduct.productName,
        })

        if (isProductThere) {
          //if the product is already in the cart, only need to increase the quantity
          const updatedCart = await CartModel.findOneAndUpdate(
            {
              ownerId: req.params.ownerId,
              status: 'active',
              'products.productName': purchasedProduct.productName,
            },
            {
              $inc: {
                'product.$.quantity': req.body.quantity,
              },
            }
          )
          res.send(updatedCart)
        } else {
          //so, if the product is not in the cart, let's add it
          const productToInsert = {
            ...purchasedProduct.toObject(),
            quantity: req.body.quantity,
          }

          //upsert is a mongo property that create the cart is it does not exist yet
          const updatedCart = await CartModel.findOneAndUpdate(
            { ownerId: req.params.ownerId, status: 'active' },
            {
              $push: { products: productToInsert },
            },
            { runValidators: true, upsert: true, new: true }
          )
          res.send(updatedCart)
        }
      } else {
        next(
          createHttpError(
            404,
            `404: The product with the id ${productId} was not found`
          )
        )
      }
    } catch (error) {
      next(error)
    }

    // try {
    //   const { productId, quantity } = req.body
    //   console.log('Line 76', { productId, quantity })

    //   const purchasedProduct = await ProductModel.findById(productId)
    //   console.log('Line 79', purchasedProduct)

    //   if (purchasedProduct) {
    //     const isProductThere = await CartModel.findOne({
    //       ownerId: req.params.ownerId,
    //       status: 'active',
    //     })
    //     console.log('Line 86', isProductThere.ownerId) //THIS IS RETURNING NULL
    //     if (isProductThere) {
    //       const cart = await CartModel.findOneAndUpdate(
    //         { ownerId: req.params.ownerId, status: 'active' },
    //         { $inc: { 'products.$.quantity': quantity } },
    //         { new: true }
    //       )
    //       res.send(cart)
    //     } else {
    //       const productToInsert = { ...purchasedProduct.toObject(), quantity }

    //       const cart = await CartModel.findOneAndUpdate(
    //         { ownerId: req.params.ownerId, status: 'active' },
    //         { $push: { products: productToInsert } },
    //         { new: true, upsert: true }
    //       )

    //       res.send(cart)
    //     }
    //   } else {
    //     next(
    //       createHttpError(
    //         404,
    //         `404: The product with the id ${productId} was not found.`
    //       )
    //     )
    //   }
    // } catch (error) {
    //   next(error)
    // }
  }
)

export default cartsRouter
