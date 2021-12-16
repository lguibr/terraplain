export const shema = [
  {
    name: 'newfield_at_start',
    type: 'string',
    mode: 'NULLABLE',
    description: 'State where the head office is located'
  },
  {
    name: 'permalink',
    type: 'STRING',
    mode: 'NULLABLE',
    description: 'The Permalink'
  },
  {
    name: 'newnew',
    type: 'INTEGER',
    mode: 'NULLABLE',
    description: 'State where the head office is located'
  },
  {
    name: 'newfield',
    type: 'STRING',
    mode: 'NULLABLE',
    description: 'State where the head office is located'
  },
  {
    name: 'newfield_at_boladon',
    type: 'STRING',
    mode: 'NULLABLE',
    description: 'State where the head office is located'
  }
]


export default {

  functions: [
    {
      name: 'insert-bq-example',
      path: './example/functions/insert.js',
      entryPoint: 'insert.handler',
      allowPublic: true
    },
    {

      name: 'get-bq-example',
      entryPoint: 'get.handler',
      path: './example/functions/get.js',
      // cron: {
      //   cronExpression: '*/2 * * * *'
      // }}
    },
  ],

  bigQuery: [
    {
      datasetId: 'my_bigquery_dataset_test',
      friendlyName: 'my-bigquery-dataset-test',
      tablesConfig: [
        {
          tableId: 'my_bigquery_table_test',
          schema: JSON.stringify(shema)
        }
      ]
    }
  ],
  bucket: [
    { name: 'my-storage-test-super-use-case' }
  ]
}