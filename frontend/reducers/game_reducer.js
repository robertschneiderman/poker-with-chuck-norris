import merge from 'lodash/merge';
import Deck from '../util/deck';
import shuffle from 'lodash/shuffle';

const GameReducer = (state = {}, action) => {

  switch (action.type) {

    state = {
      pot: 0,
      turn: "pre-flop",
      bet: 50,
      deck: Deck,
      players: ['p1', 'p2']
    }

    case "DEAL":

      let shuffledDeck = shuffle(Deck);

      state.players.forEach(player => {
        
      });

      return merge({}, state, NEWSTATE);

    default:
      return state;

  }
};

export default GameReducer;