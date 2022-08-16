const express = require('express');

const app = express();
const controller = require('./controllers');

const sampleData = require('../DataFiles/sampleQnAData');
// const PORT = 3000;
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('questions and answers!');
});

app.get('/qa/questions', (req, res) => {
  res.status(200).json({ data: sampleData.sampleQuestionData71697 });
});

/** ******************************************
 *              expected routes:
 ******************************************* */

app.get('/qa/questions', controller.getQuestions);
app.get('/qa/questions/:question_id/answers', controller.getAnswers);
app.post('/qa/questions', controller.addAQuestion);
app.post('/qa/questions/:question_id/answers', controller.addAnswer);
app.put('/qa/questions/:question_id/helpful', controller.voteQuestionHelpful);
app.put('/qa/questions/:question_id/report', controller.reportQuestion);
app.put('/qa/answers/:answer_id/helpful', controller.voteAnswerHelpful);
app.put('/qa/answers/:answer_id/report', controller.reportAnswer);



app.get('/qa/test_display', controller.displayQuestionTest); // this one is just a test, not related to FEC


module.exports = app;
