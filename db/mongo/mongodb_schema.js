/* eslint-disable camelcase */
const mongoose = require('mongoose');

let photosSchema = new mongoose.Schema({
  photo_id: {type: Number, unique: true},
  // answer_id: Number,
  photo_url: String
});

let answersSchema = new mongoose.Schema({
  answer_id: {type: Number, unique: true},
  // question_id: Number,
  answer_body: String,
  answer_date: {type: Date, default: Date.now},
  answerer_name: String,
  answerer_email: String,
  answer_helpfulness: {type: Number, default: 0},
  answer_reported: {type: Boolean, default: false},
  photos: [photosSchema]


});

let questionsSchema = new mongoose.Schema({
  question_id: {type: Number, unique: true},
  product_id: Number,
  question_body: String,
  question_date: {type: Date, default: Date.now},
  asker_name: String,
  asker_email: String,
  question_helpfulness: {type: Number, default: 0},
  question_reported: {type: Boolean, default: false},
  answers: [answersSchema]


});

const Photos = mongoose.model('Photos', photosSchema);
const Answers = mongoose.model('Answers', answersSchema);
const Questions = mongoose.modal('Questions', questionsSchema);