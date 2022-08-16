const pool = require('../db/postgres/index');

pool.on('error', (err) => {
  console.error(`Failed to connect to database: ${err}`);
  process.exit(-1);
});

const displayQuestionTest = (product_id, count) => {
  const queryString = `SELECT * from questions WHERE product_id = ${product_id} and reported = false LIMIT ${count}`;
  return pool.query(queryString);
};

module.exports = { displayQuestionTest };
