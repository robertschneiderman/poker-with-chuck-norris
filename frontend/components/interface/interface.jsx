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
    if (this.props.turn !== 0) {
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



  render() {
    this.interfaceClasses();
    this.btnEnabledness();
    let messageClass = `message message-${this.props.turn}`;    
    return(
      <div className="interface-container">
        <p className="message">{this.props.message}</p>      
        <div className={this.bettingClass}>
          <button 
            id="btn-raise"
            className="btn btn-raise"
            onClick={this.props.raise}
            >
            Raise 50
          </button>

          <button 
            id="btn-call-check" 
            className="btn btn-call-check"
            onClick={this.props.callOrCheck}>
              Call/Check
          </button>
          <button id="btn-fold" onClick={this.props.fold} className="btn btn-fold">Fold</button>
        </div>
        <div className={this.dealClass}>
          <button onClick={this.props.nextSet} className="btn btn-deal">Deal</button>
        </div>        
      </div>
    )
  }
}

export default Interface;