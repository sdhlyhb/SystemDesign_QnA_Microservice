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

describe('PUT /qa/questions/:question_id/report', () => {
  const questionId_test = 252171;
  const invalidId = 'invalid';

  afterEach(async () => {
    await pool.query(`UPDATE questions SET reported = false WHERE id = ${questionId_test};`);
  });

  it('should send status code 204 and change the reported from false to true for valid question_id', async () => {
    const res = await request(app)
      .put(`/qa/questions/${questionId_test}/report`);
    // console.log(res);
    expect(res.status).toEqual(204);
    const dataAfter = await pool.query(`SELECT reported FROM questions WHERE id = ${questionId_test}`);
    const reportStatusAfterTest = dataAfter.rows[0].reported;
    expect(reportStatusAfterTest).toEqual(true);
  });
  it('should send status code 500 for invalid question_id', async () => {
    const res = await request(app)
      .put(`/qa/questions/${invalidId}/report`);
    expect(res.status).toEqual(500);
  });
});

describe('put /qa/answers/:answer_id/report', () => {
  const ansId_test = 492234;
  const invalidId = 'invalid';

  afterEach(async () => {
    await pool.query(`UPDATE answers SET answer_reported = false WHERE id = ${ansId_test};`);
  });

  it('should send status code 204 and change the answer_reported from false to true valid answer_id', async () => {
    const res = await request(app)
      .put(`/qa/answers/${ansId_test}/report`);
    // console.log(res);
    expect(res.status).toEqual(204);
    const dataAfter = await pool.query(`SELECT answer_reported FROM answers WHERE id = ${ansId_test}`);
    const reportedStatusAfter = dataAfter.rows[0].answer_reported;
    expect(reportedStatusAfter).toEqual(true);
  });
  it('should send status code 500 for invalid answer_id', async () => {
    const res = await request(app)
      .put(`/qa/answers/${invalidId}/helpful`);
    expect(res.status).toEqual(500);
  });
});

describe('POST /qa/questions', () => {
  const testData = {
    product_id: 71697,
    body: 'This is a test question post for product 71697',
    name: 'sdc_tester_2022',
    email: 'sdcTester@email.com',
  };
  const invalidTestData = {
    product_id: 'invalid',
    body: 'This is a test question post for invalid product',
    name: 'sdc_tester_2022',
    email: 'sdcTester@email.com',
  };

  afterEach(async () => {
    await pool.query(`DELETE FROM questions WHERE asker_name = '${testData.name}'`);
  });

  it('should post the testData to db and respond with status 201 and the posted question matching the testData', async () => {
    const res = await request(app)
      .post('/qa/questions')
      .send(testData);
      // check the response
    // console.log('this is reponse for test:', res.text);
    expect(res.status).toEqual(201);
    expect(res.text).toBe('Question added!');
    // Check if the test data is in the database
    const dbData = await pool.query(`SELECT * FROM questions WHERE asker_name = '${testData.name}'`);
    // console.log('dbData:', dbData.rows);
    expect(dbData.rows[0].product_id).toBe(testData.product_id);
    expect(dbData.rows[0].question_body).toBe(testData.body);
    expect(dbData.rows[0].asker_name).toBe(testData.name);
    expect(dbData.rows[0].asker_email).toBe(testData.email);
    expect(dbData.rows[0].reported).toBe(false);
    expect(dbData.rows[0].helpfulness).toEqual(0);
  });

  it('should response with status code 500 for posting data to invalid product', async () => {
    const res = await request(app)
      .post('/qa/questions')
      .send(invalidTestData);
      // check the response
    expect(res.status).toEqual(500);
    expect(res.body.name).toEqual('error');
  });
});

