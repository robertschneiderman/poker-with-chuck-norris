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

export const getPokerHand = (stage, hold) => {
  return new PokerHand(stage, hold).bestHand();
}

export const greatestHold = (stage, hands) => {
  if (hands[0].value > hands[1].value) {
    return 0;
  } else if (hands[1].value > hands[0].value) {
    return 1;
  }

  for (let i = 0; i < hands[0].tiebreakers.length; i++) {
    if (hands[0].tiebreakers[i] > hands[1].tiebreakers[i]) {
      return 0;
    } else if (hands[1].tiebreakers[i] > hands[0].tiebreakers[i]) {
      return 1;
    }
  }
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
      if (RANKS[key] === this.value) rank = key
    }

    let tb1 = this.tiebreakers[0];
    let tb2 = this.tiebreakers[1];

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

      if (hands[hand]) {
        this.value = value;
        this.tiebreakers = tiebreakers;
        this.name = hand;
        return { value, tiebreakers, name: this.bestHandName() }
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
    let triple = this.findByCount(3);
    if (triple) {
      let valuesNotInPair = this.valuesNotInPair(triple);
      return triple.concat(valuesNotInPair.slice(0, 2));
    } else {
      return false
    }
  }

  pairs() {
    let doubles = this.findByCount(2);
    if (doubles.length >= 2) {
      let valuesNotInPair = this.valuesNotInPair(doubles);
      return doubles.concat(valuesNotInPair.slice(0, 1));
    }
    return false;
  }

  doubles() {
    let pair = this.findByCount(2);
    if (pair) {
      let valuesNotInPair = this.valuesNotInPair(pair);
      return pair.concat(valuesNotInPair.slice(0, 3));
    } else {
      return false
    }
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

// let gh = greatestHold(
//   [{rank: 11, suit: 'clubs'},
//   {rank: 13, suit: 'clubs'},
//   {rank: 11, suit: 'spades'},
//   {rank: 12, suit: 'clubs'},
//   {rank: 6, suit: 'hearts'}],
//   [[{rank: 8, suit: 'spades' },
//   {rank: 3, suit: 'hearts'}],
//   [{rank: 5, suit: 'diamonds'},
//   {rank: 3, suit: 'clubs'}]]
// );

// console.log("gh:", gh);

// let bh = new PokerHand([{rank: 11, suit: 'clubs'},
//   {rank: 13, suit: 'clubs'},
//   {rank: 11, suit: 'spades'},
//   {rank: 12, suit: 'clubs'},
//   {rank: 6, suit: 'hearts'}], [{rank: 8, suit: 'spades' },
//   {rank: 3, suit: 'hearts'}]).bestHand();

// console.log("bh:", bh);

// console.log("apiFormat([{rank:6,suit:'clubs'},{rank:10,suit:'diamonds'}]):", apiFormat([{rank:6,suit:'clubs'},{rank:10,suit:'diamonds'}]));

// let successCB = (res) => {
//   console.log("res.win:", res.win);
// }

// console.log(getHandOdds([{rank: 7, suit: 'clubs'}, {rank: 2, suit: 'spades'}, {rank: 2, suit: 'clubs'}], [{rank:6,suit:'clubs'},{rank:10,suit:'diamonds'}], successCB));