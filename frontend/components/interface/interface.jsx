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
    if (this.props.turn === 1) {
      document.getElementById("myBtn").disabled = true;
    } else {
      document.getElementById("myBtn").disabled = true;
    }
  }



  render() {
    this.interfaceClasses();

    return(
      <div className="interface-container">
        <div className={this.bettingClass}>
          <button id="btn-raise" className="btn-raise">Raise</button>
          <button id="btn-check-call" className="btn-check-call">Check/Call</button>
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