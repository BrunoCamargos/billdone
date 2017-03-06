import { connect } from '../../../src/commons/db';
import config from '../../../src/commons/config';

describe('Unit: db.js ', () => {
  describe('.connect()', () => {
    before(() => {
      sinon.stub(console, 'error');
    });

    after(() => {
      console.error.restore();
    });

    it('should be unable to connect to database', () => {
      config.db.url = 'invalidUrl:27017/test';
      return connect()
        .should.be.rejectedWith('invalid schema, expected mongodb');
    });
  });
});
