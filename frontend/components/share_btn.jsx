import React from 'react';
// import Container from './/_container';

class ShareBtn extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.getElementById('fb-share-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      FB.ui(
       {
        method: 'share',
        href: 'pokerwithchucknorris.com',
        title: `Have the guts to play Chuck Norris?`,
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

  toggleDropdown() {
    let dropdown = document.getElementById('fb-dropdown');
    let containerContent = document.querySelector('.fb-container-content');
    if (!dropdown.classList.contains('active')) {
      containerContent.innerHTML = '-';
      dropdown.classList.add('active');
    } else {
      containerContent.innerHTML = '+';      
      dropdown.classList.remove('active');
    }
  }

  render() {
    return(
      <div className="fb-container" onClick={this.toggleDropdown.bind(this)}>
        <span className="fb-container-content">+</span>        
        <div id="fb-dropdown" className="fb-dropdown">
          <div id="fb-like-btn" className="fb-btn fb-like-btn">
            <img className="fb-btn-icon" src="./images/fb_like.svg" alt=""/>
            <span className="fb-btn-text">Like</span>
          </div>
          <div id="fb-share-btn" className="fb-btn fb-share-btn">
            <img className="fb-btn-icon" src="./images/fb_share.svg" alt=""/>
            <span className="fb-btn-text">Share</span>
          </div>
        </div>
      </div>
    )
  }
}

export default ShareBtn;