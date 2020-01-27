import * as actionTypes from "./types";
import { message } from "antd";
import * as api from "../api/topic";
import { refreshTopics } from "./home";

export const fetchTopicRequest = () => ({
  type: actionTypes.FETCH_TOPIC_REQUEST
});

export const fetchTopicSuccess = topic => ({
  type: actionTypes.FETCH_TOPIC_SUCCESS,
  payload: topic
});

export const fetchTopicFailure = () => ({
  type: actionTypes.FETCH_TOPIC_FAILURE
});

export const refreshTopic = (slug, dispatch) => {
  api
    .fetchTopicApi(slug)
    .then(res => {
      dispatch(fetchTopicSuccess(res.data));
    })
    .catch(error => {
      dispatch(fetchTopicFailure());
      message.error("Something went wrong");
    });
};

export const fetchTopic = slug => {
  return dispatch => {
    dispatch(fetchTopicRequest());
    refreshTopic(slug, dispatch);
  };
};

export const createTopicRequest = () => ({
  type: actionTypes.CREATE_TOPIC_REQUEST
});

export const createTopicSuccess = () => ({
  type: actionTypes.CREATE_TOPIC_SUCCESS
});

export const createTopicFailure = () => ({
  type: actionTypes.CREATE_TOPIC_FAILURE
});

export const createTopic = topic => {
  return dispatch => {
    dispatch(createTopicRequest());
    api
      .createTopicApi(topic)
      .then(res => {
        dispatch(createTopicSuccess());
        refreshTopics(dispatch);
        message.success("Topic added successfully!");
      })
      .catch(error => {
        dispatch(createTopicFailure());
        message.error("Something went wrong");
      });
  };
};

export const updateTopicRequest = () => ({
  type: actionTypes.UPDATE_TOPIC_REQUEST
});

export const updateTopicSuccess = () => ({
  type: actionTypes.UPDATE_TOPIC_SUCCESS
});

export const updateTopicFailure = () => ({
  type: actionTypes.UPDATE_TOPIC_FAILURE
});

export const updateTopic = (slug, topic) => {
  return dispatch => {
    dispatch(updateTopicRequest());
    api
      .updateTopicApi(slug, topic)
      .then(res => {
        dispatch(updateTopicSuccess());
        refreshTopics(dispatch);
        message.success("Topic updated successfully!");
      })
      .catch(error => {
        dispatch(updateTopicFailure());
        message.error("Something went wrong");
      });
  };
};

export const deleteTopicRequest = () => ({
  type: actionTypes.DELETE_TOPIC_REQUEST
});

export const deleteTopicSuccess = () => ({
  type: actionTypes.DELETE_TOPIC_SUCCESS
});

export const deleteTopicFailure = () => ({
  type: actionTypes.DELETE_TOPIC_FAILURE
});

export const deleteTopic = slug => {
  return dispatch => {
    dispatch(deleteTopicRequest());
    api
      .deleteTopicApi(slug)
      .then(res => {
        dispatch(deleteTopicSuccess());
        refreshTopics(dispatch);
        message.success("Topic deleted successfully!");
      })
      .catch(error => {
        dispatch(deleteTopicFailure());
        message.error("Something went wrong");
      });
  };
};
