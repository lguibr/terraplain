import { BigQuery } from '@google-cloud/bigquery'

export default {
  doQuery: async query => {
    const bigquery = new BigQuery()
    try {
      const [response] = await bigquery.query({
        query,
        useLegacySql: false
      })

      return response
    } catch (err) {
      throw new Error(
        err
        // 'It was not possible to perform the query request'
      )
    }
  }
}
