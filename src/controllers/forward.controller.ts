import { RequestHandler } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import { getLogger } from '../libs/logger';
import { IRequest } from '../interfaces/interfaces';

const logger = getLogger('ForwardController');

const forwardController: RequestHandler = async (req, res) => {
  const data = req.body as IRequest;
  const config: AxiosRequestConfig = {
    url: data.requestUrl,
    headers: data.requestHeaders,
    method: data.requestMethod,
    data: data.requestBody,
  };

  logger.verbose(`Forwarding request to ${data.requestUrl}`, data);
  const response = await axios.request(config);
  logger.info(`Returning Forward Response`, response.data);

  return res.send(response.data);
};

export default forwardController;
