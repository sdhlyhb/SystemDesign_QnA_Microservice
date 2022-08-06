DROP DATABASE IF EXISTS sdc_QnA;
CREATE DATABASE sdc_QnA;



CREATE TABLE IF NOT EXISTS "questions" (
  "id" int PRIMARY KEY,
  "product_id" int,
  "question_body" mediumtext NOT NULL,
  "question_date" timestamp DEFAULT (now()),
  "asker_name" varchar(255) NOT NULL,
  "asker_email" varchar(255) NOT NULL,
  "helpfulness" int DEFAULT 0,
  "reported" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "answers" (
  "id" int PRIMARY KEY,
  "question_id" int,
  "answer_body" mediumtext NOT NULL,
  "answer_date" timestamp DEFAULT (now()),
  "answerer_name" varchar(255) NOT NULL,
  "answerer_email" varchar(255) NOT NULL,
  "answer_helpfulness" int DEFAULT 0,
  "answer_reported" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "photos" (
  "id" int PRIMARY KEY,
  "answer_id" int,
  "photo_url" varchar(255)
);

ALTER TABLE "answers" ADD FOREIGN KEY ("question_id") REFERENCES "questions" ("id");

ALTER TABLE "photos" ADD FOREIGN KEY ("answer_id") REFERENCES "answers" ("id");
