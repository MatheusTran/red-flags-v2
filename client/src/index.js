import React from 'react';
import ReactDOM from 'react-dom';
import Router from './components/Router';
import './css/App.css';
import './css/flags.css';
import './css/tabs.css';



ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root')
);

