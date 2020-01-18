import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { TopicContext } from "../contexts/TopicContext";
import { addTopic } from "../actions/topics";

export const TopicForm = ({ visible, setFormVisible }) => {
  const [topicSubmitLoading, setTopicSubmitLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const { topicDispatch } = React.useContext(TopicContext);

  const handleSubmit = () => {
    setTopicSubmitLoading(true);
    addTopic({ title }, topicDispatch, onSubmitSuccess, onSubmitFailure);
  };

  const onSubmitSuccess = () => {
    setTitle("");
    message.success("Topic added successfully");
    setTopicSubmitLoading(false);
  };

  const onSubmitFailure = error => {
    message.error("Something went wrong");
    setTopicSubmitLoading(false);
  };

  return (
    <div>
      <Modal
        title="Add Topic"
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setFormVisible(false)}
        footer={[
          <Button key="back" onClick={() => setFormVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={topicSubmitLoading}
            onClick={handleSubmit}
          >
            Add
          </Button>
        ]}
      >
        <Form>
          <Input
            name="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </Form>
      </Modal>
    </div>
  );
};
