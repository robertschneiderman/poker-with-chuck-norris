import React from 'react';
// import Container from './/_container';

class Message extends React.Component {

  constructor(props) {
    super(props);
  }

  formatMessage() {
    let message;
    let subMessage;
    if (this.props.message.match(/won!/g)) {
      this.message = this.props.message.match(/^(.*?)!/g)[0];
      // debugger;
      this.subMessage = this.props.message.substr(this.message.indexOf("!") + 2);
    } else {
      this.message = this.props.message;
      this.subMessage = '';      
    }
  }  

  render() {
    this.formatMessage();
    let messageContainerClass = this.props.message === '' ? 'message-container hidden' : 'message-container';
    let subMessageClass = this.subMessage === '' ? 'message-sub none' : 'message-sub';;    
    return(
      <div className={messageContainerClass}>
        <h2 className='message'>{this.message}</h2>
        <p className={subMessageClass}>{this.subMessage}</p>
      </div>
    )
  }
}

export default Message;