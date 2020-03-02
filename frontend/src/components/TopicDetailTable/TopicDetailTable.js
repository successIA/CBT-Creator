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
import * as constants from "../../constants";
import TopicDetailHeader from "../TopicDetailHeader";
import { ChoiceList } from "../ChoiceList/ChoiceList";

const tableStyle = {
  background: "#fff"
};

const TopicDetailTable = ({
  isLoading,
  slug,
  title,
  questions,
  fetchError,
  showModal,
  deleteQuestion
}) => {
  const handleQuestionEdit = questionToEdit => {
    showModal(constants.UPDATE_QUESTION, {
      question: questionToEdit
    });
  };

  const handleQuestionDelete = questionToDelete => {
    deleteQuestion(questionToDelete.id, questionToDelete.topic);
  };

  const columns = [
    {
      title: "Body",
      dataIndex: "body",
      key: "body",
      render: (text, row, index) => {
        return {
          children: (
            <a>
              {text}-{index}
            </a>
          ),
          props: {
            colSpan: 15
          }
        };
      }
    },
    {
      title: "Choices",
      dataIndex: "choices",
      key: "choices",
      render: text => <p>{text}</p>
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: text => <a>{text}</a>
    }
  ];

  console.log(questions);
  const data = questions.map(question => {
    return {
      key: `${question.id}`,
      body: question.body,
      choices: <ChoiceList question={question} />,
      action: (
        <>
          <Button size="small" onClick={() => handleQuestionEdit(question)}>
            <Icon type="edit" />
            Edit
          </Button>
          <Popconfirm
            title="Are you sure"
            icon={<Icon type="question-circle-o" style={{ color: "red" }} />}
            onConfirm={() => handleQuestionDelete(question)}
          >
            <Button size="small" style={{ marginLeft: 8 }}>
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
    <Row>
      <Col span={20} offset={2}>
        <TopicDetailHeader slug={slug} title={title} showModal={showModal} />
        <Table
          style={{ background: "white", marginTop: "32" }}
          columns={columns}
          dataSource={data}
        />
      </Col>
    </Row>
  );
};

export default TopicDetailTable;
