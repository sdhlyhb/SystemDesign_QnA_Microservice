DROP DATABASE IF EXISTS sdc_qna WITH (FORCE);
CREATE DATABASE sdc_qna;

\c sdc_qna


CREATE TABLE IF NOT EXISTS "questions" (
  "id" int PRIMARY KEY,
  "product_id" int,
  "question_body" varchar(1000) NOT NULL,
  "question_date" bigint,
  "asker_name" varchar(255) NOT NULL,
  "asker_email" varchar(255) NOT NULL,
  "reported" int DEFAULT 0,
  "helpfulness" int DEFAULT 0

);

CREATE TABLE IF NOT EXISTS "answers" (
  "id" int PRIMARY KEY,
  "question_id" int,
  "answer_body" varchar(1000) NOT NULL,
  "answer_date" bigint,
  "answerer_name" varchar(255) NOT NULL,
  "answerer_email" varchar(255) NOT NULL,
  "answer_reported" int DEFAULT 0,
  "answer_helpfulness" int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "photos" (
  "id" int PRIMARY KEY,
  "answer_id" int,
  "photo_url" varchar(255)
);

ALTER TABLE "answers" ADD FOREIGN KEY ("question_id") REFERENCES "questions" ("id");

ALTER TABLE "photos" ADD FOREIGN KEY ("answer_id") REFERENCES "answers" ("id");

\copy questions from '/Users/serenah/Desktop/HackReactor/SDC/CSV/questions.csv' DELIMITER ',' CSV HEADER;
\copy answers from '/Users/serenah/Desktop/HackReactor/SDC/CSV/answers.csv' DELIMITER ',' CSV HEADER;
\copy photos from '/Users/serenah/Desktop/HackReactor/SDC/CSV/answers_photos.csv' DELIMITER ',' CSV HEADER;

ALTER TABLE questions ALTER COLUMN question_date SET DATA TYPE timestamp with time zone USING to_timestamp(question_date/1000);
ALTER TABLE questions ALTER COLUMN question_date SET DEFAULT now();
ALTER TABLE questions ALTER COLUMN reported DROP DEFAULT;
ALTER TABLE questions ALTER COLUMN reported  TYPE bool USING CASE WHEN reported = 0 THEN FALSE ELSE TRUE END;
ALTER TABLE questions ALTER COLUMN reported SET DEFAULT false;



ALTER TABLE answers ALTER COLUMN answer_date SET DATA TYPE timestamp with time zone USING to_timestamp(answer_date/1000);
ALTER TABLE answers ALTER COLUMN answer_date SET DEFAULT now();
ALTER TABLE answers ALTER COLUMN answer_reported DROP DEFAULT;
ALTER TABLE answers ALTER COLUMN answer_reported  TYPE bool USING CASE WHEN answer_reported = 0 THEN FALSE ELSE TRUE END;
ALTER TABLE answers ALTER COLUMN answer_reported SET DEFAULT false;








CREATE INDEX idx_product_id ON questions(product_id);
CREATE INDEX fk_answer_question_id ON answers(question_id);
CREATE INDEX fk_photos_answer_id ON photos(answer_id);