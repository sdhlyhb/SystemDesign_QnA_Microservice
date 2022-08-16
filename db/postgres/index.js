require('dotenv').config();
const { Pool, Client } = require('pg');

const configs = {
  user: process.env.PG_USER,
  host: 'localhost',
  database: 'sdc_qna',
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
};

const pool = new Pool(configs);

const poolDemo = async () => {
  // eslint-disable-next-line no-shadow
  const pool = new Pool(configs);
  const now = await pool.query('SELECT NOW()');
  await pool.end();

  return now;
};

// Connect with a client.

const clientDemo = async () => {
  const client = new Client(configs);
  await client.connect();
  const now = await client.query('SELECT NOW()');
  await client.end();

  return now;
};

(async () => {
  const poolResult = await poolDemo();
  console.log(`Time with pool: ${poolResult.rows[0].now}`);
  const clientResult = await clientDemo();
  console.log(`Time with client: ${clientResult.rows[0].now}`);
})();

module.exports = pool;
