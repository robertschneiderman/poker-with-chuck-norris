import React from 'react';
// import Container from './/_container';

class Message extends React.Component {

  constructor(props) {
    super(props);
  }

  // componentWillMount() {
  //   let s = Snap(400, 620);
  

  //   this.path = s.path({ d: "M35.9 67.8l-7.5-22.7V31.8H11.6v34l5.3 1.6v.5H0v-.6l4.9-1.6V2.1L0 .6V0h33.8l7.8 7.4v16.3l-10.8 9.8 11.9 32.3 4.9 1.5v.5H35.9zM11.6 29.6h23.3V1.7H11.6v27.9z", transform: "r-30, 50, 50", transform: "r-30, 50, 50"});

  //   console.log("this.path(will):", this.path);
  // }

  componentWillMount() {
    this.path = '';    
  }

  componentWillReceiveProps() {
    // debugger;
    if (this.props.message) {
      // this.s = Snap('.message');
      // let path = this.s.path({ d: this.props.message, transform: "r-30, 50, 50"});
      // path.animate({ d: "M37 75.8l-8.6-26.1v-10h-8.7v27l5.3 1.6v7.5H0v-7.5l4.9-1.6V9.1L0 7.6V0h39.4l10.2 9.6v19.8l-10.1 9.2 10.3 27.9 5.8 1.8v7.5H37zM19.6 9.7v19.8h15.3V9.7H19.6z", transform: "r0, 50, 50" }, 1000, mina.bounce, path.remove);  
    }
  }

  componentDidMount() {
    // if (this.props.message) {
    //   let message = querySelector('.message');
    //   message.querySelector('path').parentNode.removeChild();
    // }
    // // if (this.props.message) {


    //   this.path.animate({ d: "M37 75.8l-8.6-26.1v-10h-8.7v27l5.3 1.6v7.5H0v-7.5l4.9-1.6V9.1L0 7.6V0h39.4l10.2 9.6v19.8l-10.1 9.2 10.3 27.9 5.8 1.8v7.5H37zM19.6 9.7v19.8h15.3V9.7H19.6z", transform: "r180, 50, 50" }, 1000, mina.bounce);
    // }
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
        <svg className="message raised"></svg>
        <svg className="message called"></svg>
        <svg className="message checked"></svg>
        <svg className="message folded"></svg>
        <svg className="message chuck-won"></svg>
        <svg className="message you-won"></svg>
        <p className={subMessageClass}>{this.subMessage}</p>
      </div>
    )
  }
}

export default Message;