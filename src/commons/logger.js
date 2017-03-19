import bunyan from 'bunyan';
import config from './config';

const configOptions = {
  name: 'billdone',
  level: config.logger.level,
};

// streams: [{
//     stream: process.stdout
//   }, {
//     type: 'rotating-file',
//     path: `${config.logger.filePath}`,
//     period: '1d',
//     count: config.logger.backCopies
//   }]

const logger = bunyan.createLogger(configOptions);

export default logger;
