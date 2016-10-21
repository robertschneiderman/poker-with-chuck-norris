import { take, drop, uniq, isEqual } from './lodash';

export const RANKS = {
  'Straight Flush': 9,
  'Four of a Kind': 8,
  'Full House': 7,
  'Flush': 6,
  'Straight': 5,
  'Three of a Kind': 4,
  'Two Pair': 3,
  'Pair': 2,
  'High card': 1
};

const LETTER_CARDS = ['Jack', 'Queen', 'King', 'Ace']

// const uniq = _.uniq;
// const take = _.take;

export const count = (array, value) => {
  let count = 0;
  for(let i = 0; i < array.length; i++){
    if(array[i] === value)
        count++;
  }
  return count;
}

export const sortNumber = (a,b) => {
  return b - a;
}

export const handName = (stage, hold) => {
  let ph = new PokerHand(stage, hold);
  return ph.bestHandName();
}

export const getPokerHand = (stage, hold) => {
  return new PokerHand(stage, hold).bestHand();
}

export const greatestHold = (stage, holds) => {
  let hand1 = getPokerHand(stage, holds[0]);
  let hand2 = getPokerHand(stage, holds[1]);

  if (hand1.rank > hand2.rank) {
    return 0;
  } else if (hand2.rank > hand1.rank) {
    return 1;
  }

  for (let i = 0; i < hand1.tiebreakers.length; i++) {
    if (hand1.tiebreakers[i] > hand2.tiebreakers[i]) {
      return 0;
    } else if (hand2.tiebreakers[i] > hand1.tiebreakers[i]) {
      return 1;
    }
  }
  return null;
}

export const bestHandName = (stage, hold) => {
  let hand = getPokerHand(stage, hold);
  let name;
  let rank = hand.rank;
  let tbs = hand.tiebreakers;

  for (let key in RANKS) {
    if (RANKS[key] === rank) name = key
  }

  let tb1 = tbs[0];
  let tb2 = tbs[1];

  tb1 = convertFaceCard(tb1);
  tb2 = convertFaceCard(tb2);

  let tbMessage;
  switch (name) {
    case 'Full House':
      tbMessage = `(${tb1}s full of ${tb2}s')`;
      break
    case 'Three of a Kind':
      tbMessage = `(${tb1}s)`;
      break
    case 'Two Pair':
      tbMessage = `(${tb1}s and ${tb2}s )`;
      break
    case 'Pair':
      tbMessage = `of ${tb1}s`;
      break
    default:
      tbMessage = `(${tb1} high)`;      
  }

  return `${name} ${tbMessage}`;
}

const convertFaceCard = (rank) => {
  if (rank > 10) rank = LETTER_CARDS[rank - 11] 
  return rank;
}

export class PokerHand {

  constructor(stage, hand) {
    
    this.pile = stage.concat(hand);
    this.ranks = this.getRanks(this.pile);
    // this.pile = this.bestHand(pile);
  }

