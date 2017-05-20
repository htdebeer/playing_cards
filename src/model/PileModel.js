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
import {Deck} from "../Deck.js";

/**
 * PileInvariantError is thrown when a PileModel's invariant is invalidated.
 */
const PileInvariantError = class extends Error {
};

/**
 * PileIndexOutOfBoundsErrow is thrown when a CardModel outside a PileModel's
 * bounds is being accessed.
 */
const PileIndexOutOfBoundsError = class extends Error {
};

/**
 * @function PILE_ACTIONS.INSERT
 * Insert card in cards at index
 *
 * @param {CardModel[]} cards - list of cards
 * @param {CardModel} card - the card to insert
 * @param {Integer} index - the place in cards to insert the card
 *
 * @return {CardModel[]} the list of cards with card inserted at index
 */
const insert = function (cards, card, index) {
    cards.splice(index, 0, card);
    return cards;
};

/**
 * @function PILE_ACTIONS.ADD
 * Add card to the top of cards.
 *
 * @param {CardModel[]} cards - list of cards
 * @param {CardModel} card - the card to add to the list of cards
 *
 * @return {CardModel[]} the list of cards with card added to it
 */
const add = function (cards, card) {
    return insert(cards, card, cards.length);
};

/**
 * @function PILE_ACTIONS.PICK
 * Pick a card at random from cards
 *
 * @param {CardModel[]} cards - list of cards
 *
 * @return {Array} an array with the list of card minus the picked card, and
 * the picked card.
 */
const pick = function (cards) {
    const RANDOM_INDEX = Math.floor(Math.random() * cards.length);
    const rest = cards;
    const picked = rest.splice(RANDOM_INDEX, 1)[0];
    return [rest, picked];
};

/**
 * @function PILE_ACTIONS.TAKE
 * Take a card from list of cards
 *
 * @param {CardModel[]} cards - list of cards
 * @param {integer} index - the index of the card to take
 *
 * @return {Array} an array with the list of card minus the taken card, and
 * the taken card.
 */
const take = function (cards, index = cards.length - 1) {
    const rest = cards;
    const taken = rest.splice(index, 1)[0];
    return [rest, taken];
};

/**
 * @function PILE_ACTIONS.MERGE
 * Merge other lists of cards with a list of cards
 *
 * @param {CardModel[]} cards - list of cards
 * @Param {cardModel[][]} others - list of lists of cards
 *
 * @return {CardModel[]} list with all lists of cards merged into one list
 */
const merge = function (cards, others) {
    return cards.concat(...others);
};

/**
 * @function PILE_ACTION.SHUFFLE
 * Shuffle a list of cards
 *
 * @param {CardModel[]} cards - list of cards
 *
 * @return {CardModel[]} shuffled list of cards
 */
const shuffle = function (cards) {
    return cards.sort(() => Math.random() - 0.5);
};

/** 
 * Insert action symbol
 */
const INSERT = Symbol("action:insert");
/**
 * Add action symbol
 */
const ADD = Symbol("action:add");
/**
 * Pick action symbol
 */
const PICK = Symbol("action:pick");
/**
 * Take action symbol
 */
const TAKE = Symbol("action:take");
/**
 * Merge action symbol
 */
const MERGE = Symbol("action:merge");
/**
 * Shuffle action symbol
 */
const SHUFFLE = Symbol("action:shuffle");

/**
 * Available actions on a pile.
 *
 * @property {function} INSERT - Insert a card at index in a pile
 * @property {function} ADD - Add a card in a pile
 * @property {function} PICK - Pick a card at random from pile
 * @property {function} TAKE - Take a card from index from pile
 * @property {function} MERGE - Merge other piles with this pile
 * @property {function} SHUFFLE - Shuffle pile
 */
const PILE_ACTIONS = {
    INSERT: insert,
    ADD: add,
    PICK: pick,
    TAKE: take,
    MERGE: merge,
    SHUFFLE: shuffle
};


const TAUTOLOGY = function (pile) { return true; };

const _cards = new WeakMap();
const _invariant = new WeakMap();

// Check the Array with cards newCards against the pile's invariant. If it
// succeeds, set the newCards as the pile's list of cards, otherwise throw a
// PileInvariantError with errorMessage.
const checkInvariant = function (pile, newCards, errorMessage = "") {
    if (!pile.invariant(newCards)) {
        throw new PileInvariantError(`${errorMessage}.\n\t${pile.invariant}`);
        return false;
    }

    _cards.set(pile, newCards);
    return true;
};

// Create a copy of this pile's cards as an Array;
const copy = function (pile) {
    return _cards.get(pile).slice();
}

/**
 * A pile of cards. 
 *
 * @extends Model
 */
