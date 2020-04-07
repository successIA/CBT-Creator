import React from "react";
import { Modal, Form, Input, Tabs, Button, message } from "antd";
import ChoiceInputList from "../ChoiceInputList";
import { INITIAL_CHOICE_STATE, INITIAL_QUESTION_STATE } from "../../constants";
// import getFirstMessage from "../../utils/getFirstMessage";

const { TextArea } = Input;
const { TabPane } = Tabs;

const MINIMUM_CHOICE_COUNT = 2;

export default class QuestionForm extends React.Component {
  constructor(props) {
    super(props);
    const { topic, body, question_type, choices, error } = this.props.question;
    this.state = {
      topic,
      body,
      question_type,
      choices,
      error
    };
    this.singleTypeQuestionState = this.props.singleTypeQuestion;
    this.multipleTypeQuestionState = this.props.multipleTypeQuestion;
  }

  componentDidUpdate(prevProps) {
    const { error, saveSuccess, shouldResetForm } = this.props;
    if (error && error !== prevProps.error) {
      // message.error(getFirstMessage(error));
      this.setState({
        ...this.state,
        error
      });
    } else if (saveSuccess && saveSuccess !== prevProps.saveSuccess) {
      if (shouldResetForm) {
        this.resetForm();
        this.props.resetQuestion();
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
    if (key === "multiple") {
      this.singleTypeQuestionState = this.state;
      this.setState({
        ...this.multipleTypeQuestionState
      });
    } else if (key === "single") {
      this.multipleTypeQuestionState = this.state;
      this.setState({
        ...this.singleTypeQuestionState
      });
    }
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

  handleCancel = () => {
    const question = {
      topic: this.state.topic,
      body: this.state.body,
      question_type: this.state.question_type,
      choices: [...this.state.choices],
      error: this.state.error
    };
    this.props.saveQuestion(
      question,
      this.singleTypeQuestionState,
      this.multipleTypeQuestionState
    );
    this.props.hideModal();
  };

  render() {
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
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
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
