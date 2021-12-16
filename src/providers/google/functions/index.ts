import * as path from 'path'

import { Construct } from 'constructs'
import { TerraformOutput, AssetType, TerraformAsset } from 'cdktf'
import {
  CloudfunctionsFunctionIamMember,
  CloudfunctionsFunction,
  ProjectService,
  CloudfunctionsFunctionConfig,
  CloudSchedulerJobHttpTarget,
  ServiceAccount
} from '@cdktf/provider-google'

import gStorage from '../storage'
import gScheduler, { CronExpression } from '../scheduler'



export interface SimplerCloudSchedulerHttpTarget
  extends Partial<CloudSchedulerJobHttpTarget> {
  uri?: string
}


export interface SimplerCloudFunctionConfig
  extends Partial<CloudfunctionsFunctionConfig> {
  name: string
  runtime?: string
  entryPoint: string
  allowPublic?: boolean
  cron: {
    cronExpression?: CronExpression
    httpTarget?: SimplerCloudSchedulerHttpTarget
  }
}

export interface SimplerCloudfunctionsFunctionIamMemberConfig
  extends Partial<CloudfunctionsFunctionConfig> {
  readonly member?: string
  readonly role?: string
}

export type GFunction = {
  context: Construct
  functionConfig: SimplerCloudFunctionConfig
  iamFunctionConfig?: SimplerCloudfunctionsFunctionIamMemberConfig
}

//INFO Enable the cloud resources manager api
const enableGFunction = (context: Construct): void => {
  //INFO Enable the cloud build resource to build the gFunction
  new ProjectService(context, 'ProjectServiceCloudBuild', {
    service: 'cloudbuild.googleapis.com'
  })

  //INFO Enable the functions API
  new ProjectService(context, 'ProjectServiceCloudFunction', {
    service: 'cloudfunctions.googleapis.com'
  })
}

const provideGFunction = async (gFunction: GFunction): Promise<CloudfunctionsFunction> => {
  const { context, functionConfig, iamFunctionConfig } = gFunction

  const { provideGStorage, provideGStorageObject } = gStorage

  const {
    name,
    entryPoint,
    runtime,
    buildEnvironmentVariables,
    availableMemoryMb,
    description,
    eventTrigger,
    environmentVariables,
    labels,
    httpsTriggerUrl,
    maxInstances,
    region,
    project,
    sourceArchiveBucket,
    sourceArchiveObject,
    sourceRepository,
    timeout,
    timeouts,
    triggerHttp,
    allowPublic,
    cron,
  } = functionConfig

  const projectId = context.node.tryGetContext('PROJECT_ID')

  console.log(`functionConfig ${functionConfig}`)


  //INFO GCP's Buckets can't have more that 64 characters
  const sourceFunctionBucketName = `fn-bucket-${name}`

  //INFO Create bucket to hold source code
  const SourceCodeBucket = provideGStorage(context, {
    name: sourceFunctionBucketName
  })




  //INFO Obtain the function source code as ${project_name}.zip
  const defaultSourceCodeFileName = process.env.npm_package_name + '.zip'

  const defaultSourceCodePath = path.join(
    process.cwd(),
    './' + defaultSourceCodeFileName
  )

  const assetSourceCodeFunction = new TerraformAsset(
    context,
    `function-source-code-asset-${name}`,
    {
      type: AssetType.FILE,
      path: defaultSourceCodePath
    }
  )

  console.log(
    `assetSourceCodeFunction.assetHash: ${assetSourceCodeFunction.assetHash}`
  )

  //INFO Upload the zip function's source code to the target bucket as ${milliseconds_timestamp}${package_name}.zip
  const SourceCodeBucketObject = provideGStorageObject(context, {
    bucket: SourceCodeBucket?.name,
    source: assetSourceCodeFunction.path,
    name: `${assetSourceCodeFunction.assetHash}-${name}`
  })

  //INFO Create the cloud function
  const GoogleCloudFunction = new CloudfunctionsFunction(
    context,
    `provide-function-${name}`,
    {
      //INFO default parameters
      region: region || process.env.REGION,
      runtime: runtime || 'nodejs16',
      triggerHttp: triggerHttp || true,
      sourceArchiveBucket: sourceArchiveBucket || SourceCodeBucket?.name,
      sourceArchiveObject: sourceArchiveObject || SourceCodeBucketObject?.name,

      //INFO Optional parameters
      name: `${projectId}-${name}`,
      buildEnvironmentVariables,
      availableMemoryMb,
      description,
      eventTrigger,
      environmentVariables,
      labels,
      httpsTriggerUrl,
      project,
      sourceRepository,
      timeout,
      timeouts,
      maxInstances,
      entryPoint
    }
  )

  if (allowPublic) {
    //INFO Create the cloud function IAM member allowing public access.
    new CloudfunctionsFunctionIamMember(
      context,
      `function-iam-member-${name}`,
      {
        cloudFunction: GoogleCloudFunction?.name,

        //INFO Allow all users including not authenticated users...
        member: 'allUsers',

        //INFO To have a role as function invover in this function
        role: 'roles/cloudfunctions.invoker'
      }
    )
  }

  //INFO allow add custom IAM members to the cloud function
  const member = iamFunctionConfig?.member
  const role = iamFunctionConfig?.role
  if (member && role) {
    new CloudfunctionsFunctionIamMember(
      context,
      `function-iam-member-${name}`,
      {
        cloudFunction: GoogleCloudFunction?.name,
        member,
        role
      }
    )
  }

  if (cron) {
    const { httpTarget, cronExpression } = cron
    const { provideScheduler, } = gScheduler

    const accountId = `sa-fn-${name}-invoker`.slice(0, 30)

    const serviceAccountFunctionInvoker = new ServiceAccount(
      context,
      `service-account-fn-${name}-invoker`,
      {
        accountId
      }
    )

    console.log(`serviceAccountFunctionInvoker : ${serviceAccountFunctionInvoker}`)

    const { email } = serviceAccountFunctionInvoker

    const scheduled = provideScheduler(context, {
      name: `${name}-scheduler`,
      description: `function ${name} scheduler`,
      schedule: cronExpression,
      httpTarget: {
        uri: GoogleCloudFunction?.httpsTriggerUrl || '',
        httpMethod: 'GET',
        oidcToken: {
          serviceAccountEmail: email
        },
        ...httpTarget
      }
    })


    new TerraformOutput(context, `scheduler-function-url-trigger-${name}`, {
      value: scheduled?.toString()
    })

    new CloudfunctionsFunctionIamMember(
      context,
      `scheduler-function-iam-member-${name}`,
      {
        cloudFunction: GoogleCloudFunction?.name,
        member: `serviceAccount:${email}`,
        role: 'roles/cloudfunctions.invoker'
      }
    )


  }



  new TerraformOutput(context, `function-url-trigger-${name}`, {
    value: GoogleCloudFunction?.httpsTriggerUrl
  })

  return GoogleCloudFunction
}

export default { enableGFunction, provideGFunction }