  bestHand() {
    let handTypes = [this.fourOfAKind.bind(this), this.fullHouse.bind(this), this.flush.bind(this), this.straight.bind(this), this.triples.bind(this), this.pairs.bind(this), this.doubles.bind(this), this.singles.bind(this)];

    for (let i = 0; i < handTypes.length; i++) {
      let hand = handTypes[i]();
      if (hand) return hand;
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

    if ((triplez) && (doublez)) {
      return {rank: 7, tiebreakers: [triplez.tiebreakers[0], doublez.tiebreakers[0]]}
    }

    return false;
  }

  flush() {
    let arrangedBySuit = this.arrangeBySuit(this.pile)
    let flushCards;

    for (let suit in arrangedBySuit) {
      flushCards = arrangedBySuit[suit];
      if (flushCards.length >= 5) {
        flushCards = take(flushCards.sort(sortNumber), 5);
        return {rank: 6, tiebreakers: flushCards}
      }
    }

    return false;
  }

  straight() {
    let sortedRanks = uniq(this.ranks.sort(sortNumber));
    let straightCards;

    for (let i = 0; i < sortedRanks.length; i++) {
      for (let j = i; j <= (i + 3); j++) {
        let cur = sortedRanks[j];
        let next = sortedRanks[j+1];
        if ( (cur - next) !== 1 ) {
          break
        } else if(j === i + 3) {
          straightCards = sortedRanks.slice(i, i + 5);
          return {rank: 5, tiebreakers: straightCards}
        }
      };      
    };

    if (this.specialStraight(sortedRanks)) {
      // debugger;
      return [14, 5, 4, 3, 2]; 
    }

    return false;
  }

  specialStraight(sortedRanks) {
    let needles = [14, 5, 4, 3, 2];

    let rank_i = 0;
    let needle_finds = 0;

    while (rank_i < sortedRanks.length) {
      if (needles.includes(sortedRanks[rank_i])) {
        needle_finds++;
      }
      rank_i++
    }

    if (needle_finds === 5) {
      return {rank: 5, tiebreakers: [5, 4, 3, 2]};
    } else {
      return null;
    }
  }


  triples() {
    let triple = this.findByCount(3);
    if (triple) {
      let valuesNotInPair = this.valuesNotInPair(triple);
      triple = triple.concat(valuesNotInPair.slice(0, 2));
      return {rank: 4, tiebreakers: triple};
    } else {
      return false
    }
  }

  pairs() {
    let doubles = this.findByCount(2);
    if (doubles.length >= 2) {
      let valuesNotInPair = this.valuesNotInPair(doubles);
      doubles = doubles.concat(valuesNotInPair.slice(0, 1));
      return {rank: 3, tiebreakers: doubles};
    }
    return false;
  }

  doubles() {
    let pair = this.findByCount(2);
    if (pair) {
      let valuesNotInPair = this.valuesNotInPair(pair);
      pair = pair.concat(valuesNotInPair.slice(0, 3));
      return {rank: 2, tiebreakers: pair};
    } else {
      return false
    }
  }

  singles() {
    let singles = this.ranks.sort(sortNumber).slice(0, 5);
    return {rank: 1, tiebreakers: singles};    
  }  

  findByCount(num) {
    let finds = [];
    this.ranks.forEach(card => {
      
      if (count(this.ranks, card) === num) {
        finds.push(card);
      }
    });

    let uniqueVals = uniq(finds);
    if (uniqueVals.length > 2) {
      return uniqueVals.sort(sortNumber).slice(0, 2);
    } else if (uniqueVals.length > 0)
      return uniqueVals.sort(sortNumber)    
    else {
      return false;
    }
  }

  valuesNotInPair(pairs) {
    return this.ranks.filter(rank => {
      if (!pairs.includes(rank)) return rank;
    });
  }

  arrangeBySuit(pile) {
    let arranged = {"spades": [], "hearts": [], "clubs": [], "diamonds": []};
    
    pile.forEach(card => {
      arranged[card.suit].push(card.rank)
    });

    return arranged;
  }

  getRanks(cards) {
    cards = cards.map(card => card.rank);
    return cards;
  }

  suits(cards) {
    cards = cards.map(card => card.suit);
    return cards;    
  }
}

let stage = [{rank: 5, suit: 'clubs'},
  {rank: 4, suit: 'clubs'},
  {rank: 5, suit: 'spades'},
  {rank: 2, suit: 'clubs'},
  {rank: 2, suit: 'hearts'}];



let h1 = getPokerHand(stage, [{rank: 13, suit: 'spades' }, {rank: 7, suit: 'hearts'}])
let h2 = getPokerHand(stage, [{rank: 4, suit: 'diamonds' }, {rank: 5, suit: 'clubs'}])

console.log("h1:", h1);
console.log("h2:", h2);


// let gh = greatestHold(stage, [h1, h2]);
// console.log("gh:", gh);