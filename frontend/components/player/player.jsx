import React from 'react';
import PlayerTag from './player_tag';
import Counter from '../counter';
import FacebookLogin from 'react-facebook-login';


class Player extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
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

  componentClicked() {

  }

  responseFacebook(response) {
    console.log(response);
    if (response.signedRequest) {
      window.playerName = response.first_name;
      window.playerGender = response.gender;
      this.setState({loggedIn: true, response});
    }
  }

  playerAvatar() {
    if (this.props.num === 1) {
      return(
        <img id="login" className="player-avatar" src="http://res.cloudinary.com/stellar-pixels/image/upload/v1474005893/chuck-norris_loijrf.jpg" alt=""/>
      );
    } else if (this.state.loggedIn) {
      return(
        <img id="login" className="player-avatar" src={this.state.response.picture.data.url} alt=""/>
      );
    } else {
      return (
        <FacebookLogin
        appId="1196099127116910"
        autoLoad={true}
        fields="first_name,last_name,gender,email,picture.width(200).height(200)"
        cssClass="btn-fb-login"
        textButton="+"
        callback={this.responseFacebook.bind(this)} />
      );     
    }
  }

  componentClicked() {

  }

  render() {
    this.getPlayerClass();
    this.getDealerClass();
    this.getCardClasses();
    this.getMessageClass();
    // aiMove()
    
    let player = this.props.player;

    let oldBank = 1000;

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


          {this.playerAvatar()}

          <div className="player-info">
            <p className="player-name">{player.name}</p>
            <Counter id="" className="player-worth"begin={oldBank} end={player.bank} />
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