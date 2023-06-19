import { RequestHandler } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import { getLogger } from '../libs/logger';

const logger = getLogger('ForwardController');

const forwardController: RequestHandler = async (req, res) => {
  const data: AxiosRequestConfig = {
    url: req.body.requestUrl,
    method: req.method,
    headers: req.headers,
    data: req.body,
  };

  // ? remove requestUrl from the body
  delete req.body.requestUrl;

  logger.verbose(`Forwarding request to ${data.url}`, data);
  const response = await axios.request(data);
  logger.info(`Response from ${data.url}`, response.data);

  return res.send(response.data);
};

export default forwardController;
