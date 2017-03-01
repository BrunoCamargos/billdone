import { MongoClient } from 'mongodb';
import Bluebird from 'bluebird';
import config from './config';

let db = {};

const connect = () => MongoClient.connect(config.db.url, { promiseLibrary: Bluebird })
  .then((database) => {
    console.log('Connected to database!');
    db = database;
    db.on('close', () => console.log('Disconnected from database!'));
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err);
    throw err;
  });

const disconnect = () => db.close();

const getCollection = collectionName => db.collection(collectionName);

export { connect, disconnect, getCollection };
