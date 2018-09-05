import "react-table/react-table.css";
import 'react-datepicker/dist/react-datepicker.min.css';
import "bootstrap/dist/css/bootstrap.min.css"
import 'react-contexify/dist/ReactContexify.min.css';
import './reactTableFix.css';
import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from 'redux-logger'
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { weightLogReducer } from "./weightLogReducer";
import Weight from "./weight";
import * as ReactDOM from "react-dom";
import * as React from "react";
import * as moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const store = createStore(
    combineReducers({weightLog: weightLogReducer}),
    applyMiddleware(thunk, createLogger({collapsed: true})));

ReactDOM.render(<Provider store={store}><Weight/></Provider>, document.getElementById('app'));
