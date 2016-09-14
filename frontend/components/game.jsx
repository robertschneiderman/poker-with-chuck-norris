import React from 'react';
import Player from './player/player';
import Stage from './stage/stage';
import Interface from './interface/interface';
import { deck } from '../util/deck';
import shuffle from 'lodash/shuffle';
import merge from 'lodash/merge';
import uniq from 'lodash/uniq';
import drop from 'lodash/drop';
import take from 'lodash/take';

Array.prototype.myRotate = function (pivot = 1) {

  let pivotConv = pivot % this.length;

  let left = this.slice(0, pivotConv);
  let right = this.slice(pivotConv);

  return right.concat(left);

};

const defaultPlayer = {
  hand: [{
    suit: '',
    rank: ''
  },{
    suit: '',
    rank: ''
  }],
  bank: 1000,
  stake: 0
};

const defaultState = {
  pot: 0,
  deck: deck,
  round: 0,
  dealer: 0,
  turn: 0,
  stage: [],
  looped: false,
  players: [ merge({}, defaultPlayer), merge({}, defaultPlayer) ]
}

// rounds = 'pre-round', 'pre-flop', 'flop', 'turn', 'river'

class Game extends React.Component {

  constructor(props) {
    super(props);

    this.state = defaultState;
  }

  nextSet() {
    let player1Bank = this.state.players[0].bank;
    let player2Bank = this.state.players[1].bank;

    let newState = merge({}, defaultState);
    newState.players[0].bank = player1Bank;
    newState.players[1].bank = player2Bank;

    debugger;
    this.setState(newState, this.deal);
  }  

  deal() {
    let deck = shuffle(this.state.deck);
    let cardsToDeal = deck.splice(48);
    let newState = merge({}, this.state);

    newState.players[0].hand = cardsToDeal.slice(0, 2);
    newState.players[1].hand = cardsToDeal.slice(2);
    newState.deck = deck;
    newState.round = 1;

    // debugger;
    this.setState(newState, this.collectAntes);
  }

  collectAntes() {
    let dealer = String(this.state.dealer);
    let smallIdx = (this.state.dealer + 1) % 2;
    let bigIdx = (this.state.dealer + 2) % 2;

    let newState = merge({}, this.state);
    newState.players[smallIdx].bank -= 25;
    newState.players[smallIdx].stake += 25;
    newState.players[bigIdx].bank -= 50;
    newState.players[bigIdx].stake += 50;

    // debugger;
    this.setState(newState, this.nextTurn);
  }

  nextRound() {
    let nextRound = (this.state.round + 1)
    let pot = (this.state.pot + this.state.players[0].stake + this.state.players[1].stake)
    
    // let stageCards
    this.resetPlayerStakes();

    this.setState({
      deck: this.alterDeck(nextRound).deck,
      stage: this.alterDeck(nextRound).cards,
      pot: pot,
      round: nextRound,
      turn: this.state.dealer,
      looped: false
    }, this.nextTurn);
  }

  resetPlayerStakes() {
    let newState = merge({}, this.state);
    newState.players[0].stake = 0;
    newState.players[1].stake = 0;
    this.setState(newState);
  }  

  alterDeck(round) {
    let deck = this.state.deck;
    let cards;
    switch (round) {
      case 2:
        cards = take(deck, 3);
        deck = drop(deck, 3);
        return {deck, cards: cards.concat(this.state.stage)};
      case (3):
        cards = take(deck, 1);
        deck = drop(deck, 1);
        return {deck, cards: cards.concat(this.state.stage)};
      case (4):
        cards = take(deck, 1);
        deck = drop(deck, 1);
        return {deck, cards: cards.concat(this.state.stage)};        
      default:
        return [];       
    }
  }

  nextTurn() {
    if ( (this.allStakesEven()) && (this.state.looped)) {
      //end of round
      this.nextRound();
    } else if (this.state.round > 4) {
        this.nextSet();
    } else {
      let nextTurn = (this.state.turn + 1) % 2;

      if (nextTurn === this.state.dealer) {
        this.setState({ turn: nextTurn, looped: true }, this.aiMove);
      } else {
        this.setState({ turn: nextTurn }, this.aiMove);        
      }   
    }
  }

  allStakesEven() {
    let stakes = this.state.players.map(player => player.stake);
    let val = (uniq(stakes).length === 1)
    return val;
  }

  aiMove() {
    // debugger;
    if (this.state.turn === 1) {
      this.callOrCheck();
    }
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
    return (this.state.turn === 0) ? this.state.players[1] : this.state.players[0];
  }

  currentIndex() {
    return (this.state.turn === 0) ? 0 : 1;
  }  

  otherIndex() {
    return (this.state.turn === 0) ? 1 : 0;
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
            player={this.state.players[0]} />
          <Player
            num={1}
            round={this.state.round}
            turn={this.state.turn}
            player={this.state.players[1]} />
        </ul>

        <Stage pot={this.state.pot} cards={this.state.stage} />

        <Interface
          nextSet={this.nextSet.bind(this)} 
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