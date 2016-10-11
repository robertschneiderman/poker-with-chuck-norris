import React from 'react';
import Counter from '../counter';
// import Container from './/_container';

class PlayerDisplay extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let className = (this.props.player.name === 'You') ? "player-info outer you" : "player-info outer chuck";

    let oldBank = oldBank ? document.getElementById('player-worth').innerHTML : 1000;

    return(
      <div className={className}>
        <p className="player-name">{this.props.player.name}</p>
        <Counter id="player-worth" className="player-worth" begin={oldBank} end={this.props.player.bank} />
      </div>
    )
  }
}

export default PlayerDisplay;