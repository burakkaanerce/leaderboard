import mongoose from 'mongoose'

const { Schema } = mongoose

const scoreSchema = new Schema({
  userId: String,
  year: Number,
  week: Number,
  day: Number,
  score: Number,
})

export default mongoose.model('Score', scoreSchema)
