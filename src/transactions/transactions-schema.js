import joi from 'joi';
import validateSchema from '../commons/schema-validator';

const schema = {
  amount: joi.required()
    .when('type', {
      is: 'income',
      then: joi.number().integer().positive(),
    })
    .when('type', {
      is: 'expense',
      then: joi.number().integer().negative(),
    }),
  type: joi.string().valid('expense', 'income').required(),
  description: joi.string().optional(),
};

const validateTransaction = transaction => validateSchema(transaction, schema);

export default validateTransaction;
