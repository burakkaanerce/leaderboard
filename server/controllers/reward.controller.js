import Repository from '../repository/index.js'
import dateParser from '../helper/dateParser.js'

async function distributeRewards (date) {
  const value = await Repository.reward.distribute(date)
  return value
}

export default {
  distributeRewards,
}
