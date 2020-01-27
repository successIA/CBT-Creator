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

const CHOICE_COMPONENTS = {
  single: Radio,
  multiple: Checkbox
};

export const ChoiceInputList = ({
  type,
  choices,
  onChoiceControlChange,
  onChoiceBodyChange,
  onChoiceAdd,
  onChoiceDelete
}) => {
  let ChoiceInput = CHOICE_COMPONENTS[type];

  if (!ChoiceInput) throw new Error("Invalid question type");

  const InputList = choices.map((choice, i) => {
    return (
      <ChoiceInput
        key={i}
        name="is_answer"
        checked={choice.is_answer}
        style={choiceControlStyle}
        onChange={e => onChoiceControlChange(e, i)}
      >
        <Input
          name="body"
          value={choice.body}
          style={{ width: "65%" }}
          onChange={e => onChoiceBodyChange(e, i)}
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
          onClick={() => onChoiceDelete(i, choice)}
        >
          <Icon type="delete" />
        </Button>
      </ChoiceInput>
    );
  });
  return InputList;
};
