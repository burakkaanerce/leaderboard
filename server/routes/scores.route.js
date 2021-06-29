import express from 'express'
import { body, param, validationResult } from 'express-validator'

import ScoreController from '../controllers/score.controller.js'
import UserController from '../controllers/user.controller.js'

const router = express.Router()

router.post('/add',
  body('userId').isAlphanumeric(),
  body('score').isNumeric(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw Array.from(new Set(errors.array().map((e) => `INVALID_${e.param.toUpperCase()}`)))
      }
      const added = await ScoreController
        .addScore({ userId: req.body.userId, score: req.body.score })
      return res.status(200).json({ success: true, data: added })
    } catch (err) {
      return next(err)
    }
  })

router.get('/leaderboard/:userId',
  param('userId').custom((value) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      throw Error('Invalid value')
    }
  }), async (req, res, next) => {
    try {
      const leaderboard = await ScoreController.getLeaderboard(req.params.userId)
      return res.status(200).json({ success: true, data: leaderboard })
    } catch (err) {
      return next(err)
    }
  })

router.get('/leaderboard', async (req, res, next) => {
  try {
    const leaderboard = await ScoreController.getLeaderboardById()
    return res.status(200).json({ success: true, data: leaderboard })
  } catch (err) {
    return next(err)
  }
})

export default {
  route: 'score',
  router,
}
