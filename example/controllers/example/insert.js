import BigQuery from '#example/services/bigquery/index.js'
import dataSource from '#example/dataSources/exampleBigQuery.js'

export default async () => {
  try {
    const { doQuery } = BigQuery
    const source = `${dataSource?.datasetId}.${dataSource?.tablesConfig[0].tableId}`
    const query = `insert into ${source}
      (   newfield_at_start     , permalink              , newnew                , newfield ,newfield_at_boladon )
      VALUES
      (  'test${Math.random()}' , 'test${Math.random()}' , '${parseInt(
      Math.random() * 10
    )}' , 'test${Math.random()}', 'test${Math.random()}' );
      `
    const data = await doQuery(query)
    return data
  } catch (e) {
    console.log({ e })
  }
}
