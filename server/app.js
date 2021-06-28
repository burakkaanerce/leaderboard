import express from 'express'

import middlewareWorker from './middlewares/index.js'

const app = express()

middlewareWorker(app)

export default app
