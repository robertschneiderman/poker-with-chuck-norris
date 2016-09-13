import React from 'react';
import PlayerTag from './player_tag';
import Hand from './hand';

class Player extends React.Component {

  constructor(props) {
    super(props);
  }

  getCardClasses() {
    // debugger;
    this.card1Class = `card ${this.props.hand[0].suit} rank${this.props.hand[0].rank}`
    this.card2Class = `card ${this.props.hand[1].suit} rank${this.props.hand[1].rank}`
  }

  render() {
    let playerClass = `player player-${this.props.num}`
    this.getCardClasses();

    return(
      <li className={playerClass}>

        <div className="player-tag">
          <div className="player-info">
            <p className="player-name">John</p>
            <p className="player-worth">{this.props.bank}</p>
          </div>

          <img className="player-avatar" src="https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg" alt=""/>
        </div>

        <div className="player-hand">
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