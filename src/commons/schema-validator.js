import joi from 'joi';

const validate = (object, schema) => new Promise((resolve, reject) => {
  if (!object) {
    reject(new Error('object to validate not provided'));
  }

  if (!schema) {
    reject(new Error('schema type to validate not provided'));
  }

  const { error, value } = joi.validate(object, schema, { abortEarly: false });

  return error ? reject(error) : resolve(value);
});

export default validate;
