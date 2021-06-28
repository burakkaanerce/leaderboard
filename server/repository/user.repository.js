import User from '../models/user.model.js'

async function create (userObj) {
  const isExist = await User.findOne({ userName: userObj.userName })

  if (isExist) throw Error('USER_EXIST')

  const value = await User.create(userObj)
  return value
}

async function list () {
  const values = await User.find({})
  return values
}

async function findById (userId) {
  const values = await User.find({ userId }).limit(1)
  return values
}

export default {
  create,
  list,
  findById,
}
