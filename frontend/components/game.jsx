import React from 'react';
import Player from './player/player';
import PlayerDisplay from './player/player_display';
import Stage from './stage/stage';
import Modal from 'boron/WaveModal';
import Message from './message';
import Interface from './interface/interface';
import Counter from './counter';
import ShareBtn from './share_btn';
import { deck } from '../util/deck';
import {shuffle, merge, uniq, drop, take, debounce, throttle, isEqual} from 'lodash';
import { RANKS, count, sortNumber, greatestHold, bestHandName, getPokerHand, PokerHand, handName, getHandOdds, getBothHandOdds} from './poker_hands';
import * as svgMessages from './svg_messages';

const roundTimes = 1000;
const aiTime = 1000;

const defaultPlayer = {
  bank: 1000,
  hold: [{
    suit: null,
    rank: null
  },{
    suit: null,
    rank: null
  }],
  hand: '',
  stake: 0,
  name: ''
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
  winner: defaultPlayer
};

const randomNumber = (frm, to) => {
  return (Math.floor(Math.random() * (to - frm) + frm));
};

window.randomNumber = randomNumber;

let locked = false;

class Game extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = defaultState;
    this.state.players[0].name = 'You';
    this.state.players[1].name = 'Chuck';
    
    window.state = this.state;
  }

  componentDidMount() {
    document.addEventListener('keydown', e => {
      this.handleKeypress(e);
    });
  }

  handleKeypress(e) {

    if ((this.state.turn === 0) && (this.state.round !== 0) && (!this.state.autoDeal) && (!this.state.setOver)) {
      let callback = e.key === 'r' ? this.raise.bind(this)
        : e.key === 'f' ? this.fold.bind(this)
        : e.key === 'c' ? this.callOrCheck.bind(this)
        : null;

      this.lock(callback);
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

  lock(callback) {
    if (!locked) {
      locked = true;
      if (!!callback) { callback(); }
      setTimeout(() => { locked = false }, 1050);
    }
  }

  checkGameState() {
    (this.state.winner.name !== '') ? this.collectWinnings() : this.splitPot();

    let gameOver = false;
    this.state.players.forEach(player => {
      if ((player.bank === 0) && (this.state.winner.name !== player.name)) { gameOver = true;
      }
    });

    if (gameOver) {
      this.playFinalSound();
      this.setState({gameOver}, this.showModal.bind(this));
    } else {
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

  chosenStage() {
    let stage = [
      {rank: 4, suit:"clubs"},
      {rank: 14, suit:"diamonds"},
      {rank: 4, suit:"hearts"},
      {rank: 11, suit:"spades"},
      {rank: 4, suit:"clubs"}
    ];

    let hand1 = [
      {rank: 12, suit:"clubs"},
      {rank: 3, suit:"diamonds"}
    ];

    let hand2 = [
      {rank: 7, suit:"clubs"},
      {rank: 7, suit:"diamonds"}
    ]; 

    // newState.players[0].hold = this.chosenStage()[1];

    // newState.players[1].hold = this.chosenStage()[2];


    return [stage, hand1, hand2];  
  }

  deal() {
    let newState = merge({}, this.state);
    let deck = shuffle(this.state.deck);

    newState.players[0].hold = deck.slice(0, 2);
    newState.players[1].hold = deck.slice(2);
    
    newState.deck = cardsToDeal.concat(deck);

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
    let winningPlayer;
    let winningIdx;
    let players;

    players = merge([], this.state.players);

    winningIdx = this.greatestHold(players);

    if ((winningIdx === 0) || (winningIdx === 1)) {
      this.setState({setOver: true, players, winner: players[winningIdx]}, this.displayWinner);
    } else {
      //TIE!
      svgMessages.tie();        
      this.setState({setOver: true, winner: defaultPlayer});        
    }      
  }

  displayWinner(foldSubmessage, delay = 0) {
    let subMessage;
    let losingPlayer = this.getLosingPlayer(this.state.winner);    
    if (foldSubmessage === '') {
      subMessage = ''
    } else {
      subMessage = `${bestHandName(this.state.stage, this.state.winner.hold)} over ${bestHandName(this.state.stage, losingPlayer.hold)}`;
    }

    let gameOver = false;

    setTimeout(() => {      
      if (this.state.winner.name === 'You') {
        this.playSound('win-sound');
        this.chuckSound('won');
        svgMessages.youWon();
      } else {
        this.playSound('lose-sound');
        this.chuckSound('lost');      
        svgMessages.chuckWon();
      }
    }, delay)

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
    // this.state.players[i].hand = handName(this.state.stage, this.state.players[i].hold);
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
    if (this.onePlayerAllIn() && this.allStakesEven()) {
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
    if (!this.state.autoDeal) svgMessages.allIn();
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
    let rn = randomNumber(0, 3);
    if (rn < 2) {
      this.cheapMoveWithFold();
    } else {
      this.cheapMoveWithFold();        
    }
  }

  // cheapMove() {
  //   let move;
  //   let winningIdx = this.greatestHold(this.state.players);
  //   if (winningIdx === 1) {
  //     move = this.moveWhileWinning();
  //   } else {
  //     move = this.callOrCheck;
  //   }
  //   setTimeout(move.bind(this), aiTime);      
  // }

  cheapMoveWithFold() {
    let move;
    let winningIdx = this.greatestHold(this.state.players); 
    let pokerHand = getPokerHand(this.state.stage, this.state.players[1].hold);       

    if (winningIdx === 1) {
      move = this.moveWhileWinning();
    } else if ((pokerHand.rank < 2) && (this.state.round > 2) && (this.currentPlayer().stake < this.otherPlayer().stake)) {
      //will fold after flop if only high card and human player has a greater stake
      move = this.fold;
    } else {
      move = this.callOrCheck;
    }
    setTimeout(move.bind(this), aiTime);      
  } 

  moveWhileWinning() {
    let pokerHand = getPokerHand(this.state.stage, this.state.players[0].hold);
    let rn = randomNumber(0, 3);
    if ( ((pokerHand.rank > 1) || (rn === 0)) && pokerHand.tiebreakers[0] !== 14 && pokerHand.tiebreakers[0] !== 13) {
      return this.raise;
    } else {
      return this.callOrCheck;
    }
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
    let amountToWager 
    
    if (this.otherPlayer().bank !== 0) {
      amountToWager = this.differenceInStake() + 50;
    } else {
      amountToWager = this.differenceInStake();
    }

    return (amountToWager > this.currentPlayer().bank) ? this.currentPlayer().bank : amountToWager; 
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
    this.playSound('fold-sound');

    this.setState({setOver: true, pot, winner: this.otherPlayer()}, this.displayWinner.bind(this, '', 700));
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

  greatestHold(players) {
    return greatestHold.call(this, this.state.stage, [players[0].hold, players[1].hold]);
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

  chuckSound(state) {
    let sounds;
    switch (state) {
      case 'won':
        sounds = ['chuck-angry', 'chuck-whirr', 'chuck-muttering'];
        break;
      case 'lost':
        sounds = ['chuck-laughter', 'chuck-silly-shout', 'chuck-whoa'];
        break;
      default:
        break;
    }

    let rn = randomNumber(0, 3);
    
    this.playSound(sounds[rn]);
  }     

  playFinalSound() {
    if (this.state.winner.name === 'Chuck') {
      this.playSound('infection-giggling');
    } else {
      this.playSound('chuck-crying');
    }
  }

  storyShare() {
    console.log("story share!");

    let title;
    let description;
    let picture;
    let pronounSubj;
    let pronounObj;
    let pronounPoss;

    if (window.playerGender === 'male') {
      pronounPoss = 'he';
      pronounPoss = 'him';
      pronounPoss = 'his';
    } else {
      pronounPoss = 'she';
      pronounObj = 'her';
    }

    if (this.state.winner.name === 'Chuck') {
      title = `${window.playerName} got round house kicked to the face by Chuck Norris!`;
      description = `${window.playerName} had the audacity to challenge Chuck Norris to a game of poker. While we respect ${pronounPoss} bravery, only a fool would challenge a god to a game of Texas Hold\'em`;
      picture = 'http://res.cloudinary.com/stellar-pixels/image/upload/v1476218978/chuck_loser_dmf48m.jpg';
    } else {
      title = `${window.playerName} got all the chips, but Chuck Norris still won`;
      description = `${window.playerName} played a great game of poker against Chuck Norris, but it is truly impossible to beat a god. While he collected all the chips, Chuck Norris was the true winner.`;
      picture = "http://res.cloudinary.com/stellar-pixels/image/upload/v1476219397/chuck_win_svmv8f.jpg"
    }
    FB.init({
      appId      : '1196099127116910',
      xfbml      : true,
      version    : 'v2.8'
    });  
    FB.ui(
     {
      method: 'share',
      href: 'http://pokerwithchucknorris.com',
      title: `${title}`,
      display: 'popup',
      description: `${description}`,
      picture: picture
    }, function(response){});

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));    
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
        <Modal ref="modal" className="modal">
          <h2 className="modal-title">{this.state.winner.name} won!</h2>
          <button id="fb-share-btn" className="share-story-btn" onClick={this.storyShare.bind(this)}>
            <img className="" src="./images/facebook_logo_reversed.svg" />
            <span className="">Share your experience</span>
          </button>          
        </Modal>

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

        <div className="stage-pot-big">
          <p className="stage-pot-label">Pot</p>
          <Counter id="stage-pot" begin={oldPot} end={this.state.pot} />
        </div>

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
          <svg className="message all-in"></svg>
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