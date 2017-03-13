import paginate from '../../../src/commons/pagination';
import config from '../../../src/commons/config';

describe('Unit: pagination.js ', () => {
  describe('.paginate()', () => {
    before(() => (config.app.defaultPageLimit = 30));
    it('should return an object', () => expect(paginate(1, 50)).to.be.an('object'));

    it('should return an object with default values', () => {
      const expected = { skip: 0, limit: config.app.defaultPageLimit };

      expect(paginate()).to.deep.equal(expected);
      expect(paginate(undefined, undefined)).to.deep.equal(expected);
      expect(paginate(null, null)).to.deep.equal(expected);
    });

    it('should return an object with default values when provided invalid string parameters', () => {
      const expected = { skip: 0, limit: config.app.defaultPageLimit };

      expect(paginate('invalid', 'invalid')).to.deep.equal(expected);
    });

    it('should return an object when provided positive number parameters', () => {
      expect(paginate(0, 15)).to.deep.equal({ skip: 0, limit: 15 });
      expect(paginate(1, 20)).to.deep.equal({ skip: 0, limit: 20 });
      expect(paginate(2, 20)).to.deep.equal({ skip: 20, limit: 20 });
      expect(paginate(2.33, 20.57)).to.deep.equal({ skip: 20, limit: 20 });
    });

    it('should return a valid object when provided valid positive string parameters', () => {
      expect(paginate('0invalid', '15invalid')).to.deep.equal({ skip: 0, limit: 15 });
      expect(paginate('1invalid', '20invalid')).to.deep.equal({ skip: 0, limit: 20 });
      expect(paginate('2.78', '10.33')).to.deep.equal({ skip: 10, limit: 10 });
    });

    it('should return an object with default values when provided negative number parameters', () => {
      const expected = { skip: 0, limit: config.app.defaultPageLimit };
      expect(paginate(-2, -15)).to.deep.equal(expected);
      expect(paginate(-0, -0)).to.deep.equal(expected);
      expect(paginate(-2.56, -15.17)).to.deep.equal(expected);
    });

    it('should return an object with default values when provided valid negative string parameters', () => {
      const expected = { skip: 0, limit: config.app.defaultPageLimit };
      expect(paginate('-2', '-15')).to.deep.equal(expected);
      expect(paginate('-0', '-0')).to.deep.equal(expected);
      expect(paginate('-2.56', '-15.17')).to.deep.equal(expected);
      expect(paginate('-2.56invalid', '-15invalid')).to.deep.equal(expected);
    });

    it('Should return a default value for the key "limit" when provided a "pageLimit" parameter that exceeds the default limit', () => {
      expect(paginate(0, 70)).to.deep.equal({ skip: 0, limit: config.app.defaultPageLimit });
      expect(paginate(1, 77)).to.deep.equal({ skip: 0, limit: config.app.defaultPageLimit });
      expect(paginate(2, 77)).to.deep
        .equal({ skip: config.app.defaultPageLimit, limit: config.app.defaultPageLimit });
      expect(paginate(3, 77)).to.deep
        .equal({ skip: (config.app.defaultPageLimit * 2), limit: config.app.defaultPageLimit });
    });
  });
});
