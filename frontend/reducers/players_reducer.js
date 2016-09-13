import merge from 'lodash/merge';

const PlayersReducer = (state = {}, action) => {

  switch (action.type) {

    state = {
      hand: ['c1', 'c2'],
      bank: 1000,
      stake: 50
    }    

    case "RECEIVE_CARDS":
      return merge({}, state, NEWSTATE);

    default:
      return state;

  }
};

export default PlayersReducer;