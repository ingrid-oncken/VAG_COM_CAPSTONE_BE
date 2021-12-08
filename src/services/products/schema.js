import mongoose from 'mongoose'

const { Schema, model } = mongoose

const ProductSchema = new Schema(
  {
    productName: { type: String, required: true },
    description: { type: String, required: true },

    image: { type: String, required: false },
    language: {
      type: String,
      default: 'English',
      required: true,
      enum: ['English', 'Português', 'Italiano', 'Español', 'Deutsch'],
    },
    category: {
      type: String,
      default: 'VCDS®',
      required: true,
      enum: ['HEX-V2', 'HEX-NET', 'HEX-NET® Pro', 'Software'],
    },
    price: { type: Number, required: true },
    comments: [
      // {
      //   commentAuthor: {
      //     type: Schema.Types.ObjectId,
      //     ref: 'Users',
      //     required: true,
      //   },
      //   comment: { type: String, required: false },
      //   rate: { type: Number, required: false },
      // },
    ],
    stock: { type: Number, required: false },
    available: { type: Boolean, required: true },
  },
  { timestamps: true }
)

ProductSchema.methods.toJSON = function () {
  const productDocument = this
  const productObject = productDocument.toObject()

  delete productObject.__v
  delete productObject.stock
}

export default model('Product', ProductSchema)
