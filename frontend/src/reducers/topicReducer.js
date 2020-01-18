import * as ActionTypes from "../actions/types";

export const topicReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.ADD_TOPIC:
      //   return [...state, action.payload];
      return {
        ...state,
        topics: [...state.topics, action.payload]
      };
    case ActionTypes.GET_TOPICS:
      return { ...state, topics: action.payload };
    default:
      return state;
  }
};
