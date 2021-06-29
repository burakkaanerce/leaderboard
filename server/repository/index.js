import RewardRepository from './reward.repository.js'
import ScoreRepository from './score.repository.js'
import UserRepository from './user.repository.js'

export default {
  user: UserRepository,
  score: ScoreRepository,
  reward: RewardRepository,
}
