import React from "react";
import { Modal, Form, Input, Tabs, Button, message } from "antd";
import ChoiceInputList from "../ChoiceInputList";
import { INITIAL_CHOICE_STATE, INITIAL_QUESTION_STATE } from "../../constants";

const { TextArea } = Input;
const { TabPane } = Tabs;

const MINIMUM_CHOICE_COUNT = 2;

export default class QuestionForm extends React.Component {
  constructor(props) {
    super(props);
    const { topic, body, question_type, choices } = this.props.question;
    this.state = {
      topic,
      body,
      question_type,
      choices
    };
    this.singleTypeQuestionState = this.props.singleTypeQuestion;
    this.multipleTypeQuestionState = this.props.multipleTypeQuestion;
  }

  componentDidUpdate(prevProps) {
    const deletedChoiceId = this.props.deletedChoiceId;
    if (deletedChoiceId && deletedChoiceId !== prevProps.deletedChoiceId) {
      this.deleteChoiceById(deletedChoiceId);
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

    if (choiceToDelete.id) {
      this.props.onChoiceDelete(choiceToDelete);
    } else {
      this.setState({
        choices: this.state.choices.filter((choice, i) => i !== index)
      });
    }
  };

  deleteChoiceById = id => {
    this.setState({
      choices: this.state.choices.filter(choice => choice.id !== id)
    });
  };

  checkChoicesValidity = choices => {
    let isValid = true;
    let hasSelectedAnAnswer = false;
    let hasAnswerWithEmptyBody = false;
    let numOfEnteredChoices = 0;
    choices.map((choice, index, array) => {
      if (choice.body.trim().length) ++numOfEnteredChoices;
      if (choice.is_answer) hasSelectedAnAnswer = choice.is_answer;
      if (choice.is_answer && !choice.body.trim().length) {
        hasAnswerWithEmptyBody = true;
      }
      if (index === array.length - 1) {
        if (numOfEnteredChoices < 2) {
          message.error("Minimum of two vaild choices are required");
          isValid = false;
        } else if (hasAnswerWithEmptyBody) {
          message.error("The correct choice must have a label");
          isValid = false;
        } else if (index === array.length - 1 && !hasSelectedAnAnswer) {
          message.error("You must select a correct answer");
          isValid = false;
        }
      }
      return choice;
    });
    return isValid;
  };

  checkQuestionValidity = question => {
    if (!question.body.trim().length) {
      message.error("The body of the question is required.");
      return false;
    }
    return this.checkChoicesValidity(question.choices);
  };

  handleSubmit = () => {
    const unvalidatedQuestion = {
      body: this.state.body,
      question_type: this.state.question_type,
      choices: this.state.choices
    };

    if (this.checkQuestionValidity(unvalidatedQuestion)) {
      const cleanedChoices = this.state.choices.filter(
        choice => choice.body.trim().length
      );
      const validatedQuestion = {
        topic: this.state.topic,
        body: this.state.body,
        question_type: this.state.question_type,
        choices: cleanedChoices
      };
      this.props.onSubmit(validatedQuestion);
      if (this.props.shouldResetForm) this.resetForm();
    }
  };

  resetForm = () => {
    this.setState({
      ...INITIAL_QUESTION_STATE,
      question_type: this.state.question_type
    });
  };

  render() {
    return (
      <div>
        <Modal
          title={this.props.modalTitle}
          visible={true}
          onOk={this.handleSubmit}
          onCancel={this.props.hideModal}
          footer={[
            <Button key="back" onClick={this.props.hideModal}>
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
              </TabPane>
            </Tabs>
          </Form>
        </Modal>
      </div>
    );
  }
}
