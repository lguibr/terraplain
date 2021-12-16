import {
  CloudSchedulerJob,
  CloudSchedulerJobConfig,
  ProjectService,
  AppEngineApplication
} from '@cdktf/provider-google'

import { Construct } from 'constructs'


type CronAllString = '*'
type CronAtom = CronAllString | number
type CronPartial = CronAtom | `${number},${number}` | `${number}-${number}` | `${number}/${number}`
export type CronExpression = `${CronPartial} ${CronPartial} ${CronPartial} ${CronPartial} ${CronPartial}`



const provideScheduler = (
  context: Construct,
  schedulerConfig: CloudSchedulerJobConfig
) => {
  const { name, ...restConfig } = schedulerConfig

  const scheduledJob = new CloudSchedulerJob(
    context,
    `scheduled-job-${name}`,
    {
      name,

      ...restConfig,
    }
  )

  return scheduledJob
}
const enableScheduler = (
  context: Construct,
) => {
  //INFO Enable the APP Engine API
  new ProjectService(context, 'ProjectServiceScheduler', {
    service: 'cloudscheduler.googleapis.com'
  })
  new AppEngineApplication(context, 'AppEngineApplicationScheduler', {
    locationId: 'us-central1',
  })
}

export default { provideScheduler, enableScheduler }
