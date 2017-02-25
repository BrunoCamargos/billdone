import Joi from 'joi';

const schema = {
  amount: Joi.required()
    .when('type', {
      is: 'income',
      then: Joi.number().integer().positive(),
    })
    .when('type', {
      is: 'expense',
      then: Joi.number().integer().negative(),
    }),
  type: Joi.string().valid('expense', 'income').required(),
  description: Joi.string().optional(),
};

const validateTransaction = transaction => Joi.validate(transaction, schema, { abortEarly: false });

export default validateTransaction;
