import * as ActionTypes from "../actions/types";

const initialState = {
  isLoading: true,
  slug: null,
  title: null,
  questions: [],
  isSubmitting: false,
  saveSuccess: false,
  fetchError: false
};

const topic = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_TOPIC_REQUEST:
      return { ...state, isSubmitting: true, saveSuccess: false };
    case ActionTypes.CREATE_TOPIC_SUCCESS:
      return { ...state, isSubmitting: false, saveSuccess: true };
    case ActionTypes.CREATE_TOPIC_FAILURE:
      return { ...state, isSubmitting: false, saveSuccess: false };
    case ActionTypes.FETCH_TOPIC_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSubmitting: false,
        saveSuccess: false,
        fetchError: false
      };
    case ActionTypes.FETCH_TOPIC_SUCCESS:
      return {
        ...state,
        slug: action.payload.slug,
        title: action.payload.title,
        questions: action.payload.questions,
        isLoading: false,
        isSubmitting: false,
        fetchError: false
      };
    case ActionTypes.FETCH_TOPIC_FAILURE:
      return {
        ...state,
        isLoading: false,
        isSubmitting: false,
        fetchError: true
      };
    case ActionTypes.UPDATE_TOPIC_REQUEST:
      return { ...state, isSubmitting: true, saveSuccess: false };
    case ActionTypes.UPDATE_TOPIC_SUCCESS:
      return { ...state, isSubmitting: false, saveSuccess: true };
    case ActionTypes.UPDATE_TOPIC_FAILURE:
      return { ...state, isSubmitting: false, saveSuccess: false };
    case ActionTypes.DELETE_TOPIC_REQUEST:
      return { ...state, isSubmitting: true };
    case ActionTypes.DELETE_TOPIC_SUCCESS:
      return { ...state, isSubmitting: false };
    case ActionTypes.DELETE_TOPIC_FAILURE:
      return { ...state, isSubmitting: false };
    default:
      return state;
  }
};

export default topic;
