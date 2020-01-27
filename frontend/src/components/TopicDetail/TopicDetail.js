import React from "react";
import { Row, Col, Spin } from "antd";
import QuestionDetail from "../QuestionDetail";
import TopicDetailHeader from "../TopicDetailHeader";
import * as constants from "../../constants";

const TopicDetail = ({
  isLoading,
  slug,
  title,
  questions,
  fetchError,
  showModal,
  deleteQuestion
}) => {
  const handleQuestionEdit = questionToEdit => {
    showModal(constants.UPDATE_QUESTION, {
      question: questionToEdit
    });
  };

  const handleQuestionDelete = questionToDelete => {
    deleteQuestion(questionToDelete.id, questionToDelete.topic);
  };

  if (isLoading) {
    return (
      <div>
        <div className="spinner-wrapper">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div>
        <Row>
          <Col
            span={16}
            offset={4}
            style={{ textAlign: "center", height: "57vh", marginTop: "35vh" }}
          >
            <h2>It seems that the server is down. Try again later.</h2>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <Row>
      <Col span={12} offset={2}>
        <TopicDetailHeader slug={slug} title={title} showModal={showModal} />
        {questions.map(question => (
          <QuestionDetail
            key={question.id}
            question={question}
            onEditClick={handleQuestionEdit}
            onDeleteClick={handleQuestionDelete}
          />
        ))}
      </Col>
    </Row>
  );
};

export default TopicDetail;
