import Repository from '../repository/index.js'

async function addScore (scoreObj) {
  const value = await Repository.score.add(scoreObj)
  return value
}

async function getLeaderboard () {
  const values = await Repository.score.getLeaderboard()
  return values
}

async function getLeaderboardById (userId) {
  const values = await Repository.score.getLeaderboardById(userId)
  return values
}

export default {
  addScore,
  getLeaderboard,
  getLeaderboardById,
}
