import bunyan from 'bunyan';
import config from './config';

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
};

const logger = bunyan.createLogger(configOptions);

export default logger;
