import errorGenerator from '../helper/errorGenerator.js'

import User from '../models/user.model.js'

async function create (userObj) {
  const isExist = await User.findOne({ userName: userObj.userName })

  if (isExist) throw errorGenerator('DUPLICATED_USER', 409)

  const value = await User.create(userObj)
  return value
}

async function list () {
  const users = await User.aggregate([
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
        as: 'totalScores',
        let: { userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$userId', '$$userId'] }],
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
        totalScore: { $sum: '$totalScores.score' },
      },
    },
    {
      $lookup: {
        from: 'rewards',
        as: 'totalRewards',
        let: { userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$userId', '$$userId'] }],
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
        score: { $add: [{ $sum: '$totalRewards.score' }, '$totalScore'] },
      },
    },
  ])
  return users
}

async function listById (userId) {
  const user = await User.aggregate([
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
      $match: {
        userId,
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
                $and: [{ $eq: ['$userId', '$$userId'] }],
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
        totalScore: { $sum: '$totalScores.score' },
      },
    },
    {
      $lookup: {
        from: 'rewards',
        as: 'totalRewards',
        let: { userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$userId', '$$userId'] }],
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
        score: { $add: [{ $sum: '$totalRewards.score' }, '$totalScore'] },
      },
    },
  ])

  if (!user) throw errorGenerator('NOT_FOUND_USER', 404)

  return user
}

async function listByName (userName) {
  const user = await User.aggregate([
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
      $match: {
        userName,
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
                $and: [{ $eq: ['$userId', '$$userId'] }],
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
        totalScore: { $sum: '$totalScores.score' },
      },
    },
    {
      $lookup: {
        from: 'rewards',
        as: 'totalRewards',
        let: { userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$userId', '$$userId'] }],
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
        score: { $add: [{ $sum: '$totalRewards.score' }, '$totalScore'] },
      },
    },
  ])

  if (!user) throw errorGenerator('NOT_FOUND_USER', 404)

  return user
}

export default {
  create,
  list,
  listById,
  listByName,
}
