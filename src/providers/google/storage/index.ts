import {
  StorageBucket,
  StorageBucketConfig,
  StorageBucketObject,
  StorageBucketObjectConfig
} from '@cdktf/provider-google'

import { Construct } from 'constructs'

import { TerraformOutput } from 'cdktf'

const provideGStorage = (
  context: Construct,
  bucketConfig: StorageBucketConfig
) => {
  const { name, ...restConfig } = bucketConfig

  //INFO GCP's Buckets can't have more that 64 characters
  const bucketName = `${context.node.tryGetContext(
    'PROJECT_ID'
  )}-${name}`.slice(0, 63)

  //INFO Create bucket
  const SourceCodeBucket = new StorageBucket(
    context,
    `provide-bucket-${name}`,
    {
      name: bucketName,
      ...restConfig
    }
  )

  new TerraformOutput(context, `storage-bucket-url-${name}`, {
    value: SourceCodeBucket?.url
  })

  return SourceCodeBucket
}

const provideGStorageObject = (
  context: Construct,
  bucketObjectConfig: StorageBucketObjectConfig
) => {
  const { name, bucket, source, ...restConfig } = bucketObjectConfig

  //INFO Create bucket object/upload file to bucket
  const SourceCodeBucketObject = new StorageBucketObject(
    context,
    `bucket-object-${name}`,
    {
      bucket,
      source,
      name,
      ...restConfig
    }
  )

  new TerraformOutput(context, `storage-bucket-object-url-${name}`, {
    value: SourceCodeBucketObject?.outputName
  })
  return SourceCodeBucketObject
}

export default { provideGStorage, provideGStorageObject }
