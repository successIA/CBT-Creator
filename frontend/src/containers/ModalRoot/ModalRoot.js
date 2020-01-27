import React from "react";
// import TopicForm from "../../components/TopicForm/index";
import { connect } from "react-redux";
import * as constants from "../../constants";
import CreateTopic from "../CreateTopic";
import UpdateTopic from "../UpdateTopic";
import CreateQuestion from "../CreateQuestion";
import UpdateQuestion from "../UpdateQuestion/UpdateQuestion";

const MODAL_COMPONENTS = {
  [constants.CREATE_TOPIC]: CreateTopic,
  [constants.UPDATE_TOPIC]: UpdateTopic,
  [constants.CREATE_QUESTION]: CreateQuestion,
  [constants.UPDATE_QUESTION]: UpdateQuestion
};

class ModalRoot extends React.Component {
  render() {
    if (!this.props.modalType) return null;
    const ModalChild = MODAL_COMPONENTS[this.props.modalType];
    return <ModalChild {...this.props.modalProps} />;
  }
}

const mapStateToProps = state => ({
  modalType: state.modal.modalType,
  modalProps: state.modal.modalProps
});

export default connect(mapStateToProps)(ModalRoot);
