import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Typography, Card, Spin, message } from "antd";
import { TopicContext } from "../contexts/TopicContext";
import { TopicForm } from "./TopicForm";
import { TopicListHeaderRow } from "./TopicListHeaderRow";
import { getTopics } from "../actions/topics";

const { Title, Text } = Typography;

export const TopicList = () => {
  const [loading, setLoading] = React.useState(true);
  const [topicFormVisible, setTopicFormVisible] = React.useState(false);
  const { topicState } = React.useContext(TopicContext);
  const { topicDispatch } = React.useContext(TopicContext);

  const onGetTopicsSuccess = () => {
    setLoading(false);
  };

  const onGetTopicsFailure = error => {
    message.error("Something went wrong");
    setLoading(false);
  };

  if (!topicState.topics.length) {
    getTopics(topicDispatch, onGetTopicsSuccess, onGetTopicsFailure);
  }

  return (
    <div>
      {!topicState.topics.length && loading ? (
        <div className="spinner-wrapper">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={16}>
          <Col span={8} offset={4}>
            <TopicListHeaderRow onAddButtonClick={setTopicFormVisible} />
            {topicState.topics.map(topic => (
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
              </Card>
            ))}
            <TopicForm
              visible={topicFormVisible}
              setFormVisible={setTopicFormVisible}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};
