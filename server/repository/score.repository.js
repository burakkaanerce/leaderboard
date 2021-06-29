import errorGenerator from '../helper/errorGenerator.js'
import dateParser from '../helper/dateParser.js'

import Score from '../models/score.model.js'
import User from '../models/user.model.js'

async function add (scoreObj) {
  const isUserExist = await User.findById(scoreObj.userId)

  if (!isUserExist) throw errorGenerator('NOT_FOUND_USER', 409)

  const today = dateParser(new Date())

  const value = await Score
    .findOneAndUpdate(
      {
        year: today.year,
        week: today.week,
        day: today.day,
        userId: `${scoreObj.userId}`,
      },
      { $inc: { score: scoreObj.score } },
      { upsert: true, new: true },
    )

  return value
}

async function getLeaderboardById (userId) {
  const date = dateParser(new Date())

  const todayScoreParser = [
    {
      $project: {
        userId: {
          $toString: '$_id',
        },
        userName: 1,
        age: 1,
      },
    },
    {
      $lookup: {
        from: 'scores',
        as: 'todayScores',
        let: { userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$userId'] },
                  { $eq: ['$year', date.year] },
                  { $eq: ['$week', date.week] },
                  { $eq: ['$day', date.day] },
                ],
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        userId: 1,
        userName: 1,
        age: 1,
        todayScore: { $sum: '$todayScores.score' },
      },
    },
  ]

  const yesterdayScoreParser = [
    {
      $project: {
        userId: 1,
        userName: 1,
        age: 1,
        todayScore: 1,
      },
    },
    {
      $lookup: {
        from: 'scores',
        as: 'yesterdayScores',
        let: { userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$userId'] },
                  { $eq: ['$year', date.year] },
                  { $eq: ['$week', date.week] },
                  { $eq: ['$day', (date.day - 1)] },
                ],
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        userId: 1,
        userName: 1,
        age: 1,
        todayScore: 1,
        yesterdayScore: { $sum: '$yesterdayScores.score' },
      },
    },
  ]

  const totalScoreParser = [
    {
      $project: {
        userId: 1,
        userName: 1,
        age: 1,
        todayScore: 1,
        yesterdayScore: 1,
      },
    },
    {
      $lookup: {
        from: 'scores',
        as: 'totalScores',
        let: { userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$userId'] },
                  { $eq: ['$year', date.year] },
                  { $eq: ['$week', date.week] },
                ],
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        userId: 1,
        userName: 1,
        age: 1,
        todayScore: 1,
        yesterdayScore: 1,
        totalScore: { $sum: '$totalScores.score' },
        dayChange: {
          $subtract: ['$todayScore', '$yesterdayScore'],
        },
      },
    },
  ]

  const currentPlayer = await User.aggregate([
    ...todayScoreParser,
    ...yesterdayScoreParser,
    ...totalScoreParser,
    {
      $match: {
        userId,
      },
    },
  ])

  if (!currentPlayer || currentPlayer.length === 0) throw errorGenerator('NOT_FOUND_USER', 404)

  const top100Conds = [
    {
      $sort: {
        totalScore: -1,
      },
    },
    {
      $limit: 100,
    },
  ]

  const next3Conds = [
    {
      $match: {
        totalScore: {
          $gte: currentPlayer[0].totalScore,
        },
        userId: {
          $ne: userId,
        },
      },
    },
    {
      $sort: {
        totalScore: 1,
      },
    },
    {
      $limit: 3,
    },
  ]

  const prev2Conds = [
    {
      $match: {
        totalScore: {
          $lte: currentPlayer[0].totalScore,
        },
        userId: {
          $ne: userId,
        },
      },
    },
    {
      $sort: {
        totalScore: -1,
      },
    },
    {
      $limit: 2,
    },
  ]

  const top100 = await User.aggregate([
    ...todayScoreParser,
    ...yesterdayScoreParser,
    ...totalScoreParser, ...top100Conds,
  ])
  const nextPlayers = await User.aggregate([
    ...todayScoreParser,
    ...yesterdayScoreParser,
    ...totalScoreParser, ...next3Conds,
  ])
  const previousPlayers = await User.aggregate([
    ...todayScoreParser,
    ...yesterdayScoreParser,
    ...totalScoreParser, ...prev2Conds,
  ])

  return {
    date,
    top100,
    currentPlayer,
    nextPlayers,
    previousPlayers,
  }
}

async function getLeaderboard () {
  const date = dateParser(new Date())

  const todayScoreParser = [
    {
      $project: {
        userId: {
          $toString: '$_id',
        },
        userName: 1,
        age: 1,
      },
    },
    {
      $lookup: {
        from: 'scores',
        as: 'todayScores',
        let: { userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$userId'] },
                  { $eq: ['$year', date.year] },
                  { $eq: ['$week', date.week] },
                  { $eq: ['$day', date.day] },
                ],
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        userId: 1,
        userName: 1,
        age: 1,
        todayScore: { $sum: '$todayScores.score' },
      },
    },
  ]

  const yesterdayScoreParser = [
    {
      $project: {
        userId: 1,
        userName: 1,
        age: 1,
        todayScore: 1,
      },
    },
    {
      $lookup: {
        from: 'scores',
        as: 'yesterdayScores',
        let: { userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$userId'] },
                  { $eq: ['$year', date.year] },
                  { $eq: ['$week', date.week] },
                  { $eq: ['$day', (date.day - 1)] },
                ],
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        userId: 1,
        userName: 1,
        age: 1,
        todayScore: 1,
        yesterdayScore: { $sum: '$yesterdayScores.score' },
      },
    },
  ]

  const totalScoreParser = [
    {
      $project: {
        userId: 1,
        userName: 1,
        age: 1,
        todayScore: 1,
        yesterdayScore: 1,
      },
    },
    {
      $lookup: {
        from: 'scores',
        as: 'totalScores',
        let: { userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$userId'] },
                  { $eq: ['$year', date.year] },
                  { $eq: ['$week', date.week] },
                ],
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        userId: 1,
        userName: 1,
        age: 1,
        todayScore: 1,
        yesterdayScore: 1,
        totalScore: { $sum: '$totalScores.score' },
        dayChange: {
          $subtract: ['$todayScore', '$yesterdayScore'],
        },
      },
    },
  ]

  const top100Conds = [
    {
      $sort: {
        totalScore: -1,
      },
    },
    {
      $limit: 100,
    },
  ]

  const top100 = await User.aggregate([
    ...todayScoreParser,
    ...yesterdayScoreParser,
    ...totalScoreParser,
    ...top100Conds,
  ])

  return {
    date,
    top100,
  }
}

async function getLeaderboardByDate (dateObj) {
  const totalScoreParser = [
    {
      $project: {
        userId: {
          $toString: '$_id',
        },
        userName: 1,
        age: 1,
      },
    },
    {
      $lookup: {
        from: 'scores',
        as: 'scores',
        let: { userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$userId'] },
                  { $eq: ['$year', dateObj.year] },
                  { $eq: ['$week', dateObj.week] },
                ],
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        userId: 1,
        userName: 1,
        age: 1,
        score: { $sum: '$scores.score' },
      },
    },
  ]

  const top100Conds = [
    {
      $sort: {
        totalScore: -1,
      },
    },
    {
      $limit: 100,
    },
  ]

  const top100 = await User.aggregate([
    ...totalScoreParser,
    ...top100Conds,
  ])

  return {
    dateObj,
    top100,
  }
}

export default {
  add,
  getLeaderboard,
  getLeaderboardById,
  getLeaderboardByDate,
}
