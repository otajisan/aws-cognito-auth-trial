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
npx cdk diff --profile=morning-code-dev AwsCognitoAuthTrialVpcStack
npx cdk diff --profile=morning-code-dev AwsCognitoAuthTrialEcrStack
npx cdk diff --profile morning-code-dev AwsCognitoAuthTrialAppStack

npx cdk deploy --profile morning-code-dev AwsCognitoAuthTrialVpcStack
npx cdk deploy --profile morning-code-dev AwsCognitoAuthTrialEcrStack
npx cdk deploy --profile morning-code-dev AwsCognitoAuthTrialAppStack
```
