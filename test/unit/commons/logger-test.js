import logger, { reqSerializer, resSerializer } from '../../../src/commons/logger';

describe('Unit: logger.js', () => {
  describe('.default', () => {
    it('should import logger', () => {
      expect(logger).to.is.an('object');
    });

    it('should log an error', () => {
      logger.error('Error test');
    });
  });

  describe('.reqSerializer()', () => {
    it('should return the same object provided', () => {
      expect(reqSerializer(null)).to.be.a('null');
      expect(reqSerializer(undefined)).to.be.an('undefined');
      expect(reqSerializer({})).to.be.eql({});
    });

    it('should return the object serialized', () => {
      const req = {
        connection: {
          remotePort: 8800,
        },
        body: {
          id: 1,
        },
        httpVersion: 1.1,
      };

      const expected = {
        body: req.body,
        headers: undefined,
        httpVersion: req.httpVersion,
        method: undefined,
        remoteAddress: undefined,
        remotePort: req.connection.remotePort,
        url: undefined,
      };

      expect(reqSerializer(req)).to.be.eql(expected);
      delete req.body;
      expected.body = {};
      expect(reqSerializer(req)).to.be.eql(expected);
    });
  });

  describe('.resSerializer()', () => {
    it('should return the same object provided', () => {
      expect(resSerializer(null)).to.be.a('null');
      expect(resSerializer(undefined)).to.be.an('undefined');
      expect(resSerializer({})).to.be.eql({});
    });

    it('should return the object serialized', () => {
      const res = {
        _header: { teste: 1 },
        responseTime: 1.155,
        statusCode: 200,
      };

      const expected = {
        header: res._header,
        statusCode: res.statusCode,
        responseTime: `${res.responseTime}ms`,
      };

      expect(resSerializer(res)).to.be.eql(expected);
      delete res.responseTime;
      expected.responseTime = undefined;
      expect(resSerializer(res)).to.be.eql(expected);
    });
  });
});
