/**
 * @see https://docs.amplify.aws/lib/auth/start/q/platform/js/#re-use-existing-authentication-resource
 */
const AwsConfigAuth = {
  region: process.env.NEXT_PUBLIC_AUTH_REGION,
  userPoolId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_ID,
  userPoolWebClientId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_WEB_CLIENT_ID,
  // NOTE: failed in production env...
  // cookieStorage: {
  //     domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_STORAGE_DOMAIN || 'localhost',
  //     path: '/',
  //     expires: 1,
  //     sameSite: "strict",
  //     secure: true
  // },
  authenticationFlowType: 'USER_SRP_AUTH',
}

export default AwsConfigAuth;
