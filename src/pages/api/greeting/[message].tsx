import {NextApiHandler} from "next";

const GreetingMessageHandler: NextApiHandler = async (req, res) => {
  const {message} = req.query;

  const responseBody = {
    'message': message,
  }

  res.status(200).json(responseBody)
};

export default GreetingMessageHandler;