import React from "react";
import { Row, Col, Button, Icon, Typography } from "antd";
import * as constants from "../../constants";

const { Title } = Typography;

const TopicListHeader = ({ showModal }) => {
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
          <Button
            type="primary"
            onClick={() =>
              showModal(constants.CREATE_TOPIC, { topic: { title: "" } })
            }
          >
            <Icon type="plus" />
            Add new topic
          </Button>
        </Col>
      </Row>
    </div>
  );
  //   }
};

export default TopicListHeader;
