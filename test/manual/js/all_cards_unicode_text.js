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
 * General utility functions
 *
 * @module
 */

/**
 * Convert a symbol to a string representation without the "Symbol(...)" in
 * it.
 *
 * @param {symbol} symbol - the symbol to convert to a string.
 *
 * @returns {string} The string representation of the symbol.
 */
const symbolToString = function (symbol) {
    return symbol.toString().match(/Symbol\(([a-z]+)\)/)[1];
};

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

const initializeEventHandlers = function (events = []) {
    return events.reduce((handlers, event) => {
        handlers[event] = [];
        return handlers;
    }, {});
};

// Private properties of an EventAware class
const _eventHandlers = new WeakMap();

/**
 * EventAware is a base class for event aware object. EventAware objects can
 * emit events. For each emittable event an event handler can be installed or
 * uninstalled.
 */
class EventAware {

    /**
     * Create an EventAware object.
     *
     * @param {symbol[]} [emitableEvents = []] - the list of events this object can emit.
     */
    constructor(emitableEvents = []) {
        _eventHandlers.set(this, initializeEventHandlers(emitableEvents));
    }

    /**
     * @callback eventHandler
     *
     * @param {...*} parameters - an eventHandler can have zero (0) or more
     * parameters of any kind.
     */

    /**
     * Install an event handler.
     *
     * @param {symbol} event - the event to listen for.
     * @param {eventHandler} eventHandler - the event handler to install; when this EventAware
     * object emits the event this event handler will be executed.
     *
     * @throws {Error} An event handler can only be installed for an event
     * this EventAware object can emit.
     */
    on(event, eventHandler) {
        if (_eventHandlers.get(this).hasOwnProperty(event)) {
            _eventHandlers.get(this)[event].push(eventHandler);
        } else {
            throw new Error(`The EventAware object '${this}' does not emit event '${event.toString()}'.`);
        }
    }

    /**
     * Remove an event handler.
     *
     * @param {symbol} event - the event to stop listen for.
     * @param {eventHandler} [eventHandler] - the event handler to uninstall; when this
     * EventAware object emits the event this event handler will not be
     * executed anymore.
     *
     * If the eventHandler is not supplied, all event handlers for this event
     * will be uninstalled.
     *
     * @throws {Error} An event handler can only be uninstalled for an event
     * this EventAware object can emit. 
     */
    off(event, eventHandler = undefined) {
        if (_eventHandlers.get(this).hasOwnProperty(event)) {
            if (undefined === eventHandler) {
                // remove all event handlers for this event
                _eventHandlers.get(this)[event] = [];
            } else {
                const index = _eventHandlers.get(this)[event].indexOf(eventHandler);

                if (0 <= index) {
                    _eventHandlers.get(this)[event].splice(index, 1);
                }
            }
        } else {
            throw new Error(`The EventAware object '${this}' does not emit event '${event.toString()}'.`);
        }
    }

    /**
     * Emit an event.
     *
     * @param {symbol} event - the event to emit by this EventAware object.
     * @param {...*} parameters - a list of parameters that are applied to the
     * installed event handlers as parameters.
     */
    emit(event, ...parameters) {
        const handleEvent = function () {
            return function (eventHandler) {
                eventHandler.call(this, ...parameters);
            };
        };

        _eventHandlers.get(this)[event].forEach(handleEvent());
    }
}

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
/**
 * General event to denote that a model has been changed;
 */
const EVENT_MODEL_CHANGE = Symbol("event:model:change");

/**
 * Model is the base class for all models for concepts in the domain of
 * playing cards, such as cards, piles, decks, and the game.
 *
 * @extends EventAware
 */
class Model extends EventAware {

    /**
     * Construct a new Model.
     *
     * @param {symbol[]} [emitableEvents = []] - the list of events this object can emit.
     */
    constructor(emitableEvents = []) {
        if (!emitableEvents.includes(EVENT_MODEL_CHANGE)) {
            emitableEvents.push(EVENT_MODEL_CHANGE);
        }
        super(emitableEvents);
    }

    /** 
     * Emit an event. This method overrides the EventAware's emit method to
     * emit the EVENT_MODEL_CHANGE event whenever any other event is emitted
     * to signal to all subscribers that the model has been changed.
     *
     * In case of an EVENT_MODEL_CHANGE event, this model, the original event,
     * and the original parameters are passed as parameters to any installed
     * listener to EVENT_MODEL_CHANGE.
     *
     * @param {symbol} event - the event to emit by this EventAware object.
     * @param {...*} parameters - a list of parameters that are applied to the
     * installed event handlers as parameters.
     */
    emit(event, ...parameters) { 
        super.emit(event, ...parameters);

        if (EVENT_MODEL_CHANGE !== event) {
            const originalEvent = event;
            const originalParameters = parameters;
            this.emit(EVENT_MODEL_CHANGE, this, originalEvent, originalParameters);
        }
    }
}

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
 * The four suits: spades, hearts, diamonds, and clubs.
 *
 * @enum {symbol}
 */
