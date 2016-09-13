import React from 'react';
import { Provider } from 'react-redux';
import Game from './game';


  // <Provider store={store}>
const Root = ({ store }) => (
    <Game />
);
  // </Provider>

export default Root;

