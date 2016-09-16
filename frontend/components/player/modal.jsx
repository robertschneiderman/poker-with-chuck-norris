import React from 'react';
// import Container from './/_container';

class Modal extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    let modalClass = this.props.gameOver ? 'modal' : 'modal none';

    return(
      <div className={modalClass}>
        <button className="btn modal-btn">Play Again?</button>
      </div>
    )
  }
}

export default Modal;