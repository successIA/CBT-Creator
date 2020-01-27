import { combineReducers } from "redux";

import topic from "./topic";
import home from "./home";
import modal from "./modal";
import question from "./question";

const rootReducer = combineReducers({
  topic,
  question,
  home,
  modal
});

export default rootReducer;
