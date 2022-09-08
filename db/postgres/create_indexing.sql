CREATE INDEX idx_product_id ON questions(product_id);
CREATE INDEX fk_answer_question_id ON answers(question_id);
CREATE INDEX fk_photos_answer_id ON photos(answer_id);