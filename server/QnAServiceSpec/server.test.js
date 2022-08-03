const request = require('supertest');
const app = require('../server.js');


describe('Test root', () => {
  test('GET /', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect(res => {
        res.body = 'questions and answers!';
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        return done();
      });

  });
});




describe('Test sample questions response', () => {
  test('GET /qa/questions', (done) => {
    request(app)
      .get('/qa/questions')
      .expect(200)
      .expect('Content-type', /json/)
      .expect((res) => {
        console.log(res.body);
        // eslint-disable-next-line camelcase
        res.body.data.product_id = '71697';
        res.body.data.results.length = 16;
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        return done();
      });

  });
});