class PileModel extends Model {
    /**
     * Create an empty pile and set its data invariant. This data invariant
     * should always hold.
     *
     * @param {Function} [invariant = TAUTOLOGY] - the data invariant for this
     * pile.
     * @param {CardModel[]|Deck} [initial = []] - create a pile from a list of cards
     *
     * @throw {PileInvariantError} Invariant invalidated by adding this card
     */
    constructor(invariant = TAUTOLOGY, initial = []) {
        super();
        _invariant.set(this, invariant);

        let initialCards = initial instanceof Deck ? initial.cards : initial;
        initialCards = Array.isArray(initialCards) ? initialCards : [];

        checkInvariant(
            this, 
            initialCards,
            `Initial cards does not fullfill data invariant`
        );
    }

    /**
     * Get the data invariant for this pile
     *
     * @return {Function} the data invariant
     */
    get invariant() {
        return _invariant.get(this);
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
     * Add a card to this pile.
     *
     * @param {CardModel} card - the card to add.
     *
     * @return {PileModel} Return this pile.
     *
     * @fire EVENT_MODEL_CHANGE
     *
     * @throw {PileInvariantError} Invariant invalidated by adding this card
     */
    add (card) {
        const added = add(copy(this), card);
        const valid = checkInvariant(
            this,
            added,
            `Cannot add ${card.toUnicode()}`
        );
        
        if (valid) {
            this.emit(EVENT_MODEL_CHANGE, this);
        }

        return this;
    }
    
    /**
     * Insert a card in this pile.
     *
     * @param {CardModel} card - the card to add.
     * @param {integer} [index = pile.count] - the index to insert the card in
     * this pile. Defaults to the end of the pile.
     *
     * @return {PileModel} Return this pile.
     *
     * @fire EVENT_MODEL_CHANGE
     *
     * @throw {PileIndexOutOfBoundsError} Index out of bounds.
     * @throw {PileInvariantError} Invariant invalidated by inserting this card at this index
     */
    insert (card, index) {
        if (0 > index || index > this.count) {
            throw new PileIndexOutOfBoundsError();
        }

        const inserted = insert(copy(this), card, index);
        const valid = checkInvariant(
            this,
            inserted,
            `Cannot insert ${card.toUnicode()} at index ${index}`
        );
        
        if (valid) {
            this.emit(EVENT_MODEL_CHANGE, this);
        }

        return this;
    }

    /**
     * Pick a random card from this pile; the pile contains one card less
     * hereafter.
     *
     * @return {Card} the picked card.
     *
     * @fire EVENT_MODEL_CHANGE
     *
     * @throw {PileInvariantError} Invariant invalidated by picking a card
     * from this pile
     */
    pick() {
        const [rest, picked] = pick(copy(this));
        const valid = checkInvariant(
            this,
            rest,
            `Cannot pick ${picked.toUnicode()}`
        );
        
        if (valid) {
            this.emit(EVENT_MODEL_CHANGE, this);
        }

        return picked;
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
     *
     * @throw {PileInvariantError} Invariant invalidated taking card from
     * index
     */
    take(index = this.count - 1) {
        const [rest, taken] = take(copy(this), index);
        const valid = checkInvariant(
            this,
            rest,
            `Cannot take ${taken.toUnicode()} from ${index}`
        );
        
        if (valid) {
            this.emit(EVENT_MODEL_CHANGE, this);
        }

        return taken;
    }

    /**
     * Shuffle this pile.
     *
     * @return {PileModel} this pile, shuffled.
     *
     * @fire EVENT_MODEL_CHANGE
     *
     * @throw {PileInvariantError} Invariant invalidated by shuffling pile
     */
    shuffle() {
        const valid = checkInvariant(
            this,
            shuffle(copy(this)),
            `Shuffling results in an invalid pile`
        );
        
        if (valid) {
            this.emit(EVENT_MODEL_CHANGE, this);
        }

        return this;
    }

    /**
     * Merge another pile with this pile. Other pile will be empty afterwards.
     *
     * @param {PileModel} other - the other pile to merge with this one.
     *
     * @return {PileModel} this pile.
     *
     * @fire EVENT_MODEL_CHANGE
     *
     * @throw {PileInvariantError} Invariant invalidated by merging the other
     * piles with this pile; or others' invariant invalidated by emptying them
     */
    merge(...others) {
        const merged = merge(copy(this), others.map((o) => _cards.get(o)));
        
        let valid = checkInvariant(
            this,
            merged,
            `Merge pile with ${others} is invalid`
        );

        valid = valid && others.every((otherPile) => checkInvariant(
            otherPile,
            [],
            `Empty pile is invalid`
        ));
        
        if (valid) {
            this.emit(EVENT_MODEL_CHANGE, this);
        }

        return this;
    }
}

export {
    PileModel,
    TAUTOLOGY,
    PILE_ACTIONS,
    INSERT,
    ADD,
    PICK,
    TAKE,
    MERGE,
    SHUFFLE
};