const SUIT = [SPADES, HEARTS, DIAMONDS, CLUBS]; // Note. order of these suits matter, they are used by #fromUnicode to determine the suit.

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
const _color$1 = new WeakMap();
const _deck = new WeakMap();
const _faceUp = new WeakMap();

/**
 * A Card models a playing card.
 *
 * @extends Model
 */
class CardModel extends Model {

    /** 
     * Create a CardModel based on a specification in terms of suit, rank, and the
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
        _color$1.set(this, [DIAMONDS, HEARTS].includes(specification.suit) ? RED : BLACK);
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
     * @returns {CardModel} The newly created joker card.
     */
    static joker(color, deck, faceUp = false) {
        const card = new CardModel({suit: SPADES, rank: ACE}, deck, faceUp);
        _rank.set(card, undefined);
        _suit.set(card, undefined);
        _color$1.set(card, check(COLOR, color));
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
        return _color$1.get(this);
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
     * Return a string representation of this card. The difference with
     * #toUnicode() is that is returns the "back" unicode character when this
     * card is facing down.
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
     * @returns {CardModel} The card corresponding to the unicode representation of
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
            return CardModel.joker(0x1F0B === suitPart ? RED : BLACK, deck, faceUp);
        } else if (0 < rankPart && rankPart < 0xF && 0x1F0A <= suitPart && suitPart <= 0x1F0D) {
            const rank = RANK[rankPart - 1];
            const suit = SUIT[suitPart - 0x1F0A];
            return new CardModel({rank, suit}, deck, faceUp);
        } else {
            throw new Error(`Unable to convert character with code point ${codePoint.toString(HEX)} to a card.`);
        }
    }

}

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
const createDeck = function (deck, jokers = false) {
    const createCard = function (codePoint) {
        return CardModel.fromUnicode(String.fromCodePoint(codePoint), deck);
    };

    const cards = [
        createCard(0x1F0A1), // ace of spades
        createCard(0x1F0A2), // two of spades
        createCard(0x1F0A3), // three of spades
        createCard(0x1F0A4), // four of spades
        createCard(0x1F0A5), // five of spades
        createCard(0x1F0A6), // six of spades
        createCard(0x1F0A7), // seven of spades
        createCard(0x1F0A8), // eight of spades
        createCard(0x1F0A9), // nine of spades
        createCard(0x1F0AA), // ten of spades
        createCard(0x1F0AB), // jack of spades
        createCard(0x1F0AD), // queen of spades
        createCard(0x1F0AE), // king of spades

        createCard(0x1F0B1), // ace of hearts
        createCard(0x1F0B2), // two of hearts
        createCard(0x1F0B3), // three of hearts
        createCard(0x1F0B4), // four of hearts
        createCard(0x1F0B5), // five of hearts
        createCard(0x1F0B6), // six of hearts
        createCard(0x1F0B7), // seven of hearts
        createCard(0x1F0B8), // eight of hearts
        createCard(0x1F0B9), // nine of hearts
        createCard(0x1F0BA), // ten of hearts
        createCard(0x1F0BB), // jack of hearts
        createCard(0x1F0BD), // queen of hearts
        createCard(0x1F0BE), // king of hearts

        createCard(0x1F0C1), // ace of diamonds
        createCard(0x1F0C2), // two of diamonds
        createCard(0x1F0C3), // three of diamonds
        createCard(0x1F0C4), // four of diamonds
        createCard(0x1F0C5), // five of diamonds
        createCard(0x1F0C6), // six of diamonds
        createCard(0x1F0C7), // seven of diamonds
        createCard(0x1F0C8), // eight of diamonds
        createCard(0x1F0C9), // nine of diamonds
        createCard(0x1F0CA), // ten of diamonds
        createCard(0x1F0CB), // jack of diamonds
        createCard(0x1F0CD), // queen of diamonds
        createCard(0x1F0CE), // king of diamonds

        createCard(0x1F0D1), // ace of clubs
        createCard(0x1F0D2), // two of clubs
        createCard(0x1F0D3), // three of clubs
        createCard(0x1F0D4), // four of clubs
        createCard(0x1F0D5), // five of clubs
        createCard(0x1F0D6), // six of clubs
        createCard(0x1F0D7), // seven of clubs
        createCard(0x1F0D8), // eight of clubs
        createCard(0x1F0D9), // nine of clubs
        createCard(0x1F0DA), // ten of clubs
        createCard(0x1F0DB), // jack of clubs
        createCard(0x1F0DD), // queen of clubs
        createCard(0x1F0DE), // king of clubs
    ];

    if (jokers) {
        cards.push(createCard(0x1F0CF)); // black joker
        cards.push(createCard(0x1F0BF)); // red joker
    }

    return cards;
};


