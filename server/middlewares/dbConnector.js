import mongoose from 'mongoose'
import config from '../config/index.js'

export default async () => {
  await mongoose.connect(
    config.DB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  ).then(() => {
    console.log('connection to database established')
  }).catch((err) => {
    console.log(`db error ${err.message}`)
    process.exit(-1)
  })
}
