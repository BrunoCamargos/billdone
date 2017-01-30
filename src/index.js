const express = require('express');
const router = require('./router');

const app = express();

router.handle(app);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
