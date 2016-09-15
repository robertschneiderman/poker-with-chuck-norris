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
  let pokerHands = hands.map( hand => new PokerHand(stage, hand));
  debugger;
  let handsSortedByRank = pokerHands.sort(hand => hand.bestHand.value);
  let greatestValue = handsSortedByRank[pokerHands.length - 1].value;
  let greatestHands = handsSortedByRank.select(hand => hand.bestHand.value === greatestValue);

  if (greatestHands.length === 1) {
    return greatestHands[0];
  } else {
    return tiebreaker(greatestHands);
  }

}


function tiebreaker(hands) {

  let greatestHands = hands;

  for (var i = 0; i < hands.tiebreakers.length; i++) {
    let tiebreaker = greatestHands.tiebreakers[i];

    let sortedHands = greatestHands.sort((hand, nextHand) => hand.tiebreakers[i] > nextHand.tiebreakers[i]);

    let largestTiebreaker = sortedHands[0].tiebreakers[i];

    greatestHands = sortedHands.select(hand => hand.tiebreaker = largestTiebreaker);

    if (greatestHands.length === 1) {
      return greatestHands[0];
    }
  };

  return 'tie';
}

function fourOfAKind(array) {
  let fours = []
  array.forEach(card => {
    if (count(array, card) === 4) {
      fours.push(card);
    }
  });

  return fours.length !== 0 ? fours : false;
}

console.log("fourOfAKind([3, 3, 3, 4, 5, 6, 7]):", fourOfAKind([3, 3, 3, 4, 5, 6, 7]));
console.log("fourOfAKind([3, 3, 3, 3, 5, 6, 7]):", fourOfAKind([3, 3, 3, 3, 5, 6, 7]));


class PokerHand {

  constructor(stage, hand) {
    let pile = stage.concat(hand);
    this.pile = this.bestHand(pile);
  }

  bestHand() {
    for (hand in this.hands()) {
      let value = RANKS[hand];
      let tiebreakers = this.hands[hand];

      if (tiebreakers && (value > 4)) {
        
        return { value, tiebreakers }

      } else if(tiebreakers && (value <= 4)) {
        let sortedSingles = this.hands['singles'].sort(sortNumber)
        let tiebreakers =  tiebreakers.concat(sortedSingles);

        return { value, tiebreakers }
      }
    }
  }

  hands() {
    this.hands = {
      'straightFlush': this.straightFlush(),
      'fourOfAKind': this.fourOfAKind(),
      'fullHouse': this.fullHouse(),
      'flush': this.flush(),
      'straight': this.straight(),      
      'triples': this.triples(),
      'twoPair': this.doubles(),
      'pair': this.doubles(),
      'singles': this.singles()
    }
  }

  straightFlush() {
    let straight = this.straight(this.pile);
    if (straight && this.flush(straight)) {
      return true;
    }
    return false;
  }

  fourOfAKind() {
    let fours = []
    this.pile.forEach(card => {
      if (count(this.pile, card) === 4) {
        fours.push(card);
      }
    });

    return fours.length !== 0 ? fours : false;
  }

  fullHouse() {
    let triples = this.triples();
    let doubles = this.doubles();

    if (triples && doubles) {
      return [triples[0], doubles[0]]
    }

    return false;
  }

  flush() {
    let arrangedBySuit = arrangeBySuit(this.pile).values;

    arrangedBySuit.forEach(suitCards => {
      if (suitCards.length >= 5) {
        return take(suitCards.sorted(sortNumber), 5);
      }
    })

    return false;
  }

  straight() {
    let sortedPile = this.pile.sort(sortNumber);

    for (let i = 0; i < sortedPile.length; i++) {
      for (let j = i; j <= (i + 3); j++) {
        let cur = sortedPile[j];
        let next = sortedPile[j+1];
        if ( (cur - next) !== 1 ) {
          next
        } else if(j === i + 3) {
          return sortedPile.slice(i, i + 5); 
        }
      };      
    };

    return false;
  }  

  triples() {
    return findByCount(3);
  }

  doubles() {
    return findByCount(2);
  }

  singles() {
    return findByCount(1);
  }  

  findByCount(num) {
    let finds = [];
    this.hand.forEach(card => {
      if (count(card.rank) === num) {
        finds.push(card.rank);
      }
    });
    let uniqueVals = uniq(finds);
    return uniqueVals.sort(sortNumber);
  }  

  arrangeBySuit(pile) {
    let arranged = {"spades": [], "hearts": [], "clubs": [], "diamonds": []};
    
    pile.forEach(card => {
      arranged[card.suit].push(card);
    });

    return arranged;
  }  

  straight() {

  }

  specialStraight() {
    return this.hand === []
  }
}

greatestHand([3, 5, 8],
  [[{rank: 3, suit: 'spades' },
  {rank: 7, suit: 'hearts'}],
  [{rank: 14, suit: 'spades' },
  {rank: 6, suit: 'hearts'}]]   
);