import path from 'path'
import url from 'url'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import express from 'express'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async (app) => {
  app.use(logger('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, '../public')))
}
