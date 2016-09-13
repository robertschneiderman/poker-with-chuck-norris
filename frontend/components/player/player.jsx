import React from 'react';
import PlayerTag from './player_tag';
import Hand from './hand';

class Player extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let className = `player player-${this.props.num}`
    return(
      <li className={className}>
        <PlayerTag />
        <Hand />
      </li>
    )
  }
}

export default Player;