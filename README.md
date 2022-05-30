# aws-cognito-auth-trial

## Preview
<p align="center">
  <img src="https://user-images.githubusercontent.com/5608492/165056966-4cea4f7d-82c8-40df-8e0c-c1b91e90a373.png" width="500">
</p>

## env

```bash
❱❱❱ volta install node@16.15.0
❱❱❱ node -v
v16.15.0

❱❱❱ volta install npm@8.5.5
❱❱❱ npm -v
8.5.5
```

```bash
❱❱❱ cat .envrc
# for build Docker image
export AWS_ACCOUNT_ID=<YOUR_AWS_ACCOUNT_ID>

# application environment variables
export NEXT_PUBLIC_AUTH_REGION=<YOUR_COGNITO_REGION>
export NEXT_PUBLIC_AUTH_USER_POOL_ID=<YOUR_COGNITO_USER_POOL_ID>
export NEXT_PUBLIC_AUTH_USER_POOL_WEB_CLIENT_ID=<YOUR_COGNITO_WEB_CLIENT_ID>
export NEXT_PUBLIC_AUTH_COOKIE_STORAGE_DOMAIN=localhost
```

## run on local machine

```bash
❱❱❱ npm run dev
```

## build image

```bash
./publish_ecr.sh
```

## Production configuration

- write following configurations in `.env.production.local`

```bash
NEXT_PUBLIC_AUTH_REGION=<YOUR_COGNITO_REGION>
NEXT_PUBLIC_AUTH_USER_POOL_ID=<YOUR_COGNITO_USER_POOL_ID>
NEXT_PUBLIC_AUTH_USER_POOL_WEB_CLIENT_ID=<YOUR_COGNITO_WEB_CLIENT_ID>
NEXT_PUBLIC_AUTH_COOKIE_STORAGE_DOMAIN=auth-trial.morningcode.io
```

## deploy to AWS

- see [awsCognitoAuthTrialDeploy](https://github.com/otajisan/aws-cognito-auth-trial/tree/main/awsCognitoAuthTrialDeploy) directory.

## references
- https://tailwindcss.com/docs/installation
- https://mui.com/material-ui/getting-started/installation/
- https://mseeeen.msen.jp/react-auth-with-ready-made-cognito/
- https://github.com/kenzauros/react-auth-with-cognito
- https://docs.amplify.aws/lib/auth/start/q/platform/js/#re-use-existing-authentication-resource
