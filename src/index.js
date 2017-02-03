import express from 'express';
import handleRoutes from './handle-routes';

const app = express();

handleRoutes(app);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

export default app;
