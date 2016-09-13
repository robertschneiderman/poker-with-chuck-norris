import React from 'react';
// import Container from './/_container';

class Interface extends React.Component {

  constructor(props) {
    super(props);
  }

  interfaceClasses() {
    if (this.props.round === 'pre-round') {
      this.bettingClass = 'interface-betting hidden';
      this.dealClass = 'interface-deal';
    } else {
      this.bettingClass = 'interface-betting';
      this.dealClass = 'interface-deal hidden';
    }
  }

  btnEnabledness() {
    if (this.props.turn !== 1) {
      document.querySelectorAll(".interface-betting > button").forEach(button => {
        button.disabled = true;
      });
    } else {
      document.querySelectorAll(".interface-betting > button").forEach(button => {
        button.disabled = false;
      });
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
            className="btn-raise"
            onClick={this.props.raise}
            >
            Raise 50
          </button>

          <button id="btn-call-check" className="btn-call-check">Call/Check</button>
          <button id="btn-fold" className="btn-fold">Fold</button>
        </div>
        <div className={this.dealClass}>
          <button onClick={this.props.deal} className="btn-deal">Deal</button>
        </div>        
      </div>
    )
  }
}

export default Interface;