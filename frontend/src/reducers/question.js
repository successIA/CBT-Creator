import * as actionTypes from "../actions/types";

const initialState = {
  isSubmitting: false,
  saveSuccess: false,
  deletedChoiceId: null
};

const question = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_QUESTION_REQUEST:
      return {
        ...state,
        isSubmitting: true,
        saveSuccess: false,
        deletedChoiceId: null
      };
    case actionTypes.CREATE_QUESTION_SUCCESS:
      return {
        ...state,
        isSubmitting: false,
        saveSuccess: true
      };
    case actionTypes.CREATE_QUESTION_FAILURE:
      return { ...state, isSubmitting: false, saveSuccess: false };
    case actionTypes.UPDATE_QUESTION_REQUEST:
      return {
        ...state,
        isSubmitting: true,
        saveSuccess: false,
        deletedChoiceId: null
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
    case actionTypes.DELETE_CHOICE_REQUEST:
    case actionTypes.DELETE_CHOICE_FAILURE:
      return {
        ...state,
        deletedChoiceId: null
      };
    case actionTypes.DELETE_CHOICE_SUCCESS:
      return {
        ...state,
        deletedChoiceId: action.payload
      };
    default:
      return state;
  }
};

export default question;
