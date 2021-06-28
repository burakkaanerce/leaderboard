import Repository from '../repository/index.js'
import User from '../models/user.model.js'

async function getAll () {
  const values = await Repository.user.list(User)
  return values
}

async function createUser (userObj) {
  const value = await Repository.user.create(userObj)
  return value
}

export default {
  getAll,
  createUser,
}
