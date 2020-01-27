import React from "react";
import { Card, Row, Col, Button, Typography, Icon, Popconfirm } from "antd";
import { ChoiceList } from "../ChoiceList/ChoiceList";

const { Text } = Typography;

export const QuestionDetail = ({ question, onEditClick, onDeleteClick }) => {
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
            <Popconfirm
              title="Are you sure"
              icon={<Icon type="question-circle-o" style={{ color: "red" }} />}
              onConfirm={() => onDeleteClick(question)}
            >
              <Button type="danger" style={{ marginLeft: 8 }}>
                <Icon type="delete" />
                Delete
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default QuestionDetail;
