import express from 'express';
import { ObjectId } from 'mongodb';
import { getCollection } from '../commons/db';
import validateTransaction from './transactions-schema';

const router = express.Router();
const collectionName = 'transactions';

const errorResponseFactory = errorMessage => ({ message: errorMessage });

router.get('/', (req, res, next) => getCollection(collectionName).find().toArray()
  .then(transactions => res.json(transactions))
  .catch(next));

const validatePayload = (payload, res) => new Promise((resolve) => {
  validateTransaction(payload)
    .then(resolve)
    .catch(validationError => res.status(400)
      .json(errorResponseFactory(validationError.message)));
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
        res.status(404).json(errorResponseFactory('transaction not found'));
      } else {
        res.status(204).json();
      }
    })
    .catch(next);
});

const createObjectId = hexStringId => new Promise((resolve, reject) => {
  try {
    resolve(ObjectId.createFromHexString(hexStringId));
  } catch (e) {
    reject(new Error('transaction id must be a string of 24 hex characters'));
  }
});

router.put('/:id', (req, res, next) => {
  Promise.all([createObjectId(req.params.id), validateTransaction(req.body)])
    .then(([transactionId, transaction]) => {
      const queryById = { _id: transactionId };

      getCollection(collectionName)
        .findOneAndUpdate(queryById, { $set: transaction }, {
          returnOriginal: false,
          upsert: true,
        })
        .then(updatedResult => res.status(200).json(updatedResult.value))
        .catch(next);
    })
    .catch(validationError => res.status(400)
      .json(errorResponseFactory(validationError.message)));
});

export default router;
