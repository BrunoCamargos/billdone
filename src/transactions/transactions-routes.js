import express from 'express';
import { ObjectId } from 'mongodb';
import { getCollection } from '../commons/db';
import validateTransaction from './transactions-schema';

const router = express.Router();
const collectionName = 'transactions';

router.get('/', (req, res, next) => getCollection(collectionName).find().toArray()
  .then(transactions => res.json(transactions))
  .catch(next));

const validatePayload = (payload, res) => new Promise((resolve) => {
  validateTransaction(payload)
    .then(resolve)
    .catch(validationError => res.status(400).send(validationError.message));
});

router.post('/', (req, res, next) => {
  validatePayload(req.body, res)
    .then(transaction => getCollection(collectionName).insertOne(transaction))
    .then((insertResult) => {
      const transaction = insertResult.ops[0];
      res.location(`/transactions/${transaction._id}`);
      res.status(201).json(transaction);
    })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  getCollection(collectionName).deleteOne({ _id: new ObjectId(req.params.id) })
    .then((result) => {
      if (!result.deletedCount) {
        res.status(404).send('transaction not found');
      } else {
        res.status(204).json();
      }
    })
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  validatePayload(req.body, res)
    .then(transaction => getCollection(collectionName)
      .update({ _id: new ObjectId(req.params.id) }, { $set: transaction }))
    .then(() => res.status(204).json())
    .catch(next);
});

export default router;
