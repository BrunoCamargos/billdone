import express from 'express';
import { getCollection } from '../commons/db';
import validateTransaction from './transaction-schema';

const router = express.Router();
const collectionName = 'transactions';

router.get('/', (req, res) => {
  getCollection(collectionName).find({}).toArray()
    .then(transactions => res.json(transactions));
});

router.post('/', (req, res) => {
  const transactionPayload = req.body;
  const validationResult = validateTransaction(transactionPayload);

  if (!validationResult.error) {
    getCollection(collectionName).insertOne(transactionPayload)
      .then((insertResult) => {
        const transaction = insertResult.ops[0];
        res.location(`/transactions/${transaction._id}`);
        res.status(201).json(transaction);
      });
  } else {
    res.status(400).send(validationResult.error.message);
  }
});

export default router;
