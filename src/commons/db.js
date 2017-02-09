import { MongoClient } from 'mongodb';
import Bluebird from 'bluebird';
import config from './config';

let db = {};

const connect = () => MongoClient.connect(config.db.url, { promiseLibrary: Bluebird })
  .then((database) => {
    console.log('Connected to db!');
    db = database;
  })
  .catch((error) => {
    console.log('Error from connet', error);
    throw error;
  });

const getCollection = collectionName => db.collection(collectionName);

export default connect;

export { getCollection };
