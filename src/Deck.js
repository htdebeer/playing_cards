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
import {GameElement} from "./GameElement.js";
import {CardModel} from "./model/CardModel.js";

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
 *
 * @extends GameElement
 */
class Deck extends GameElement {

    /**
     * Construct a new Deck. The deck's color is also its name.
     *
     * @param {string} [color = "red"] - the background color of this deck.
     * @param {Boolean} [jokers = false] - should this deck include joker
     * cards or not?
     */
    constructor(color = "red", jokers = false) {
        super(color);
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
}

export {
    Deck,
};
