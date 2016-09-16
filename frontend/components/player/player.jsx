import React from 'react';
import PlayerTag from './player_tag';

class Player extends React.Component {

  constructor(props) {
    super(props);
  }

  getPlayerClass() {
    this.playerClass = `player player-${this.props.num}`;

    if (this.props.turn === this.props.num) {
      this.playerClass = `player player-${this.props.num} active`;
    }
  }

  getDealerClass() {
    this.dealerClass = (this.props.dealer === this.props.num) ? 'dealer' : 'hidden'
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

    let avatarLink = (this.props.num === 0) ? "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg" : "http://res.cloudinary.com/stellar-pixels/image/upload/v1473995713/chuck_norris_avatar_ptumq3.jpg";


          // <p className={this.messageClass}>{this.props.message}</p>
    return(
      <li className={this.playerClass}>

        <div className="player-tag">
          <div className="player-stake">{player.stake}</div>
          <div className={this.dealerClass}>D</div>

          <div className="player-info">
            <p className="player-name">{player.name}</p>
            <p className="player-worth">{player.bank}</p>
          </div>

          <img className="player-avatar" src={avatarLink} alt=""/>
        </div>

        <div className="player-hold">
          <div className={this.card1Class}>
            <div className="face"></div>
          </div>

          <div className={this.card2Class}>
            <div className="face"></div>
          </div>
        </div>        
      </li>
    )
        // <Hand />
  }
}

export default Player;