/* eslint-disable no-nested-ternary */
import Score from '../models/score.model.js'
import Reward from '../models/reward.model.js'
import scoreRepository from './score.repository.js'

async function rewardPool (dateObj) {
  const reward = await Score.aggregate(
    [
      {
        $match: {
          week: dateObj.week,
        },
      }, {
        $project: {
          week: 1,
          year: 1,
          totalReward: {
            $sum: '$score',
          },
        },
      }, {
        $group: {
          _id: '',
          totalReward: {
            $sum: '$totalReward',
          },
        },
      }, {
        $project: {
          _id: 0,
          totalReward: '$totalReward',
        },
      }, {
        $set: {
          week: dateObj.week,
          year: dateObj.year,
        },
      },
    ],
  )
  return reward[0]
}

async function distribute (dateObj) {
  const reward = (await rewardPool(dateObj)).totalReward
  const top100 = await scoreRepository.getLeaderboard()

  await Promise.all(top100.top100.map(async (user, index) => {
    const tempReward = reward
    * ((index === 0) ? 0.2
      : (index === 1 ? 0.15
        : (index === 2 ? 0.1
          : (0.55 / 97))))

    const isExist = await Reward.findOne({
      userId: user.userId,
      year: dateObj.year,
      week: dateObj.week,
    })

    if (!isExist) {
      const value = await Reward.create({
        userId: user.userId,
        year: dateObj.year,
        week: dateObj.week,
        score: tempReward,
      })

      return value
    }
  }))
}

export default {
  distribute,
}
