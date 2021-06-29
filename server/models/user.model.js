import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
  userName: String,
  age: Number,
})

export default mongoose.model('User', userSchema)
