import insert from '#example/controllers/example/insert.js'

export default {
  handler: async (_req, res) => {
    const data = await insert()
    res.send(data)
  },
  name: 'insert-bq-example',
  entryPoint: 'insert.handler',
  allowPublic: true
}
