import {NextApiHandler} from "next";
import {withSSRContext} from "aws-amplify";
import {SsrAuthorizer} from "../../../lib/ssr-authorizer";

const GreetingMessageHandler: NextApiHandler = async (req, res) => {
  const auth: any = await SsrAuthorizer(req, res);

  // const {Auth} = withSSRContext({req: req});
  // const auth = await Auth.currentAuthenticatedUser({bypassCache: false})
  //   .then((result: any) => result)
  //   .catch((e: any) => {
  //     console.error('401 - Unauthorized');
  //     console.warn(e);
  //     res.status(401)
  //       .json({
  //         status: 401,
  //         message: 'Unauthorized',
  //       });
  //     throw new Error('401 - Unauthorized');
  //   });

  const session = auth.signInUserSession;
  const {payload} = session.getIdToken();
  const cognitoGroupNames = payload['cognito:groups'];

  console.log('========== Auth ==========');
  console.log(auth);
  console.log(cognitoGroupNames);
  console.log('username: ' + auth.username);
  console.log('==========================');

  const {message} = req.query;

  const responseBody = {
    'message': message + ' ' + auth.username,
  }

  res.status(200).json(responseBody)
};

export default GreetingMessageHandler;