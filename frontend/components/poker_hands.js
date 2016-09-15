// import { sortBy, drop, uniq } from './lodash';

const RANKS = {
  'straightFlush': 9,
  'fourOfAKind': 8,
  'fullHouse': 7,
  'flush': 6,
  'straight': 5,
  'triples': 4,
  'twoPair': 3,
  'pair': 2,
  'singles': 1
};

const uniq = _.uniq;
const take = _.take;

function count(array, value) {
  let count = 0;
  for(let i = 0; i < array.length; i++){
    if(array[i] === value)
        count++;
  }
  return count;
}

function sortNumber(a,b) {
    return b - a;
}

function greatestHand(stage, hands) {
  let pokerHands = hands.map( hand => new PokerHand(stage, hand).bestHand());
  let handsSortedByValue = pokerHands.sort((hand, nextHand) => hand.value > nextHand.value);
  let greatestValue = handsSortedByValue[pokerHands.length - 1].value;
  
  let greatestHands = []

    // debugger;
  handsSortedByValue.forEach(hand => {
    if (hand.value === greatestValue) {
      greatestHands.push(hand);
    }
  });

  if (greatestHands.length === 1) {
    return greatestHands[0];
  } else {
    return tiebreaker(greatestHands);
  }

}

function tiebreaker(hands) {

  let greatestHands = hands;

  for (var i = 0; i < greatestHands[0].tiebreakers.length; i++) {

    greatestHands.sort((hand, nextHand) => hand.tiebreakers[i] < nextHand.tiebreakers[i]);

    let largestTiebreaker = greatestHands[0].tiebreakers[i];

    greatestHands = greatestHands.filter(hand => {
      if (hand.tiebreakers[i] === largestTiebreaker) {
        return hand;
      }
    });

    if (greatestHands.length === 1) {
      return greatestHands[0];
    }
  };

  return 'tie';
}

class PokerHand {

  constructor(stage, hand) {
    
    this.pile = stage.concat(hand);
    this.ranks = this.ranks(this.pile);
    // this.pile = this.bestHand(pile);
  }

  bestHand() {
    let hands = this.hands();
    for (let hand in hands) {
      let value = RANKS[hand];
      let tiebreakers = hands[hand];

      if (tiebreakers && (value > 4)) {
        
        return { value, tiebreakers }

      } else if(tiebreakers && (value <= 4)) {
        let sortedSingles = hands['singles'].sort(sortNumber)
        tiebreakers = tiebreakers.concat(sortedSingles);

        return { value, tiebreakers }
      }
    }
  }

      // 'straightFlush': this.straightFlush(),
  hands() {
    return {
      'fourOfAKind': this.fourOfAKind(),
      'fullHouse': this.fullHouse(),
      'flush': this.flush(),
      'straight': this.straight(),      
      'triples': this.triples(),
      'twoPair': this.pairs(),
      'pair': this.doubles(),
      'singles': this.singles()
    }
  }

  // straightFlush() {
  //   debugger;
  //   let straight = this.straight(this.ranks);
  //   if (straight && this.flush(straight)) {
  //     return true;
  //   }
  //   return false;
  // }

  fourOfAKind() {
    let fours = []
    
    this.ranks.forEach(card => {
      if (count(this.ranks, card) === 4) {
        fours.push(card);
      }
    });

    return fours.length !== 0 ? fours : false;
  }

  fullHouse() {
    let triplez = this.triples();
    let doublez = this.doubles();

    if ((triplez.length > 0) && (doublez.length > 0)) {
      return [triplez[0], doublez[0]]
    }

    return false;
  }

  flush() {
    let arrangedBySuit = this.arrangeBySuit(this.pile)

    for (let suit in arrangedBySuit) {
      let flushCards = arrangedBySuit[suit];
      if (flushCards.length >= 5) {
        return take(flushCards.sort(sortNumber), 5);
      }
    }

    return false;
  }

  straight() {
    let sortedRanks = this.ranks.sort(sortNumber);

    for (let i = 0; i < sortedRanks.length; i++) {
      for (let j = i; j <= (i + 3); j++) {
        let cur = sortedRanks[j];
        let next = sortedRanks[j+1];
        if ( (cur - next) !== 1 ) {
          break
        } else if(j === i + 3) {
          return sortedRanks.slice(i, i + 5); 
        }
      };      
    };

    return false;
  }

  specialStraight() {
    return this.hand === []
  }

  triples() {
    return this.findByCount(3);
  }

  pairs() {
    let doubles = this.doubles();
    if (doubles.length === 2) {
      return doubles;
    }
    return false;
  }

  doubles() {
    return this.findByCount(2);
  }

  singles() {
    return this.findByCount(1);
  }  

  findByCount(num) {
    let finds = [];
    this.ranks.forEach(card => {
      
      if (count(this.ranks, card) === num) {
        finds.push(card);
      }
    });

    let uniqueVals = uniq(finds);
    if (uniqueVals.length > 0) {
      return uniqueVals.sort(sortNumber);
    } else {
      return false;
    }
  }  

  arrangeBySuit(pile) {
    let arranged = {"spades": [], "hearts": [], "clubs": [], "diamonds": []};
    
    pile.forEach(card => {
      arranged[card.suit].push(card.rank)
    });

    return arranged;
  }

  ranks(cards) {
    cards = cards.map(card => card.rank);
    return cards;
  }

  suits(cards) {
    cards = cards.map(card => card.suit);
    return cards;    
  }
}

// let ph = new PokerHand(
//   [{rank: 6, suit: 'hearts'},
//   {rank: 2, suit: 'clubs'},
//   {rank: 12, suit: 'spades'},
//   {rank: 2, suit: 'hearts'},
//   {rank: 2, suit: 'spades'}],
//   [{rank: 12, suit: 'clubs' },
//   {rank: 7, suit: 'clubs'}]   
// );

// console.log("ph.bestHand():", ph.bestHand());

// ph.bestHand(): Object {value: 7, tiebreakers: Array[2]}

let gh = greatestHand(
  [{rank: 6, suit: 'clubs'},
  {rank: 7, suit: 'clubs'},
  {rank: 2, suit: 'spades'},
  {rank: 2, suit: 'clubs'},
  {rank: 10, suit: 'hearts'}],
  [[{rank: 12, suit: 'spades' },
  {rank: 5, suit: 'hearts'}],
  [{rank: 8, suit: 'diamonds'},
  {rank: 9, suit: 'clubs'}]]
);

console.log("gh:", gh);