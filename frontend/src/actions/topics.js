import axios from "axios";
import * as Constants from "../constants";
import * as ActionTypes from "./types";

const config = {
  headers: {
    "Content-Type": "application/json"
  }
};

export const addTopic = (topic, dispatch, onSuccess, onFailure) => {
  const url = Constants.TOPIC_CREATE_URL;
  axios
    .post(url, topic, config)
    .then(res => {
      console.log(res.data);
      dispatch({ type: ActionTypes.ADD_TOPIC, payload: res.data });
      onSuccess();
    })
    .catch(error => onFailure(error));
};

export const getTopics = (dispatch, onSuccess, onFailure) => {
  const url = `${Constants.BASE_API_URL}auth/`;
  axios
    .get(url)
    .then(res => {
      console.log(res.data);
      dispatch({ type: ActionTypes.GET_TOPICS, payload: res.data });
      onSuccess();
    })
    .catch(err => onFailure(err));
};
