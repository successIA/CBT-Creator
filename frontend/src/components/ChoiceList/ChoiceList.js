import React from "react";
import { Radio, Checkbox } from "antd";

const choiceStyle = {
  display: "inline-block",
  width: "100%",
  marginLeft: 0,
  height: "30px",
  lineHeight: "30px"
};

const CHOICE_COMPONENTS = {
  single: Radio,
  multiple: Checkbox
};

export const ChoiceList = ({ question }) => {
  let ChoiceInput = CHOICE_COMPONENTS[question.question_type];

  if (!ChoiceInput) throw new Error("Invalid question type");

  return question.choices.map(choice => (
    <ChoiceInput key={choice.id} style={choiceStyle} checked={choice.is_answer}>
      {choice.body}
    </ChoiceInput>
  ));
};
