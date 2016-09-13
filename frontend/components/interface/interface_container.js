import {connect} from 'react-redux';
import * as ACTIONS from '../../actions/player_actions'
import Interface from './interface';

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
  return {
    deal: () => dispatch(ACTIONS.deal())
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Interface);
