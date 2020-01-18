import React from "react";

import { topicReducer } from "../reducers/topicReducer";

export const TopicContext = React.createContext();

export const TopicContextProvider = props => {
  const initialTopicState = {
    topics: []
  };
  const [topicState, topicDispatch] = React.useReducer(
    topicReducer,
    initialTopicState
  );
  return (
    <TopicContext.Provider value={{ topicState, topicDispatch }}>
      {props.children}
    </TopicContext.Provider>
  );
};
