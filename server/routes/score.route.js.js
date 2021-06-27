import express from 'express'

const router = express.Router()

router.post('/list', (req, res, next) => {
  res.status(200).json({ success: true, data: { message: 'score list' } })
})

export default {
  route: 'score',
  router,
}
