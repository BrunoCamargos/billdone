import { MongoClient } from 'mongodb';
import Bluebird from 'bluebird';
import config from './config';
import logger from './logger';

let db = {};

const connect = () => MongoClient.connect(config.db.url, { promiseLibrary: Bluebird })
  .then((database) => {
    logger.info('Connected to database!');
    db = database;
    db.on('close', () => logger.info('Disconnected from database!'));
  })
  .catch((err) => {
    logger.error({ err }, 'Unable to connect to database:');
    throw err;
  });

const disconnect = () => db.close();

const getCollection = collectionName => db.collection(collectionName);

export { connect, disconnect, getCollection };
