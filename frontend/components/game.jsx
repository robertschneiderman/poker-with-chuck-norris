import React from 'react';
import Player from './player/player';
import Stage from './stage/stage';
import Modal from './player/modal';
import Interface from './interface/interface';
import { deck } from '../util/deck';
import shuffle from 'lodash/shuffle';
import merge from 'lodash/merge';
import uniq from 'lodash/uniq';
import drop from 'lodash/drop';
import take from 'lodash/take';
import isEqual from 'lodash/isEqual';
import { RANKS, count, sortNumber, greatestHand, greatestHold, tiebreaker, PokerHand} from './poker_hands';

Array.prototype.myRotate = function (pivot = 1) {

  let pivotConv = pivot % this.length;

  let left = this.slice(0, pivotConv);
  let right = this.slice(pivotConv);

  return right.concat(left);

};

const defaultPlayer = {
  hold: [{
    suit: null,
    rank: null
  },{
    suit: null,
    rank: null
  }],
  hand: '',
  stake: 0
};

const defaultState = {
  pot: 0,
  deck: deck,
  round: 0,
  turn: 0,
  stage: [],
  looped: false,
  message: '',
  setOver: false,
  gameOver: false,
  playerAllIn: false,
  players: [ merge({}, defaultPlayer), merge({}, defaultPlayer) ]
}

// rounds = 'pre-round', 'pre-flop', 'flop', 'turn', 'river'

const roundTimes = 1000;

class Game extends React.Component {

  constructor(props) {
    super(props);

    
    this.state = defaultState;
    this.state.dealer = -1;
    this.state.players[0].bank = 1000;
    this.state.players[0].name = 'You';
    this.state.players[1].bank = 1000;
    this.state.players[1].name = 'Chuck Norris';

  }

  nextSet() {
    let player1Bank = this.state.players[0].bank;
    let player2Bank = this.state.players[1].bank;

    let newState = merge({}, defaultState);
    newState.dealer = (this.state.dealer + 1) % 2;
    newState.players[0].bank = player1Bank;
    newState.players[1].bank = player2Bank;

    this.setState(newState, this.deal.bind(this));
  }  

  deal() {
    let deck = shuffle(this.state.deck);
    let cardsToDeal = deck.splice(48);
    let newState = merge({}, this.state);

    newState.players[0].hold = cardsToDeal.slice(0, 2);
    newState.players[1].hold = cardsToDeal.slice(2);
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
    let nextRound = (this.state.round + 1);
    // debugger;
    let pot = (this.state.pot + this.state.players[0].stake + this.state.players[1].stake)
    
    this.resetPlayerStakes();

    if (nextRound > 4) {
      this.setState({
        pot: pot,
      }, this.collectWinnings);
    } else {
      this.setState({
        deck: this.alterDeck(nextRound).deck,
        stage: this.alterDeck(nextRound).cards,
        pot: pot,
        round: nextRound,
        turn: this.state.dealer,
        looped: false
      }, this.nextTurn);      
    }
  } 

  collectWinnings(playerWhoDidntFold) {
    // debugger;

    let winningPlayer = this.determineWinner(playerWhoDidntFold);


    let players = merge([], this.state.players);

    players.map(player => {
      if (isEqual(player, winningPlayer)) {
        player.bank += this.state.pot;
      }
    });
    // console.log("winningHold:", winningHold);
    // debugger;
    this.setState({players}, this.displayWinner.bind(this, `${winningPlayer.name} won!`));
  }


  determineWinner(playerWhoDidntFold) {
    if (playerWhoDidntFold) {
      return playerWhoDidntFold
    } else {
      let holds = [this.state.players[0].hold, this.state.players[1].hold];
      let winningHold = greatestHold(this.state.stage, holds);

      let players = merge([], this.state.players);

      if (winningHold) {

        for (var i = 0; i < players.length; i++) {
          if (isEqual(players[i].hold, winningHold)) {
            return players[i];
          }
        };      
      } else {
        // IMPLEMENT TIEING!
      }      
    }
  }

