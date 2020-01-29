import * as actionTypes from "../actions/types";

const initialState = {
  isSubmitting: false,
  saveSuccess: false,
  validationError: null,
  isValid: null
};

const question = (state = initialState, action) => {
  switch (action.type) {
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
