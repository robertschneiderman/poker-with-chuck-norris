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
    if ((this.props.turn !== 0) || (this.props.message !== '') || (this.props.autoDeal)) {
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

  clickHandle(str) {
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



  render() {
    this.interfaceClasses();
    this.btnEnabledness();

    return(
      <div className="interface-container">  
        <div className={this.bettingClass}>

          <button 
            id="btn-raise"
            className="btn btn-raise"
            onClick={this.clickHandle.bind(this, 'raise')}>
            Raise 50 (R)
          </button>

          <button 
            id="btn-call-check" 
            className="btn btn-call-check"
            onClick={this.clickHandle.bind(this, 'callOrCheck')}>
              Call/Check (C)
          </button>

          <button id="btn-fold" 
            className="btn btn-fold"
            onClick={this.clickHandle.bind(this, 'fold')}>
            Fold (F)
          </button>

        </div>
        <div className={this.dealClass}>
          <button onClick={this.props.checkGameState} className="btn btn-deal">Deal (D)</button>
        </div>        
      </div>
    )
  }
}

export default Interface;