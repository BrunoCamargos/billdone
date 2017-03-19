import dotenv from 'dotenv';
import joi from 'joi';

(!process.env.NODE_ENV) && dotenv.load();

const load = () => {
  const envVarsSchema = joi.object({
    NODE_ENV: joi.string().valid('test', 'development', 'production').required(),
    DB_URL: joi.string().required(),
    APP_PORT: joi.string().default('3775'),
    APP_HOST: joi.string().default('localhost'),
    APP_DEFAULT_PAGE_LIMIT: joi.number().integer().positive().default(50),
    LOGGER_LEVEL: joi.string()
      .allow(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
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
      defaultPageLimit: envVars.APP_DEFAULT_PAGE_LIMIT,
    },
    logger: {
      level: envVars.LOGGER_LEVEL,
    },
  };
};
export default load;
