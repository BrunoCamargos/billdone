import joi from 'joi';
import validateSchema from '../../../src/commons/schema-validator';

const schema = {
  amount: joi.number().required(),
  description: joi.string().optional(),
};

describe('Unit: schema-validator.js ', () => {
  describe('.validate()', () => {
    it('object parameter should be provided', () => validateSchema()
      .catch(err => expect(err.message).to.equal('object to validate not provided')));

    it('schema parameter should be provided', () => validateSchema({ a: 1 })
      .catch(err => expect(err.message).to.equal('schema type to validate not provided')));

    it('should resolve with a valid object', () => {
      const validObject = { amount: 1 };

      return validateSchema(validObject, schema)
        .then(objectValidated => expect(objectValidated).to.deep.equal(validObject));
    });

    it('should reject with an invalid error object', () => {
      const invalidObject = { description: 'invalid object' };
      const expected = [{
        message: '"amount" is required',
        path: 'amount',
        type: 'any.required',
        context: { key: 'amount' },
      }];

      return validateSchema(invalidObject, schema)
        .catch((err) => {
          expect(err.details).to.deep.equal(expected);
          expect(err.message).to.equal('child "amount" fails because ["amount" is required]');
        });
    });
  });
});
