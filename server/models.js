const pool = require('../db/postgres/index');

pool.on('error', (err) => {
  console.error(`Failed to connect to database: ${err}`);
  process.exit(-1);
});










module.exports = {};
