import express from 'express';
import { getCollection } from '../commons/db';

const router = express.Router();
const collectionName = 'transactions';

router.get('/', (req, res) => {
  getCollection(collectionName).find().toArray()
    .then(transactions => res.json(transactions));
});

router.post('/', (req, res) => {
  getCollection(collectionName).insertOne(req.body)
    .then((result) => {
      const transaction = result.ops[0];
      res.location(`/transactions/${transaction._id}`);
      res.status(201).json(transaction);
    });
});

export default router;
