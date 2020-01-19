import React from "react";
import { Row, Col, Button, Icon, Typography } from "antd";

const { Title } = Typography;

export const TopicDetailHeaderRow = ({ title, onAddButtonClick }) => {
  return (
    <div>
      <Row
        type="flex"
        justify="space-between"
        align="bottom"
        style={{ marginTop: 16, marginBottom: 8 }}
      >
        <Col span={12} offset={2}>
          <Title
            level={3}
            style={{ marginBottom: 0, verticalAlign: "text-bottom" }}
          >
            {title}
          </Title>
        </Col>
      </Row>
    </div>
  );
};
