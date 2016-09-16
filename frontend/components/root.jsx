import React from 'react';
import { Provider } from 'react-redux';
import Game from './game';


  // <Provider store={store}>
const Root = ({ store }) => (
    <div className="">
      <img className="logo" src="http://res.cloudinary.com/stellar-pixels/image/upload/v1474005754/poker-chuck-logo_tsexg6.png" alt=""/>
      <Game />
    </div>
);
  // </Provider>

export default Root;

