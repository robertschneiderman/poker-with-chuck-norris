import React from 'react';
// import Container from './/_container';

class Message extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let messageContainerClass = this.props.message === '' ? 'message-container hidden' : 'message-container';
    return(
      <div className={messageContainerClass}>
        <svg className="message raised"></svg>
        <svg className="message reraised"></svg>
        <svg className="message called"></svg>
        <svg className="message checked"></svg>
        <svg className="message folded"></svg>
        <svg className="message chuck-won"></svg>
        <svg className="message you-won"></svg>
      </div>
    )
  }
}

export default Message;