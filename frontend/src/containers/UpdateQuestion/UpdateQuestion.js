import React from "react";
import { connect } from "react-redux";
import { updateQuestion, deleteChoice, hideModal } from "../../actions";
import QuestionForm from "../../components/QuestionForm";
import withQuestionType from "../../hoc/withQuestionType";

class UpdateQuestion extends React.Component {
  constructor(props) {
    super(props);
    const { topic, body, question_type, choices } = this.props.question;
    this.questionToEdit = {
      topic,
      body,
      question_type,
      choices
    };
    this.singleTypeQuestion = this.props.singleTypeQuestion;
    this.multipleTypeQuestion = this.props.multipleTypeQuestion;
    this.updateQuestionTypes();
  }

  updateQuestionTypes = () => {
    if (this.questionToEdit.question_type === "single") {
      this.singleTypeQuestion = this.questionToEdit;
    } else if (this.questionToEdit.question_type === "multiple") {
      this.multipleTypeQuestion = this.questionToEdit;
    }
  };

  handleChoiceDelete = choiceToDelete => {
    this.props.deleteChoice(choiceToDelete.id, this.props.question.topic);
  };

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
    const { hideModal, deletedChoiceId, isSubmitting } = this.props;

    return (
      <QuestionForm
        question={this.questionToEdit}
        singleTypeQuestion={this.singleTypeQuestion}
        multipleTypeQuestion={this.multipleTypeQuestion}
        modalTitle="Edit Question"
        hideModal={hideModal}
        onChoiceDelete={this.handleChoiceDelete}
        deletedChoiceId={deletedChoiceId}
        onSubmit={this.handleSubmit}
        isSubmitting={isSubmitting}
        modalSubmitText="Update"
        shouldResetForm={false}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    isSubmitting: state.question.isSubmitting,
    deletedChoiceId: state.question.deletedChoiceId,
    saveSuccess: state.question.saveSuccess
  };
};

const mapDispatchToProps = {
  hideModal,
  updateQuestion,
  deleteChoice
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withQuestionType(UpdateQuestion));