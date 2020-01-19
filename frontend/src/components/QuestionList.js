import React from "react";
import axios from "axios";
import { Row, Col, message, Spin } from "antd";
import { QuestionForm } from "./QuestionForm";
import { QuestionDetail } from "./QuestionDetail";
import * as Constants from "../constants";

export const QuestionList = props => {
  const [questions, setQuestions] = React.useState([]);
  const [questionFormVisible, setQuestionFormVisible] = React.useState(false);
  const [questionToEdit, setQuestionToEdit] = React.useState(null);

  if (Array.isArray(questions) && !questions.length) {
    const slug = props.match.params.slug;
    const url = `${Constants.BASE_TOPIC_DETAIL_URL}${slug}/questions/`;
    axios
      .get(url)
      .then(res => {
        setQuestions(res.data);
        console.log(res.data);
      })
      .catch(err => message.error("Something went wrong"));
  }

  const handleQuestionAdd = (question, setQuestionSubmitLoading) => {
    setQuestions([...questions, question]);
    setQuestionSubmitLoading(false);
    message.success("Question Added Successfully!");
  };

  const handleQuestionUpdate = (questionToEdit, setQuestionSubmitLoading) => {
    updateQuestion(questionToEdit);
    message.success("Question Updated Successfully!");
    setQuestionSubmitLoading(false);
  };

  const handleQuestionChoiceDelete = questionToEdit => {
    updateQuestion(questionToEdit);
  };

  const updateQuestion = questionToEdit => {
    const newQuestions = questions.map(question => {
      if (question.id === questionToEdit.id) {
        question = questionToEdit;
      }
      return question;
    });
    setQuestions(newQuestions);
  };

  const handleQuestionDelete = questionToDelete => {
    const url = `${Constants.BASE_QUESTION_DELETE_URL}${questionToDelete.id}`;
    axios
      .delete(url)
      .then(res => {
        message.success("Question deleted successfully");
        const newQuestions = questions.filter(question => {
          return question.id !== questionToDelete.id;
        });
        setQuestions(newQuestions);
      })
      .catch(err => message.error("Something went wrong"));
  };

  const hideQuestionForm = () => {
    setQuestionToEdit(null);
    setQuestionFormVisible(false);
  };

  return (
    <div>
      {questions == undefined || !questions.length ? (
        <Row>
          <Col span={12} offset={2}>
            <div
              className="spinner-wrapper"
              style={{ height: "80vh", width: 680 }}
            >
              <Spin size="large" />
            </div>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col span={12} offset={2}>
            {questions.map(question => (
              <QuestionDetail
                key={question.id}
                question={question}
                onEditClick={setQuestionToEdit}
                onDeleteClick={handleQuestionDelete}
              />
            ))}

            {questionFormVisible || questionToEdit ? (
              <QuestionForm
                visible={true}
                slug={props.match.params.slug}
                questionToEdit={questionToEdit}
                onHideForm={hideQuestionForm}
                onSubmitSuccess={
                  questionToEdit ? handleQuestionUpdate : handleQuestionAdd
                }
                onChoiceDeleteSuccess={
                  questionToEdit ? handleQuestionChoiceDelete : null
                }
              />
            ) : null}
          </Col>
        </Row>
      )}
    </div>
  );
};
