import Joi from 'joi';

const schema = {
  amount: Joi.number().required(),
  type: Joi.string().required(),
  description: Joi.string().optional(),
};

const validateTransaction = transaction => Joi.validate(transaction, schema, { abortEarly: false });

export default validateTransaction;
