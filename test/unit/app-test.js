import startApp from '../../src/app';
import config from '../../src/commons/config';

describe('Unit: app.js ', () => {
  describe('.start()', () => {
    before(() => {
      sinon.stub(console, 'error');
    });

    after(() => {
      console.error.restore();
    });

    it('should be unable to start the server when unable to connect to database', () => {
      const processExitSpy = sinon.stub(process, 'exit');
      config.db.url = 'invalidUrl:27017/test';

      return startApp()
        .catch((err) => {
          expect(processExitSpy).to.have.been.calledWith(1);
          processExitSpy.restore();
          throw err;
        })
        .should.be.rejectedWith('invalid schema, expected mongodb');
    });
  });
});
