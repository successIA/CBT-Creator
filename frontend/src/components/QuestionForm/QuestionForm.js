import React from "react";
import { Modal, Form, Input, Tabs, Button, message } from "antd";
import ChoiceInputList from "../ChoiceInputList";
import { INITIAL_CHOICE_STATE, INITIAL_QUESTION_STATE } from "../../constants";
// import getFirstMessage from "../../utils/getFirstMessage";

const { TextArea } = Input;
const { TabPane } = Tabs;

const MINIMUM_CHOICE_COUNT = 2;

export default class QuestionForm extends React.Component {
  // constructor(props) {
  //   super(props);
  //   const { topic, body, question_type, choices } = this.props.question;
  //   this.state = {
  //     topic,
  //     body,
  //     question_type,
  //     choices,
  //     error: null
  //   };
  //   this.singleTypeQuestionState = this.props.singleTypeQuestion;
  //   this.multipleTypeQuestionState = this.props.multipleTypeQuestion;
  // }

  state = {
    topic: this.props.question.topic,
    body: this.props.question.body,
    question_type: this.props.question.question_type,
    choices: this.props.question.choices,
    error: null
  };

  componentDidUpdate(prevProps) {
    console.log("prevProps:", prevProps);
    console.log("this.props:", this.props);
    const { question, error, saveSuccess, shouldResetForm } = this.props;
    if (question && question.id !== prevProps.question.id) {
      this.setState({
        body: question.body,
        question_type: question.question_type,
        choices: question.choices,
        error: null
      });
    } else if (
      question &&
      question.question_type !== prevProps.question.question_type
    ) {
      this.setState({
        body: question.body,
        question_type: question.question_type,
        choices: question.choices,
        error: null
      });
    }
    if (error && error !== prevProps.error) {
      // message.error(getFirstMessage(error));
      this.setState({
        ...this.state,
        error
      });
    } else if (saveSuccess && saveSuccess !== prevProps.saveSuccess) {
      if (shouldResetForm) {
        this.resetForm();
      }
    }
  }

  handleBodyChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleChoiceBodyChange = (e, index) => {
    this.setState({
      choices: this.state.choices.map((choice, i) =>
        index === i ? { ...choice, body: e.target.value } : choice
      )
    });
  };

  handleChoiceControlChange = (e, value) => {
    this.setState({
      choices: this.state.choices.map((choice, i) =>
        i === value
          ? { ...choice, is_answer: e.target.checked }
          : e.target.type === "radio"
          ? { ...choice, is_answer: false }
          : choice
      )
    });
  };

  handleTabChange = key => {
    const question = {
      topic: this.state.topic,
      body: this.state.body,
      question_type: this.state.question_type,
      choices: [...this.state.choices]
    };
    this.props.onQuestionTypeChange(question);
    // if (key === "multiple") {
    //   this.singleTypeQuestionState = this.state;
    //   this.setState({
    //     ...this.multipleTypeQuestionState
    //   });
    // } else if (key === "single") {
    //   this.multipleTypeQuestionState = this.state;
    //   this.setState({
    //     ...this.singleTypeQuestionState
    //   });
    // }
  };

  handleChoiceAdd = (index, top) => {
    const newChoices = [...this.state.choices];
    if (top) {
      newChoices.splice(index, 0, INITIAL_CHOICE_STATE);
    } else {
      newChoices.splice(index + 1, 0, INITIAL_CHOICE_STATE);
    }
    this.setState({
      choices: newChoices
    });
  };

  handleChoiceDelete = (index, choiceToDelete) => {
    if (this.state.choices.length === MINIMUM_CHOICE_COUNT) {
      message.error("A question should have at least two choices");
      return;
    }

    this.setState({
      choices: this.state.choices.filter((choice, i) => i !== index)
    });
  };

  handleSubmit = () => {
    const question = {
      topic: this.state.topic,
      body: this.state.body,
      question_type: this.state.question_type,
      choices: [...this.state.choices]
    };
    this.props.onSubmit(question);
  };

  resetForm = () => {
    this.setState({
      ...INITIAL_QUESTION_STATE,
      question_type: this.state.question_type,
      error: null
    });
  };

  handleModalClose = () => {
    const question = {
      topic: this.state.topic,
      body: this.state.body,
      question_type: this.state.question_type,
      choices: [...this.state.choices]
    };
    this.props.onHideModal(question);
  };

  render() {
    console.log(this.props);

    const bodyErrorSpan =
      this.state.error && this.state.error.body ? (
        <p style={{ color: "#ff4d4f" }}>{this.state.error.body}</p>
      ) : null;

    const choiceErrorSpan =
      this.state.error && this.state.error.choices ? (
        <div style={{ color: "#ff4d4f" }}>{this.state.error.choices}</div>
      ) : null;

    return (
      <div>
        <Modal
          title={this.props.modalTitle}
          visible={true}
          onOk={this.handleSubmit}
          onCancel={this.handleModalClose}
          footer={[
            <Button key="back" onClick={this.handleModalClose}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={this.props.isSubmitting}
              onClick={this.handleSubmit}
            >
              {this.props.modalSubmitText}
            </Button>
          ]}
        >
          <Form>
            <h4>Body</h4>
            <TextArea
              rows={4}
              name="body"
              value={this.state.body}
              onChange={this.handleBodyChange}
            />
            {bodyErrorSpan}
            <Tabs
              defaultActiveKey={this.state.question_type}
              onChange={this.handleTabChange}
              style={{ marginTop: 8 }}
            >
              <TabPane tab="Single" key="single">
                {this.state.choices.length && (
                  <ChoiceInputList
                    type="single"
                    choices={this.state.choices}
                    onChoiceControlChange={this.handleChoiceControlChange}
                    onChoiceBodyChange={this.handleChoiceBodyChange}
                    onChoiceAdd={this.handleChoiceAdd}
                    onChoiceDelete={this.handleChoiceDelete}
                  />
                )}
                {choiceErrorSpan}
              </TabPane>
              <TabPane tab="Multiple" key="multiple">
                {this.state.choices.length && (
                  <ChoiceInputList
                    type="multiple"
                    choices={this.state.choices}
                    onChoiceControlChange={this.handleChoiceControlChange}
                    onChoiceBodyChange={this.handleChoiceBodyChange}
                    onChoiceAdd={this.handleChoiceAdd}
                    onChoiceDelete={this.handleChoiceDelete}
                  />
                )}
                {choiceErrorSpan}
              </TabPane>
            </Tabs>
          </Form>
        </Modal>
      </div>
    );
  }
}
