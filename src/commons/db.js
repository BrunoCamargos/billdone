import { MongoClient } from 'mongodb';
import Bluebird from 'bluebird';

let db = {};

const connect = () => MongoClient.connect('mongodb://localhost:27017/test', { promiseLibrary: Bluebird })
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
