import React from 'react';
import ReactDOM from 'react-dom';//Components
import Root from './components/root';
// import configureStore from './store/store';

document.addEventListener('DOMContentLoaded', () => {
  // let store;
  // store = configureStore();

  // window.store = store;  

  const root = document.getElementById('root');
  // ReactDOM.render(<Root store={store}/>, root);
  ReactDOM.render(<Root />, root);
});