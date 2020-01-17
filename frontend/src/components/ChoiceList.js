import React from "react";
import { Radio, Checkbox } from "antd";

const choiceStyle = {
  display: "inline-block",
  width: "100%",
  marginLeft: 0,
  height: "30px",
  lineHeight: "30px"
};

export const ChoiceList = ({ question }) => {
  return (
    <div>
      {question.question_type === "single"
        ? question.choices.map(choice => (
            <Radio
              key={choice.id}
              value={choice.id}
              style={choiceStyle}
              checked={choice.is_answer}
            >
              {choice.body}
            </Radio>
          ))
        : question.choices.map(choice => (
            <Checkbox
              key={choice.id}
              style={choiceStyle}
              checked={choice.is_answer}
            >
              {choice.body}
            </Checkbox>
          ))}
    </div>
  );
};
