import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
  userId: String,
  userName: { type: String, min: [4, 'Too short, min is 4 characters'], max: [32, 'Too long, max is 32 characters'] },
  age: Number,
})

export default mongoose.model('User', userSchema)
