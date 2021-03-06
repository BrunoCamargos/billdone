import joi from 'joi';
import validateSchema from '../../../src/commons/schema-validator';

describe('Unit: schema-validator.js ', () => {
  describe('.validate()', () => {
    const schema = {
      amount: joi.number().required(),
      description: joi.string().optional(),
    };

    it('"object" parameter should be provided', () => validateSchema()
      .should.be.rejectedWith('object to validate not provided'));

    it('"schema" parameter should be provided', () => validateSchema({ a: 1 })
      .should.be.rejectedWith('schema type to validate not provided'));

    it('should resolve with a valid object', () => {
      const validObject = { amount: 1 };

      return validateSchema(validObject, schema)
        .then(objectValidated => expect(objectValidated).to.deep.equal(validObject));
    });

    it('should reject when an invalid "object" is provided', () => validateSchema({}, schema)
      .should.be.rejectedWith('child "amount" fails because ["amount" is required]'));
  });
});
