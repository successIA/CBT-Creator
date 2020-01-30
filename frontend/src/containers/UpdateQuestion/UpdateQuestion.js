import React from "react";
import { connect } from "react-redux";
import {
  updateQuestion,
  hideModal,
  saveQuestion,
  changeQuestionType
} from "../../actions";
import QuestionForm from "../../components/QuestionForm";
import withQuestionType from "../../hoc/withQuestionType";
import { INITIAL_QUESTION_STATE } from "../../constants";

class UpdateQuestion extends React.Component {
  // constructor(props) {
  //   super(props);
  //   // const { topic, body, question_type, choices } = this.props.question;
  //   // this.questionToEdit = {
  //   //   topic,
  //   //   body,
  //   //   question_type,
  //   //   choices
  //   // };
  //   this.singleTypeQuestion = this.props.singleTypeQuestion;
  //   this.multipleTypeQuestion = this.props.multipleTypeQuestion;
  //   // this.updateQuestionTypes();
  // }

  componentDidMount() {
    this.props.saveQuestion(this.props.questionToEdit);
  }

  handleModalClose = question => {
    this.props.saveQuestion(INITIAL_QUESTION_STATE);
    this.props.hideModal();
  };

  handleQuestionTypeChange = question => {
    this.props.changeQuestionType(question);
  };

  // updateQuestionTypes = () => {
  //   if (this.questionToEdit.question_type === "single") {
  //     this.singleTypeQuestion = this.questionToEdit;
  //   } else if (this.questionToEdit.question_type === "multiple") {
  //     this.multipleTypeQuestion = this.questionToEdit;
  //   }
  // };

  handleSubmit = editedQuestion => {
    editedQuestion = {
      ...editedQuestion,
      id: this.props.question.id,
      choices: editedQuestion.choices.map(choice =>
        !choice.id ? { ...choice, id: 0 } : choice
      )
    };

    this.props.updateQuestion(
      editedQuestion.id,
      editedQuestion,
      editedQuestion.topic
    );
  };

  componentDidUpdate(prevProps) {
    const { saveSuccess } = this.props;
    if (prevProps.saveSuccess !== saveSuccess) {
      if (saveSuccess) this.props.hideModal();
    }
  }

  render() {
    const {
      question,
      saveSuccess,
      validationError,
      hideModal,
      deletedChoiceId,
      isSubmitting
    } = this.props;

    return (
      <QuestionForm
        saveSuccess={saveSuccess}
        error={validationError}
        question={question}
        onQuestionTypeChange={this.handleQuestionTypeChange}
        modalTitle="Edit Question"
        onHideModal={this.handleModalClose}
        deletedChoiceId={deletedChoiceId}
        onSubmit={this.handleSubmit}
        isSubmitting={isSubmitting}
        modalSubmitText="Update"
        shouldResetForm={false}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { body, question_type, choices } = state.question;
  const question = {
    id: ownProps.questionToEdit.id,
    topic: ownProps.questionToEdit.topic,
    body,
    question_type,
    choices
  };
  return {
    question,
    isSubmitting: state.question.isSubmitting,
    deletedChoiceId: state.question.deletedChoiceId,
    saveSuccess: state.question.saveSuccess,
    validationError: state.question.validationError
  };
};

const mapDispatchToProps = {
  hideModal,
  updateQuestion,
  saveQuestion,
  changeQuestionType
};
export default connect(mapStateToProps, mapDispatchToProps)(UpdateQuestion);
