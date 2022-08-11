/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server');

describe('Test root', () => {
  it('GET /', async () => {
    const res = await request(app)
      .get('/');
    // console.log(res);
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('questions and answers!');
  });
});

describe('Test sample questions response', () => {
  it('GET /qa/questions', async () => {
    const res = await request(app)
      .get('/qa/questions')
      .set('Accept', 'application/json');
    // console.log(res.body.data.results);
    expect(res.status).toEqual(200);
    expect(res.body.data.results.length).toEqual(16);
    expect(res.body.data.product_id).toEqual('71697');
  });
});
