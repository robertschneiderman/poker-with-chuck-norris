import React from 'react';
// import Container from './/_container';

class Interface extends React.Component {

  constructor(props) {
    super(props);
  }

  interfaceClasses() {
    if ((this.props.round === 0) || (this.props.setOver)) {
      this.bettingClass = 'interface-betting hidden';
      this.dealClass = 'interface-deal';
    } else {
      this.bettingClass = 'interface-betting';
      this.dealClass = 'interface-deal hidden';
    }
  }

  btnEnabledness() {
    if ((this.props.turn !== 0) || (this.props.message !== '')) {
      document.querySelectorAll(".interface-betting > button").forEach(button => {
        button.disabled = true;
      });
    } else {
      document.querySelectorAll(".interface-betting > button").forEach(button => {
        button.disabled = false;
      });
    }

    if (this.props.players['0'].stake === this.props.players['1'].stake) {
      // document.getElementById('btn-call-check').disabled = true;
    }
  }

  clickHand(str) {
    document.querySelectorAll(".interface-betting > button").forEach(button => {
      button.disabled = true;
    });
    switch(str) {
      case 'raise':
        this.props.raise();
        break;
      case 'fold': 
        this.props.fold();
        break;
      default:
        this.props.callOrCheck();
        break;
    }
  }

  formatMessage() {
    let message;
    let subMessage;
    if (this.props.message.match(/won!/g)) {
      this.message = this.props.message.match(/^(.*?)!/g)[0];
      // debugger;
      this.subMessage = this.props.message.substr(this.message.indexOf("!") + 2);
    } else {
      this.message = this.props.message;
      this.subMessage = '';      
    }
  }

  render() {
    this.interfaceClasses();
    this.btnEnabledness();
    this.formatMessage();
    let messageClass = `message message-${this.props.turn}`;
    let subMessageClass = 'message-sub';
    return(
      <div className="interface-container">
        <p className="message">{this.message}<span className='message-sub'>{this.subMessage}</span></p>   
        <div className={this.bettingClass}>

          <button 
            id="btn-raise"
            className="btn btn-raise"
            onClick={this.clickHand.bind(this, 'raise')}>
            Raise 50
          </button>

          <button 
            id="btn-call-check" 
            className="btn btn-call-check"
            onClick={this.clickHand.bind(this, 'callOrCheck')}>
              Call/Check
          </button>

          <button id="btn-fold" 
            className="btn btn-fold"
            onClick={this.clickHand.bind(this, 'fold')}>
            Fold
          </button>

        </div>
        <div className={this.dealClass}>
          <button onClick={this.props.nextSet} className="btn btn-deal">Deal</button>
        </div>        
      </div>
    )
  }
}

export default Interface;