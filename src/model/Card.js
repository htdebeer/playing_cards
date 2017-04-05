/*
 * Copyright 2017 Huub de Beer <huub@heerdebeer.org>
 *
 * This file is part of playing_cards.
 *
 * playing_cards is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * playing_cards is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with playing_cards.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */

/**
 * @module
 */
import {Model} from "./Model.js";

const BACK = 0x1F0A0;
const HEX = 16;

/**
 * EVENT_CARD_TURN is emitted when a card is turned.
 */
const EVENT_CARD_TURN = Symbol("event:card:turn");

/**
 * A red card.
 */
const RED = Symbol("red");

/**
 * A black card.
 */
const BLACK = Symbol("black");

/**
 * The two colors of a card: red and black.
 *
 * @enum {symbol}
 */
const COLOR = [RED, BLACK];

/**
 * The suit clubs.
 */
const CLUBS = Symbol("clubs");

/**
 * The suit diamonds.
 */
const DIAMONDS = Symbol("diamonds");

/**
 * The suit hearts.
 */
const HEARTS = Symbol("hearts");

/**
 * The suit spades.
 */
const SPADES = Symbol("spades");

/**
 * The four suits: clubs, diamonds, diamonds, and hearts.
 *
 * @enum {symbol}
 */
const SUIT = [CLUBS, DIAMONDS, HEARTS, SPADES];

/**
 * The rank ace.
 */
const ACE = Symbol("ace");

/**
 * The rank two.
 */
const TWO = Symbol("two");

/**
 * The rank three.
 */
const THREE = Symbol("three");

/**
 * The rank four.
 */
const FOUR = Symbol("four");

/**
 * The rank five.
 */
const FIVE = Symbol("five");

/**
 * The rank six.
 */
const SIX = Symbol("six");

/**
 * The rank seven.
 */
const SEVEN = Symbol("seven");

/**
 * The rank eight.
 */
const EIGHT = Symbol("eight");

/**
 * The rank nine.
 */
const NINE = Symbol("nine");

/**
 * The rank ten.
 */
const TEN = Symbol("ten");

/**
 * The rank JACK.
 */
const JACK = Symbol("jack");

/**
 * The rank KNIGHT.
 */
const KNIGHT = Symbol("knight");

/**
 * The rank queen.
 */
const QUEEN = Symbol("queen");

/**
 * The rank king.
 */
const KING = Symbol("king");

/**
 * The various ranks: ace, two, three, four, five, six, seven, eight, nine,
 * ten, jack, knight, queen, and king.
 *
 * @enum {symbol}
 */
const RANK = [ACE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, KNIGHT, QUEEN, KING];

const check = function (type, value) {
    if (type.includes(value)) {
        return value;
    } else {
        throw new Error(`Value "${value}" not in ${type}`);
    }
};

// Private properties of a Card
const _rank = new WeakMap();
const _suit = new WeakMap();
const _color = new WeakMap();
const _deck = new WeakMap();
const _faceUp = new WeakMap();

/**
 * A Card models a playing card.
 */
class Card extends Model {

    /** 
     * Create a Card based on a specification in terms of suit, rank, and the
     * deck it belongs to. Optionally, you can indicate if the card should be
     * face up initially or not. By default a card faces down. Based on this
     * specification the card's color is determined.
     *
     * Note. You cannot create a joker card using this constructor. Us the
     * static @see joker method to create a joker card.
     *
     * @param {Object} specification - the card's specification
     * @param {symbol} specification.suit - the suit of the card
     * @param {symbol} specification.rank - the rank of the card
     * @param {Deck} deck - the deck the card belongs to. Each card belongs to
     * a deck.
     * @param {boolean} [faceUp = false] - is the card facing up initially or
     * not?
     */
    constructor(specification, deck, faceUp = false) {
        super([EVENT_CARD_TURN]);

        _suit.set(this, check(SUIT, specification.suit));
        _rank.set(this, check(RANK, specification.rank));
        _color.set(this, [DIAMONDS, HEARTS].includes(specification.suit) ? RED : BLACK);
        _deck.set(this, deck);
        _faceUp.set(this, faceUp);
    }

    /**
     * Create a joker card. Joker cards are special cards. Joker cards have no
     * suit nor rank. A joker does have a color, belongs to a deck, and, like
     * cards, they can be optionally created to face up.
     *
     * @param {symbol} color This joker's color.
     * @param {Deck} deck The deck this joker belongs to.
     * @param {boolean} [faceUp = false] - is the joker card facing up
     * initially or not?
     *
     * @returns {Card} The newly created joker card.
     */
    static joker(color, deck, faceUp = false) {
        const card = new Card({suit: SPADES, rank: ACE}, deck, faceUp);
        _rank.set(this, undefined);
        _suit.set(this, undefined);
        _color.set(this, check(COLOR, color));
        return card;
    }

    /**
     * Get the rank of this card. A joker card has rank undefined.
     *
     * @returns {symbol} The rank of this card.
     */
    get rank() {
        return _rank.get(this);
    }

    /**
     * Get the suit of this card. A joker card has suit undefined.
     *
     * @returns {symbol} The suit of this card.
     */
    get suit() {
        return _suit.get(this);
    }

    /**
     * Get the color of this card.
     *
     * @returns {symbol} The color of the card.
     */
    get color() {
        return _color.get(this);
    }

    /**
     * Get the number of pips on this card. If this card is a joker card or a
     * face card, this property is 0.
     *
     * @returns {number} The number of pips of this card.
     */
    get pips() {
        const rankIndex = RANK.indexOf(_rank.get(this));
        return 0 <= rankIndex && rankIndex < 10 ? rankIndex + 1 : 0;
    }

}

export {
    EVENT_CARD_TURN,
    RED,
    BLACK,
    COLOR,
    CLUBS,
    DIAMONDS,
    HEARTS,
    SPADES,
    SUIT,
    ACE,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
    NINE,
    TEN,
    JACK,
    KNIGHT,
    QUEEN,
    KING,
    RANK,
    Card
};
