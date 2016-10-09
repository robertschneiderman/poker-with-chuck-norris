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

// 'https://poker-odds.p.mashape.com/hold-em/odds?community=5d%2C7c%2CAh&hand=As%2CKd&players=3'
// 'https://poker-odds.p.mashape.com/hold-em/odds?community=6c%2C10d&hand=7c%2C2s%2C2c&players=2'

export const getHandOdds = (stage, hold, success) => {
  let community = apiFormat(stage);
  let hand = apiFormat(hold);
  $.ajax({
    method: 'GET',
    data: {},
    dataType: 'json',
    url: `https://poker-odds.p.mashape.com/hold-em/odds?community=${community}&hand=${hand}&players=2`,
    beforeSend: (xhr) => { 
      xhr.setRequestHeader('X-Mashape-Key', '3NBkE5BjtAmshkI378bHS3DNTgr1p1zR7G6jsnP6vJDIvjyptP');
      xhr.setRequestHeader('Accept', 'application/json');
    },
    success
  });
};

export const getBothHandOdds = (stage, aiHold, humanHold, success) => {
  let community = apiFormat(stage);
  let aiHand = apiFormat(aiHold);
  let humanHand = apiFormat(humanHold);
  $.ajax({
    method: 'GET',
    data: {},
    dataType: 'json',
    url: `https://poker-odds.p.mashape.com/hold-em/odds?community=${community}&hand=${aiHand}&players=2`,
    beforeSend: (xhr) => { 
      xhr.setRequestHeader('X-Mashape-Key', '3NBkE5BjtAmshkI378bHS3DNTgr1p1zR7G6jsnP6vJDIvjyptP');
      xhr.setRequestHeader('Accept', 'application/json');
    },
    success: function(aiResponse){
      $.ajax({

        method: 'GET',
        data: {},
        dataType: 'json',
        url: `https://poker-odds.p.mashape.com/hold-em/odds?community=${community}&hand=${humanHand}&players=2`,
        beforeSend: (xhr) => { 
          xhr.setRequestHeader('X-Mashape-Key', '3NBkE5BjtAmshkI378bHS3DNTgr1p1zR7G6jsnP6vJDIvjyptP');
          xhr.setRequestHeader('Accept', 'application/json');
        },
        success: function(humanResponse) {
          success(aiResponse, humanResponse);
        }
      });
    }
  });
};

// curl --get --include 'https://poker-odds.p.mashape.com/hold-em/odds?community=6c%2C10d&hand=7c%2C2s%2C2c&players=2' \
//   -H 'X-Mashape-Key: 3NBkE5BjtAmshkI378bHS3DNTgr1p1zR7G6jsnP6vJDIvjyptP' \
//   -H 'Accept: application/json'

export const greatestHold = (stage, holds) => {
  let greatistHand = greatestHand(stage, holds);

  for (let i = 0; i < holds.length; i++) {
    let hold = holds[i]
    let hand = new PokerHand(stage, hold).bestHand();

    if (isEqual(hand, greatistHand)) {
      return hold;
    }    
  }

  return null;
}