  // winnersHand() {

  // }

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
      this.nextRound();
    } else {
      let nextTurn = (this.state.turn + 1) % 2;

      if (nextTurn === this.state.dealer) { //FIX!!!!!!!!!
        this.setState({ turn: nextTurn, message: '', looped: true }, this.aiMove);
      } else {
        this.setState({ turn: nextTurn, message: '', }, this.aiMove);        
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
    let randomMove = this.aiFormulateMove();
    if (this.state.turn === 1) {
      setTimeout(randomMove.bind(this), roundTimes);
    }
  }

  aiFormulateMove() {
    let randomIndeces = [0, 0, 0, 0, 1, 1, 1];
    let randomIndex = randomIndeces[Math.floor(Math.random() * randomIndeces.length)];

    let moves = [this.callOrCheck, this.raise, this.fold]
    let randomMove = moves[randomIndex];    

    return randomMove;
  }

  callOrCheck() {
    let newState = merge({}, this.state);
    let turnStr = String(this.state.turn);
    let oldStake = newState.players[this.currentIndex()].stake;
    let otherStake = newState.players[this.otherIndex()].stake;

    let message = 'Checked';

    if (oldStake < otherStake) {
      newState.players[turnStr].stake = otherStake;
      newState.players[turnStr].bank -= (otherStake - oldStake);
      
      message = 'Called';
    }

    this.setState(newState, this.displayMessage.bind(this, message));
  }

  raise() {
    let turnStr = String(this.state.turn)    
    let newState = merge({}, this.state);
    let highestStake = this.highestStake();

    let playerStake = newState.players[turnStr].stake;
    let otherPlayerStake = this.otherPlayer().stake;

    let differenceInStake = highestStake - playerStake;

    let amountToWager = differenceInStake + 50;

    amountToWager = (amountToWager > newState.players[turnStr].bank) ? amountToWager : newState.players[turnStr].bank;

    newState.players[turnStr].stake += amountToWager;
    newState.players[turnStr].bank -= amountToWager;

    let message = 'Reraised';

    if (highestStake === 0) {
      message = 'Raised';
    }

    if ( (this.state.round === 1) && ((otherPlayerStake === 25) || (otherPlayerStake === 50)) ) {
      message = 'Raised';
    }
    
    this.setState(newState, this.displayMessage.bind(this, message));
  }

  fold() {
    // duplicated in 'nextRound'
    let pot = (this.state.pot + this.state.players[0].stake + this.state.players[1].stake)

    this.setState({
      pot: pot,
    }, this.collectWinnings.bind(this, this.otherPlayer()));
  }

  displayWinner(message) {

    let gameOver = false;

    this.state.players.forEach(player => {
      if (player.bank === 0) {
        gameOver = true;
      }
    })

    this.setState({message, setOver: true, gameOver});
    // setTimeout(this.nextSet.bind(this), 2000);
  }  

  displayMessage(message) {
    this.setState({message});
    setTimeout(this.nextTurn.bind(this), roundTimes)
  }

  highestStake() {
    let highestStake = 0;
    this.state.players.forEach(player => {
      if (player.stake > highestStake) highestStake = player.stake;
    });
    return highestStake;
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
        <Modal gameOver={this.state.gameOver} />
        <ul className="players">
          <Player
            num={0}
            dealer={this.state.dealer}
            round={this.state.round}
            turn={this.state.turn}
            message={this.state.message}            
            player={this.state.players[0]} />
          <Player
            num={1}
            setOver={this.state.setOver}
            dealer={this.state.dealer}
            round={this.state.round}
            turn={this.state.turn}
            message={this.state.message}            
            player={this.state.players[1]} />
        </ul>

        <Stage 
          pot={this.state.pot} 
          cards={this.state.stage}
          message={this.state.message} />

        <Interface
          nextSet={this.nextSet.bind(this)}
          setOver={this.state.setOver}           
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