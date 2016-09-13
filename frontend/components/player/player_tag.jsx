import React from 'react';
// import Container from './/_container';

class PlayerTag extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="player-tag">
        <div className="player-info">
          <p className="player-name">John</p>
          <p className="player-worth">1,000</p>
        </div>
        <img className="player-avatar" src="https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg" alt=""/>
      </div>
    )
  }
}

export default PlayerTag;