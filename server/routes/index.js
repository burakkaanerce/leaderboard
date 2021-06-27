import path from 'path'
import url from 'url'
import { readdir } from 'fs/promises'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async (app) => {
  try {
    const files = await readdir(__dirname)
    return await Promise.all(files.map(async (file) => {
      if (file.indexOf('.route.js') > -1) {
        const module = await import(path.join(__dirname, file))
        await app.use(`/api/v1/${module.default.route}`, module.default.router)
      }
    }))
  } catch (err) {
    console.error(err)
    return err
  }
}
