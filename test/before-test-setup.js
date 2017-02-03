import supertest from 'supertest-as-promised';
import app from '../';

global.request = supertest(app);
