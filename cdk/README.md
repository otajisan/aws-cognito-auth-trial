# Deployment configuration

## environment setting

- write environment variables in your `.envrc` etc.

```bash
export CDK_DEPLOY_ACCOUNT=<YOUR_AWS_ACCOUNT_ID>
export CDK_DEPLOY_REGION=ap-northeast-1
export GIT_SHA1=local
```

## How to deploy?

```bash
npx awsCognitoAuthTrialDeploy diff --profile=morning-code-dev AwsCognitoAuthTrialVpcStack
npx awsCognitoAuthTrialDeploy diff --profile=morning-code-dev AwsCognitoAuthTrialEcrStack
npx awsCognitoAuthTrialDeploy diff --profile morning-code-dev AwsCognitoAuthTrialAppStack

npx awsCognitoAuthTrialDeploy deploy --profile morning-code-dev AwsCognitoAuthTrialVpcStack
npx awsCognitoAuthTrialDeploy deploy --profile morning-code-dev AwsCognitoAuthTrialEcrStack
npx awsCognitoAuthTrialDeploy deploy --profile morning-code-dev AwsCognitoAuthTrialAppStack
```
