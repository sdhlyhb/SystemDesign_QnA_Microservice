/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server');
const pool = require('../../db/postgres/index');

afterAll(async () => {
  await pool.end();
});

describe('Test GET routes', () => {
  it('GET / should send status code 200 and correct message', async () => {
    const res = await request(app)
      .get('/');
    // console.log(res);
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('questions and answers!');
  });

  it('GET /qa/questions with valid product_id send 200 status code', async () => {
    const res = await request(app)
      .get('/qa/questions?product_id=71699&count=5&page=1')
      .set('Accept', 'application/json');
    // console.log('this is data:', res.body);
    expect(res.status).toEqual(200);
  });

  it('GET /qa/questions with valid product_id should return expected data shape', async () => {
    const res = await request(app)
      .get('/qa/questions?product_id=71699&count=5&page=1')
      .set('Accept', 'application/json');
    // console.log('this is data:', res.body);
    expect(typeof res.body).toEqual('object');
    expect(res.body.product_id).toEqual('71699');
    expect(res.body.results.length >= 0).toBe(true);
    expect(res.body.results.length <= 5).toBe(true);
    expect(res.body.results[0].question_body).toBeDefined();
    expect(res.body.results[0].question_date).toBeDefined();
    expect(res.body.results[0].asker_name).toBeDefined();
    expect(res.body.results[0].question_helpfulness >= 0).toBe(true);
    expect(res.body.results[0].reported).toBeDefined();
    expect(res.body.results[0].answers).toBeDefined();
  });

  it('GET /qa/questions with invalid product_id send 500 status code and error message', async () => {
    const res = await request(app)
      .get('/qa/questions?product_id=invalid&count=5&page=1')
      .set('Accept', 'application/json');
    // console.log('this is data:', res.body);
    expect(res.status).toEqual(500);
    expect(res.text).toEqual('Error: invalid info provided!');
  });

  it('GET /qa/questions/:question_id/answers should send status code 200 for valid question_id', async () => {
    const res = await request(app)
      .get('/qa/questions/252171/answers')
      .set('Accept', 'application/json');
    // console.log(res);
    expect(res.status).toEqual(200);
  });
  it('GET /qa/questions/:question_id/answers should return expected datashape for valid question_id', async () => {
    const res = await request(app)
      .get('/qa/questions/252171/answers')
      .set('Accept', 'application/json');
    // console.log(res.body);
    expect(typeof res.body).toEqual('object');
    expect(res.body.question).toEqual('252171');
    expect(res.body.page).toEqual(1);
    expect(res.body.count).toEqual(5);
    expect(res.body.results.length >= 0).toBe(true);
    expect(res.body.results.length <= 5).toBe(true);
    expect(res.body.results[0].body).toBeDefined();
    expect(res.body.results[0].date).toBeDefined();
    expect(res.body.results[0].answerer_name).toBeDefined();
    expect(res.body.results[0].helpfulness >= 0).toBe(true);
    expect(res.body.results[0].photos).toBeDefined();
  });
  it('GET /qa/questions/:question_id/answers should send status code 500 and error message for invalid question_id', async () => {
    const res = await request(app)
      .get('/qa/questions/invalid/answers')
      .set('Accept', 'application/json');
    expect(res.status).toEqual(500);
    expect(res.body.name).toEqual('error');
  });
});

describe('PUT /qa/questions/:question_id/helpful', () => {
  const questionId_test = 252171;
  const invalidId = 'invalid';
  let helpfulnessBeforeTest;
  beforeEach(async () => {
    const dataBeforeTest = await pool.query(`SELECT helpfulness FROM questions WHERE id = ${questionId_test}`);
    helpfulnessBeforeTest = dataBeforeTest.rows[0].helpfulness;
  });

  afterEach(async () => {
    await pool.query(`UPDATE questions SET helpfulness = ${helpfulnessBeforeTest} WHERE id = ${questionId_test};`);
  });

  it('should send status code 204 and increment the helpfulness by 1 for valid question_id', async () => {
    const res = await request(app)
      .put(`/qa/questions/${questionId_test}/helpful`);
    // console.log(res);
    expect(res.status).toEqual(204);
    const dataAfter = await pool.query(`SELECT helpfulness FROM questions WHERE id = ${questionId_test}`);
    const helpfulnessAfter = dataAfter.rows[0].helpfulness;
    expect(helpfulnessAfter).toEqual(helpfulnessBeforeTest + 1);
  });
  it('should send status code 500 for invalid question_id', async () => {
    const res = await request(app)
      .put(`/qa/questions/${invalidId}/helpful`);
    // console.log(res);
    expect(res.status).toEqual(500);
  });
});

describe('PUT /qa/answers/:answer_id/helpful', () => {
  const ansId_test = 492234;
  const invalidId = 'invalid';
  let helpfulnessBeforeTest;
  beforeEach(async () => {
    const dataBeforeTest = await pool.query(`SELECT answer_helpfulness FROM answers WHERE id = ${ansId_test}`);
    helpfulnessBeforeTest = dataBeforeTest.rows[0].answer_helpfulness;
  });

  afterEach(async () => {
    await pool.query(`UPDATE answers SET answer_helpfulness = ${helpfulnessBeforeTest} WHERE id = ${ansId_test};`);
  });

  it('should send status code 204 and increment the answer helpfulness by 1 for valid answer_id', async () => {
    const res = await request(app)
      .put(`/qa/answers/${ansId_test}/helpful`);
    // console.log(res);
    expect(res.status).toEqual(204);
    const dataAfter = await pool.query(`SELECT answer_helpfulness FROM answers WHERE id = ${ansId_test}`);
    const helpfulnessAfter = dataAfter.rows[0].answer_helpfulness;
    expect(helpfulnessAfter).toEqual(helpfulnessBeforeTest + 1);
  });
  it('should send status code 500 for invalid answer_id', async () => {
    const res = await request(app)
      .put(`/qa/answers/${invalidId}/helpful`);
    // console.log(res);
    expect(res.status).toEqual(500);
  });
});

describe('POST /qa/questions', () => {
  it.todo('response with status code 201');
  it.todo('should add question to the corresponding product');
  it.todo('should response with 500 and error message if the product_id is invalid');
});
describe('POST /qa/questions/:question_id/answers', () => {
  it.todo('response with status code 201');
  it.todo('should add answer to the corresponding question');
  it.todo('added answer to the corresponding question should contain correct photos if there are any ');
  it.todo('should response with 500 and error message if the question_id is invalid');
});

describe('PUT /qa/questions/:question_id/report', () => {
  it.todo('response with status code 204');
  it.todo('should update the report status to true for the quetion');
  it.todo('should response with 500 and error message if the quetion_id is invalid');
});

describe('put /qa/answers/:answer_id/report', () => {
  it.todo('response with status code 204');
  it.todo('should update the report status to true for the answer');
  it.todo('should response with 500 and error message if the answer_id is invalid');
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
