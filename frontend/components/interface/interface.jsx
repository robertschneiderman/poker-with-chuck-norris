import React from 'react';
import {debounce} from 'lodash';
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

  componentDidMount() {
    document.querySelectorAll(".interface-betting > button").forEach(button => {
      button.addEventListener("click", debounce(e => {
        e.preventDefault();
        this.clickHandle(e.srcElement.id);
      }, 210));
    });    
  }

  clickHandle(str) {
    document.querySelectorAll(".interface-betting > button").forEach(button => {
      button.disabled = true;
    });
    switch(str) {
      case 'btn-raise':
        this.props.raise();
        break;
      case 'btn-fold': 
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
            className="btn btn-raise">
            Raise 50 (R)
          </button>

          <button 
            id="btn-call-check" 
            className="btn btn-call-check">
              Call/Check (C)
          </button>

          <button id="btn-fold" 
            className="btn btn-fold">
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