import '#example/preload.js'

import { Construct } from 'constructs'
import { App, TerraformStack } from 'cdktf'


import getPath from './src/lib/getPath'
import storageModule from './src/providers/google/storage'
import bigQueryModule from './src/providers/google/bigQuery'

import providerModule from './src/providers/google/provider'
import
functionsModule,
{
  SimplerCloudFunctionConfig
}
  from './src/providers/google/functions'




type FunctionPropsEntry = [
  string,
  SimplerCloudFunctionConfig & { handler: (value: any) => any }
]

const ENV = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
const REGION = process.env.REGION
const PROJECT_ID = process.env.PROJECT_ID
const BUCKET_TF_STATE = process.env.BUCKET_TF_STATE

type Options = {
  resources: string,
  output?: string
}

const projectStack = async (options: Options) => {

  const { resources } = options
  const configFile = resources || './resources.js'
  const resourcesFile = getPath(configFile)
  const { default: config } = await import(resourcesFile);
  const { bigQuery, storage, functions: cloudFunctions } = config



  class MyStack extends TerraformStack {
    constructor(scope: Construct, name: string) {
      super(scope, name)

      //INFO Load env on the stack context to be available across all modules
      this.node.setContext('ENV', ENV)
      this.node.setContext('PROJECT_ID', PROJECT_ID)
      this.node.setContext('REGION', REGION)
      this.node.setContext('BUCKET_TF_STATE', BUCKET_TF_STATE)

      //INFO Declare TF-GCP Modules's used methods
      const { enableGoogleResources } = providerModule
      const { enableGFunction, provideGFunction } = functionsModule
      const { provideGBigQueryDataSet } = bigQueryModule
      const { provideGStorage } = storageModule

      //INFO Enable GCP Resources/Provider
      enableGoogleResources(this)

      //INFO Enable GCP Resources needed to GCP Functions
      enableGFunction(this)

      //INFO Provide GCP Function for each function on the example/functions
      const functionsEntries: FunctionPropsEntry[] = Object.entries(cloudFunctions)
      functionsEntries.map(([_key, { handler: _handler, path, ...functionProps }]) =>
        provideGFunction({
          context: this,
          functionConfig: {
            ...functionProps,
            path,
            name:
              functionProps?.name.toLocaleLowerCase() || _key.toLocaleLowerCase()
          }
        })
      )



      //INFO Load dataSources provided by the example/dataSources

      //INFO Provide GCP BigQuery for each dataset exposed on the example/dataSources
      if (bigQuery && bigQuery.length > 0) bigQuery.map(
        ({ datasetId, friendlyName, tablesConfig, ...bigQueryProps }) =>
          provideGBigQueryDataSet(
            this,
            { datasetId, friendlyName, ...bigQueryProps },
            tablesConfig
          )
      )

      //INFO Provide GCP Storage for each bucket exposed on the example/dataSources
      if (storage && storage.length > 0) storage.map(({ name, ...storageProps }) =>
        provideGStorage(this, { name, ...storageProps })
      )
    }
  }

  const app = new App()
  new MyStack(app, `${PROJECT_ID}-stack`)
  app.synth()



}

projectStack({ resources: './resources.js' })

