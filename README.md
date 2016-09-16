# Poker with Chuck Norris

## Background

Poker with Chuck Norris is a heads up game of Texas Holdem poker. This means that it is just you versus Chuck Norris and nooone else. The goal is to create the best 5 card hand possible among 7 cards. Players can perform different actions such as checking, raising, and folding:

![Picture of the poker game](http://res.cloudinary.com/stellar-pixels/image/upload/v1474014167/poker-screen_kkoyyk.jpg)

## The Code

The game was build in React and leverages state and callback functions in order to create cycles, which correspond ot the game, round, and turn. A seperate file was used in order to handle the logic behind which hand is stronger. This logic exists inside a class 'PokerHand', which also includes several helper functions. This logic was made to get the best hand down to the very last tiebreaker.

```javascript

export class PokerHand {

  constructor(stage, hand) {
    
    this.pile = stage.concat(hand);
    this.ranks = this.ranks(this.pile);
    // this.pile = this.bestHand(pile);
  }

  bestHand() {
    let hands = this.hands();
    for (let hand in hands) {
      let value = RANKS[hand];

  ...
```