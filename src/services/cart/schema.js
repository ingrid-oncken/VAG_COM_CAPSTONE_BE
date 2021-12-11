import mongoose, { SchemaTypes } from 'mongoose'

const { Schema, model } = mongoose

const cartSchema = new Schema(
  {
    ownerId: { type: SchemaTypes.ObjectId, ref: 'User' },
    products: [
      {
        productName: String,
        language: String,
        category: String,
        price: Number,
        quantity: Number,
      },
    ],
    status: { type: String, enum: ['active', 'paid'] },
  },
  { timestamps: true }
)

export default model('Cart', cartSchema)
