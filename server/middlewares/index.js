import setRoutes from '../routes/index.js'
import expressListRoutes from './expressListRoutes.js'
import errorHandler from './errorHandler.js'
import commonTasks from './commonTasks.js'
import dbConnector from './dbConnector.js'

export default async (app) => {
  await commonTasks(app)
  await setRoutes(app)
  await expressListRoutes(app)
  await errorHandler(app)
  await dbConnector()
  console.info('Successfully worked all starting tasks')
}
