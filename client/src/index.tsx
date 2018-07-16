import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from 'redux-logger'
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { weightLogReducer } from "./weightLogReducer";
import WeightLog from "./weightLog";
import "react-table/react-table.css";
import * as ReactDOM from "react-dom";
import * as React from "react";

const store = createStore(combineReducers({weightLog: weightLogReducer}), applyMiddleware(thunk, logger));

ReactDOM.render(<Provider store={store}><WeightLog/></Provider>, document.getElementById('app'));
