const get = require('./../controllers/example/get.js')


export default {
  handler: async (_req, res) => {
    const data = await get()
    const status = data?.length ? 200 : 204
    res.status(status).send(data)
    console.log('cenourinha')

  },
  name: 'get-bq-example',
  entryPoint: 'get.handler'
  // cron: {
  //   cronExpression: '*/2 * * * *'
  // }
}


