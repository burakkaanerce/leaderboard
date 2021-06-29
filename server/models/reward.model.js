import mongoose from 'mongoose'

const { Schema } = mongoose

const rewardSchema = new Schema({
  userId: String,
  year: Number,
  week: Number,
  score: Number,
})

export default mongoose.model('Reward', rewardSchema)
