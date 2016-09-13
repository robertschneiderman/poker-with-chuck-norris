import React from 'react';
// import Container from './/_container';

class Interface extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="interface-container">
        <div className="interface-betting">
          <button className="btn-raise">Raise</button>
          <button className="btn-check-call">Check/Call</button>
          <button className="btn-fold">Fold</button>
        </div>
        <div className="interface-deal">
          <button onClick={this.props.deal.bind(this)} className="btn-deal">Deal</button>
        </div>        
      </div>
    )
  }
}

export default Interface;