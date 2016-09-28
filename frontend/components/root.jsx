import React from 'react';
import { Provider } from 'react-redux';
import Game from './game';
import Logo from './logo';
import Audio from './audio';
import Loading from './loading';


const load = () => {

  

};

class Root extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loading: true};
  }

  load() {
    // $('.logo').animate({
    //   transform: '-=100px',
    //   duration: 1000, 
    //   easing: 'easeOutElastic', 
    // });    
    setTimeout(() => {
      this.setState({loading: false})
    }, 2500);
  }

  render() {
    this.load();
        // <img className="logo" src="http://res.cloudinary.com/stellar-pixels/image/upload/v1474005754/poker-chuck-logo_tsexg6.png" alt=""/>
        // <svg className="logo" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="1173.2" height="402.6" viewBox="0 0 1173.2 402.6"><image id="chucks-head" overflow="visible" width="173" height="200" xlinkHref="./images/chuck_norris_head.png" transform="translate(228.093 32.71) scale(1.0002)"/><text transform="translate(0 216.055)" fill="#E980BA" fontFamily="'Bigfish-Black'" fontSize="263">P</text><text transform="translate(433.943 226.655)" fill="#E980BA" fontFamily="'Bigfish-Black'" fontSize="263">ker</text><text transform="translate(1003.402 225.455)" fill="#D6CDD2" fontFamily="'Bigfish-Black'" fontSize="93">w/</text><text transform="translate(2.34 374.018)" fill="#4C67A3" fontFamily="'Distractor-Roman'" fontSize="153" letterSpacing="2">CHUCK NORRIS</text></svg>        
    return(
      <div className="app">
        <Audio />
        <Logo />
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

