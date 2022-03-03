import { createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers";
import socketMiddleware from "../middleware/middleware";

const middleware = [socketMiddleware, thunk];

export default createStore(
  rootReducer,
  applyMiddleware(...middleware)
);
