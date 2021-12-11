import mongoose from 'mongoose'

const { Schema, model } = mongoose

const cartSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
