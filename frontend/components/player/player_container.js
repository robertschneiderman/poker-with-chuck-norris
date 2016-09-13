import {connect} from 'react-redux';
import * as ACTIONS from '../../actions/players_actions';
import Player from './player';

const mapStateToProps = state => ({
  hand: state.deck.
});

const mapDispatchToProps = (dispatch) => {
  return {
    action: items => dispatch(ACTIONS.action(items)),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);
