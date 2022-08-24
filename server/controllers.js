/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
const models = require('./models');

// get questions:
const getQuestions = async (req, res) => {
  try {
    const { product_id } = req.query;
    const count = req.query.count || 5;
    const page = req.query.page || 1;
    const formatted = {};
    formatted.product_id = product_id;
    const getQReponse = await models.getQuestions(product_id, count, page);
    const questionInfo = getQReponse.rows;
    formatted.results = questionInfo;
    const answersInfoPromises = questionInfo.map((question) => {
      const { question_id } = question;
      const page_q = 1;
      const count_q = 10;
      return models.getAnswersResults(question_id, count_q, page_q);
    });
    const answersResponse = await Promise.all(answersInfoPromises);
    const answers = answersResponse.map((obj) => obj.rows);
    for (let i = 0; i < answers.length; i++) {
      if (!answers[i].length) {
        formatted.results[i].answers = {};
      } else {
        formatted.results[i].answers = {};
        answers[i].forEach((ans) => {
          const id = ans.answer_id;
          ans.id = id;
          delete ans.answer_id;
          if (ans.photos) {
            const urls = ans.photos.map((urlObj) => urlObj.url);
            ans.photos = urls;
          }
          formatted.results[i].answers[id] = ans;
        });
      }
    }

    // console.log(formatted);

    res.status(200).send(formatted);
  } catch (err) {
    res.status(500).send('Error: invalid info provided!');
  }
};

const getAnswers = (req, res) => {
  const { question_id } = req.params;
  const count = req.query.count || 5;
  const page = req.query.page || 1;
  const formatted = {};
  models.getAnswersResults(question_id, count, page)
    .then((response) => {
      // console.log(`this is test display for question_id ${question_id}:`, response.rows);
      formatted.question = question_id;
      formatted.page = page;
      formatted.count = count;
      formatted.results = response.rows;
      res.status(200).send(formatted);
    }).catch((err) => res.status(500).send(err));
};

const addAQuestion = (req, res) => {
  const dataObj = req.body;
  models.addAQuestion(dataObj.product_id, dataObj.body, dataObj.name, dataObj.email)
    .then((response) => {
      res.status(201).send('Question added!');
    }).catch((err) => res.status(500).send(err));
};

const addAnswer = async (req, res) => {
  try {
    const dataObj = req.body;
    const { question_id } = req.params;
    const {
      body, name, email, photos,
    } = dataObj;
    const results = await models.addAnswer_withoutPhotos(question_id, body, name, email);
    const answer_id = results.rows[0].id;
    if (photos.length) {
      const addPhotosRes = await models.addPhotos(answer_id, photos);
    }

    res.status(201).send('Answer added!');
  } catch (err) {
    res.status(500).send(err);
  }
};

const voteQuestionHelpful = (req, res) => {
  // console.log(req.params);
  const { question_id } = req.params;
  models.voteQuestionHelpful(question_id)
    .then((response) => {
      console.log(response);
      res.status(204).send('Question voted helpful!');
    }).catch((err) => res.status(500).send(err));
};

const reportQuestion = (req, res) => {
  console.log(req.params);
  const { question_id } = req.params;
  models.reportQuestion(question_id)
    .then((response) => {
      // console.log(response);
      res.status(204).send('Question is reported!');
    }).catch((err) => res.status(500).send(err));
};

const voteAnswerHelpful = (req, res) => {
  console.log(req.params);
  const { answer_id } = req.params;
  models.voteAnswerHelpful(answer_id)
    .then((response) => {
      // console.log(response);
      res.status(204).send('Answer voted helpful!');
    }).catch((err) => res.status(500).send(err));
};

const reportAnswer = (req, res) => {
  console.log(req.params);
  const { answer_id } = req.params;
  models.reportAnswer(answer_id)
    .then((response) => {
      // console.log(response);
      res.status(204).send('Answer is reported!');
    }).catch((err) => res.status(500).send(err));
};

// test display upto 5 results with product_id = 1, reported = false
// const displayQuestionTest = (req, res) => {
//   const product_id = 1;
//   const count = 5;
//   models.displayQuestionTest(product_id, count)
//     .then((response) => {
//       console.log('this is test display for product_id 1:', response);
//       res.status(200).send(response.rows);
//     }).catch((err) => res.status(500).send(err));
// };

// const displayAnswersTest = (req, res) => {
//   const question_id = 36;
//   const count = 15;
//   const page = 1;
//   const formatted = {};
//   models.getAnswersResults(question_id, count, page)
//     .then((response) => {
//       console.log('this is test display for question_id 5:', response.rows);
//       formatted.question = question_id;
//       formatted.page = page;
//       formatted.count = count;
//       formatted.results = response.rows;
//       res.status(200).send(formatted);
//     }).catch((err) => res.status(500).send(err));
// };

module.exports = {
  getQuestions,
  getAnswers,
  addAQuestion,
  addAnswer,
  voteQuestionHelpful,
  reportQuestion,
  voteAnswerHelpful,
  reportAnswer,
  // displayQuestionTest,
  // displayAnswersTest,
};
