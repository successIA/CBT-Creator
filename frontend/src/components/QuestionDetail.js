import React from "react";
import { Card, Row, Col, Button, Typography, Icon } from "antd";
import { ChoiceList } from "./ChoiceList";

const { Text } = Typography;

export const QuestionDetail = ({ question, onEditClick }) => {
  return (
    <div>
      <Card
        bordered={false}
        style={{
          background: "#fff",
          marginBottom: 16
        }}
      >
        <div style={{ marginBottom: 4 }}>
          <Text>{question.body}</Text>
        </div>
        <ChoiceList question={question} />
        <Row type="flex" justify="end">
          <Col>
            <Button onClick={() => onEditClick(question)}>
              <Icon type="edit" />
              Edit
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
