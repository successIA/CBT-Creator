import React from "react";
import { Row, Col, Button, Icon, Typography } from "antd";
import * as constants from "../../constants";

const { Title } = Typography;

export const TopicDetailHeader = ({ slug, title, showModal }) => {
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
            {title}
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() =>
              showModal(constants.CREATE_QUESTION, {
                topic: slug
              })
            }
          >
            <Icon type="plus" />
            Add new question
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default TopicDetailHeader;
