/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server');
const pool = require('../../db/postgres/index');

afterAll(async () => {
  await pool.end();
});

describe('Test routes', () => {
  it('GET / should send status code 200 and correct message', async () => {
    const res = await request(app)
      .get('/');
    // console.log(res);
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('questions and answers!');
  });

  it('GET /qa/questions should send status code 200', async () => {
    const res = await request(app)
      .get('/qa/questions');
    // console.log(res);
    expect(res.status).toEqual(200);
  });

  it('GET /qa/questions/:question_id/answers should send status code 200', async () => {
    const res = await request(app)
      .get('/qa/questions/:question_id/answers');
    // console.log(res);
    expect(res.status).toEqual(200);
  });

  it('POST /qa/questions/:question_id/answers should send status code 201 and expected message', async () => {
    const res = await request(app)
      .post('/qa/questions/:question_id/answers');
    // console.log(res);
    expect(res.status).toEqual(201);
    expect(res.text).toEqual('Answer added!');
  });
});

/** ******* old sample data test ********************** */
// describe('Test sample questions response', () => {
//   it('GET /qa/questions should send status code 200 and correct sample data ', async () => {
//     const res = await request(app)
//       .get('/qa/questions')
//       .set('Accept', 'application/json');
//     // console.log(res.body.data.results);
//     expect(res.status).toEqual(200);
//     expect(res.body.data.results.length).toEqual(16);
//     expect(res.body.data.product_id).toEqual('71697');
//   });
// });
