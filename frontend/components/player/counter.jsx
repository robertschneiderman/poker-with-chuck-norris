import React from 'react';
// import Container from './/_container';

class Counter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {bank: this.props.begin};
    this.interval = setInterval(this.update.bind(this), 5);
  }

  update() {
    // let to;
    if (this.state.bank === this.props.end) return;
    // debugger;
    else if (this.state.bank < this.props.end) {

      this.setState({
        bank: this.state.bank + 1
      });

    } else {
      this.setState({
        bank: this.state.bank - 1
      });
    }
  }

  render() {
    return(
      <div className="player-worth">
        {this.state.bank}
      </div>
    )
  }
}

export default Counter;