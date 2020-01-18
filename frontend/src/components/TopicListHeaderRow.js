import React from "react";
import { Row, Col, Button, Icon, Typography } from "antd";

const { Title } = Typography;

export const TopicListHeaderRow = ({ onAddButtonClick }) => {
  return (
    <div style={{ marginBottom: 16, marginTop: 32 }}>
      <Row
        type="flex"
        justify="space-between"
        align="bottom"
        style={{ marginTop: 16, marginBottom: 8, width: 913 }}
        gutter={16}
      >
        <Col>
          <Title
            level={3}
            style={{ marginBottom: 0, verticalAlign: "text-bottom" }}
          >
            Topics
          </Title>
        </Col>
        <Col>
          <Button type="primary" onClick={() => onAddButtonClick(true)}>
            <Icon type="plus" />
            Add new topic
          </Button>
        </Col>
      </Row>
    </div>
  );
};
