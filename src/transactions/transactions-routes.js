import express from 'express';
import { getCollection } from '../commons/db';

const router = express.Router();

router.get('/', (req, res) => {
  getCollection('transactions').find().toArray()
    .then((docs) => {
      res.json(docs);
    });
});

export default router;
