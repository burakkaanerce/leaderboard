import express from 'express'
import { body, param, validationResult } from 'express-validator'

import UserController from '../controllers/user.controller.js'
import errorGenerator from '../helper/errorGenerator.js'

const router = express.Router()

router.get('/find', async (req, res, next) => {
  try {
    const allUsers = await UserController.findAll()
    return res.status(200).json({ success: true, data: allUsers })
  } catch (err) {
    return next(err)
  }
})

router.get('/find/:userId',
  param('userId').custom((value) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      throw Error('INVALID_USERID')
    }
  }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw errorGenerator('INVALID_USERID', 400)
      }
      const user = await UserController.findById(req.params.userId)
      return res.status(200).json({ success: true, data: user })
    } catch (err) {
      return next(err)
    }
  })

router.post('/create',
  body('userName').isAlphanumeric().isLength({ min: 3 }),
  body('age').isInt({ min: 5 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw Array.from(new Set(errors.array().map((e) => `INVALID_${e.param.toUpperCase()}`)))
      }
      const created = await UserController.createUser(req.body)
      return res.status(200).json({ success: true, data: created })
    } catch (err) {
      return next(err)
    }
  })

export default {
  route: 'users',
  router,
}
