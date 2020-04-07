import * as actionTypes from "../actions/types";
import {
  INITIAL_CHOICE_STATE,
  DEFAULT_CHOICE_COUNT,
  INITIAL_QUESTION_STATE,
  INITIAL_MULTIPLE_TYPE_QUESTION_STATE
} from "../constants";
import { getArrayByObjAndCount } from "../utils/getArrayByObjAndCount";

const initialState = {
  saved: {
    topic: "",
    body: "",
    question_type: "single",
    choices: getArrayByObjAndCount(INITIAL_CHOICE_STATE, DEFAULT_CHOICE_COUNT),
    error: null
  },
  savedSingleType: { ...INITIAL_QUESTION_STATE, error: null },
  savedMultipleType: { ...INITIAL_MULTIPLE_TYPE_QUESTION_STATE, error: null },
  isSubmitting: false,
  saveSuccess: false,
  validationError: null,
  isValid: null
};

const question = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SAVE_QUESTION:
      const question = action.payload.question;
      return {
        ...state,
        saved: {
          topic: question.topic,
          body: question.body,
          question_type: question.question_type,
          choices: question.choices,
          error: question.error
        },
        savedSingleType: action.payload.singleTypeQuestion,
        savedMultipleType: action.payload.multipleTypeQuestion
      };
    case actionTypes.RESET_QUESTION:
      return {
        ...state,
        saved: {
          topic: "",
          body: "",
          question_type: "single",
          choices: [],
          error: null
        },
        savedSingleType: INITIAL_QUESTION_STATE,
        savedMultipleType: INITIAL_MULTIPLE_TYPE_QUESTION_STATE
      };
    case actionTypes.QUESTION_VALIDATION_REQUEST:
      return {
        ...state,
        validationError: null,
        isValid: false
      };
    case actionTypes.QUESTION_VALIDATION_SUCCESS:
      return {
        ...state,
        validationError: null,
        isValid: true
      };
    case actionTypes.QUESTION_VALIDATION_FAILURE:
      return {
        ...state,
        validationError: action.payload,
        isValid: false
      };
    case actionTypes.CREATE_QUESTION_REQUEST:
      return {
        ...state,
        isSubmitting: true,
        saveSuccess: false
      };
    case actionTypes.CREATE_QUESTION_SUCCESS:
      return {
        ...state,
        isSubmitting: false,
        saveSuccess: true
      };
    case actionTypes.CREATE_QUESTION_FAILURE:
      return {
        ...state,
        isSubmitting: false,
        saveSuccess: false
      };
    case actionTypes.UPDATE_QUESTION_REQUEST:
      return {
        ...state,
        isSubmitting: true,
        saveSuccess: false
      };
    case actionTypes.UPDATE_QUESTION_SUCCESS:
      return {
        ...state,
        isSubmitting: false,
        saveSuccess: true
      };
    case actionTypes.UPDATE_QUESTION_FAILURE:
      return { ...state, isSubmitting: false, saveSuccess: false };
    case actionTypes.DELETE_QUESTION_REQUEST:
    case actionTypes.DELETE_QUESTION_SUCCESS:
    case actionTypes.DELETE_QUESTION_FAILURE:
      return {
        ...state,
        isSubmitting: false,
        saveSuccess: false
      };
    default:
      return state;
  }
};

export default question;
