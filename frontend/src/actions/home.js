import * as ActionTypes from "./types";
import { message } from "antd";
import * as api from "../api/topic";

export const fetchTopicsRequest = () => {
  return {
    type: ActionTypes.FETCH_TOPICS_REQUEST
  };
};

export const fetchTopicsSuccess = topics => {
  return { type: ActionTypes.FETCH_TOPICS_SUCCESS, payload: topics };
};

export const fetchTopicsFailure = () => {
  return { type: ActionTypes.FETCH_TOPICS_FAILURE };
};

export const refreshTopics = dispatch => {
  api
    .fetchTopicsApi()
    .then(res => {
      dispatch(fetchTopicsSuccess(res.data));
    })
    .catch(err => {
      dispatch(fetchTopicsFailure());
      message.error("Something went wrong");
    });
};

export const fetchTopics = () => {
  return dispatch => {
    dispatch(fetchTopicsRequest());
    refreshTopics(dispatch);
  };
};
