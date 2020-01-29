import axios from "axios";
import * as constants from "../constants";
import { getConfig } from "../utils/config";

export const createQuestionApi = newQuestion => {
  return axios.post(
    `${constants.QUESTION_CREATE_URL}`,
    newQuestion,
    getConfig()
  );
};

export const updateQuestionApi = (id, editedQuestion) => {
  return axios.put(
    `${constants.BASE_QUESTION_UPDATE_URL}${id}/`,
    editedQuestion,
    getConfig()
  );
};

export const deleteQuestionApi = id => {
  return axios.delete(`${constants.BASE_QUESTION_DELETE_URL}${id}`);
};
