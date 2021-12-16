This project aim to be a bootstrap to API with automated provisioning of cloud resources in Google Cloud Platform using Terraform CDK in Typescript.

## Getting Started

### Pre-requisite

In order to start will be necessary a GCP's account with billing active, a project, a storage bucket with versioning to store the terraform state and a service account with capabilities of:

- Editor
- Cloud Functions Admin
- Storage Admin
- Cloud Build Service Account
- BigQuery Admin

### Expose environment variables

Following the .env.example file exposes:

- GOOGLE_CREDENTIALS_PATH
- PROJECT_ID
- BUCKET_TF_STATE
- REGION

### Install dependencies

```
  yarn
```

### Start development server using GoogleFrameworkFunctions

```
  yarn dev
```

### Start slim development server

```
  yarn dev:slim
```

### Provide a cloud resource's diff

```
  yarn diff
```

### Provide cloud resources and deploy project

```
  yarn deploy
```
