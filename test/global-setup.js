import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

const setEnvironmentVariables = () => {
  process.env.APP_HOST = 'localhost';
  process.env.APP_HTTPS_PORT = 8200;
  process.env.APP_CERTIFICATE_FILE = './server.crt';
  process.env.APP_PRIVATE_KEY_FILE = './server.key';
  process.env.DB_URL = 'mongodb://localhost:27017/billdone_test';
  process.env.LOGGER_LEVEL = 'info';
  process.env.LOGGER_ENABLED = false;
};

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

global.expect = chai.expect;
global.sinon = sinon;

setEnvironmentVariables();
