import express from 'express';
import bodyParser from 'body-parser';
import handleRoutes from './handle-routes';
import config from './commons/config';
import connectDb from './commons/db';

const app = express();
app.use(bodyParser.json()); // parsing application/json

handleRoutes(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something failed!' });
  next();
});

// app.start = () => {
//   return connectDb()
//     .then(() => {
//       app.listen(config.app.port, config.app.host, () => {
//         console.log(`Example app listening on http://${config.app.host}:${config.app.port}!`);
//       });
//     })
//     .catch(() => process.exit());
// }

connectDb()
  .then(() => {
    app.listen(config.app.port, config.app.host, () => {
      console.log(`Example app listening on http://${config.app.host}:${config.app.port}!`);
      app.emit('started');
    });
  })
  .catch(() => process.exit());

export default app;
