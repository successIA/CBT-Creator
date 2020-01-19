import React from "react";
import axios from "axios";
import { Row, Col, message, Spin } from "antd";
import { QuestionList } from "./QuestionList";
import { TopicDetailHeaderRow } from "./TopicDetailHeaderRow";
import * as Constants from "../constants";

export const ThreadDetail = props => {
  const [title, setTitle] = React.useState("");

  if (!title) {
    const slug = props.match.params.slug;
    const url = `${Constants.BASE_TOPIC_DETAIL_URL}${slug}/`;
    axios
      .get(url)
      .then(res => {
        setTitle(res.data.title);
        console.log(res.data);
      })
      .catch(err => message.error("Something went wrong"));
  }

  return (
    <div>
      {!title ? (
        <div className="spinner-wrapper">
          <Spin size="large" />
        </div>
      ) : (
        <React.Fragment>
          <TopicDetailHeaderRow title={title} />
          <QuestionList {...props} />
        </React.Fragment>
      )}
    </div>
  );
};
