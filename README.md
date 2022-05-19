# aws-cognito-auth-trial

## Preview
<p align="center">
  <img src="https://user-images.githubusercontent.com/5608492/165056966-4cea4f7d-82c8-40df-8e0c-c1b91e90a373.png" width="500">
</p>

## env

```bash
❱❱❱ node -v
v16.15.0

❱❱❱ npm -v
8.5.5
```

```bash
❱❱❱ cat .envrc
export NEXT_PUBLIC_AUTH_REGION=<YOUR_COGNITO_REGION>
export NEXT_PUBLIC_AUTH_USER_POOL_ID=<YOUR_COGNITO_USER_POOL_ID>
export NEXT_PUBLIC_AUTH_USER_POOL_WEB_CLIENT_ID=<YOUR_COGNITO_WEB_CLIENT_ID>
export NEXT_PUBLIC_AUTH_COOKIE_STORAGE_DOMAIN=localhost
```

## run on local machine

```bash
❱❱❱ npm run dev
```

## references
- https://tailwindcss.com/docs/installation
- https://mui.com/material-ui/getting-started/installation/
- https://mseeeen.msen.jp/react-auth-with-ready-made-cognito/
- https://github.com/kenzauros/react-auth-with-cognito
- https://docs.amplify.aws/lib/auth/start/q/platform/js/#re-use-existing-authentication-resource
