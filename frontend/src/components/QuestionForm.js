import React from "react";
import axios from "axios";
import { Modal, Form, Input, Tabs, Button, message } from "antd";
import { ChoiceInputList } from "./ChoiceInputList";
import * as Constants from "../constants";

const { TextArea } = Input;
const { TabPane } = Tabs;

export const QuestionForm = ({
  slug,
  questionToEdit,
  visible,
  onHideForm,
  onSubmitSuccess,
  onChoiceDeleteSuccess
}) => {
  let initialSingleTypeQuestion = {
    topic: slug,
    body: "",
    choices: [],
    question_type: "single"
  };

  let initialMultipleTypeQuestion = {
    ...initialSingleTypeQuestion,
    question_type: "multiple"
  };

  let initialQuestion = initialSingleTypeQuestion;
  let initialChoice = {
    body: "",
    is_answer: false
  };
  const defaultInitialChoiceCount = 5;
  const MINIMUM_CHOICE_COUNT = 2;
  let initialChoiceCount = defaultInitialChoiceCount;

  if (questionToEdit) {
    initialQuestion = questionToEdit;
    initialChoice = {
      id: 0,
      body: "",
      is_answer: false
    };
    initialChoiceCount = questionToEdit.choices.length;

    if (questionToEdit.question_type === "single") {
      initialSingleTypeQuestion = questionToEdit;
      initialMultipleTypeQuestion = {
        ...initialMultipleTypeQuestion,
        id: questionToEdit.id
      };
    } else if (questionToEdit.question_type === "multiple") {
      initialMultipleTypeQuestion = questionToEdit;
      initialSingleTypeQuestion = {
        ...initialSingleTypeQuestion,
        id: questionToEdit.id
      };
    }
  }

  const [question, setQuestion] = React.useState(initialQuestion);
  const [choiceCount, setChoiceCount] = React.useState(initialChoiceCount);
  const [questionSubmitLoading, setQuestionSubmitLoading] = React.useState(
    false
  );

  const [savedSingleTypeQuestion, setSavedSingleTypeQuestion] = React.useState(
    initialSingleTypeQuestion
  );

  const [
    savedMultipleTypeQuestion,
    setSavedMultipleTypeQuestion
  ] = React.useState(initialMultipleTypeQuestion);

  if (!question.choices.length) {
    const choiceList = [];
    for (let i = 0; i < choiceCount; i++) {
      choiceList.push(initialChoice);
    }
    const newQuestion = { ...question };
    newQuestion.choices = choiceList;
    setQuestion(newQuestion);
  }

  const handleQuestionTypeValueTabChange = key => {
    if (key === "multiple") {
      setStateBeforeMultipleTypeQuestionTabEnter();
    } else if (key === "single") {
      setStateBeforeSingleTypeQuestionTabEnter();
    }
  };

  const setStateBeforeMultipleTypeQuestionTabEnter = () => {
    setSavedSingleTypeQuestion(question);
    const count =
      savedMultipleTypeQuestion.choices.length || defaultInitialChoiceCount;
    setChoiceCount(count);
    setQuestion(savedMultipleTypeQuestion);
  };

  const setStateBeforeSingleTypeQuestionTabEnter = () => {
    setSavedMultipleTypeQuestion(question);
    const count =
      savedSingleTypeQuestion.choices.length || defaultInitialChoiceCount;
    setChoiceCount(count);
    setQuestion(savedSingleTypeQuestion);
  };

  const handleSubmit = e => {
    if (checkQuestionValidity()) {
      const newQuestion = { ...question };
      newQuestion.choices = getCleanedChoices();
      if (question.id) {
        updateQuestion(newQuestion);
      } else {
        createQuestion(newQuestion);
      }
    }
  };

  const getCleanedChoices = () => {
    const cleanedChoices = question.choices.filter(choice => {
      if (!choice.body.trim().length) return false;
      return true;
    });
    return cleanedChoices;
  };

  const checkQuestionValidity = () => {
    if (!question.body.trim().length) {
      message.error("The body of the question is required.");
      return false;
    }
    return checkChoicesValidity();
  };

  const checkChoicesValidity = () => {
    let isValid = true;
    let hasSelectedAnAnswer = false;
    let hasAnswerWithEmptyBody = false;
    let numOfEnteredChoices = 0;
    question.choices.map((choice, index, array) => {
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

  const updateQuestion = newQuestion => {
    setQuestionSubmitLoading(true);
    const url = `${Constants.BASE_QUESTION_UPDATE_URL}${newQuestion.id}/`;
    axios
      .put(url, newQuestion, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        onSubmitSuccess(res.data, setQuestionSubmitLoading);
        onHideForm();
      })
      .catch(err => {
        setQuestionSubmitLoading(false);
        message.error("Something went wrong");
      });
  };

  const createQuestion = newQuestion => {
    setQuestionSubmitLoading(true);
    const url = `${Constants.QUESTION_CREATE_URL}`;
    axios
      .post(url, newQuestion, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        onSubmitSuccess(res.data, setQuestionSubmitLoading);
        setChoiceCount(initialChoiceCount);
        setQuestion(initialQuestion);
      })
      .catch(err => {
        setQuestionSubmitLoading(false);
        message.error("Something went wrong");
      });
  };

  const handleQuestionBodyChange = e => {
    setQuestion({ ...question, body: e.target.value });
  };

  const handleChoiceBodyChange = (e, index) => {
    question.choices.map((choice, i) => {
      if (index === i) {
        const newQuestion = { ...question };
        const newChoice = { ...choice, body: e.target.value };
        newQuestion.choices[index] = newChoice;
        setQuestion(newQuestion);
      }
      return choice;
    });
  };

  const handleChoiceControlChange = (e, value) => {
    const newQuestion = { ...question };
    question.choices.map((choice, index) => {
      if (index === value) {
        newQuestion.choices[index] = { ...choice, is_answer: e.target.checked };
      } else if (e.target.type === "radio") {
        newQuestion.choices[index] = { ...choice, is_answer: false };
      }
      setQuestion(newQuestion);
      return choice;
    });
  };

  const handleChoiceAdd = (index, top) => {
    const newQuestion = { ...question };
    if (top) {
      newQuestion.choices.splice(index, 0, initialChoice);
    } else {
      newQuestion.choices.splice(index + 1, 0, initialChoice);
    }
    setChoiceCount(choiceCount + 1);
    setQuestion(newQuestion);
  };

  const handleChoiceDelete = (index, choiceToDelete = null) => {
    if (question.choices.length === MINIMUM_CHOICE_COUNT) {
      message.error("A question should have at least two choices");
      return;
    }
    if (choiceToDelete && choiceToDelete.id > 0) {
      const url = `${Constants.BASE_CHOICE_DELETE_URL}${choiceToDelete.id}`;
      axios
        .delete(url)
        .then(res => removeChoiceFromQuestionChoices(index, choiceToDelete))
        .catch(err => message.error("Something went wrong"));
    } else {
      removeChoiceFromQuestionChoices(index);
    }
  };

  const removeChoiceFromQuestionChoices = (index, choiceToDelete = null) => {
    const newQuestion = { ...question };
    const newChoices = newQuestion.choices.filter((choice, i) => {
      if (i === index) {
        setChoiceCount(choiceCount - 1);
        return false;
      }
      return true;
    });
    newQuestion.choices = newChoices;
    setQuestion(newQuestion);
    if (choiceToDelete) {
      onChoiceDeleteSuccess(newQuestion);
    }
  };

  return (
    <div>
      <Modal
        title="Add Question"
        visible={visible}
        onOk={handleSubmit}
        onCancel={onHideForm}
        footer={[
          <Button key="back" onClick={onHideForm}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={questionSubmitLoading}
            onClick={handleSubmit}
          >
            {questionToEdit ? "Update" : "Add"}
          </Button>
        ]}
      >
        <Form>
          <h4>Body</h4>
          <TextArea
            rows={4}
            value={question.body}
            onChange={handleQuestionBodyChange}
          />
          <Tabs
            defaultActiveKey={question.question_type}
            onChange={handleQuestionTypeValueTabChange}
            style={{ marginTop: 8 }}
          >
            <TabPane tab="Single" key="single">
              {question.choices.length && (
                <ChoiceInputList
                  question={question}
                  count={choiceCount}
                  onChoiceControlChange={handleChoiceControlChange}
                  onChoiceBodyChange={handleChoiceBodyChange}
                  onChoiceAdd={handleChoiceAdd}
                  onChoiceDelete={handleChoiceDelete}
                />
              )}
            </TabPane>
            <TabPane tab="Multiple" key="multiple">
              {question.choices.length && (
                <ChoiceInputList
                  question={question}
                  count={choiceCount}
                  onChoiceControlChange={handleChoiceControlChange}
                  onChoiceBodyChange={handleChoiceBodyChange}
                  onChoiceAdd={handleChoiceAdd}
                  onChoiceDelete={handleChoiceDelete}
                />
              )}
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    </div>
  );
};
