import supertest from 'supertest';
import joiAssert from 'joi-assert';
import startApp from '../../src/app';
import { getCollection } from '../../src/commons/db';

global.joiAssert = joiAssert;
global.getCollection = getCollection;

let server = {};
before('Starting app...', () => startApp()
  .then(app => {
    global.request = supertest(app);
    server = app;
  }));

after('Stopping app...', () => {
  server.close();
  server = null;
});
