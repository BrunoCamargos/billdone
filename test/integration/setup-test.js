import supertest from 'supertest-as-promised';
import joiAssert from 'joi-assert';
import app from '../../src';

global.joiAssert = joiAssert;

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
