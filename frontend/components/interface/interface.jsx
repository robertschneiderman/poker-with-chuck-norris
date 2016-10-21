import React from 'react';
import {debounce} from 'lodash';
// import Container from './/_container';

let locked = false;

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
    let btns = document.querySelectorAll(".interface-betting > button");
    if ((this.props.turn !== 0) || (this.props.message !== '') || (this.props.autoDeal)) {

      for (var i = 0; i < btns.length; i++) {
        btns[i].disabled = true;
      }

    } else {
      for (var i = 0; i < btns.length; i++) {
        btns[i].disabled = false;
      }
    }

    if (this.props.players['0'].stake === this.props.players['1'].stake) {
      // document.getElementById('btn-call-check').disabled = true;
    }
  }

  componentDidMount() {
    let btns = document.querySelectorAll(".interface-betting > button");

    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", e => {
        e.preventDefault();
        this.clickHandle(e.srcElement.id);
      });
    }
  }

  clickHandle(str) {
    let btns = document.querySelectorAll(".interface-betting > button");

    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
    }

    let callback = str === 'btn-raise' ? this.props.raise.bind(this)
      : str === 'btn-fold' ? this.props.fold.bind(this)
      : this.props.callOrCheck.bind(this);

    this.lock(callback);
  }

  lock(callback) {
    if (!locked) {
      locked = true;
      if (!!callback) { callback(); }
      setTimeout(() => { locked = false }, 1050);
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