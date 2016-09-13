import React from 'react';
import Player from './player/player';
import Stage from './stage/stage';
import Interface from './interface/interface';
import { deck } from '../util/deck';
import shuffle from 'lodash/shuffle';
import merge from 'lodash/merge';


class Game extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pot: 0,
      deck: deck,
      turn: 'pre-round',
      dealer: 1,
      players: {
        "1": {
          hand: [{
            suit: '',
            rank: ''
          },{
            suit: '',
            rank: ''
          }],
          bank: 1000,
          stake: 50
        },
        "2": {
          hand: [{
            suit: '',
            rank: ''
          },{
            suit: '',
            rank: ''
          }],
          bank: 1000,
          stake: 25
        }
      }
    };
  }

  // pre-round
  // pre-flop
  // flop
  // turn
  // river

  deal() {
    let deck = shuffle(this.state.deck);
    let cardsToDeal = deck.splice(48);
    
    let player1Hand = cardsToDeal.slice(0, 2);
    let player2Hand  = cardsToDeal.slice(2);

    this.setState({
      deck: deck,
      players: {
        '1': { 
          hand: player1Hand,
        },
        '2': {
          hand: player2Hand,
        }
      },
      turn: 'pre-flop'
    });
    debugger;
    this.collectAntes();
  }

  collectAntes() {
    let dealer = String(this.state.dealer);
    let smallAntePlayerIdx = (this.state.dealer + 1);
    let bigAntePlayerIdx = (this.state.dealer + 2);

    if (smallAntePlayerIdx > 2) {
      smallAntePlayerIdx = String(smallAntePlayerIdx % 2);
    }
    if (bigAntePlayerIdx > 2) {
      bigAntePlayerIdx = String(bigAntePlayerIdx % 2);
    }

    let smallAntesBank = this.state.players[smallAntePlayerIdx].bank - 25;
    let bigAntesBank = this.state.players[bigAntePlayerIdx].bank - 50;

    this.setState({
      players: {
        [smallAntePlayerIdx]: { 
          bank: smallAntesBank,
          stake: 25,
          hand: this.state.players[smallAntePlayerIdx].hand
        },
        [bigAntePlayerIdx]: {
          bank: bigAntesBank,
          stake: 50,
          hand: this.state.players[bigAntePlayerIdx].hand               
        }
      },
      turn: 'pre-flop'
    });
    debugger;

  }

  setPlayer() {
    //dynamically output players
  }

  render() {
    window.state = this.state;
    return(
      <div className="game">
        <ul className="players">
          <Player 
            num={1} 
            hand={ this.state.players["1"].hand } 
            bank={ this.state.players["1"].bank } />
          <Player
            num={2}
            hand={ this.state.players["2"].hand }
            bank={ this.state.players["2"].bank } />
        </ul>

        <Stage />

        <Interface 
          deal={this.deal.bind(this)} 
          turn={this.state.turn}
          />
      </div>
    );
  }
}

export default Game;