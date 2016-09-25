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


        <audio id="deal-sound">
          <source src="./audio/deal.mp3" />
          <source src="./audio/deal.wav" />
        </audio> 
        
        <audio id="raise-sound">
          <source src="./audio/raise.mp3" />
          <source src="./audio/raise.wav" />
        </audio>
        
        <audio id="call-sound">
          <source src="./audio/call.mp3" />
          <source src="./audio/call.wav" />
        </audio>
        
        <audio id="next-card-sound">
          <source src="./audio/next-card.mp3" />
          <source src="./audio/next-card.wav" />
        </audio>
      </div>
    )
  }
}

export default Audio;