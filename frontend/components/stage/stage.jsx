import React from 'react';
// import Container from './/_container';

class Stage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <section className="stage">
        <span className="pot">Pot: {this.props.pot}</span>
        <div className="stage-cards"></div>
      </section>
    )
  }
}

export default Stage;