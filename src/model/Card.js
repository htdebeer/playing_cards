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
import {symbolToString} from "../util.js";
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
        _rank.set(card, undefined);
        _suit.set(card, undefined);
        _color.set(card, check(COLOR, color));
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
     * Get the deck this card belongs to.
     *
     * @returns {Deck} The deck this card belongs to.
     */
    get deck() {
        return _deck.get(this);
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

    /**
     * Get the name of this card, which follows the pattern "rank of suit" or
     * "color joker".
     *
     * @return {string} The name of this card.
     */
    get name() {
        let name = "";
        if (this.isJoker()) {
            name = `${symbolToString(this.color)} joker`;
        } else {
            name = `${symbolToString(this.rank)} of ${symbolToString(this.suit)}`;
        }
        return name;
    }

    /**
     * Is this a joker card?
     *
     * @return {Boolean} True if this card is a joker card, false otherwise.
     */
    isJoker() {
        return undefined === this.rank || undefined === this.suit;
    }

    /**
     * Is this card a jack?
     *
     * @returns {Boolean} True if this card is a jack, false otherwise.
     */
    isJack() {
        return JACK === this.rank;
    }

    /**
     * Is this card a knight?
     *
     * @return {Boolean} True is this card is a knight, false otherwise.
     */
    isKnight() {
        return KNIGHT === this.rank;
    }

    /**
     * Is this card a queen?
     *
     * @return {Boolean} True if this card is a queen, false otherwise.
     */
    isQueen() {
        return QUEEN === this.rank;
    }

    /**
     * Is this card a king?
     *
     * @return {Boolean} True if this card is a king, false otherwise.
     */
    isKing() {
        return KING === this.rank;
    }

    /**
     * Is this card an ace?
     *
     * @return {Boolean} True if this card is an ace, false otherwise.
     */
    isAce() {
        return ACE === this.rank;
    }

    /**
     * Is this a face card? 
     *
     * @return {Boolean} True if this card is a jack, knight, queen or king,
     * false otherwise. 
     *
     * Note. In some card games the ace is also considered a face card.
     */
    isFaceCard() {
        return this.isJack() || 
            this.isKnight() ||
            this.isQueen() ||
            this.isKing();
    }

    /**
     * Is this a pips card?
     *
     * @return {Boolean} True if this card has 1 — 10 pips, false otherwise.
     * 
     * Note. In some card games the ace is not considered a pips card.
     */
    isPipsCard() {
        return 0 < this.pips;
    }

    /**
     * Belongs this card to the spades?
     *
     * @return {Boolean} True if this card's suit is spades, false otherwise.
     */
    isSpades() {
        return SPADES === this.suit;
    }

    /**
     * Belongs this card to the hearts?
     *
     * @return {Boolean} True if this card's suit is hearts, false otherwise.
     */
    isHearts() {
        return HEARTS === this.suit;
    }

    /**
     * Belongs this card to the diamonds?
     *
     * @return {Boolean} True if this card's suit is diamonds, false
     * otherwise.
     */
    isDiamonds() {
        return DIAMONDS === this.suit;
    }

    /**
     * Belongs this card to the clubs?
     *
     * @return {Boolean} True if this card's suit is clubs, false otherwise.
     */
    isClubs() {
        return CLUBS === this.suit;
    }

    /**
     * Is this card facing up?
     *
     * @return {Boolean} True if this card is facing up, false if it is facing
     * down.
     */
    isFacingUp() {
        return _faceUp.get(this);
    }

    /**
     * Is this card facing down?
     *
     * @return {Boolean} True if this card is facing down, false if it is
     * facing up.
     */
    isFacingDown() {
        return !this.isFacingUp();
    }

    /**
     * Turn this card around.
     *
     * @fires EVENT_CARD_TURN
     */
    turn() {
        _faceUp.set(this, !_faceUp.get(this));
        this.emit(EVENT_CARD_TURN);
    }

    /**
     * Is this a red card?
     *
     * @return {Boolean} True true if this card belongs to the hearts or
     * diamonds, or is the red joker.
     */
    isRed() {
        return RED === this.color;
    }

    /**
     * Is this a black card?
     *
     * @return {Boolean} True if this card belongs to the spades or clubs, or
     * is the black joker.
     */
    isBlack() {
        return BLACK === this.color;
    }

    /**
     * The background of this card is the color of the deck this card belongs
     * to. 
     *
     * @return {string} ["black"] A string representation of a color, such as a HTML
     * name, like "red" or a hexadecimal number like "#ff00ae".
     */
    get backColor() {
        return this.deck.color;
    }

    /**
     * Is this card the same card as another card? For two cards to be equal,
     * they need to have the same suit, rank, color, and should be part of the
     * same deck.
     *
     * @param {Card} other - The other card to compare with this card.
     *
     * @returns {Boolean} True if this card and the other card are the same,
     * false otherwise.
     */
    equals(other) {
        return this.suit === other.suit &&
            this.rank === other.rank &&
            this.color === other.color &&
            this.deck === other.deck;
    }

    /**
     * Return a string representation of this card. 
     *
     * @returns {string} This card's string representation.
     */
    toString() {
        return this.isFacingDown() ? String.fromCodePoint(BACK) : this.toUnicode();
    }

    /**
     * Convert this card to a unicode symbol. See {@link https://en.wikipedia.org/wiki/Playing_cards_in_Unicode|the wikipedia page on playing cards in Unicode} for more information.
     *
     * @return {string} The unicode symbol representation of this card.
     */
    toUnicode() {
        let codePoint = 0;

        if (this.isJoker()) {
            codePoint = this.isRed() ? 0x1F0BF : 0x1F0CF;
        } else {
            codePoint = 0x1F0A0 + SUIT.indexOf(this.suit) * HEX + RANK.indexOf(this.rank) + 1;
        }

        return String.fromCodePoint(codePoint);
    }
  
    /**
     * Create a new card based on a unicode representation, the deck it belongs
     * to and if it should initially be facing up. See {@link https://en.wikipedia.org/wiki/Playing_cards_in_Unicode|the wikipedia page on playing cards in Unicode} for more information.
     *
     * @param {String} cardChar A single unicode character representing a card.
     * @param {Deck} deck The deck this card belongs to.
     * @param {Boolean} faceUp This card is facing up.
     *
     * @returns {Card} The card corresponding to the unicode representation of
     * a card.
     *
     * @throws {Error} When the unicode representation is not exactly one
     * character
     * @throws {Error} When the unicode representation cannot be converted to
     * a card.
     */
    static fromUnicode(cardChar, deck, faceUp = false) {
        if (1 !== [...cardChar].length) {
            // Got the idea to check for unicode length via array from
            // https://mathiasbynens.be/notes/javascript-unicode
            throw new Error(`Expected one character, but got ${cardChar.length} characters instead: "${cardChar}"`);
        }

        // The unicode card symbols contain two bytecodes: combine them to one
        // codepoint.
        const codePoint = cardChar.codePointAt(0);
        const rankPart = codePoint % HEX;
        const suitPart = Math.trunc(codePoint / HEX);

        if (0xF === rankPart && (0x1F0B === suitPart || 0x1F0C === suitPart)) {
            return Card.joker(0x1F0B === suitPart ? RED : BLACK, deck, faceUp);
        } else if (0 < rankPart && rankPart < 0xF && 0x1F0A <= suitPart && suitPart <= 0x1F0D) {
            return new Card({rank: RANK[rankPart - 1], suit: SUIT[suitPart - 0x1F0A]}, deck, faceUp);
        } else {
            throw new Error(`Unable to convert character with code point ${codePoint.toString(HEX)} to a card.`);
        }
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
