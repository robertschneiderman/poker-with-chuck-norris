import React from 'react';
import Player from './player/player';
import PlayerDisplay from './player/player_display';
import Stage from './stage/stage';
import Modal from './player/modal';
import Message from './message';
import Interface from './interface/interface';
import { deck } from '../util/deck';
import {shuffle, merge, uniq, drop, take, debounce, isEqual} from 'lodash';
import { RANKS, count, sortNumber, greatestHand, greatestHold, tiebreaker, PokerHand, handName, getHandOdds} from './poker_hands';
import * as svgMessages from './svg_messages';

const roundTimes = 100;
const aiTime = 100;

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
  subMessage: '',
  setOver: false,
  gameOver: false,
  playerAllIn: false,
  players: [ merge({}, defaultPlayer), merge({}, defaultPlayer) ],
  winner: null
};

// rounds = 'pre-round', 'pre-flop', 'flop', 'turn', 'river'


class Game extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = defaultState;
    this.state.dealer = -1;
    this.state.players[0].bank = 1000;
    this.state.players[0].name = 'You';
    this.state.players[1].bank = 1000;
    this.state.players[1].name = 'Chuck';
    
    window.state = this.state;
  }

  componentDidMount() {
    document.addEventListener('keydown', debounce(e => {
      this.handleKeypress(e);
    }, 250));
  }

  handleKeypress(e) {
    if ((this.state.turn === 0) && (this.state.round !== 0)) {
      switch(e.key) {
        case 'r':
          this.raise();
          break;
        case 'f': 
          this.fold();
          break;
        case 'c':
          this.callOrCheck();
          break;
        default:
          break;
      }
    }
    if ((this.state.round === 0) || (this.state.setOver)) {
      switch(e.key) {
        case 'd':
          this.checkGameState();
          break;
        default:
          break;
      }
    }
  }

  checkGameState() {
    this.state.winner ? this.collectWinnings() : this.splitPot();

    let gameOver = false;
    this.state.players.forEach(player => {
      if (player.bank === 0) gameOver = true;
    });

    if (gameOver)
      this.setState({gameOver});
    else {
      this.setState({gameOver}, this.nextSet);
    }
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

    this.playSound('deal-sound');

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

    this.setState(newState, this.nextRound);
  }

  nextRound(advanceRound) {

    let nextRound = (this.state.round + 1);
    let pot;

    if (nextRound !== 1) {
      pot = (this.state.pot + this.state.players[0].stake + this.state.players[1].stake);
      this.resetPlayerStakes();
    }

    if (nextRound > 4) {
      this.setState({
        pot: pot,
      }, this.determineWinner);
    } else if (advanceRound) {
      this.playSound('next-card-sound');
      this.setState({
        deck: this.alterDeck(nextRound).deck,
        stage: this.alterDeck(nextRound).cards,
        pot: pot,
        round: nextRound,
        turn: this.state.dealer,
        looped: false
      }, this.nextTurn);      
    } else {
      this.setState({round: nextRound}, this.nextTurn);  
    }
  }

  determineWinner(playerWhoDidntFold) {
    if (playerWhoDidntFold) {
      return playerWhoDidntFold;
    } else {
      let holds = [this.state.players[0].hold, this.state.players[1].hold];
      let winningHold = greatestHold(this.state.stage, holds);

      let players = merge([], this.state.players);

      if (winningHold) {
        let winningPlayer;
        for (var i = 0; i < players.length; i++) {
          let player = players[i];

          if (isEqual(player.hold, winningHold)) {
            player.hand = handName(this.state.stage, player.hold);
            winningPlayer = player;
          }
        }

        this.setState({setOver: true, winner: winningPlayer}, this.displayWinner);
      } else {
        // IMPLEMENT TIEING!
        svgMessages.tie();        
        this.setState({setOver: true, winner: null}, this.displayWinner);        
      }      
    }
  }

  displayWinner() {

    let gameOver = false;

    if (this.state.winner.name === 'You') {
      this.playSound('win-sound');
      svgMessages.youWon();
    } else {
      this.playSound('lose-sound');
      svgMessages.chuckWon();
    }    

    let losingPlayer = this.getLosingPlayer(this.state.winner);

    let subMessage = `${this.state.winner.hand} over ${losingPlayer.hand}`;

    this.setState({subMessage});
  }     

  collectWinnings() {

    let players = merge([], this.state.players);
    let that = this;

    players.map(player => {
      if (player.name === that.state.winner.name) {
        player.bank += this.state.pot;
      }
    });

    this.setState({players});
  }

  splitPot() {
    let players = merge([], this.state.players);

    players.map(player => {
      player.bank += (this.state.pot / 2);
    });

    this.setState({players});    
  }

  getLosingPlayer(winningPlayer) {
    let i = (winningPlayer.name === 'You') ? 1 : 0;
    this.state.players[i].hand = handName(this.state.stage, this.state.players[i].hold);
    return this.state.players[i];
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
    if (this.state.setOver) {
      let message = `${this.otherPlayer().name} won!`;
      this.determineWinner(this.otherPlayer()); // Player folded
    } else if ( (this.allStakesEven()) && (this.state.looped)) {
      this.nextRound(true);
    } else {
      let nextTurn = (this.state.turn + 1) % 2;

      if (nextTurn === this.state.dealer) { //FIX!!!!!!!!!
        this.setState({ turn: nextTurn, subMessage: '', looped: true }, this.aiFormulateMove);
      } else {
        this.setState({ turn: nextTurn, subMessage: '' }, this.aiFormulateMove);        
      }   
    }
  }  

  allStakesEven() {
    let stakes = this.state.players.map(player => player.stake);
    let val = (uniq(stakes).length === 1)
    return val;
  }

  aiMove(odds) {
    let move;
    let wOdds = odds.win;
    if ((wOdds < 0.33) && (this.state.players[1].stake < this.state.players[0].stake)) {
      move = this.fold;
    } else if (wOdds < 0.66) {
      move = this.callOrCheck;
    } else {
      move = this.raise;
    }    

    setTimeout(move.bind(this), aiTime);
  }

  aiFormulateMove() {
    if (this.state.turn !== 1) return;

    let randomNumber = Math.floor(Math.random() * 1);

    // implement a confidence factor based on how much human player bets... bluff only when safe...

    if (randomNumber === 0) {
      setTimeout(this.raise.bind(this), aiTime); // bluff
    } else if (randomNumber === 1) {
      setTimeout(this.callOrCheck.bind(this), aiTime); // slow play
    } else {
      // let odds = getHandOdds(this.state.stage, this.state.players[1].hold, this.aiMove.bind(this));
    }
  }

  smartMove(odds) {
    // return (this.state.players[1].pot * odds); 
  }  

  callOrCheck() {
    let newState = merge({}, this.state);
    let turnStr = String(this.state.turn);
    let oldStake = newState.players[this.currentIndex()].stake;
    let otherStake = newState.players[this.otherIndex()].stake;

    let sound = 'checked-sound';

    if (oldStake < otherStake) {
      newState.players[turnStr].stake = otherStake;
      newState.players[turnStr].bank -= (otherStake - oldStake);
      
      // message = 'Called';
      svgMessages.called();

      sound = 'called-sound';
    } else {
      svgMessages.checked();
      // this.playSound('check-sound');
    }

    this.playSound(sound);

    this.setState(newState, this.displayMessage);
  }

  raise() {
    let turnStr = String(this.state.turn)    
    let newState = merge({}, this.state);
    let highestStake = this.highestStake();

    let playerStake = newState.players[turnStr].stake;
    let otherPlayerStake = this.otherPlayer().stake;

    let differenceInStake = highestStake - playerStake;

    let amountToWager = differenceInStake + 50;

    amountToWager = (amountToWager > newState.players[turnStr].bank) ? newState.players[turnStr].bank : amountToWager;

    newState.players[turnStr].stake += amountToWager;
    newState.players[turnStr].bank -= amountToWager;

    this.playSound('raise-sound');

    if (highestStake === 0) {
      svgMessages.raised();
    } else if ( (this.state.round === 1) && ((otherPlayerStake === 25) || (otherPlayerStake === 50)) ) {
      svgMessages.raised();    
    } else {
      svgMessages.reraised();
    }
    
    this.setState(newState, this.displayMessage);
  }

  fold() {
    // duplicated in 'nextRound'
    let pot = (this.state.pot + this.state.players[0].stake + this.state.players[1].stake);

    svgMessages.folded();

    setTimeout(() => {

      if (this.currentPlayer().name === 'You') {
        svgMessages.chuckWon();
        this.playSound('lose-sound');
      } else {
        svgMessages.youWon();
        this.playSound('win-sound');
      }
    }, 700);   

    this.setState({
      pot: pot,
      setOver: true
    }, this.displayMessage);
  }

  playSound(selector) {
    let sound = document.getElementById(selector);
    sound.play();    
  }

  displayMessage(message) {
    setTimeout(this.nextTurn.bind(this), 700);
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
    let subMessageClass = this.state.subMessage === '' ? 'message-sub none' : 'message-sub';    
    return(
      <div className="game">

        <main className="main">
          <div className="table">
            <Modal gameOver={this.state.gameOver} />
            <ul className="players">
              <Player
                num={0}
                dealer={this.state.dealer}
                round={this.state.round}
                turn={this.state.turn}
                player={this.state.players[0]} />
              <Player
                num={1}
                setOver={this.state.setOver}
                dealer={this.state.dealer}
                round={this.state.round}
                turn={this.state.turn}
                player={this.state.players[1]} />
            </ul>
          
            <Stage 
              pot={this.state.pot} 
              cards={this.state.stage} />
          </div>
        </main>

        <PlayerDisplay player={this.state.players[0]} />
        <PlayerDisplay player={this.state.players[1]} />

        <Interface
          nextSet={this.nextSet.bind(this)}
          setOver={this.state.setOver}           
          round={this.state.round}
          turn={this.state.turn}
          players={this.state.players}
          callOrCheck={this.callOrCheck.bind(this)}
          fold={this.fold.bind(this)}
          message={this.state.message}
          raise={this.raise.bind(this)} />

        <div className="message-container">
          <svg className="message raised"></svg>
          <svg className="message reraised"></svg>
          <svg className="message called"></svg>
          <svg className="message checked"></svg>
          <svg className="message folded"></svg>
          <svg className="message chuck-won"></svg>
          <svg className="message you-won"></svg>
          <svg className="message tie"></svg>
        </div>

        <p className={subMessageClass}>{this.state.subMessage}</p>

      </div>
    );
  }
}

export default Game;