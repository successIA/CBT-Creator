import React from "react";
import { Radio, Checkbox, Input, Button, Icon } from "antd";

const choiceControlStyle = {
  height: "30px",
  lineHeight: "30px",
  marginTop: "8px",
  marginBottom: "8px",
  display: "inline-block",
  width: "100%",
  marginLeft: 0
};

export const ChoiceInputList = ({
  question,
  count,
  onChoiceControlChange,
  onChoiceBodyChange,
  onChoiceAdd,
  onChoiceDelete
}) => {
  let ChoiceInput = null;
  if (question.question_type === "single") {
    ChoiceInput = Radio;
  } else if (question.question_type === "multiple") {
    ChoiceInput = Checkbox;
  } else {
    throw new Error("Invalid question type");
  }

  const choiceInputList = [];
  for (let i = 0; i < count; i++) {
    choiceInputList.push(
      <ChoiceInput
        key={i}
        name="is_answer"
        checked={question.choices[i].is_answer}
        style={choiceControlStyle}
        onChange={e => onChoiceControlChange(e, i)}
      >
        <Input
          name="body"
          value={question.choices[i].body}
          style={{ width: "65%" }}
          onChange={e => {
            onChoiceBodyChange(e, i);
          }}
        />
        <Button
          size="small"
          style={{ marginLeft: 8 }}
          onClick={() => onChoiceAdd(i, true)}
        >
          <Icon type="up" />
        </Button>
        <Button
          size="small"
          style={{ marginLeft: 8 }}
          onClick={() => onChoiceAdd(i, false)}
        >
          <Icon type="down" />
        </Button>
        <Button
          type="danger"
          size="small"
          style={{ marginLeft: 8 }}
          onClick={() => onChoiceDelete(i, question.choices[i])}
        >
          <Icon type="delete" />
        </Button>
      </ChoiceInput>
    );
  }
  return choiceInputList;
};
