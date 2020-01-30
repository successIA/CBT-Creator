import React from "react";
import { connect } from "react-redux";
import {
  createQuestion,
  hideModal,
  saveQuestion,
  changeQuestionType
} from "../../actions";
import QuestionForm from "../../components/QuestionForm";
import withQuestionType from "../../hoc/withQuestionType";

class CreateQuestion extends React.Component {
  handleSubmit = newQuestion => {
    this.props.createQuestion(newQuestion, newQuestion.topic);
  };

  handleModalClose = question => {
    this.props.saveQuestion(question);
    this.props.hideModal();
  };

  handleQuestionTypeChange = question => {
    this.props.changeQuestionType(question);
  };

  render() {
    const {
      question,
      isSubmitting,
      saveSuccess,
      validationError,
      singleTypeQuestion,
      multipleTypeQuestion
    } = this.props;

    return (
      <QuestionForm
        saveSuccess={saveSuccess}
        error={validationError}
        question={question}
        onQuestionTypeChange={this.handleQuestionTypeChange}
        modalTitle="Add Question"
        onHideModal={this.handleModalClose}
        onSubmit={this.handleSubmit}
        isSubmitting={isSubmitting}
        modalSubmitText="Create"
        shouldResetForm={true}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { body, question_type, choices } = state.question;
  const question = {
    topic: ownProps.topic,
    body,
    question_type,
    choices
  };
  return {
    question,
    // singleTypeQuestion: state.question.singleType,
    // multipleTypeQuestion: state.question.multipleType,
    isSubmitting: state.question.isSubmitting,
    saveSuccess: state.question.saveSuccess,
    validationError: state.question.validationError
  };
};

const mapDispatchToProps = {
  hideModal,
  createQuestion,
  saveQuestion,
  changeQuestionType
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateQuestion);
