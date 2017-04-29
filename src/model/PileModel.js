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
import {Model, EVENT_MODEL_CHANGE} from "./Model.js";

const _cards = new WeakMap();

/**
 * A pile of cards.
 *
 * @extends Model
 */
class PileModel extends Model {
    /**
     * Create an empty pile.
     *
     * @param {Deck} [deck = undefined] - create a pile from a deck
     */
    constructor(deck = undefined) {
        super();
        _cards.set(this, undefined === deck ? [] : deck.cards);
    }

    /**
     * The number of cards in this pile.
     *
     * @return {integer} The number of cards in this pile.
     */
    get count() {
        return _cards.get(this).length;
    }

    /**
     * Get a list of the cards in this pile.
     *
     * @return {Card[]} The cards in this pile as an array.
     */
    get cards() {
        return _cards.get(this);
    }

    /**
     * Is this pile empty?
     *
     * @return {Boolean} True if this pile has no cards, false otherwise.
     */
    isEmpty() {
        return 0 >= this.count;
    }

    /**
     * Add a card to this pile.
     *
     * @param {CardModel} card - the card to add.
     * @param {integer} [index = pile.count] - the index to insert the card in
     * this pile. Defaults to the end of the pile.
     *
     * @return {PileModel} Return this pile.
     *
     * @fire EVENT_MODEL_CHANGE
     *
     * @throw {Error} Index out of bounds.
     */
    add (card, index = this.count) {
        if (0 <= index && index <= this.count) {
            _cards.get(this).splice(index, 0, card);
            this.emit(EVENT_MODEL_CHANGE, this);
            return this;
        } else {
            throw new Error("Index out of bounds");
        }
    }

    /**
     * Iterator over all cards of this pile.
     *
     * @return {iterator} 
     */
    *each() {
        for (const card of _cards.get(this)) {
            yield card;
        }
    }

    /**
     * Apply callback to each card in this pile.
     *
     * @param {Function} callback - the function to apply to each card in this
     * pile
     */
    forEach(callback) {
        _cards.get(this).forEach(callback);
    }

    /**
     * Pick a random card from this pile; the pile contains one card less
     * hereafter.
     *
     * @return {Card} the picked card.
     *
     * @fire EVENT_MODEL_CHANGE
     */
    pick() {
        const randomIndex = Math.floor(Math.random() * this.count);
        const card = _cards.get(this).splice(randomIndex, 1)[0];
        this.emit(EVENT_MODEL_CHANGE, this);
        return card;
    }

    /**
     * Take a card from this pile. The pile contains one card less.
     *
     * @param {integer} [index = this.count -1] - the index of the card to
     * take. Defaults to the top card.
     *
     * @return {Card} the top card
     *
     * @fire EVENT_MODEL_CHANGE
     */
    take(index = this.count - 1) {
        const card = _cards.get(this).splice(index, 1)[0];
        this.emit(EVENT_MODEL_CHANGE, this);
        return card;
    }

    /**
     * Inspect a card in this pile. The pile does not change.
     *
     * @param {integer} [index = top] - the index of the card to
     * inspect. Defaults to the top card
     *
     * @return {Card} the card to inspect.
     */
    inspect(index = this.count - 1) {
        return _cards.get(this)[index];
    }

    /**
     * Shuffle this pile.
     *
     * @return {PileModel} this pile, shuffled.
     *
     * @fire EVENT_MODEL_CHANGE
     */
    shuffle() {
        _cards.get(this).sort(() => Math.random() - 0.5);
        this.emit(EVENT_MODEL_CHANGE, this);
        return this;
    }

    /**
     * Split this pile in a number of smaller piles. By default the pile is
     * split in two.
     *
     * @param {integer} [numberOfPiles = 2] - the number of piles to split
     * this pile into, defaults to 2.
     *
     * @return {PileModel[]} An array of piles, this pile is the first in that list
     *
     * @fire EVENT_MODEL_CHANGE
     */
    split(numberOfPiles = 2) {
        if (Number.isInteger(numberOfPiles)) {
            const pileCount = Math.floor(this.count / numberOfPiles);
            const piles = [];
            piles.push(this);

            while (this.count > pileCount) {
                const pile = new PileModel();

                while (pile.count < pileCount) {
                    pile.add(this.take());
                }

                piles.push(pile);
            }

            this.emit(EVENT_MODEL_CHANGE, this);
            return piles;
        }
    }

    /**
     * Merge another pile with this pile. Other pile will be empty afterwards.
     *
     * @param {PileModel} other - the other pile to merge with this one.
     *
     * @return {PileModel} this pile.
     *
     * @fire EVENT_MODEL_CHANGE
     */
    merge(other) {
        while (!other.isEmpty()) {
            this.add(other.take(0));
        }
        this.emit(EVENT_MODEL_CHANGE, this);
        return this;
    }


    
}

export {
    PileModel,
};
