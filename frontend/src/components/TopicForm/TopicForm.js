import React from "react";
import { Modal, Form, Input, Button, message } from "antd";

export default class TopicForm extends React.Component {
  state = {
    title: this.props.topic.title
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    if (!this.state.title.trim().length) {
      message.error("The title of the topic is required.");
      return;
    }

    const topic = { title: this.state.title };
    this.props.onSubmit(topic);
    this.setState({ title: "" });
  };

  render() {
    return (
      <div>
        <Modal
          title={this.props.modalTitle}
          visible={true}
          onOk={this.handleSubmit}
          onCancel={this.props.hideModal}
          footer={[
            <Button key="back" onClick={this.props.hideModal}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={this.props.isSubmitting}
              onClick={this.handleSubmit}
            >
              {this.props.modalSubmitText}
            </Button>
          ]}
        >
          <Form>
            <Input
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </Form>
        </Modal>
      </div>
    );
  }
}
