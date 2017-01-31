import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World by Transactions!');
});

export default router;
