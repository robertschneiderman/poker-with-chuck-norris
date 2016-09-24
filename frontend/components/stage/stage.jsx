import React from 'react';
// import Container from './/_container';

class Stage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let cards = this.props.cards.map((card, i) => {
    let cardClass = `card ${card.suit} rank${card.rank}`;
      return(
        <li key={i} className={cardClass}>
          <div className="face">
          </div>
        </li>
      );
    });

    return(
      <section className="stage">
        <ul className="stage-cards">
          {cards}
        </ul>
      </section>
    )
  }
}

export default Stage;