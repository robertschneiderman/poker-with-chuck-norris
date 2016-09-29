import React from 'react';
import PlayerTag from './player_tag';
import Counter from './counter';


class Player extends React.Component {

  constructor(props) {
    super(props);
  }

  getPlayerClass() {
    if (this.props.num !== 0) {
      this.playerClass = `player player-${this.props.num} hiddenCards`;
    } else {
      this.playerClass = `player player-${this.props.num}`;      
    }

    if (this.props.turn === this.props.num) {
      this.playerClass = `${this.playerClass} active`;
    }

    if (this.props.setOver) {
      this.playerClass = `player player-${this.props.num}`;
    }
  }

  getDealerClass() {
    this.dealerClass = (this.props.dealer === this.props.num) ? 'dealer' : 'none'
  }

  getCardClasses() {
    let hold = this.props.player.hold;

    if (hold[this.props.num].suit) {
      this.card1Class = `card ${hold[0].suit} rank${hold[0].rank}`;
      this.card2Class = `card ${hold[1].suit} rank${hold[1].rank}`;
    } else {
      this.card1Class = 'hidden';
      this.card2Class = 'hidden';
    }

    if ((this.props.num === 0) || (this.props.setOver)) {
      this.face1Class = 'face';
      this.face2Class = 'face';      
    } else {
      this.face1Class = 'back';
      this.face2Class = 'back';       
    }
  }

  getMessageClass() {
    this.messageClass = (this.props.turn === this.props.num) ? 'message' : 'message hidden';
  }

  render() {
    this.getPlayerClass();
    this.getDealerClass();
    this.getCardClasses();
    this.getMessageClass();
    // aiMove()
    
    let player = this.props.player;

    let avatarLink = (this.props.num === 0) ? "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg" : "http://res.cloudinary.com/stellar-pixels/image/upload/v1474005893/chuck-norris_loijrf.jpg";

    let oldBank = 1000;

    debugger;

    if (parseInt(document.querySelectorAll('.player-worth')[this.props.turn])) {
      if (oldBank === player.bank) {
        oldBank = oldBank.innerHTML;
      }
      let oldStake = parseInt(document.querySelectorAll('.player-stake')[this.props.turn].innerHTML);
    }
            // <p className="player-worth">{player.bank}</p>


    return(
      <li className={this.playerClass}>

        <div className="player-tag">
          <div className="player-stake">{player.stake}</div>
          <div className={this.dealerClass}>D</div>

          <img className="player-avatar" src={avatarLink} alt=""/>

          <div className="player-info">
            <p className="player-name">{player.name}</p>
            <Counter begin={oldBank} end={player.bank} />
          </div>

        </div>

        <div className="player-hold">
          <div className={this.card1Class}>
            <div className={this.face1Class}></div>
          </div>

          <div className={this.card2Class}>
            <div className={this.face2Class}></div>
          </div>
        </div>        
      </li>
    )
        // <Hand />
  }
}

export default Player;