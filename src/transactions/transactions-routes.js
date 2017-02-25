import express from 'express';
import { ObjectId } from 'mongodb';
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

router.delete('/:id', (req, res) => {
  getCollection(collectionName).deleteOne({ _id: new ObjectId(req.params.id) })
    .then((result) => {
      if (!result.deletedCount) {
        res.status(404).send('transaction not found');
      } else {
        res.status(204).send();
      }
    });
});

export default router;
