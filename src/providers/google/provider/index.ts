import * as fs from 'fs'
import { Construct } from 'constructs'
import { GoogleProvider, ProjectService } from '@cdktf/provider-google'
import { GcsBackend } from 'cdktf'

const enableGoogleResources = (context: Construct) => {
  //INFO Loading the provider's credentials from a JSON file
  const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH || 'google.json'
  console.log(`credentialsPath: ${credentialsPath}`)

  const credentials = fs.existsSync(credentialsPath)
    ? fs.readFileSync(credentialsPath).toString()
    : '{}'

  const projectId = context.node.tryGetContext('PROJECT_ID')
  const region = context.node.tryGetContext('REGION')
  const tfStateBucket = context.node.tryGetContext('BUCKET_TF_STATE')

  //INFO set credential in the context to be used in TF's root module to
  context.node.setContext('credentials', credentials)
  console.log(`credentials: ${credentials}`)


  //INFO provide the remote state of the stack to the GCS's BUCKET_TF_STATE
  new GcsBackend(context, {
    credentials,
    bucket: tfStateBucket || 'state',
    prefix: 'terraform.state'
  })

  //INFO Create the cloud provider
  new GoogleProvider(context, 'GoogleAuth', {
    region,
    zone: region + '-c',
    project: projectId,
    credentials
  })

  //INFO Enable the cloud resources manager api
  new ProjectService(context, 'ProjectServiceCloudResourceManager', {
    service: 'cloudresourcemanager.googleapis.com'
  })

  //INFO Enable the IAM manager api
  new ProjectService(context, 'ProjectServiceIAM', {
    service: 'iam.googleapis.com'
  })
}

export default { enableGoogleResources }
