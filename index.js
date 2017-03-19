import startApp from './src/app';
import logger from './src/commons/logger';

// TODO: unit tests
process.on('uncaughtException', (err) => {
  logger.fatal(err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.fatal(err);
  process.exit(1);
});

startApp();
