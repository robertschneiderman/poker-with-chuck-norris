import React from 'react';
// import Container from './/_container';

class PlayerDisplay extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let className = (this.props.player.name === 'You') ? "player-info outer you" : "player-info outer chuck";

    return(
      <div className={className}>
        <p className="player-name">{this.props.player.name}</p>
        <p className="player-worth">{this.props.player.bank}</p>
      </div>
    )
  }
}

export default PlayerDisplay;