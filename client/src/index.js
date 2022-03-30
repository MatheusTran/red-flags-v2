import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './components/Router';
import './css/App.css';
import './css/flags.css';
import './css/tabs.css';

const root= ReactDOM.createRoot(document.getElementById('root'))
//remove react strictmode in the future

root.render(
    <Router />
);

