import './src/main.scss';

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {Provider} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';

import configureStore from './src/modules/configureStore';
import {IntlProvider, addLocaleData} from './src/modules/utils';
import routes from './src/routes';


function startApp() {
  // Needed for onTouchTap
  // Check this repo:
  // https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  // add to React-Intl locale data
  addLocaleData();

  const store = configureStore();
  const syncedBrowserHistory = syncHistoryWithStore(browserHistory, store, {
    selectLocationState(state) {
      return state.get('routing').toJS();
    }
  });

  const reactRoot = window.document.getElementById('react-root');

  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider>
        <IntlProvider locale="en">
          <Router history={syncedBrowserHistory} routes={routes}/>
        </IntlProvider>
      </MuiThemeProvider>
    </Provider>,
    reactRoot
  );
}

if (!global.Intl) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en.js'
  ], function (require) {
    require('intl');
    require('intl/locale-data/jsonp/en.js');
    startApp();
  });
} else {
  startApp();
}
