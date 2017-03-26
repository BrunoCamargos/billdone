import bunyan from 'bunyan';
import config from './config';

// Serialize an HTTP request.
const reqSerializer = (req) => {
  if (!req || !req.connection) {
    return req;
  }

  const reqSerialized = bunyan.stdSerializers.req(req);

  const complementKeys = {
    body: req.body || {},
    httpVersion: req.httpVersion,
  };

  return Object.assign({}, complementKeys, reqSerialized);
};

// Serialize an HTTP response.
const resSerializer = (res) => {
  if (!res || !res.statusCode) {
    return res;
  }

  const resSerialized = bunyan.stdSerializers.res(res);

  const complementKeys = {
    responseTime: res.responseTime && `${res.responseTime}ms`,
  };

  return Object.assign({}, complementKeys, resSerialized);
};

const streams = [{
  stream: process.stdout,
}, {
  type: 'rotating-file',
  path: './logs/billdone-errors.log',
  level: 'error',
}, {
  type: 'rotating-file',
  path: './logs/billdone.log',
}];

const configOptions = {
  name: 'billdone',
  level: config.logger.level,
  streams: config.logger.enabled ? streams : [],
  serializers: {
    err: bunyan.stdSerializers.err,
    req: reqSerializer,
    res: resSerializer,
  },
};

const logger = bunyan.createLogger(configOptions);

export default logger;

export { reqSerializer, resSerializer };
