import merge from 'lodash/merge';
import Deck from '../util/deck';
import shuffle from 'lodash/shuffle';

const DeckReducer = (state = Deck, action) => {

  state = {
    dealt
  }

  switch (action.type) {

    case "RESET_DECK":
      return shuffle(Deck);

    case "DEAL":

      return merge({}, state, NEWSTATE);

    case "FLOP":

    case "TURN/RIVER":   

    default:
      return state;

  }
};

export default DeckReducer;