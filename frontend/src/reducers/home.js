import * as ActionTypes from "../actions/types";

const initialState = {
  isLoading: true,
  topics: [],
  fetchError: false
};

const home = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_TOPICS_REQUEST:
      return { ...state, isLoading: true, fetchError: false };
    case ActionTypes.FETCH_TOPICS_SUCCESS:
      return {
        ...state,
        topics: action.payload,
        isLoading: false,
        fetchError: false
      };
    case ActionTypes.FETCH_TOPICS_FAILURE:
      return { ...state, isLoading: false, fetchError: true };
    default:
      return state;
  }
};

export default home;
