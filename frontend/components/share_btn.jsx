import React from 'react';
// import Container from './/_container';

class ShareBtn extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
      document.getElementById('fb-share-btn').addEventListener('click', () => {
        FB.ui(
         {
          method: 'share',
          href: 'pokerwithchucknorris.com',
          title: `Have the guts to play Chuck?`,
          picture: 'http://res.cloudinary.com/stellar-pixels/image/upload/v1475969955/chuck_norris_share_mxoagf.jpg',          
          description: 'See if you can beat Chuck Norris in a game of Texas Hold\'em Poker'
        }, function(response){});
      });

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));    
  }

  render() {
    return(
      <button id="fb-share-btn" className="share-btn">
        +
      </button>
    )
  }
}

export default ShareBtn;