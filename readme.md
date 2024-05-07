# Terraplain: GCP Resource Automation using Terraform CDK in TypeScript

Terraplain aims to bootstrap APIs with automated provisioning of cloud resources on the Google Cloud Platform (GCP) using the Terraform Cloud Development Kit (CDK) in TypeScript.

## Getting Started

### Prerequisites

To use this project, you need:

- An active GCP account with billing enabled.
- A GCP project.
- A Storage Bucket with versioning enabled to store the Terraform state.
- A Service Account with the following roles:
  - Editor
  - Cloud Functions Admin
  - Storage Admin
  - Cloud Build Service Account
  - BigQuery Admin

### Environment Setup

Configure the necessary environment variables as specified in the `.env.example` file:

- `GOOGLE_CREDENTIALS_PATH`: Path to your Google Cloud service account key file.
- `PROJECT_ID`: Your GCP project ID.
- `BUCKET_TF_STATE`: The name of the bucket where Terraform states are stored.
- `REGION`: The region for deploying the resources.

### Install Dependencies

Install the required dependencies using yarn:

```bash
yarn
```

### Development Servers

Run a development server using Google Framework Functions:

```bash
yarn dev
```

Run a slim version of the development server:

```bash
yarn dev:slim
```

### Resource Management Commands

Generate a diff of the planned changes:

```bash
yarn diff
```

Deploy the project and provision the cloud resources:

```bash
yarn deploy
```

## Modules and Supported Resources

### Provider Module

- Initializes and configures the GCP provider.
- Manages authentication using service account credentials.
- Sets up the Terraform state storage in a specified GCS bucket.

### Google Functions Module

- Handles deployment of Cloud Functions.
- Supports HTTP triggers and scheduled execution via Cloud Scheduler.
- Manages IAM roles for secure access.

### Google BigQuery Module

- Provisions and manages BigQuery datasets and tables.
- Supports complex configurations like dataset permissions and table schema definitions.

### Google Storage Module

- Manages GCP storage resources including buckets and objects.
- Handles file uploads and permissions for Cloud Storage.

### Scheduler Module

- Schedules tasks using Cloud Scheduler.
- Integrates with Cloud Functions for triggered execution.

## Example Usage

The project stack is configured through a `projectStack` function which dynamically loads resource configurations from a specified path. This approach allows for flexible and scalable resource management based on external configuration files.

Here's a quick example to set up a new stack:

```javascript
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
      cron: {
        cronExpression: '*/2 * * * *'
      }
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

projectStack({ resources: './config/resources.js' });
```