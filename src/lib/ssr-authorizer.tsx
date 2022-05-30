import {NextApiRequest, NextApiResponse} from 'next';
import {withSSRContext} from 'aws-amplify';

export const SsrAuthorizer = async (req: NextApiRequest, res: NextApiResponse) => {
  const {Auth} = withSSRContext({req: req});

  return await Auth.currentAuthenticatedUser({bypassCache: false})
    .then((result: any) => result)
    .catch((e: any) => {
      console.error('401 - Unauthorized');
      console.warn(e);
      res.status(401)
        .json({
          status: 401,
          message: 'Unauthorized',
        });
      throw new Error('401 - Unauthorized');
    });
};