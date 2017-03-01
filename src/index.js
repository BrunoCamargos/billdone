import express from 'express';
import bodyParser from 'body-parser';
import Promise from 'bluebird';
import handleRoutes from './handle-routes';
import config from './commons/config';
import * as db from './commons/db';

const expressFactory = () => {
  const app = express();
  app.use(bodyParser.json()); // parsing application/json

  handleRoutes(app);

  app.use((err, req, res, next) => {
    console.error('Express unhandled exception: ', err);
    res.status(500).json({ error: 'Something wrong!' });
    next();
  });

  return app;
};

const start = () => new Promise((resolve, reject) => {
  db.connect()
    .then(() => {
      const app = expressFactory();

      const server = app.listen(config.app.port, config.app.host, () => {
        console.log(`Server listening on http://${config.app.host}:${config.app.port}!`);
        resolve(server);
      });

      server.on('close', () => {
        db.disconnect();
        console.log('Server closed!');
      });
    })
    .catch((err) => {
      console.error('Unable to start the server: ', err);
      reject(err);
      process.exit(1);
    });
});

export default start;