const _color = new WeakMap();
const _hasJokers = new WeakMap();
const _cards = new WeakMap();

/**
 * A Deck is a {@link https://en.wikipedia.org/wiki/Standard_52-card_deck|standard 52-card deck} 
 * and, optionally, with two joker cards.
 */
class Deck {

    /**
     * Construct a new Deck.
     *
     * @param {string} [color = "red"] - the background color of this deck.
     * @param {Boolean} [jokers = false] - should this deck include joker
     * cards or not?
     */
    constructor(color = "red", jokers = false) {
        _color.set(this, color);
        _hasJokers.set(this, jokers);
        _cards.set(this, createDeck(this, jokers));
    }

    /**
     * This deck's card's back-side color.
     *
     * @return {string} the color of the back of the cards of this deck.
     */
    get color() {
        return _color.get(this);
    }

    /**
     * Does this deck contain jokers?
     *
     * @return {Boolean} true if this deck contains joker cards, false
     * otherwise.
     */
    get hasJokers() {
        return _hasJokers(this);
    }

    /**
     * Get the cards of this deck.
     *
     * @return {Card[]} the cards of this deck.
     */
    get cards() {
        return _cards.get(this);
    }

    /**
     * Add all cards from this deck to a pile.
     *
     * @param {PileModel} pile - the pile to add this deck's cards to.
     *
     * @return {PileModel} the pile the cards are added to.
     */
    addToPile(pile) {
        for (const card of this.cards) {
            pile.add(card);
        }
        return pile;
    }
        
}

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
/**
 * CardRenderEngine is an abstract base class as an interface to various card render engines, such as
 * an unicode font based one, an image based one, or a SVG based one.
 */
class CardRenderEngine {
    /**
     * Create a new render engine
     */
    constructor() {
    }

    /**
     * Represent a card as a SVG element.
     *
     * @param {CardModel} card - the card model to represent;
     *
     * @return {SVGElement} A SVG representation of the card.
     */
    createCard() {
    }

    /**
     * Represent a card's base, its circumference, as a SVG Element.
     *
     * @return {SVGElement} A SVG representation of a card's circumference
     */
    createBase() {
    }

    /**
     * Represent a suit as a SVG Element
     *
     * @param {string} suit - the suit to represent.
     *
     * @return {SVGElement} A SVG representation of the suit.
     */
    createSuit() {
    }

}

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
 * Utilities for handling SVG.
 *
 * @module
 */

const SVGNS = "http://www.w3.org/2000/svg";
const XLINKNS = "http://www.w3.org/1999/xlink";

/**
 * SVG is a utility class to create and work with SVG elements.
 */
class SVG {
    /**
     * Create a new SVG object with the document to use to create SVG
     * elements.
     */
    constructor() {
    }

    /**
     * Create a SVG element with name and attributes.
     *
     * @param {string} name - the name of the element to create.
     * @param {object} [attributes = {}] - the attributes to set on the
     * created element.
     */
    create(name, attributes = {}) {
        const elt = document.createElementNS(SVGNS, name);
      
        Object.keys(attributes).forEach(key => elt.setAttribute(key, attributes[key]));
        
        return elt;
    }

    /**
     * Create a TEXT element with content and attributes
     *
     * @param {string} content - the text to show
     * @param {object} [attributes = {}] - the attributes to set.
     */
    text(content, attributes = {}) {
        const text = this.create("text", attributes);
        text.textContent = content;
        return text;
    }

    /**
     * Create a USE element with url and attributes.
     *
     * @param {string} url - the URL to the object to use.
     * @param {object} [attributes = {}] - the attributes to set.
     */
    use(url, attributes = {}) {
        const use = this.create("use", attributes);
        use.setAttributeNS(XLINKNS, "xlink:href", url);
        return use;
    }

    /**
     * Create a GROUP element with attributes.
     *
     * @param {object} [attributes = {}] - the attributes to set.
     */
    group(attributes = {}) {
        return this.create("g", attributes);
    }

    /**
     * Create a RECT
     *
     * @param {float} x - the upper left corner, x coordinate
     * @param {float} y - the upper left corner, y coordinate
     * @param {float} width - the width of the rectangle
     * @param {float} height - the heigt of the rectangle
     * @param {attributes} [attributes = {}] - other attributes
     */
    rectangle(x, y, width, height, attributes = {}) {
        const rect = this.create("rect", attributes);
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        return rect;
    }

}

const svg$1 = new SVG();

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

const SUITS = {
    "club": {
        codePoint: 0x2663,
        color: "black"
    },
    "spade": {
        codePoint: 0x2660,
        color: "black"
    },
    "heart": {
        codePoint: 0x2665,
        color: "red"
    },
    "diamond": {
        codePoint: 0x2666,
        color: "red"
    }
};

