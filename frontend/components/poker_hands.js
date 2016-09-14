require_relative './tie_breaker'

import sortBy from 'lodash/sortBy';
import drop from 'lodash/drop';

const RANKS = [
  'royal_flush',
  'straight_flush',
  'four_of_a_kind',
  'full_house',
  'flush',
  'straight',
  'three_of_a_kind',
  'two_pair',
  'one_pair',
  'high_car'
];

function count() {
  var count = 0;
  for(var i = 0; i < array.length; ++i){
      if(array[i] == 2)
          count++;
  }
  return count;
}

function sortNumber(a,b) {
    return b - a;
}

// function rank() {
//   RANKS.forEach(rank => {
//   }
// }

class PokerHand {

  constructor(pile) {
    this.hand = bestHand(pile);
    this.getRank();
  }

  compare(otherHand) {
    if (this.hand === otherHand) {
      0
    } else if (rank != otherHand.rank) {
      RANKS.reverse.index(rank) <=> RANKS.reverse.index(otherHand.rank)
    }
    else {
      tie_breaker(otherHand)
    }
  }

  bestHand() {
    let bestHand = this.hand.sort(sortNumber);

    bestHand = bestHand.sort((card, nextCard) => { return count(arr, card) >= count(arr, nextCard) });

    return drop(bestHand, 2);
  }

  // function count(array, val) {
  //   var count = 0;
  //   for(var i = 0; i < array.length; ++i){
  //       if(array[i] === val)
  //           count++;
  //   }
  //   return count;
  // }

  // arr = [12, 10, 9, 9, 2, 2, 2]
  // arr.sort((card, nextCard) => { return count(arr, card) >= count(arr, nextCard) })

  // [12, 10, 9, 9, 2, 2, 2].sort(sortNumber)

  function card_value_count(value) {
    @cards.map(&:value).count(value)
  }

  function highCard {
    @cards.sort.last
  }

  def cards_without(value)
    @cards.select { |card| card.value != value }
  end

  def has_a?(value_or_suit)
    @cards.any? do |card|
      card.value == value_or_suit || card.suit == value_or_suit
    end
  end

  def royal?
    Card.royal_values.all? { |value| @cards.map(&:value).include?(value) }
  end

  def set_card(n)
    cards.find { |card| card_value_count(card.value) == n }
  end

  private
  def royal_flush?
    royal? && straight_flush?
  end

  def straight_flush?
    straight? && flush?
  end

  def four_of_a_kind?
    @cards.any? { |card| card_value_count(card.value) == 4 }
  end

  def full_house?
    three_of_a_kind? && one_pair?
  end

  def flush?
    @cards.map(&:suit).uniq.length == 1
  end

  def straight?
    if has_a?(:ace) && has_a?(:two)
      straight = Card.values[0..3] + [:ace]
    else
      low_index = Card.values.index(@cards.first.value)
      straight = Card.values[low_index..(low_index + 4)]
    end

    @cards.map(&:value) == straight
  end

  def three_of_a_kind?
    @cards.any? { |card| card_value_count(card.value) == 3 }
  end

  def two_pair?
    pairs.count == 2
  end

  def one_pair?
    pairs.count == 1
  end

  def high_card?
    true
  end
}