import React from 'react';
import { Provider } from 'react-redux';
import Game from './game';
import Loading from './loading';


const load = () => {

  

};

class Root extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loading: true};
  }

  load() {
    setTimeout(() => {
      this.setState({loading: false})
    }, 2000)    
  }

  render() {
    this.load();
    return(
      <div className="root">
        <img className="logo" src="http://res.cloudinary.com/stellar-pixels/image/upload/v1474005754/poker-chuck-logo_tsexg6.png" alt=""/>
        <Loading loading={this.state.loading}>
          <Game />
        </Loading>
      </div>
    );
  }
}

// const Root = ({ store }) => (
//     <Loading loading={setTimeout(() => {return false}, 3000)}>
//       <img className="logo" src="http://res.cloudinary.com/stellar-pixels/image/upload/v1474005754/poker-chuck-logo_tsexg6.png" alt=""/>
//       <Game />
//     </Loading>
// );

export default Root;

