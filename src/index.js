import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './title.css';
import './battle.css';
import './battlefield.css';
import './party.css';
import './store.css';
import './create.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store.js';

ReactDOM.render(
  <Provider store={store}>
    <Router basename={process.env.PUBLIC_URL}>
      <App />
    </Router>
  </Provider>, document.getElementById('root'));
registerServiceWorker();
