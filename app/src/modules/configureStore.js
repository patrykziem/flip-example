import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';
import {apiMiddleware} from 'redux-api-middleware';
import {Map} from 'immutable';

import reducers from './reducers';

const middleware = [
  thunk,
  apiMiddleware,
  routerMiddleware(browserHistory)
];
const storeEnhancers = [];

export default function configureStore() {
  const store = createStore(
    reducers,
    Map(),
    compose(
      applyMiddleware(...middleware),
      ...storeEnhancers
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
