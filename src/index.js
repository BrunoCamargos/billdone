import express from 'express';
import handleRoutes from './handle-routes';
import config from './commons/config';
import connectDb from './commons/db';

const app = express();

handleRoutes(app);

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
