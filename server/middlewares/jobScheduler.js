import schedule from 'node-schedule'

import dateParser from '../helper/dateParser.js'

import RewardController from '../controllers/reward.controller.js'

export default async () => {
  const job = schedule.scheduleJob({ hour: 0, minute: 0, dayOfWeek: 1 }, async () => {
    const tempDate = new Date()
    tempDate.setDate(tempDate.getDate() - 7)
    const today = dateParser(tempDate)
    await RewardController.distributeRewards(today)
    console.info(`Time for rewards ! (${today.value})`)
  })
}