/**
 * UnicodeCardRenderEngine renders cards and suits as unicode SVG TEXT elements.
 *
 * @extends CardRenderEngine
 */
class UnicodeCardRenderEngine extends CardRenderEngine {
    /**
     * Create a new Unicode font based render engine.
     */
    constructor() {
        super();
    }

    /**
     * Represent a card as a SVG element.
     *
     * @param {CardModel} card - the card model to represent;
     *
     * @return {SVGElement} A SVG representation of the card.
     */
    createCard(card) {
        const attributes = {};

        let color;
        if (card.isFacingUp()) {
            color = card.isRed() ? "red" : "black";
        } else {
            color = card.backColor;
        }

        attributes.fill = color;

        const text = svg$1.text(card.toString(), attributes);

        if (card.isRed() && card.isJoker() && card.isFacingUp()) {
            // The red joker unicode symbol looks off compared to the other
            // card symbols. Therefore, instead of red joker symbol, use the
            // black joker symbol (but color it red).
            text.textContent = String.fromCodePoint(0x1F0CF);
        }
        
        return text;
    }

    /**
     * Represent a card's base, its circumference, as a SVG Element.
     *
     * @return {SVGElement} A SVG representation of a card's circumference
     */
    createBase() {
        return svg$1.text(String.fromCodePoint(0x1F0A0), {
            fill: "silver",
            "fill-opacity": 0.2
        });
    }

    /**
     * Represent a suit as a SVG Element
     *
     * @param {string} suit - the suit to represent.
     *
     * @return {SVGElement} A SVG representation of the suit.
     */
    createSuit(suit) {
        return svg$1.text(String.fromCodePoint(SUITS[suit].codePoint), {
            fill: SUITS[suit].color
        });
    }

}

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

const _engine = new WeakMap();

/**
 * CardSupplier is a singleton that renders cards. The engine to render cards
 * can be configured.
 *
 * @extends CardRenderEngine
 */
const CARD_SUPPLIER = new class extends CardRenderEngine {
    /**
     * Create a new supplier
     *
     */
    constructor() {
        super();
        _engine.set(this, new UnicodeCardRenderEngine());
    }

    /**
     * Get the configured card render engine.
     *
     * @returns {CardRenderEngine}
     */
    get engine() {
        return _engine.get(this);
    }

    /**
     * Set the card render engine.
     *
     * @param {CardRenderEngine} engine - the engine to use.
     */
    set engine(engine) {
        _engine.set(this, engine);
    }

    /**
     * Represent a card as a SVG element.
     *
     * @param {CardModel} card - the card model to represent;
     *
     * @return {SVGElement} A SVG representation of the card.
     */
    createCard(card) {
        return this.engine.createCard(card);
    }

    /**
     * Represent a card's base, its circumference, as a SVG Element.
     *
     * @return {SVGElement} A SVG representation of a card's circumference
     */
    createBase() {
        return this.engine.createBase();
    }

    /**
     * Represent a suit as a SVG Element
     *
     * @param {string} suit - the suit to represent.
     *
     * @return {SVGElement} A SVG representation of the suit.
     */
    createSuit(suit) {
        return this.engine.createSuit(suit);
    }

};

const deck = new Deck("navy", true);

const WIDTH = 60;
const HEIGHT = 1.5 * WIDTH;
const SUIT_WIDTH = 12 * WIDTH;

const svg = document.getElementById("table");
svg.setAttribute("width", SUIT_WIDTH + WIDTH);
svg.setAttribute("height", 6 * HEIGHT);
svg.style["font-size"] = `${WIDTH}px`;

let x = 0;
let y = 0;

const renderCard = function (card, x, y) {
    const cardElt = CARD_SUPPLIER.createCard(card);
    cardElt.setAttribute("transform", `translate(${x}, ${y + HEIGHT})`);
    svg.appendChild(cardElt);
};

for (const card of deck.cards) {
    if (x > SUIT_WIDTH) {
        x = 0;
        y += HEIGHT;
    }

    // Render the front of the cards
    card.turn();
    renderCard(card, x, y);

    x += WIDTH;
}

// Render back as well.
const card = deck.cards[0];
card.turn();
renderCard(card, x, y);

// Render base of a card
x += WIDTH;
const base = CARD_SUPPLIER.createBase();
base.setAttribute("transform", `translate(${x},${y + HEIGHT})`);
svg.appendChild(base);

// Render each of the four suits separately
x += WIDTH;
["club", "spade", "heart", "diamond"].forEach(suit => {
    const suitElt = CARD_SUPPLIER.createSuit(suit);
    suitElt.setAttribute("transform", `translate(${x}, ${y + HEIGHT})`);
    svg.appendChild(suitElt);
    x += WIDTH;
});
