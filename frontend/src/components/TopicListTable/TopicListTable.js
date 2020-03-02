import React from "react";
import {
  Row,
  Col,
  Table,
  Divider,
  Tag,
  Spin,
  Button,
  Icon,
  Popconfirm
} from "antd";
import TopicListHeader from "../TopicListHeader";
import { Link } from "react-router-dom";
import * as constants from "../../constants";

const tableStyle = {
  background: "#fff"
};

const TopicListTable = ({
  isLoading,
  topics,
  fetchError,
  showModal,
  deleteTopic
}) => {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "name",
      render: text => <a>{text}</a>
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: text => <a>{text}</a>
    }
  ];

  const data = topics.map(topic => {
    return {
      key: topic.id,
      title: <Link to={`/auth/topics/${topic.slug}/`}>{topic.title}</Link>,
      action: (
        <>
          <Button onClick={() => showModal(constants.UPDATE_TOPIC, { topic })}>
            <Icon type="edit" />
            Edit
          </Button>
          <Popconfirm
            title="Are you sure"
            icon={<Icon type="question-circle-o" style={{ color: "red" }} />}
            onConfirm={() => deleteTopic(topic.slug)}
          >
            <Button style={{ marginLeft: 8 }}>
              <Icon type="delete" />
              Delete
            </Button>
          </Popconfirm>
        </>
      )
    };
  });

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
    <Row gutter={16}>
      <Col span={16} offset={4}>
        <TopicListHeader showModal={showModal} />
        <Table
          style={{ background: "white", marginTop: "32" }}
          columns={columns}
          dataSource={data}
        />
      </Col>
    </Row>
  );
};

export default TopicListTable;
