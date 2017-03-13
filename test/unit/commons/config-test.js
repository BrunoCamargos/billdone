import loadConfig from '../../../src/commons/config/config-loader';

describe('Unit: config-loader.js ', () => {
  describe('.load()', () => {
    it('should provide required environment variables', () => {
      const expected = 'Config validation error: child "NODE_ENV" fails because ["NODE_ENV" ' +
        'is required]. child "DB_URL" fails because ["DB_URL" is required]';
      const env = process.env;
      process.env = {};
      expect(loadConfig).to.throw(expected);
      process.env = env;
    });

    it('should provide a valid "NODE_ENV" value', () => {
      const expected = 'Config validation error: child "NODE_ENV" fails because ["NODE_ENV" ' +
        'must be one of [test, development, production]]';
      process.env.NODE_ENV = 'invalid';
      expect(loadConfig).to.throw(expected);
    });
  });
});
