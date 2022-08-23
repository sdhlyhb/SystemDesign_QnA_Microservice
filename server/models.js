const pool = require('../db/postgres/index');

pool.on('error', (err) => {
  console.error(`Failed to connect to database: ${err}`);
  process.exit(-1);
});

const getQuestions = (product_id, count, page) => {
  const queryString = `SELECT
  id AS question_id, question_body, question_date, asker_name, reported, helpfulness AS question_helpfulness
  FROM questions WHERE product_id=$1 AND reported = false ORDER BY id LIMIT $2 OFFSET $3;`;

  const values = [product_id, count, count * (page - 1)];
  return pool.query(queryString, values);
};

const getAnswersResults = (question_id, count, page) => {
  // count = count || 5;
  // page = page || 1;

  const queryString = `SELECT
  a.id AS answer_id,
  a.answer_body AS body,
  a.answer_date AS date,
  a.answerer_name,
  a.answer_helpfulness AS helpfulness,
  a.answer_reported AS reported,
  (
    SELECT COALESCE(json_agg(item), '[]'::json)
    FROM (
      SELECT
        p.id AS id,
        p.photo_url AS url
      FROM photos p
      WHERE p.answer_id = a.id
      ) item
  ) AS photos
FROM answers a where a.question_id = $1 AND a.answer_reported = false limit $2 OFFSET $3;`;
  const values = [question_id, count, count * (page - 1)];

  return pool.query(queryString, values);
};

const addAQuestion = (product_id, body, name, email) => {
  const queryString = `INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email)
  VALUES ($1, $2, NOW(), $3, $4);`;
  const values = [product_id, body, name, email];

  return pool.query(queryString, values);
};

const addAnswer = (question_id, body, name, email, photos) => {
  const queryString_insertAns = `
  INSERT INTO answers (question_id, answer_body, answer_date, answerer_name, answerer_email)
 VALUES ($1, $2, NOW(), $3, $4)`;
  const values_insertAns = [question_id, body, name, email];
  if (photos.length === 0) {
    return pool.query(queryString_insertAns, values_insertAns);
  } else {
    const promises = [pool.query(queryString_insertAns, values_insertAns)];
    const promises2 = photos.map((url) => {
      const queryString_insertP = `INSERT INTO photos (answer_id, photo_url) VALUES (currval('answers_id_seq'), $1);`;
      const values = [url];
      return pool.query(queryString_insertP, values);
    });
    const promises_all = promises.concat(promises2);
    return Promise.all(promises_all);

  }

};

const voteQuestionHelpful = (question_id) => {
  const queryString = 'UPDATE questions SET helpfulness = helpfulness + 1 WHERE id = $1;';
  const values = [question_id];
  return pool.query(queryString, values);
};

const reportQuestion = (question_id) => {
  const queryString = 'UPDATE questions SET reported = true WHERE id = $1;';
  const values = [question_id];
  return pool.query(queryString, values);
};

const voteAnswerHelpful = (answer_id) => {
  const queryString = 'UPDATE answers SET answer_helpfulness = answer_helpfulness + 1 WHERE id = $1;';
  const values = [answer_id];
  return pool.query(queryString, values);
};
const reportAnswer = (answer_id) => {
  const queryString = 'UPDATE answers SET answer_reported = true WHERE id = $1;';
  const values = [answer_id];
  return pool.query(queryString, values);
};

// test functions, not related to FEC
// const displayQuestionTest = (product_id, count) => {
// eslint-disable-next-line max-len
// const queryString = `SELECT * from questions WHERE product_id = ${product_id} and reported = false LIMIT ${count}`;
//   return pool.query(queryString);
// };

module.exports = {
  getQuestions,
  getAnswersResults,
  addAQuestion,
  addAnswer,
  voteQuestionHelpful,
  reportQuestion,
  voteAnswerHelpful,
  reportAnswer,
  // displayQuestionTest,
};
