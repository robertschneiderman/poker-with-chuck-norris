export const callOrCheck = () => {
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

export const raise = () => {
  debugger;
  let turnStr = String(this.state.turn);    
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

export const fold = () => {
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