import BigQuery from './../../services/bigquery/index.js'

export default async () => {
  try {
    console.log('batatinha')
    const { doQuery } = BigQuery
    const source = `tt.ttt}`
    const query = `SELECT * FROM ${source} LIMIT 10;`
    const data = await doQuery(query)

    return data
  } catch (e) {
    console.log({ e })
  }
}
