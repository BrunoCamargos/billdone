import logger from '../../../src/commons/logger';

describe('Unit: logger.js', () => {
  describe('.default', () => {
    it('should import logger', () => {
      expect(logger).to.is.an('object');
    });

    it('should log an error', () => {
      logger.error('Error test');
    });
  });
});
