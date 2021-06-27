import setRoutes from '../routes/index.js'
import expressListRoutes from './expressListRoutes.js'
import errorHandler from './errorHandler.js'
import commonTasks from './commonTasks.js'

export default async (app) => {
  await commonTasks(app)
  await setRoutes(app)
  await expressListRoutes(app)
  await errorHandler(app)
  console.info('Successfully worked all starting tasks')
}
