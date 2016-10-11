import React from 'react';

class Audio extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="sounds">

        <audio id="nice-meeting-you">
          <source src="./audio/chuck_norris/nice_meeting_you.mp3" />
        </audio>

        <audio id="walker-texas-ranger-theme">
          <source src="./audio/chuck_norris/walker_texas_ranger_theme.mp3" />
          <source src="./audio/chuck_norris/walker_texas_ranger_theme.wav" />
        </audio>

        <audio id="explosion">
          <source src="./audio/explosion.mp3" />
          <source src="./audio/explosion.wav" />
        </audio>        

        <audio id="hi-this-is-chuck-norris">
          <source src="./audio/chuck_norris/hi_this_is_chuck_norris.mp3" />
          <source src="./audio/chuck_norris/hi_this_is_chuck_norris.wav" />
        </audio>

        <audio id="chuck-angry">
          <source src="./audio/chuck_norris/chuck_angry.mp3" />
          <source src="./audio/chuck_norris/chuck_angry.wav" />
        </audio>

        <audio id="chuck-whirr">
          <source src="./audio/chuck_norris/chuck_whirr.mp3" />
          <source src="./audio/chuck_norris/chuck_whirr.wav" />
        </audio>

        <audio id="chuck-muttering">
          <source src="./audio/chuck_norris/chuck_muttering.mp3" />
          <source src="./audio/chuck_norris/chuck_muttering.wav" />
        </audio>  

        <audio id="chuck-laughter">
          <source src="./audio/chuck_norris/chuck_laughter.mp3" />
          <source src="./audio/chuck_norris/chuck_laughter.wav" />
        </audio>

        <audio id="chuck-silly-shout">
          <source src="./audio/chuck_norris/chuck_silly_shout.mp3" />
          <source src="./audio/chuck_norris/chuck_silly_shout.wav" />
        </audio>      

        <audio id="chuck-whoa">
          <source src="./audio/chuck_norris/chuck_whoa.mp3" />
          <source src="./audio/chuck_norris/chuck_whoa.wav" />
        </audio>           

        <audio id="chuck-crying">
          <source src="./audio/chuck_norris/chuck_crying.mp3" />
          <source src="./audio/chuck_norris/chuck_crying.wav" />
        </audio>

        <audio id="infection-giggling">
          <source src="./audio/chuck_norris/infectious_giggling.mp3" />
          <source src="./audio/chuck_norris/infectious_giggling.wav" />
        </audio>              


        <audio id="deal-sound">
          <source src="./audio/deal.mp3" />
          <source src="./audio/deal.wav" />
        </audio> 
        
        <audio id="raise-sound">
          <source src="./audio/raise.mp3" />
          <source src="./audio/raise.wav" />
        </audio>
        
        <audio id="called-sound">
          <source src="./audio/call.mp3" />
          <source src="./audio/call.wav" />
        </audio>

        <audio id="fold-sound">
          <source src="./audio/fold.mp3" />
          <source src="./audio/fold.wav" />
        </audio>             

        <audio id="checked-sound">
          <source src="./audio/check.mp3" />
          <source src="./audio/check.wav" />
        </audio>        
        
        <audio id="next-card-sound">
          <source src="./audio/next-card.wav" />
        </audio>

        <audio id="win-sound">
          <source src="./audio/win_money.mp3" />
          <source src="./audio/win_money.wav" />
        </audio>

        <audio id="lose-sound">
          <source src="./audio/lose_money.mp3" />
          <source src="./audio/lose_money.wav" />
        </audio>                
      </div>
    )
  }
}

export default Audio;