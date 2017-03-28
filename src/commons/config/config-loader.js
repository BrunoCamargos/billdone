import dotenv from 'dotenv';
import joi from 'joi';
import fs from 'fs';

(!process.env.NODE_ENV) && dotenv.load();

const load = () => {
  const envVarsSchema = joi.object({
    NODE_ENV: joi.string()
      .valid('test', 'development', 'production')
      .required(),
    DB_URL: joi.string()
      .required(),
    APP_PORT: joi.string()
      .default('3775'),
    APP_HTTPS_PORT: joi.string()
      .required(),
    APP_CERTIFICATE_FILE: joi.string()
      .required(),
    APP_PRIVATE_KEY_FILE: joi.string()
      .required(),
    APP_HOST: joi.string()
      .default('localhost'),
    APP_DEFAULT_PAGE_LIMIT: joi.number()
      .integer()
      .positive()
      .default(50),
    LOGGER_LEVEL: joi.string()
      .allow(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
    LOGGER_ENABLED: joi.boolean()
      .truthy('TRUE')
      .truthy('true')
      .falsy('FALSE')
      .falsy('false')
      .default(true),
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
      httpsPort: envVars.APP_HTTPS_PORT,
      defaultPageLimit: envVars.APP_DEFAULT_PAGE_LIMIT,
      ssl: {
        cert: fs.readFileSync(envVars.APP_CERTIFICATE_FILE),
        key: fs.readFileSync(envVars.APP_PRIVATE_KEY_FILE),
      },
    },
    logger: {
      level: envVars.LOGGER_LEVEL,
      enabled: envVars.LOGGER_ENABLED,
    },
  };
};
export default load;
