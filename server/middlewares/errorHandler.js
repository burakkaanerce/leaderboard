export default async (app) => {
  app.use((req, res, next) => {
    res.status(404).json({ success: false, error: { code: 404, message: 'invalid route' } })
  })

  app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).json({
      success: false, error: { code: err.status || 500, message: err },
    })
  })
}
