import express from 'express'

const router = express.Router()

router.get('/get', (req, res, next) => {
  res.status(200).json({ success: true, data: { message: 'users get' } })
})

export default {
  route: 'users',
  router,
}
