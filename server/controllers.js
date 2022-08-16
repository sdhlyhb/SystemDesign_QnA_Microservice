const models = require('./models');

// get questions:
const getQuestions = (req, res) => {
  console.log(req.body);
  res.status(200);
};

const getAnswers = (req, res) => {
  console.log(req.body);
  res.status(200);
};

const addAQuestion = (req, res) => {
  console.log(req.body);
  res.status(201);
};

const addAnswer = (req, res) => {
  console.log(req.body);
  res.status(201);
};
const voteQuestionHelpful = (req, res) => {
  console.log(req.body);
  res.status(204);
};
const reportQuestion = (req, res) => {
  console.log(req.body);
  res.status(204);
};
const voteAnswerHelpful = (req, res) => {
  console.log(req.body);
  res.status(204);
};
const reportAnswer = (req, res) => {
  console.log(req.body);
  res.status(204);
};


// test display upto 5 results with product_id = 1, reported = false, unformatted;
const displayQuestionTest = (req, res) => {
  const product_id = 1;
  const count = 5;
  models.displayQuestionTest(product_id, count)
    .then((response) => {
      console.log('this is test display for product_id 1:', response);
      res.status(200).send(response.rows);
    }).catch((err) => res.status(500).send(err));
};

module.exports = {
  getQuestions,
  getAnswers,
  addAQuestion,
  addAnswer,
  voteQuestionHelpful,
  reportQuestion,
  voteAnswerHelpful,
  reportAnswer,
  displayQuestionTest,
};