export const greatestHand = (stage, hands) => {
  let pokerHands = hands.map( hand => new PokerHand(stage, hand).bestHand());
  let handsSortedByValue = pokerHands.sort((hand, nextHand) => hand.value > nextHand.value);
  let greatestValue = handsSortedByValue[pokerHands.length - 1].value;
  
  let greatestHands = []

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

export const tiebreaker = (hands) => {

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

  return null;
}

const apiFormat = (cards) => {
  // debugger;
  let cardsFormatted = cards.map(card => {
    return cardFormat(card)
  });

  return cardsFormatted.join('%2C');
}

const cardFormat = (card) => {
  let rank;
  if (card.rank === 10)
    rank = convertFaceCard(card.rank.toString());
  else {
    rank = convertFaceCard(card.rank.toString())[0];
  }

  return (rank + card.suit[0])
}

const separateWithPercent = (values) => {
  return values.map((value, i) => { if (i !== (values.length - 1)) return `${value}%` }).join('');
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

  bestHandName() {
    let rank;
    let tb;

    for (let key in RANKS) {
      if (RANKS[key] === this.bestHand().value) rank = key
    }

    let tb1 = this.bestHand().tiebreakers[0];
    let tb2 = this.bestHand().tiebreakers[1];

    tb1 = convertFaceCard(tb1);
    tb2 = convertFaceCard(tb2);

    switch (rank) {
      case 'Full House':
        tb = `(${tb1}s full of ${tb2}s')`;
        break
      case 'Three of a Kind':
        tb = `(${tb1}s)`;
        break
      case 'Two Pair':
        tb = `(${tb1}s and ${tb2}s )`;
        break
      case 'Pair':
        tb = `of ${tb1}s`;
        break
      default:
        tb = `(${tb1} high)`;      
    }

    return `${rank} ${tb}`;
  }

  bestHand() {
    let hands = this.hands();
    for (let hand in hands) {
      let value = RANKS[hand];
      let tiebreakers = hands[hand];

      if (tiebreakers && (value > 4)) {
        
        return { value, tiebreakers }

      } else if(tiebreakers && (value <= 4)) {
        let sortedSingles = hands['High card'].sort(sortNumber)
        tiebreakers = tiebreakers.concat(sortedSingles);

        return { value, tiebreakers }
      }
    }
  }

      // 'straightFlush': this.straightFlush(),
  hands() {
    return {
      'Four of a Kind': this.fourOfAKind(),
      'Full House': this.fullHouse(),
      'Flush': this.flush(),
      'Straight': this.straight(),      
      'Three of a Kind': this.triples(),
      'Two Pair': this.pairs(),
      'Pair': this.doubles(),
      'High card': this.singles()
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
    let sortedRanks = uniq(this.ranks.sort(sortNumber));

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
      return [5, 4, 3, 2];
    } else {
      return null;
    }
  }


  triples() {
    return this.findByCount(3);
  }

  pairs() {
    let doubles = this.doubles();
    if (doubles.length >= 2) {
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
    if (uniqueVals.length > 2) {
      return uniqueVals.sort(sortNumber).slice(0, 2);
    } else if (uniqueVals.length > 0)
      return uniqueVals.sort(sortNumber)    
    else {
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

  getRanks(cards) {
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
  [{rank: 11, suit: 'clubs'},
  {rank: 13, suit: 'clubs'},
  {rank: 11, suit: 'spades'},
  {rank: 12, suit: 'clubs'},
  {rank: 6, suit: 'hearts'}],
  [[{rank: 8, suit: 'spades' },
  {rank: 3, suit: 'hearts'}],
  [{rank: 5, suit: 'diamonds'},
  {rank: 3, suit: 'clubs'}]]
);

console.log("gh:", gh);

let bh = new PokerHand([{rank: 11, suit: 'clubs'},
  {rank: 13, suit: 'clubs'},
  {rank: 11, suit: 'spades'},
  {rank: 12, suit: 'clubs'},
  {rank: 6, suit: 'hearts'}], [{rank: 8, suit: 'spades' },
  {rank: 3, suit: 'hearts'}]).bestHand();

console.log("bh:", bh);

// console.log("apiFormat([{rank:6,suit:'clubs'},{rank:10,suit:'diamonds'}]):", apiFormat([{rank:6,suit:'clubs'},{rank:10,suit:'diamonds'}]));

// let successCB = (res) => {
//   console.log("res.win:", res.win);
// }

// console.log(getHandOdds([{rank: 7, suit: 'clubs'}, {rank: 2, suit: 'spades'}, {rank: 2, suit: 'clubs'}], [{rank:6,suit:'clubs'},{rank:10,suit:'diamonds'}], successCB));