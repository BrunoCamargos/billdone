import dotenv from 'dotenv';
import joi from 'joi';

dotenv.load();

const envVarsSchema = joi.object({
  NODE_ENV: joi.string().valid('test', 'development', 'production').required(),
  DB_URL: joi.string().required(),
}).unknown().required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  db: {
    url: envVars.DB_URL,
  },
  env: envVars.NODE_ENV,
};

export default config;
