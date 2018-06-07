import React from 'react'
import ReactDOM from 'react-dom'
import 'babel-polyfill';
import { Route, Router, IndexRoute, useRouterHistory } from 'react-router'
import configureStore from './store/configStore';
import { Provider } from 'react-redux';
import { createHistory } from 'history'
import { dispatchFetchTarget, getInitialConvertDropdownData } from './actions/initialActions';
import Root from './components/Root'
import HomePage from './components/home/HomePage'
import Convert from './components/convert/TabsMain'
import Metrics from './components/metrics/Metrics'
import Utilities from './components/utilities/Utilities'
import './index.css';
import 'style!css!../node_modules/toastr/build/toastr.min.css';

const history = useRouterHistory(createHistory)({
  basename: '/dce/ui/'
})

const store = configureStore();
store.dispatch(dispatchFetchTarget());
store.dispatch(getInitialConvertDropdownData());

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Root}>
        <IndexRoute component={HomePage} />
        <Route path="./convert" component={Convert} />
        <Route path="./metrics" component={Metrics} />
        <Route path="./utilities" component={Utilities} />
        <Route path="*" component={HomePage} />
      </Route>
    </Router>
  </Provider>, document.getElementById('root'))