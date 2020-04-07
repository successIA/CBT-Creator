import { getArrayByObjAndCount } from "../utils/getArrayByObjAndCount";

// API URL
export const BASE_API_URL = "http://127.0.0.1:8000/";
export const TOPIC_LIST_URL = `${BASE_API_URL}auth/`;
export const TOPIC_CREATE_URL = `${BASE_API_URL}auth/`;
export const BASE_TOPIC_UPDATE_URL = `${BASE_API_URL}auth/topics/`;
export const BASE_TOPIC_DELETE_URL = `${BASE_API_URL}auth/topics/`;
export const BASE_TOPIC_DETAIL_URL = `${BASE_API_URL}auth/topics/`;
export const QUESTION_CREATE_URL = `${BASE_API_URL}auth/questions/`;
export const BASE_QUESTION_UPDATE_URL = `${BASE_API_URL}auth/questions/`;
export const BASE_QUESTION_DELETE_URL = `${BASE_API_URL}auth/questions/`;

// MODAL FORM
export const CREATE_TOPIC = "CREATE_TOPIC";
export const UPDATE_TOPIC = "UPDATE_TOPIC";
export const CREATE_QUESTION = "CREATE_QUESTION";
export const UPDATE_QUESTION = "UPDATE_QUESTION";

// DEFAULT STATES
export const INITIAL_CHOICE_STATE = {
  body: "",
  is_answer: false
};
export const DEFAULT_CHOICE_COUNT = 5;
export const INITIAL_QUESTION_STATE = {
  body: "",
  question_type: "single",
  choices: getArrayByObjAndCount(INITIAL_CHOICE_STATE, DEFAULT_CHOICE_COUNT)
};

export const INITIAL_MULTIPLE_TYPE_QUESTION_STATE = {
  ...INITIAL_QUESTION_STATE,
  question_type: "multiple"
};
