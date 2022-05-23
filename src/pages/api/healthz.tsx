import {NextApiHandler} from "next";

const HealthCheckHandler: NextApiHandler = async (req, res) => {
    res.status(200).json({ status: 'UP' })
};

export default HealthCheckHandler;
