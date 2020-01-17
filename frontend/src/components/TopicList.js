import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Row, Col, Typography, Card, message } from "antd";
import * as Constants from "../constants";

const { Title, Text } = Typography;

export const TopicList = () => {
  const [topics, setTopics] = React.useState([]);

  if (!topics.length) {
    const url = `${Constants.BASE_API_URL}auth/`;
    axios
      .get(url)
      .then(res => {
        console.log(res.data);
        setTopics(res.data);
      })
      .catch(err => message.error("Something went wrong"));
  }

  console.log(topics);
  return (
    <Row gutter={16}>
      <Col span={8} offset={4}>
        <h1 style={{ marginBottom: 16 }}>Topic List</h1>
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
          </Card>
        ))}
      </Col>
    </Row>
  );
};
