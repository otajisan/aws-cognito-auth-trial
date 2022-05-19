# Deployment configuration

## How to deploy?

```bash
npx cdk diff --profile morning-code-dev
npx cdk deploy --profile morning-code-dev VpcStack
npx cdk deploy --profile morning-code-dev EcrStack
npx cdk deploy --profile morning-code-dev AwsCognitoAuthTrialStack
```
