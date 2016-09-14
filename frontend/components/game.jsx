import React from 'react';
import Player from './player/player';
import Stage from './stage/stage';
import Interface from './interface/interface';
import { deck } from '../util/deck';
import shuffle from 'lodash/shuffle';
import merge from 'lodash/merge';

Array.prototype.myRotate = function (pivot = 1) {

  let pivotConv = pivot % this.length;

  let left = this.slice(0, pivotConv);
  let right = this.slice(pivotConv);

  return right.concat(left);

};

// rounds = 'pre-round', 'pre-flop', 'flop', 'turn', 'river'

class Game extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pot: 0,
      deck: deck,
      round: 0,
      dealer: 0,
      turn: 0,
      stage: [],
      looped: false,
      players: [{
          hand: [{
            suit: '',
            rank: ''
          },{
            suit: '',
            rank: ''
          }],
          bank: 1000,
          stake: 0
        }, {
          hand: [{
            suit: '',
            rank: ''
          },{
            suit: '',
            rank: ''
          }],
          bank: 1000,
          stake: 0
        }
      }];
  }

  deal() {
    let deck = shuffle(this.state.deck);
    let cardsToDeal = deck.splice(48);
    
    let player1Hand = cardsToDeal.slice(0, 2);
    let player2Hand  = cardsToDeal.slice(2);

    this.setState({
      deck: deck,
      players: [{
          bank: this.state.players[0].bank,
          stake: this.state.players[0].stake,
          hand: player1Hand,
        }, {
          bank: this.state.players[1].bank,
          stake: this.state.players[1].stake,
          hand: player2Hand
        }
      ],
      round: 1
    }, this.collectAntes);
  }

  collectAntes() {
    let dealer = String(this.state.dealer);
    let smallAntePlayerIdx = (this.state.dealer + 1) % 2;
    let bigAntePlayerIdx = (this.state.dealer + 2) % 2;

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
        },
      }
    }, this.nextTurn);
  }

  nextRound() {
    let nextRound = (this.state.round + 1);
    let pot = (this.state.players['0'].stake + this.state.players['1'].stake)
    
    // let stageCards
    debugger;

    this.setState({
      stage: this.stageCards(nextRound),
      pot: pot,
      round: nextRound,
      turn: this.state.dealer,
      looped: false
    });
  }

  stageCards(round) {
    let deck = this.state.deck;
    let cards;
    switch (round) {
      case 2:
        cards = [deck.pop(), deck.pop(), deck.pop()];
        return cards;
      case 3:
        cards = [deck.pop()]
        return cards;
      case 4:
        cards = [deck.pop()]
        return cards; 
      default:
        return [];       
    }
  }

  nextTurn() {
    if ( () && (this.state.looped)) {
      //end of round
      this.nextRound();
    } else {
      let nextTurn = (this.state.turn + 1) % 2;
      this.checkLooped(nextTurn);
      this.setState({ turn: nextTurn }, this.aiMove);      
    }
  }

  checkLooped(turn) {
    if (turn === this.state.dealer) {
      this.setState(looped: true);
    }
  }

  allStakesEven() {
    let stakes = this.state.players.map(player => player.stake);

  }

  aiMove() {
    // debugger;
    if (this.state.turn === 1) {
      this.callOrCheck();
    }
  }

  getHighestStake() {
    let stake1 = this.state.players['0'].stake;
    let stake2 = this.state.players['1'].stake;
    return (stake1 > stake2) ? stake1 : stake2;
  }

  callOrCheck() {
    let newState = merge({}, this.state);
    let turnStr = String(this.state.turn);
    let oldStake = newState.players[this.currentIndex()].stake;
    let otherStake = newState.players[this.otherIndex()].stake;

    if (oldStake < otherStake) {
      newState.players[turnStr].stake = otherStake;
      newState.players[turnStr].bank -= (otherStake - oldStake);
    }

    // debugger;
    this.setState(newState, this.nextTurn);
  }

  raise() {
    let turnStr = String(this.state.turn)    
    let newState = merge({}, this.state);
    newState.players[turnStr].stake += 50;
    newState.players[turnStr].bank -= 50;

    this.setState(newState, this.nextTurn);
  }

  fold() {

    let pot = (this.state.pot + this.currentPlayer().stake);
    let otherPlayerBank = this.otherPlayer().bank + pot;

    let newState = merge({}, this.state);
    newState.pot = 0;
    newState.players[this.otherIndex()].bank = otherPlayerBank;
  }

  currentPlayer() {
    return this.state.players[this.state.turn];
  }

  otherPlayer() {
    return (this.state.turn === '0') ? this.state.players['1'] : this.state.players['0'];
  }

  currentIndex() {
    return (this.state.turn === '0') ? '0' : '1';
  }  

  otherIndex() {
    return (this.state.turn === '0') ? '1' : '0';
  }

  render() {
    window.state = this.state;
    return(
      <div className="game">
        <ul className="players">
          <Player 
            num={0}
            round={this.state.round}
            turn={this.state.turn}
            player={this.state.players['0']} />
          <Player
            num={1}
            round={this.state.round}
            turn={this.state.turn}
            player={this.state.players['1']} />
        </ul>

        <Stage pot={this.state.pot} cards={this.state.stage} />

        <Interface
          deal={this.deal.bind(this)} 
          round={this.state.round}
          turn={this.state.turn}
          players={this.state.players}
          callOrCheck={this.callOrCheck.bind(this)}
          fold={this.fold.bind(this)}
          raise={this.raise.bind(this)}
          />
      </div>
    );
  }
}

export default Game;