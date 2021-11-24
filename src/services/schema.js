import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema, model } = mongoose

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

//.pre .pos are kind of hooks for mongoose
//before saving the user on the DB I'll hash the password
//I am using a plain function so I can use 'this'
UserSchema.pre('save', async function (next) {
  const newUser = this
  const plainPW = newUser.password

  if (newUser.isModified('password')) {
    newUser.password = await bcrypt.hash(plainPW, 10)
  }
  next()
})

export default model('User', UserSchema)
