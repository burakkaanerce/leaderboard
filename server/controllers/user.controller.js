import Repository from '../repository/index.js'

async function findAll () {
  const values = await Repository.user.list()
  return values
}

async function findById (userId) {
  const values = await Repository.user.listById(userId)
  return values
}

async function findByName (userName) {
  const values = await Repository.user.listByName(userName)
  return values
}

async function createUser (userObj) {
  const value = await Repository.user.create(userObj)
  return value
}

export default {
  findAll,
  findById,
  findByName,
  createUser,
}
