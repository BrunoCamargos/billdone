import supertest from 'supertest'; // usar promise supertest-as-promise
import app from '../';

global.request = supertest(app);
