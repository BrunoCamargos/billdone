import supertest from 'supertest-as-promised';
import app from '../src';

console.log('before-test-setup');
beforeAll((done) => {
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
