import React from "react";

import { topicReducer } from "../reducers/topicReducer";

export const TopicContext = React.createContext();

export const TopicContextProvider = props => {
  // topics topicDe  questions
  const initialTopicState = {
    topics: []
    // topic: {
    //   title: null,
    //   slug: null,
    //   questions: []
    // }
  };
  // if topic props.match.slug === topic.slug
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
