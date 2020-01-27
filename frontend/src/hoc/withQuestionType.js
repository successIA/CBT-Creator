import React from "react";
import { INITIAL_QUESTION_STATE } from "../constants";

const withQuestionType = WrappedComponent => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.singleTypeQuestion = {
        ...INITIAL_QUESTION_STATE,
        topic: this.props.question.topic
      };
      this.multipleTypeQuestion = {
        ...INITIAL_QUESTION_STATE,
        topic: this.props.question.topic,
        question_type: "multiple"
      };
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          singleTypeQuestion={this.singleTypeQuestion}
          multipleTypeQuestion={this.multipleTypeQuestion}
        />
      );
    }
  };
};

export default withQuestionType;
