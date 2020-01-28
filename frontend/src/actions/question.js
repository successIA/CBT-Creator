import * as actionTypes from "./types";
import { message } from "antd";
import * as api from "../api/question";
import { refreshTopic } from "./topic";

export const createQuestionRequest = () => ({
  type: actionTypes.CREATE_QUESTION_REQUEST
});

export const createQuestionSuccess = question => ({
  type: actionTypes.CREATE_QUESTION_SUCCESS,
  payload: question
});

export const createQuestionFailure = () => ({
  type: actionTypes.CREATE_QUESTION_FAILURE
});

export const createQuestion = (question, topic_slug) => {
  return dispatch => {
    dispatch(createQuestionRequest());
    api
      .createQuestionApi(question)
      .then(res => {
        dispatch(createQuestionSuccess(res.data));
        refreshTopic(topic_slug, dispatch);
        message.success("Question added successfully!");
      })
      .catch(err => {
        dispatch(createQuestionFailure());
        message.error("Something went wrong");
      });
  };
};

export const updateQuestionRequest = () => ({
  type: actionTypes.UPDATE_QUESTION_REQUEST
});

export const updateQuestionSuccess = () => ({
  type: actionTypes.UPDATE_QUESTION_SUCCESS
});

export const updateQuestionFailure = () => ({
  type: actionTypes.UPDATE_QUESTION_FAILURE
});

export const updateQuestion = (id, editedQuestion, topic_slug) => {
  return dispatch => {
    dispatch(updateQuestionRequest());
    api
      .updateQuestionApi(id, editedQuestion)
      .then(res => {
        dispatch(updateQuestionSuccess());
        refreshTopic(topic_slug, dispatch);
        message.success("Question updated successfully!");
      })
      .catch(err => {
        dispatch(updateQuestionFailure());
        message.error("Something went wrong");
      });
  };
};

export const deleteQuestionRequest = () => ({
  type: actionTypes.DELETE_QUESTION_REQUEST
});

export const deleteQuestionSuccess = () => ({
  type: actionTypes.DELETE_QUESTION_SUCCESS
});

export const deleteQuestionFailure = () => ({
  type: actionTypes.DELETE_QUESTION_FAILURE
});

export const deleteQuestion = (id, topic_slug) => {
  return dispatch => {
    dispatch(deleteQuestionRequest());
    api
      .deleteQuestionApi(id)
      .then(res => {
        dispatch(deleteQuestionSuccess());
        refreshTopic(topic_slug, dispatch);
        message.success("Question deleted successfully!");
      })
      .catch(err => {
        dispatch(deleteQuestionFailure());
        message.error("Something went wrong");
      });
  };
};
