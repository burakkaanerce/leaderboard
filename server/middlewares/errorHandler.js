/* eslint-disable no-unused-vars */
export default async (app) => {
  app.use((req, res, next) => {
    res.status(404).json({ success: false, error: { code: 404, message: 'invalid route' } })
  })

  app.use((err, req, res, next) => {
    res
      .status(err.code || 500)
      .json({ success: false, error: { code: err.code || 500, message: err.message || err } })
  })
}
