import React from "react";
import { Row, Col, Button, Icon, Typography } from "antd";

const { Title } = Typography;

export const QuestionListHeaderRow = ({ onAddButtonClick }) => {
  return (
    <div>
      <Row
        type="flex"
        justify="space-between"
        align="bottom"
        style={{ marginTop: 16, marginBottom: 8 }}
      >
        <Col>
          <Title
            level={3}
            style={{ marginBottom: 0, verticalAlign: "text-bottom" }}
          >
            Question List
          </Title>
        </Col>
        <Col>
          <Button type="primary" onClick={() => onAddButtonClick(true)}>
            <Icon type="plus" />
            Add new question
          </Button>
        </Col>
      </Row>
    </div>
  );
};
