import React from "react";
import { connect } from "react-redux";
import { createTopic, hideModal } from "../../actions";
import TopicForm from "../../components/TopicForm";

class CreateTopic extends React.Component {
  handleSubmit = newTopic => {
    const topic = { ...newTopic };
    this.props.createTopic(topic);
  };

  render() {
    return (
      <TopicForm
        topic={this.props.topic}
        modalTitle="Add Topic"
        hideModal={this.props.hideModal}
        onSubmit={this.handleSubmit}
        isSubmitting={this.props.isSubmitting}
        modalSubmitText="Create"
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    isSubmitting: state.topic.isSubmitting
  };
};

export default connect(mapStateToProps, {
  hideModal,
  createTopic
})(CreateTopic);
