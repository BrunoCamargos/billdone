import express from 'express';
import { ObjectId } from 'mongodb';
import { getCollection } from '../commons/db';
import validateTransaction from './transactions-schema';

const router = express.Router();
const collectionName = 'transactions';
const transactionNotFoundMessage = 'transaction not found';
const sendResponse = (statusCode, res, transactions) => {
  res.format({
    json: () => res.status(statusCode).json(transactions),
    // text: () => res.status(statusCode).send(JSON.stringify(transactions)),
    // 406 é tratado no express unhandled exception
    /* default: () => res.status(406).json({
       message: `mime type is not acceptable`,
     }),*/
  });
};

const errorResponseFactory = errorMessage => ({ message: errorMessage });

router.get('/', (req, res, next) => {
  getCollection(collectionName).find().toArray()
    .then(transactions => sendResponse(200, res, transactions))
    .catch(next);
});

router.get('/:transactionId', (req, res, next) => {
  getCollection(collectionName).findOne()
    .then((transaction) => {
      if (transaction) {
        sendResponse(200, res, transaction);
      } else {
        res.status(404).json(errorResponseFactory(transactionNotFoundMessage));
      }
    })
    .catch(next);
});

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
        res.status(404).json(errorResponseFactory(transactionNotFoundMessage));
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
