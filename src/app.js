import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import Promise from 'bluebird';
import handleRoutes from './handle-routes';
import config from './commons/config';
import * as db from './commons/db';

const skipMongan = () => process.env.NODE_ENV === 'test';

const morganRequest = (app) => {
  morgan.token('req-body', req => JSON.stringify(req.body));
  app.use(morgan('[:date[clf]] Request  -> :method :url HTTP/:http-version :req-body', {
    immediate: true,
    skip: skipMongan,
  })); // Request
  return app;
};

const morganResponse = (app) => {
  app.use(morgan('[:date[clf]] Response -> :method :url :status :response-time[2]ms', {
    skip: skipMongan,
  })); // Response
  return app;
};

const setupMorgan = app => morganResponse(morganRequest(app));

const expressFactory = () => {
  const app = express();
  app.use(bodyParser.json({ type: 'application/json' })); // Para futuro uso c HATEOAS - (vn.dfd/json)
  setupMorgan(app);

  handleRoutes(app);

  app.use((err, req, res, next) => {
    if (err.statusCode && err.statusCode === 406) {
      res.status(err.statusCode).json({
        message: `type ${req.headers.accept} is not acceptable, try changing to ${err.types.join(' or ')}`,
      });
    } else {
      console.error('Express unhandled exception: ', err);
      res.status(500).json({
        message: 'Oh no. Really!? Sorry for this my friend, something went very wrong :/',
      });
    }

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