describe('POST /qa/questions/:question_id/answers without photos', () => {
  const testQ_id = 999;

  const testDataWithoutPhotos = {
    body: 'This is a test answer post for question 999 without photos',
    name: 'sdc_tester_2022',
    email: 'sdcTester@email.com',
    photos: [],
  };
  afterEach(async () => {
    await pool.query('DELETE FROM photos WHERE answer_id >=6879308;');
    await pool.query('DELETE FROM answers WHERE id >=6879308;');
  });
  it('should response with status code 201 and display correct answer content for posting answers without photos to valid question', async () => {
    const res = await request(app)
      .post(`/qa/questions/${testQ_id}/answers`)
      .send(testDataWithoutPhotos);
      // check the response
    expect(res.status).toEqual(201);
    expect(res.text).toEqual('Answer added!');
    // check inserted answer data in the database:
    const dbData = await pool.query(`SELECT * FROM answers WHERE answerer_name = '${testDataWithoutPhotos.name}'`);
    const testAnsId = dbData.rows[0].id;
    const dbData_photos = await pool.query(`SELECT * FROM photos WHERE answer_id = '${testAnsId}'`);
    expect(dbData.rows[0].question_id).toBe(testQ_id);
    expect(dbData.rows[0].answer_body).toBe(testDataWithoutPhotos.body);
    expect(dbData.rows[0].answerer_name).toBe(testDataWithoutPhotos.name);
    expect(dbData.rows[0].answerer_email).toBe(testDataWithoutPhotos.email);
    expect(dbData.rows[0].answer_helpfulness).toEqual(0);
    expect(dbData.rows[0].answer_reported).toEqual(false);
    expect(dbData_photos.rows.length).toEqual(0);
  });
});

describe('POST /qa/questions/:question_id/answers with photos ', () => {
  const testQ_id = 999;

  const testDataWithPhotos = {
    body: 'This is a test answer post for question 999 with photos',
    name: 'sdc_tester_2022',
    email: 'sdcTester@email.com',
    photos: ['image1.jpg', 'image2.png'],
  };

  afterEach(async () => {
    await pool.query('DELETE FROM photos WHERE answer_id >=6879308;');
    await pool.query('DELETE FROM answers WHERE id >=6879308;');
  });
  it('should response with status code 201 and display correct answer content for posting answers with photos to valid question', async () => {
    const res = await request(app)
      .post(`/qa/questions/${testQ_id}/answers`)
      .send(testDataWithPhotos);
      // check the response
    // console.log('this is res of post ans:', res);
    expect(res.status).toEqual(201);
    expect(res.text).toEqual('Answer added!');
    // check inserted answer data in the database:
    const dbData = await pool.query(`SELECT * FROM answers WHERE answerer_name = '${testDataWithPhotos.name}'`);
    const testAnsId = dbData.rows[0].id;
    const dbData_photos = await pool.query(`SELECT * FROM photos WHERE answer_id = '${testAnsId}'`);
    expect(dbData.rows[0].question_id).toBe(testQ_id);
    expect(dbData.rows[0].answer_body).toBe(testDataWithPhotos.body);
    expect(dbData.rows[0].answerer_name).toBe(testDataWithPhotos.name);
    expect(dbData.rows[0].answerer_email).toBe(testDataWithPhotos.email);
    expect(dbData.rows[0].answer_helpfulness).toEqual(0);
    expect(dbData.rows[0].answer_reported).toEqual(false);
    expect(dbData_photos.rows.length).toEqual(testDataWithPhotos.photos.length);
    expect(dbData_photos.rows[0].photo_url).toBe(testDataWithPhotos.photos[0]);
    expect(dbData_photos.rows[1].photo_url).toBe(testDataWithPhotos.photos[1]);
  });
});

describe('POST /qa/questions/:question_id/answers with invalid question id', () => {
  it('should response with status code 500 for posting data to invalid question', async () => {
    const invalidQ_id = 'invalid_id';
    const invalidTestData = {
      body: 'This is a test answer post for invalid question',
      name: 'sdc_tester',
      email: 'sdcTester@email.com',
      photos: [],
    };
    const res = await request(app)
      .post(`/qa/questions/${invalidQ_id}/answers`)
      .send(invalidTestData);
      // check the response
    expect(res.status).toEqual(500);
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
