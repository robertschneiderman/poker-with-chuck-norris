import React from 'react';
import Player from './player/player';
import PlayerDisplay from './player/player_display';
import Stage from './stage/stage';
import Modal from './player/modal';
import Message from './message';
import Interface from './interface/interface';
import Counter from './counter';
import ShareBtn from './share_btn';
import { deck } from '../util/deck';
import {shuffle, merge, uniq, drop, take, debounce, isEqual} from 'lodash';
import { RANKS, count, sortNumber, greatestHand, greatestHold, tiebreaker, PokerHand, handName, getHandOdds, getBothHandOdds} from './poker_hands';
import * as svgMessages from './svg_messages';

const roundTimes = 100;
const aiTime = 100;

const defaultPlayer = {
  bank: 100,
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
  dealer: 0,
  deck: deck,
  round: 0,
  turn: 0,
  stage: [],
  looped: false,
  message: '',
  subMessage: '',
  setOver: false,
  gameOver: false,
  autoDeal: false,
  players: [ merge({}, defaultPlayer), merge({}, defaultPlayer) ],
  winner: null
};

class Game extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = defaultState;
    this.state.players[0].name = 'You';
    this.state.players[1].name = 'Chuck';
    
    window.state = this.state;
  }

  componentDidMount() {
    document.addEventListener('keydown', debounce(e => {
      this.handleKeypress(e);
    }, 250));
  }

  handleKeypress(e) {
    if ((this.state.turn === 0) && (this.state.round !== 0) && (!this.state.autoDeal)) {
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
      if ((player.bank === 0) && (this.state.winner.name !== player.name)) { gameOver = true;
      }
    });

    if (gameOver)
      this.setState({gameOver}, this.showModal);
    else {
      this.setState({gameOver}, this.nextSet);
    }
  } 

  nextSet() {
    let player1Bank = this.state.players[0].bank;
    let player2Bank = this.state.players[1].bank;

    let newState = merge({}, defaultState);
    newState.dealer = (this.state.dealer + 1) % 2;
    newState.turn = newState.dealer;
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
        turn: this.state.dealer,
        round: nextRound,
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
        this.setState({setOver: true, winner: null});        
      }      
    }
  }

  displayWinner() {

    let gameOver = false;

    debugger;

    if (this.state.winner.name === 'You') {
      this.playSound('win-sound');
      this.chuckSound('won');
      svgMessages.youWon();
    } else {
      this.playSound('lose-sound');
      this.chuckSound('lost');      
      svgMessages.chuckWon();
    }    

    let losingPlayer = this.getLosingPlayer(this.state.winner);

    let subMessage = `${this.state.winner.hand} over ${losingPlayer.hand}`;

    this.setState({subMessage});
  }

  chuckSound(state) {
    let sounds;
    switch (state) {
      case 'won':
        sounds = ['chuck-disagree', 'chuck-annoyed', 'chuck-dammit'];
        break;
      case 'lost':
        sounds = ['chuck-laughter', 'chuck-silly-shout', 'chuck-whoa'];
        break;
      default:
        break;
    }

    let randomNumber = Math.floor(Math.random() * (3 - 0) + 0);
    
    this.playSound(sounds[randomNumber]);
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
    } else if (this.onePlayerAllIn() && this.allStakesEven()) {
      setTimeout(this.autoDeal.bind(this), 1000); // Player All In
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
  
  autoDeal() {
    this.setState({autoDeal: true}, this.nextRound.bind(this, true));
  }

  onePlayerAllIn() {
    for (var i = 0; i < this.state.players.length; i++) {
      if (this.state.players[i].bank === 0) return true;
    }
    return false;
  }

  currentPlayerAllIn() {
    return (this.currentPlayer().bank === 0) ? true : false;
  }  

  allStakesEven() {
    let stakes = this.state.players.map(player => player.stake);
    let val = (uniq(stakes).length === 1)
    return val;
  }

  aiFormulateMove() {
    if (this.state.turn !== 1) return;

    let randomNumber = Math.floor(Math.random() * (4 - 0 + 4)) + 0;
    // implement a confidence factor based on how much human player bets... bluff only when safe...

    if (randomNumber === 0) {
      setTimeout(this.raise.bind(this), aiTime); // bluff
    } else if (randomNumber === 1) {
      setTimeout(this.callOrCheck.bind(this), aiTime); // slow play
    } else if (this.state.round === 4) {
      getHandOdds(this.state.stage, this.state.players[1].hold, this.smartMove.bind(this));
    } else {
      getBothHandOdds(this.state.stage, this.state.players[1].hold, this.state.players[0].hold, this.cheapMove.bind(this));
    }
  }

  cheapMove(aiOdds, humanOdds) {
    let move;    
    let oddsDiff = aiOdds.win - humanOdds.win;
    if (oddsDiff > 0) {
      move = this.raise;
    } else {
      move = this.callOrCheck;
    }

    setTimeout(move.bind(this), aiTime);      
  }

  smartMove(aiOdds) {
    let move;
    let wOdds = aiOdds.win;
    if ((wOdds < 0.33) && (this.state.players[1].stake < this.state.players[0].stake)) {
      move = this.fold;
    } else if (wOdds < 0.66) {
      move = this.callOrCheck;
    } else {
      move = this.raise;
    }    

    setTimeout(move.bind(this), aiTime);
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
    let amountToWager = this.amountToWager();

    this.currentPlayer().stake += amountToWager;
    this.currentPlayer().bank -= amountToWager;

    this.playSound('raise-sound');

    if (this.highestStake() === 50) {
      svgMessages.raised();
    } else if (this.raisedinFirstRound()) {
      svgMessages.raised();    
    } else {
      svgMessages.reraised();
    }
    
    let newState = merge({}, this.state);
    newState.players = this.updatePlayerState(this.currentPlayer());
    this.setState(newState, this.displayMessage);
  }

  updatePlayerState(newPlayer) {
    return this.state.players.map(player => {
      return (player.name === newPlayer.name) ? newPlayer : player;
    });
  }

  raisedinFirstRound() {
    if (this.state.round !== 1) return false;
    if (this.currentPlayer().stake === 25) return true;
    if ((this.currentPlayer().stake === 100) && (this.otherPlayer().stake === 50)) return true;
  }

  amountToWager() {
    let amountToWager = this.differenceInStake() + 50;

    return (amountToWager > this.currentPlayer().bank) ? this.currentPlayer().bank : amountToWager;
    // amountToWager = (amountToWager > (this.otherPlayer().bank + this.differenceInStake())) ? (this.otherPlayer().bank + this.differenceInStake()) : amountToWager;    
  }

  differenceInStake() {
    let highestStake = this.highestStake();
    let playerStake = this.currentPlayer().stake;

    return highestStake - playerStake;    
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

  showModal() {
    this.refs.modal.show();    
  }

  render() {
    window.state = this.state;
    let subMessageClass = this.state.subMessage === '' ? 'message-sub none' : 'message-sub';


    let oldPot = oldPot ? oldPot : 0;

    if (oldPot !== this.state.pot) {
      oldPot = document.getElementById('stage-pot').innerHTML;
    }

    // <Modal gameOver={this.state.gameOver} winner={this.state.winner} />
    return(
      <div className="game">
        <Modal refs="modal" className="modal">
          <h2>{this.state.winner} won!</h2>
          <button onClick={this.hideModal}>Close</button>
        </Modal>

        <div id="fb-root"></div>
        <ShareBtn />

        <main className="main">
          <div className="table">
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

        <Counter id="stage-pot" className="stage-pot-big" begin={oldPot} end={this.state.pot} />

        <PlayerDisplay player={this.state.players[0]} />
        <PlayerDisplay player={this.state.players[1]} />

        <Interface
          checkGameState={this.checkGameState.bind(this)}
          setOver={this.state.setOver}           
          round={this.state.round}
          turn={this.state.turn}
          players={this.state.players}
          callOrCheck={this.callOrCheck.bind(this)}
          fold={this.fold.bind(this)}
          message={this.state.message}
          autoDeal={this.state.autoDeal}
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