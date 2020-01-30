import React from "react";
import { connect } from "react-redux";
import { createQuestion, hideModal } from "../../actions";
import QuestionForm from "../../components/QuestionForm";
import withQuestionType from "../../hoc/withQuestionType";

class CreateQuestion extends React.Component {
  handleSubmit = newQuestion => {
    this.props.createQuestion(newQuestion, newQuestion.topic);
  };

  render() {
    const {
      isSubmitting,
      saveSuccess,
      validationError,
      question,
      singleTypeQuestion,
      multipleTypeQuestion,
      hideModal
    } = this.props;

    return (
      <QuestionForm
        saveSuccess={saveSuccess}
        error={validationError}
        question={question}
        singleTypeQuestion={singleTypeQuestion}
        multipleTypeQuestion={multipleTypeQuestion}
        modalTitle="Add Question"
        hideModal={hideModal}
        onSubmit={this.handleSubmit}
        isSubmitting={isSubmitting}
        modalSubmitText="Create"
        shouldResetForm={true}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    isSubmitting: state.question.isSubmitting,
    saveSuccess: state.question.saveSuccess,
    validationError: state.question.validationError
  };
};

const mapDispatchToProps = {
  hideModal,
  createQuestion
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withQuestionType(CreateQuestion));
