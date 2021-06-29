import schedule from 'node-schedule'

import dateParser from '../helper/dateParser.js'

import RewardController from '../controllers/reward.controller.js'

export default async () => {
  const job = schedule.scheduleJob({ hour: 0, minute: 0, dayOfWeek: 1 }, async () => {
    const today = dateParser(new Date())
    await RewardController.distributeRewards(today)
    console.info(`Time for rewards ! (${today.value})`)
  })
}
