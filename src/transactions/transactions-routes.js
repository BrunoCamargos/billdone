import express from 'express';
import { ObjectId } from 'mongodb';
import { getCollection } from '../commons/db';
import logger from '../commons/logger';
import validateTransaction from './transactions-schema';
import paginate from '../commons/pagination';

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

const createObjectId = hexStringId => new Promise((resolve, reject) => {
  try {
    resolve(ObjectId.createFromHexString(hexStringId));
  } catch (e) {
    const msg = 'transaction id must be a string of 24 hex characters';
    logger.warn(`IdValidationError - ${msg}`);
    reject(new Error('transaction id must be a string of 24 hex characters'));
  }
});

const errorResponseFactory = errorMessage => ({ message: errorMessage });

const validatePayload = (payload, res) => new Promise((resolve) => {
  validateTransaction(payload)
    .then(resolve)
    .catch((validationError) => {
      logger.warn(`PayloadValidationError - ${validationError.message}`);
      res.status(400)
        .json(errorResponseFactory(validationError.message));
    });
});

router.get('/', (req, res, next) => {
  const { skip, limit } = paginate(req.query.page, req.query.limit);
  getCollection(collectionName)
    .find()
    .skip(skip)
    .limit(limit)
    .toArray()
    .then(transactions => sendResponse(200, res, transactions))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  createObjectId(req.params.id)
    .then((transactionId) => {
      const queryById = { _id: transactionId };

      getCollection(collectionName).findOne(queryById)
        .then((transaction) => {
          if (transaction) {
            sendResponse(200, res, transaction);
          } else {
            logger.warn(`${transactionNotFoundMessage} - id: ${req.params.id}`);
            res.status(404).json(errorResponseFactory(transactionNotFoundMessage));
          }
        })
        .catch(next);
    })
    .catch(validationError => res.status(400)
      .json(errorResponseFactory(validationError.message)));
});

router.post('/', (req, res, next) => {
  validatePayload(req.body, res)
    .then(transaction => getCollection(collectionName).insertOne(transaction))
    .then((insertResult) => {
      const transaction = insertResult.ops[0];

      logger.info(`transaction created - id: ${transaction._id}`);
      res.location(`/transactions/${transaction._id}`);
      res.status(201).json(transaction);
    })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  createObjectId(req.params.id)
    .then((transactionId) => {
      const queryById = { _id: transactionId };

      getCollection(collectionName).deleteOne(queryById)
        .then((result) => {
          if (!result.deletedCount) {
            logger.warn(`${transactionNotFoundMessage} - id: ${req.params.id}`);
            res.status(404).json(errorResponseFactory(transactionNotFoundMessage));
          } else {
            logger.info(`transaction deleted - id: ${req.params.id}`);
            res.status(204).json();
          }
        })
        .catch(next);
    })
    .catch(validationError => res.status(400)
      .json(errorResponseFactory(validationError.message)));
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
        .then((updatedResult) => {
          logger.info(`transaction updated - id: ${updatedResult.value._id}`);
          res.status(200).json(updatedResult.value);
        })
        .catch(next);
    })
    .catch(validationError => res.status(400)
      .json(errorResponseFactory(validationError.message)));
});

export default router;
