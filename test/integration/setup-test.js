import supertest from 'supertest-as-promised';
import joiAssert from 'joi-assert';
import app from '../../src';
import { getCollection } from '../../src/commons/db';

global.joiAssert = joiAssert;
global.getCollection = getCollection;

before('Starting app...', (done) => {
  // app.start()
  //   .then(() => {
  //     global.request = supertest(app);
  //     done();
  //   });

  app.on('started', () => {
    global.request = supertest(app);
    done();
  });
});
