import express from 'express';
import { ObjectId } from 'mongodb';
import { getCollection } from '../commons/db';
import validateTransaction from './transactions-schema';
import paginate from '../commons/pagination';

const COLLECTION_NAME = 'transactions';
const TRANSACTION_NOT_FOUND = 'transaction not found';

const router = express.Router();

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

const createObjectId = (hexStringId, logger) => new Promise((resolve, reject) => {
  try {
    resolve(ObjectId.createFromHexString(hexStringId));
  } catch (e) {
    const msg = 'transaction id must be a string of 24 hex characters';
    logger.warn(`IdValidationError - ${msg}`);
    reject(new Error('transaction id must be a string of 24 hex characters'));
  }
});

const errorResponseFactory = errorMessage => ({ message: errorMessage });

const validatePayload = (payload, res) => new Promise(resolve => {
  validateTransaction(payload)
    .then(resolve)
    .catch(validationError => {
      res.logger.warn(`PayloadValidationError - ${validationError.message}`);
      res.status(400)
        .json(errorResponseFactory(validationError.message));
    });
});

router.get('/', (req, res, next) => {
  const { skip, limit } = paginate(req.query.page, req.query.limit);
  getCollection(COLLECTION_NAME)
    .find()
    .skip(skip)
    .limit(limit)
    .toArray()
    .then(transactions => sendResponse(200, res, transactions))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  createObjectId(req.params.id, req.logger)
    .then(transactionId => {
      const queryById = { _id: transactionId };

      getCollection(COLLECTION_NAME).findOne(queryById)
        .then(transaction => {
          if (transaction) {
            sendResponse(200, res, transaction);
          } else {
            req.logger.warn(`${TRANSACTION_NOT_FOUND} - id: ${req.params.id}`);
            res.status(404).json(errorResponseFactory(TRANSACTION_NOT_FOUND));
          }
        })
        .catch(next);
    })
    .catch(validationError => res.status(400)
      .json(errorResponseFactory(validationError.message)));
});

router.post('/', (req, res, next) => {
  validatePayload(req.body, res)
    .then(transaction => getCollection(COLLECTION_NAME).insertOne(transaction))
    .then(insertResult => {
      const transaction = insertResult.ops[0];

      req.logger.info(`transaction created - id: ${transaction._id}`);
      res.location(`/transactions/${transaction._id}`);
      res.status(201).json(transaction);
    })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  createObjectId(req.params.id, req.logger)
    .then(transactionId => {
      const queryById = { _id: transactionId };

      getCollection(COLLECTION_NAME).deleteOne(queryById)
        .then(result => {
          if (!result.deletedCount) {
            req.logger.warn(`${TRANSACTION_NOT_FOUND} - id: ${req.params.id}`);
            res.status(404).json(errorResponseFactory(TRANSACTION_NOT_FOUND));
          } else {
            req.logger.info(`transaction deleted - id: ${req.params.id}`);
            res.status(204).json();
          }
        })
        .catch(next);
    })
    .catch(validationError => res.status(400)
      .json(errorResponseFactory(validationError.message)));
});

router.put('/:id', (req, res, next) => {
  Promise.all([createObjectId(req.params.id, req.logger), validateTransaction(req.body)])
    .then(([transactionId, transaction]) => {
      const queryById = { _id: transactionId };

      getCollection(COLLECTION_NAME)
        .findOneAndUpdate(queryById, { $set: transaction }, {
          returnOriginal: false,
          upsert: true,
        })
        .then(updatedResult => {
          req.logger.info(`transaction updated - id: ${updatedResult.value._id}`);
          res.status(200).json(updatedResult.value);
        })
        .catch(next);
    })
    .catch(validationError => res.status(400)
      .json(errorResponseFactory(validationError.message)));
});

export default router;
