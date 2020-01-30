import * as actionTypes from "../actions/types";
import { getArrayByObjAndCount } from "../utils/getArrayByObjAndCount";
import {
  INITIAL_CHOICE_STATE,
  DEFAULT_CHOICE_COUNT,
  INITIAL_QUESTION_STATE
} from "../constants";

const initialState = {
  body: "",
  question_type: "single",
  choices: getArrayByObjAndCount(INITIAL_CHOICE_STATE, DEFAULT_CHOICE_COUNT),
  singleType: INITIAL_QUESTION_STATE,
  multipleType: {
    ...INITIAL_QUESTION_STATE,
    choices: getArrayByObjAndCount(INITIAL_CHOICE_STATE, DEFAULT_CHOICE_COUNT),
    question_type: "multiple"
  },
  isSubmitting: false,
  saveSuccess: false,
  validationError: null,
  createError: null,
  isValid: null
};

const question = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SAVE_QUESTION:
      return {
        ...state,
        body: action.payload.body,
        question_type: action.payload.question_type,
        choices: [...action.payload.choices]
      };
    case actionTypes.CHANGE_QUESTION_TYPE:
      console.log(action.payload);
      const question = {
        body: action.payload.body,
        question_type: action.payload.question_type,
        choices: [...action.payload.choices]
      };
      if (action.payload.question_type === "single") {
        const multipleType = {
          ...state.multipleType,
          choices: [...state.multipleType.choices]
        };
        console.log("new state:", multipleType);
        return {
          ...state,
          ...multipleType,
          singleType: question
        };
      } else if (action.payload.question_type === "multiple") {
        const singleType = {
          ...state.singleType,
          choices: [...state.singleType.choices]
        };
        console.log("new state:", singleType);
        return {
          ...state,
          ...singleType,
          multipleType: question
        };
      }
      return state;
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
        saveSuccess: false,
        createError: action.payload
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
