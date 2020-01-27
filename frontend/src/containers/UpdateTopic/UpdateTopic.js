import React from "react";
import { connect } from "react-redux";
import { updateTopic, hideModal } from "../../actions";
import TopicForm from "../../components/TopicForm";

class UpdateTopic extends React.Component {
  handleSubmit = editedTopic => {
    const topic = { ...this.props.topic, ...editedTopic };
    this.props.updateTopic(topic.slug, topic);
  };

  componentDidUpdate(prevProps) {
    const { saveSuccess } = this.props;
    if (saveSuccess !== prevProps.saveSuccess) {
      if (saveSuccess) this.props.hideModal();
    }
  }

  render() {
    return (
      <TopicForm
        topic={this.props.topic}
        modalTitle="Edit Topic"
        hideModal={this.props.hideModal}
        onSubmit={this.handleSubmit}
        isSubmitting={this.props.isSubmitting}
        modalSubmitText="Update"
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    isSubmitting: state.topic.isSubmitting,
    saveSuccess: state.topic.saveSuccess
  };
};

export default connect(mapStateToProps, {
  hideModal,
  updateTopic
})(UpdateTopic);
