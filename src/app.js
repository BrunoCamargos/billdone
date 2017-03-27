/* eslint no-param-reassign: 'off' */

import fs from 'fs';
import https from 'https';
import express from 'express';
import bodyParser from 'body-parser';
import requestId from 'express-request-id';
import Promise from 'bluebird';
import handleRoutes from './handle-routes';
import config from './commons/config';
import logger from './commons/logger';
import * as db from './commons/db';
import bunyanMorgan from './commons/bunyan-morgan';

const expressFactory = () => {
  const app = express();

  app.use(requestId());
  app.use((req, res, next) => {
    const childLogger = logger.child({ reqId: req.id });
    req.logger = childLogger;
    res.logger = childLogger;
    next();
  });

  app.use(bunyanMorgan());

  app.use(bodyParser.json({ type: 'application/json' })); // Para futuro uso c HATEOAS - (vn.dfd/json)

  handleRoutes(app);

  app.use((err, req, res, next) => {
    if (err.statusCode && err.statusCode === 406) {
      const error = {
        message: `type ${req.headers.accept} is not acceptable, try changing to ${err.types.join(' or ')}`,
      };

      req.logger.warn({ err }, error.message);
      res.status(err.statusCode).json(error);
    } else {
      req.logger.error({ err }, 'Express unhandled exception');
      res.status(500).json({
        message: 'Oh no. Really!? Sorry for this my friend, something went very wrong :/',
      });
    }

    next(err);
  });

  return app;
};

const start = () => new Promise((resolve, reject) => {
  db.connect()
    .then(() => {
      const app = expressFactory();

      const certificate = {
        cert: fs.readFileSync('./server.crt'),
        key: fs.readFileSync('./server.key'),
      };

      https.createServer(certificate, app)
        .listen(8445, () => logger.info(`App securely running on https://${config.app.host}:8445`));

      const server = app.listen(config.app.port, config.app.host, () => {
        logger.info(`Server running on http://${config.app.host}:${config.app.port}`);
        resolve(server);
      });

      server.on('close', () => {
        db.disconnect();
        logger.info('Server closed!');
      });
    })
    .catch((err) => {
      logger.error({ err }, 'Unable to start the server: ');
      reject(err);
      process.exit(1);
    });
});

export default start;
