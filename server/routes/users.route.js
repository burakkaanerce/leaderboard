import express from 'express'
import { body, param, validationResult } from 'express-validator'

import UserController from '../controllers/user.controller.js'

const router = express.Router()

router.get('/find', async (req, res, next) => {
  try {
    const allUsers = await UserController.getAll()
    return res.status(200).json({ success: true, data: allUsers })
  } catch (err) {
    return res.status(400).json({ success: false, error: { code: 400, message: 'getAll error' } })
  }
})

router.get('/find/:id',
  param('id').isInt({ min: 1 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw Error('Invalid Param')
      }
      const allUsers = await UserController.getAll()
      return res.status(200).json({ success: true, data: allUsers })
    } catch (err) {
      return res.status(400).json({ success: false, error: { code: 400, message: err.message || 'getAll error' } })
    }
  })

router.post('/create',
  body('userName').isLength({ min: 3 }),
  body('age').isInt({ min: 5 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw Error(errors.array().map((e) => `${e.param} ${e.msg}`).join(', '))
      }
      const created = await UserController.createUser(req.body)
      return res.status(200).json({ success: true, data: created })
    } catch (err) {
      return res.status(400).json({ success: false, error: { code: 400, message: err.message || 'create error' } })
    }
  })

export default {
  route: 'users',
  router,
}
