import React from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Card,
  Spin,
  Button,
  Icon,
  Popconfirm
} from "antd";
import TopicListHeader from "../TopicListHeader";
import * as constants from "../../constants";

const { Title, Text } = Typography;

const TopicList = ({
  isLoading,
  topics,
  fetchError,
  showModal,
  deleteTopic
}) => {
  if (isLoading) {
    return (
      <div>
        <div className="spinner-wrapper">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div>
        <Row>
          <Col
            span={16}
            offset={4}
            style={{ textAlign: "center", height: "57vh", marginTop: "35vh" }}
          >
            <h2>It seems that the server is down. Try again later.</h2>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div>
      <Row gutter={16}>
        <Col span={8} offset={4}>
          <TopicListHeader showModal={showModal} />
          {topics.map(topic => (
            <Card
              key={topic.slug}
              bordered={false}
              hoverable
              style={{
                width: 900,
                background: "#fff",
                marginBottom: 16
              }}
            >
              <Title level={2}>
                <Link to={`/auth/topics/${topic.slug}/`}>{topic.title}</Link>
              </Title>
              <Text type="secondary">Lorem ipsum dalor</Text>
              <Row type="flex" justify="end">
                <Col>
                  <Button
                    onClick={() => showModal(constants.UPDATE_TOPIC, { topic })}
                  >
                    <Icon type="edit" />
                    Edit
                  </Button>
                  <Popconfirm
                    title="Are you sure"
                    icon={
                      <Icon type="question-circle-o" style={{ color: "red" }} />
                    }
                    onConfirm={() => deleteTopic(topic.slug)}
                  >
                    <Button type="danger" style={{ marginLeft: 8 }}>
                      <Icon type="delete" />
                      Delete
                    </Button>
                  </Popconfirm>
                </Col>
              </Row>
            </Card>
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default TopicList;
