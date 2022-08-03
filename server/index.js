const PORT = 3000;
const app = require('./server.js');



app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});