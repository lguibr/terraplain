import { Construct } from 'constructs'
import { TerraformOutput } from 'cdktf'
import {
  BigqueryDataset,
  BigqueryDatasetConfig,
  BigqueryTable,
  BigqueryTableConfig,
  // BigqueryJob,
} from '@cdktf/provider-google'


const provideGBigQueryDataSet = (
  context: Construct,
  datasetConfig: BigqueryDatasetConfig,
  tablesConfig?: BigqueryTableConfig[]
) => {
  const {
    datasetId,
    friendlyName: friendlyNameDataSet,
    ...configs
  } = datasetConfig

  //INFO Create the dataset on BigQuery
  const dataset = new BigqueryDataset(
    context,
    `dataset-${friendlyNameDataSet || datasetId}`,
    {
      friendlyName: friendlyNameDataSet,
      datasetId,
      ...configs
    }
  )

  //INFO Create each tables contained in the dataset
  tablesConfig?.map(tableConfig => {
    const { friendlyName: friendlyNameTable, tableId, ...configs } = tableConfig


    // const projectId = context.node.tryGetContext(
    //   'PROJECT_ID'
    // )

    // const newJobReplicateTable = new BigqueryJob(context, `job-${friendlyNameTable || tableId}`, {
    //   jobId: `job-${friendlyNameTable || tableId}-migration-replicate-2`,
    //   project: projectId,
      
    //   query: {

    //     writeDisposition: 'WRITE_TRUNCATE',
    //     createDisposition:'CREATE_IF_NEEDED',
    //     allowLargeResults: true,
    //     schemaUpdateOptions: ['ALLOW_FIELD_ADDITION', 'ALLOW_FIELD_RELAXATION'],
    //     query: 'CREATE OR REPLACE TABLE `my_bigquery_dataset_test.my_bigquery_table_test` AS SELECT * EXCEPT (newstate), CAST(newstate AS FLOAT) AS state FROM `my_bigquery_dataset_test.my_bigquery_table_test`;',
    //     destinationTable: {
    //       tableId,
    //       datasetId,
    //       projectId
    //     }

    //   }

    // })

    // const { query } = newJobReplicateTable
    // console.log({ newJobReplicateTable })
    // console.log({ query })


    const table = new BigqueryTable(
      context,
      `${datasetId} - table - ${friendlyNameTable || tableId}`,
      {
        tableId,
        ...configs,
        datasetId,
        friendlyName: friendlyNameTable
      }
    )

    new TerraformOutput(
      context,
      `big - query - dataset - ${datasetId} - table - ${friendlyNameTable || tableId}`,
      { value: friendlyNameTable || tableId }
    )

    return table
  })

  new TerraformOutput(
    context,
    `big - query - dataset - name - ${friendlyNameDataSet || datasetId} `,
    { value: dataset?.friendlyUniqueId }
  )

  return dataset
}

export default { provideGBigQueryDataSet }
