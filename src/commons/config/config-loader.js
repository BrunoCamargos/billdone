import dotenv from 'dotenv';
import joi from 'joi';

dotenv.load();

const load = () => {
  const envVarsSchema = joi.object({
    NODE_ENV: joi.string().valid('test', 'development', 'production').required(),
    DB_URL: joi.string().required(),
    APP_PORT: joi.string().default('3775').optional(),
    APP_HOST: joi.string().required(),
  }).unknown().required();


  const { error, value: envVars } = joi.validate(process.env, envVarsSchema, { abortEarly: false });
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    db: {
      url: envVars.DB_URL,
    },
    env: envVars.NODE_ENV,
    app: {
      host: envVars.APP_HOST,
      port: envVars.APP_PORT,
    },
  };
};
export default load;
