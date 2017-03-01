import startApp from './src';

// TODO: unit tests
process.on('uncaughtException', (err) => {
  console.error('Unhandled exception: ', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection: ', err);
  process.exit(1);
});

startApp();
