import express from 'express';
import handleRoutes from './handle-routes';
import config from './commons/config';
import connectDb from './commons/db';

const app = express();

handleRoutes(app);

// app.start = () => {
//   return connectDb()
//     .then(() => {
//       app.listen(3000, () => {
//         console.log('Example app listening on port 3000!');
//       });
//     })
//     .catch(() => process.exit());
// }

connectDb()
  .then(() => {
    app.listen(3001, () => {
      console.log('Example app listening on port 3001!');
      app.emit('started');
    });
  })
  .catch(() => process.exit());

export default app;
