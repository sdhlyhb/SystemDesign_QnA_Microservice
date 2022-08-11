const express = require('express');

const app = express();

const sampleData = require('../DataFiles/sampleQnAData');
// const PORT = 3000;
require('dotenv').config();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('questions and answers!');
});

app.get('/qa/questions', (req, res) => {
  res.status(200).json({ data: sampleData.sampleQuestionData71697 });
});

module.exports = app;
