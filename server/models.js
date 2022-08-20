const pool = require('../db/postgres/index');

pool.on('error', (err) => {
  console.error(`Failed to connect to database: ${err}`);
  process.exit(-1);
});

const getAnswersResults = (question_id, count, page) => {
  count = count || 5;
  page = page || 1;

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
  const queryString = `INSERT INTO question (product_id, question_body, question_date, asker_name, asker_email)
  VALUES ($1, $2, NOW(), $3, $4);`;
  const values = [product_id, body, name, email];

  return pool.query(queryString, values);
};

const addAnswer = (question_id, body, name, email, photos) => {
  let queryString;
  if (photos.length) {
    queryString = `WITH answer_full AS (
    INSERT INTO answers (question_id, answer_body, answer_date, answerer_name, answerer_email)
   VALUES ($1, $2, NOW(), $3, $4)
   returning id
  )
  INSERT INTO answers_photos (answer_id, photo_url)
  VALUES ((SELECT id FROM answer_full), unnest (${photos}))
  `;
  } else {
    queryString = `
      INSERT INTO answers (question_id, answer_body, answer_date, answerer_name, answerer_email)
     VALUES ($1, $2, NOW(), $3, $4)`;
  }
  const values = [question_id, body, name, email];
  return pool.query(queryString, values);
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
  const queryString = 'UPDATE answers SET helpfulness = helpfulness + 1 WHERE id = $1;';
  const values = [answer_id];
  return pool.query(queryString, values);
};
const reportAnswer = (answer_id) => {
  const queryString = 'UPDATE answers SET answer_reported = true WHERE id = $1;';
  const values = [answer_id];
  return pool.query(queryString, values);
};

// test functions, not related to FEC
const displayQuestionTest = (product_id, count) => {
  const queryString = `SELECT * from questions WHERE product_id = ${product_id} and reported = false LIMIT ${count}`;
  return pool.query(queryString);
};

module.exports = {
  getAnswersResults,
  addAQuestion,
  addAnswer,
  voteQuestionHelpful,
  reportQuestion,
  voteAnswerHelpful,
  reportAnswer,
  displayQuestionTest,
};
