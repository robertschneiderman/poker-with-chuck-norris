import React from 'react';
import Player from './player/player';
import Stage from './stage/stage';
import Interface from './interface/interface';
import { deck } from '../util/deck';


class Game extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pot: 0,
      deck: deck,
      turn: 'pre-flop',
    };
  }

  deal() {
    let cardsToDeal = this.state.deck.splice(4);
    this.setState({deck: this.state.deck});
  }

  setPlayer() {
    //dynamically output players
  }

  render() {
    return(
      <div className="game">
        <ul className="players">
          <Player num={1} />
          <Player num={2} />
        </ul>

        <Stage />

        <Interface deal={this.deal.bind(this)} />
      </div>
    );
  }
}

export default Game;